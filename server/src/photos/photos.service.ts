import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import * as sharp from 'sharp';

@Injectable()
export class PhotosService {
    constructor(private readonly configService: ConfigService/*, private readonly logger = new Logger(PhotosService.name)*/) {
        cloudinary.config({
            cloud_name: configService.get("CL_NAME = 'dfcfbptet'"),
            api_key: configService.get("CL_KEY"),
            api_secret: configService.get("CL_SECRET"), // Замените на реальный ключ
        });
    }

    // async uploadImage(file): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         const uploadStream = cloudinary.uploader.upload_stream(
    //             {
    //                 folder: 'uploads', // Папка в Cloudinary (опционально)
    //                 public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // Уникальное имя
    //                 transformation: [
    //                     { width: 800, height: 600, crop: 'limit' }, // Оптимизация размера
    //                     { quality: 'auto' }, // Автоматическое сжатие
    //                 ],
    //             },
    //             (error, result) => {
    //                 if (error) {
    //                     return reject(error);
    //                 }
    //                 if (!result) {
    //                     return reject(new Error('Cloudinary upload failed: no result returned'));
    //                 }
    //                 resolve(result.secure_url);
    //             },
    //         );

    //         const bufferStream = new Readable();
    //         bufferStream.push(file.buffer);
    //         bufferStream.push(null); // Сигнал конца потока

    //         bufferStream.pipe(uploadStream);
    //     });
    // }


    private async optimizeImage(buffer: Buffer): Promise<Buffer> {
        return sharp(buffer)
            .resize({
                width: 1200,
                height: 800,
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({
                quality: 80,
                alphaQuality: 80,
                lossless: false
            })
            .toBuffer();
    }

    async uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
        try {
            const optimizedBuffer = await this.optimizeImage(file.buffer);

            return new Promise((resolve, reject) => {
                const uploadOptions: UploadApiOptions = {
                    folder: 'recipe-app/optimized',
                    resource_type: 'image',
                    transformation: [
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' },
                    ],
                };

                const handleUploadResponse = (
                    err: UploadApiErrorResponse | undefined,
                    result: UploadApiResponse | undefined
                ) => {
                    if (err) {
                        // this.logger.error(`Upload failed: ${err.message}`);
                        return reject(new Error(err.message));
                    }
                    if (!result) {
                        return reject(new Error('Cloudinary upload failed: no result returned'));
                    }
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                };

                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    handleUploadResponse
                );

                const bufferStream = new Readable();
                bufferStream.push(optimizedBuffer);
                bufferStream.push(null);
                bufferStream.pipe(uploadStream);
            });
        } catch (error) {
            // this.logger.error(`Image processing failed: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error('Image processing error');
        }
    }


    async deleteImage(publicId: string): Promise<void> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result !== 'ok') {
                throw new Error(`Failed to delete image: ${result.result}`);
            }
        } catch (error) {
            throw new Error(`Error deleting image: ${error.message}`);
        }
    }
}
