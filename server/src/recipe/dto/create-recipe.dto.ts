import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateRecipeDto {
    @IsString()
    @IsNotEmpty()
    title: string; // Название рецепта

    @IsString()
    @IsOptional()
    description?: string; // Описание рецепта

    @IsArray()
    @IsOptional()
    phases?: { phaseId: string }[]; // Этапы приготовления

    @IsArray()
    @IsOptional()
    ingredients?: { ingredientId: string }[]; // Ингредиенты

    @IsString()
    @IsOptional()
    cuisineId?: string; // Идентификатор кухни

    @IsArray()
    @IsOptional()
    categories?: { categoryId: string }[]; // Категории
}