import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateIngredientToRecipeDto {
    @IsString()
    @IsNotEmpty()
    ingredientId: string;

    // @IsString()
    // @IsNotEmpty()
    // recipeId: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    ingredientUnitId: string;
}