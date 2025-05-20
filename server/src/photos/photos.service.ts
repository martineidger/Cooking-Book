import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class PhotosService {

    constructor() {
        cloudinary.config({
            cloud_name: process.env.CL_NAME,
            api_key: process.env.CL_KEY,
            api_secret: process.env.CL_SECRET,
        });
    }

    /**
     * Удаляет изображение из Cloudinary по его publicId
     * @param publicId Public ID изображения в Cloudinary
     * @returns Promise<boolean> true если удаление успешно, false если нет
     */
    async deleteImage(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);

            if (result.result === 'ok') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Удаляет несколько изображений из Cloudinary
     * @param publicIds Массив public IDs изображений
     * @returns Promise<boolean[]> Массив результатов для каждого изображения
     */
    async deleteMultipleImages(publicIds: string[]): Promise<boolean[]> {
        return Promise.all(publicIds.map(id => this.deleteImage(id)));
    }
}