import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { CreateCookingStepDto } from '../step/create-cooking-step.dto';

//export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
export class UpdateRecipeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    steps?: CreateCookingStepDto[];

    @IsArray()
    @IsOptional()
    ingredients?: { ingredientId: string }[];

    @IsString()
    @IsOptional()
    cuisineId?: string;

    @IsArray()
    @IsOptional()
    categories?: { categoryId: string }[];

    @IsArray()
    @IsOptional()
    categoriesToDisconnect?: string[]; // IDs of categories to disconnect

    @IsArray()
    @IsOptional()
    ingredientsToDisconnect?: string[]; // IDs of ingredients to disconnect

    @IsArray()
    @IsOptional()
    stepsToDelete?: string[]; // IDs of steps to delete
}
