import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateIngredientDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    ingredientCategoryId: string;

}