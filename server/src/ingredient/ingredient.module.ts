import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { DatabaseModule } from 'src/database/database.module';
import { IngredientUnitModule } from './unit/ingredient-unit.module';

@Module({
  imports: [DatabaseModule, IngredientUnitModule],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule { }
