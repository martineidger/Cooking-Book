import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/auth/strategy/jwt.strategy";
import { DatabaseModule } from "src/database/database.module";
import { ServingsService } from "./servings.service";
import { IngredientUnitModule } from "src/ingredient/unit/ingredient-unit.module";

@Module({
    imports: [
        DatabaseModule,
        IngredientUnitModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_ACCESS_LIFETIME', '15m')
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [ServingsService, JwtStrategy],
    exports: [ServingsService]
})
export class ServingsModule { }