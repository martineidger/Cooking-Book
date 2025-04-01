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

@Module({
  imports: [DatabaseModule, RecipeModule, IngredientModule, CategoryModule, UserModule, CuisineModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule { }
