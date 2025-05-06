// src/common/middlewares/error.middleware.ts
import {
    Injectable,
    NestMiddleware,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            next();
        } catch (error) {
            // Преобразование ошибки в HttpException, если это не так
            if (!(error instanceof HttpException)) {
                error = new HttpException(
                    error.message || 'Internal server error',
                    error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
            throw error; // Фильтр исключений обработает это
        }
    }
}   