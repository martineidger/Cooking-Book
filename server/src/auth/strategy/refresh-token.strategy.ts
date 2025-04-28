// auth/refresh-token.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                return req.body?.refreshToken; // Получаем токен из тела запроса
            },
            secretOrKey: process.env.JWT_REFRESH_SECRET,
        });
    }

    validate(payload: any) {
        return payload; // Возвращаем payload без изменений
    }
}