import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServingsModule } from './servings/servings.module';
import { AdditionalModule } from './additional/additional.module';
import { IngredientUnitModule } from 'src/ingredient/unit/ingredient-unit.module';
import { AllergenModule } from 'src/allergen/allergen.module';

@Module({
  imports: [
    DatabaseModule,
    ServingsModule,
    AdditionalModule,
    IngredientUnitModule,
    AllergenModule,
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
  controllers: [RecipeController],
  providers: [RecipeService, JwtStrategy],
})
export class RecipeModule { }
