import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as sharp from 'sharp';

@Injectable()
export class RecipePhotosMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RecipePhotosMiddleware.name);

    constructor() {
        cloudinary.config({
            cloud_name: process.env.CL_NAME,
            api_key: process.env.CL_KEY,
            api_secret: process.env.CL_SECRET,
        });
    }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // Логируем входящие файлы для отладки
            this.logger.debug(`Incoming files: ${JSON.stringify(req.files)}`);
            this.logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            if (!req.files || Object.keys(req.files).length === 0) {
                this.logger.log('No files found in request');
                return next();
            }

            // Обрабатываем главное фото
            if (req.files['mainPhoto']?.[0]) {
                this.logger.log('Processing main photo');
                const mainPhoto = req.files['mainPhoto'][0];
                req.body.mainPhoto = await this.processAndUploadImage(mainPhoto);
            }

            // Обрабатываем фото шагов
            if (req.files['steps']) {
                this.logger.log('Processing step photos');
                req.body.steps = req.body.steps || [];

                // Получаем все файлы шагов
                const stepFiles = Array.isArray(req.files['steps']) ?
                    req.files['steps'] :
                    [req.files['steps']];

                for (const stepFile of stepFiles) {
                    const matches = stepFile.fieldname.match(/steps\[(\d+)\]\[photo\]/);
                    if (matches && matches[1]) {
                        const stepIndex = parseInt(matches[1]);
                        req.body.steps[stepIndex] = req.body.steps[stepIndex] || {};
                        req.body.steps[stepIndex].photo = await this.processAndUploadImage(stepFile);
                    }
                }
            }

            next();
        } catch (error) {
            this.logger.error(`File upload failed: ${error.message}`);
            return res.status(500).json({
                statusCode: 500,
                message: 'File upload failed',
                error: error.message,
            });
        }
    }

    private async processAndUploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
        const optimizedBuffer = await this.optimizeImage(file.buffer);
        return this.uploadToCloudinary(optimizedBuffer);
    }

    private async optimizeImage(buffer: Buffer): Promise<Buffer> {
        return sharp(buffer)
            .resize({
                width: 1200,
                height: 800,
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({
                quality: 80,
                alphaQuality: 80,
                lossless: false,
            })
            .toBuffer();
    }

    private uploadToCloudinary(buffer: Buffer): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'recipe-app/optimized',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed'));
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            );

            const bufferStream = new Readable();
            bufferStream.push(buffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
        });
    }
}