import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { RecipeModule } from './recipe/recipe.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { AllergenModule } from './allergen/allergen.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TestController } from './test.controller';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    RecipeModule,
    IngredientModule,
    CategoryModule,
    UserModule,
    CuisineModule,
    AllergenModule,

  ],
  controllers: [AppController, TestController],
  providers: [AppService, DatabaseService, JwtStrategy],
})
export class AppModule { }
