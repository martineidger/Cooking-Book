import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';
import { CreateCookingStepDto } from '../step/create-cooking-step.dto';
import { CreateIngredientToRecipeDto } from '../ingredient/create-ingredient-to-recipe.dto';

export class CreateRecipeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    steps?: CreateCookingStepDto[]

    @IsNumber()
    @IsNotEmpty()
    portions: number;

    @IsArray()
    @IsOptional()
    ingredients?: CreateIngredientToRecipeDto[];

    @IsString()
    @IsOptional()
    cuisineId?: string;

    @IsArray()
    @IsOptional()
    categories?: { categoryId: string }[];


}