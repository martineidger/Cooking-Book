import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as sharp from 'sharp';

type FileMap = Record<string, Express.Multer.File[]>;

@Injectable()
export class CloudinaryInterceptor implements NestInterceptor {
    private readonly logger = new Logger(CloudinaryInterceptor.name);

    constructor() {
        cloudinary.config({
            cloud_name: process.env.CL_NAME,
            api_key: process.env.CL_KEY,
            api_secret: process.env.CL_SECRET,
        });
    }

    /*
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();

        if (req.method === 'GET') {
            return next.handle();
        }

        this.logger.debug(`Incoming files: ${JSON.stringify(req.files)}`);
        this.logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        if (!req.files || Object.keys(req.files).length === 0) {
            this.logger.log('No files found in request');
            return next.handle();
        }

        try {
            // Обрабатываем главное фото
            if (req.files['mainPhoto']?.[0]) {
                this.logger.log('Processing main photo');
                const mainPhoto = req.files['mainPhoto'][0];
                //req.body.mainPhoto = await this.processAndUploadImage(mainPhoto);

                if (req.body.oldMainPhotoPublicId) {
                    await this.deleteImage(req.body.oldMainPhotoPublicId);
                    this.logger.log(`Deleted old main photo: ${req.body.oldMainPhotoPublicId}`);
                }

                req.body.mainPhoto = await this.processAndUploadImage(mainPhoto);
                delete req.body.oldMainPhotoPublicId;
            }

            // // Обрабатываем фото шагов
            // if (req.files['steps']) {
            //     this.logger.log('Processing step photos');
            //     req.body.steps = req.body.steps || [];

            //     const stepFiles = Array.isArray(req.files['steps'])
            //         ? req.files['steps']
            //         : [req.files['steps']];

            //     for (const stepFile of stepFiles) {
            //         const matches = stepFile.fieldname.match(/steps\[(\d+)\]\[photo\]/);
            //         if (matches && matches[1]) {
            //             const stepIndex = parseInt(matches[1]);
            //             req.body.steps[stepIndex] = req.body.steps[stepIndex] || {};
            //             if (req.body.steps[stepIndex].oldPhotoPublicId) {
            //                 await this.deleteImage(req.body.steps[stepIndex].oldPhotoPublicId);
            //                 this.logger.log(`Deleted old step photo: ${req.body.steps[stepIndex].oldPhotoPublicId}`);
            //             }
            //             req.body.steps[stepIndex].photo = await this.processAndUploadImage(
            //                 stepFile,
            //             );


            //             delete req.body.steps[stepIndex].oldPhotoPublicId; // Удаляем поле после обработки
            //         }


            //     }
            // }

            if (req.files['steps']) {
                req.body.steps = req.body.steps || [];

                // Сортируем файлы по порядку шагов
                const stepFiles = Array.isArray(req.files['steps'])
                    ? req.files['steps']
                    : [req.files['steps']];

                for (const file of stepFiles) {
                    // Определяем индекс шага из fieldname (steps[0][photo] → 0)
                    const match = file.fieldname.match(/steps\[(\d+)\]\[photo\]/);
                    if (match) {
                        const stepIndex = parseInt(match[1]);
                        if (req.body.steps[stepIndex]) {
                            req.body.steps[stepIndex].photo = await this.processAndUploadImage(file);

                            // Если было старое фото - помечаем для удаления
                            if (req.body.steps[stepIndex].oldPhotoPublicId) {
                                await this.deleteImage(req.body.steps[stepIndex].oldPhotoPublicId);
                            }
                        }
                    }
                }
            }

            return next.handle().pipe(
                map((data) => {
                    // Можно дополнительно обработать response здесь
                    return data;
                }),
            );
        } catch (error) {
            this.logger.error(`File upload failed: ${error.message}`);
            throw error;
        }
    }
        */



    async intercept(context: ExecutionContext, next: CallHandler) {
        const req = context.switchToHttp().getRequest();

        if (req.method === 'GET') {
            return next.handle();
        }

        this.logger.debug(`Incoming files`);
        this.logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        if (!req.files || Object.keys(req.files).length === 0) {
            this.logger.log('No files found in request');
            return next.handle();
        }

        const files = req.files as FileMap;
        // Парсим stepsChanges если есть
        if (req.body.stepsChanges) {
            try {
                req.body.stepsChanges = JSON.parse(req.body.stepsChanges);
            } catch (e) {
                this.logger.error('Error parsing stepsChanges', e);
            }
        }

        // Обработка mainPhoto
        if (req.files['mainPhoto']?.[0]) {
            if (req.body.oldMainPhotoPublicId) {
                await this.deleteImage(req.body.oldMainPhotoPublicId);
            }
            req.body.mainPhoto = await this.processAndUploadImage(req.files['mainPhoto'][0]);
            delete req.body.oldMainPhotoPublicId;
        }

        // Обработка фото шагов
        const stepFiles = Object.entries(files)
            .filter(([key]) => key.startsWith('step_'));

        for (const [key, fileArray] of stepFiles) {
            const matchResult = key.match(/^step_(create|update)_(\d+)$/);
            if (!matchResult) continue;

            const action = matchResult[1];
            const index = parseInt(matchResult[2]);
            const file = fileArray[0];

            try {
                if (action === 'create') {
                    if (!req.body.stepsChanges?.create?.[index]) continue;
                    req.body.stepsChanges.create[index].photo = await this.processAndUploadImage(file);
                }
                else if (action === 'update') {
                    if (!req.body.stepsChanges?.update?.[index]) continue;

                    if (req.body.stepsChanges.update[index].oldPhotoPublicId) {
                        await this.deleteImage(req.body.stepsChanges.update[index].oldPhotoPublicId);
                    }

                    req.body.stepsChanges.update[index].photo = await this.processAndUploadImage(file);
                    delete req.body.stepsChanges.update[index].oldPhotoPublicId;
                }
            } catch (error) {
                this.logger.error(`Error processing step file ${key}:`, error);
            }
        }

        return next.handle();
    }


    private async processAndUploadImage(
        file: Express.Multer.File,
    ): Promise<{ url: string; publicId: string }> {
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
    private async deleteImage(publicId: string): Promise<void> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result !== 'ok') {
                throw new Error(`Failed to delete image: ${publicId}`);
            }
            this.logger.log(`Successfully deleted image: ${publicId}`);
        } catch (error) {
            this.logger.error(`Error deleting image ${publicId}: ${error.message}`);
            throw error;
        }
    }

    private uploadToCloudinary(
        buffer: Buffer,
    ): Promise<{ url: string; publicId: string }> {
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
                },
            );

            const bufferStream = new Readable();
            bufferStream.push(buffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
        });
    }
}

