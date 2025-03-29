import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateIngredientDto {
    @IsString()
    @IsNotEmpty()
    ingredientId: string; // Идентификатор ингредиента

    @IsNumber()
    @IsNotEmpty()
    quantity: number; // Количество ингредиента

    @IsString()
    @IsNotEmpty()
    ingredientUnitId: string; // Идентификатор единицы измерения
}