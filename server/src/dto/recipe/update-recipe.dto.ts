import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { CreateCookingStepDto } from '../step/create-cooking-step.dto';

export class UpdateRecipeDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    steps?: CreateCookingStepDto[];

    // @IsArray()
    // @IsOptional()
    // ingredients?: { ingredientId: string }[];
    ingredients?: {
        ingredientId: string;
        quantity: number;
        ingredientUnitId?: string;
    }[];
    ingredientsToDisconnect?: string[];

    @IsString()
    @IsOptional()
    cuisineId?: string;

    @IsArray()
    @IsOptional()
    categories?: { categoryId: string }[];

    @IsArray()
    @IsOptional()
    categoriesToDisconnect?: string[]; // IDs of categories to disconnect

    // @IsArray()
    // @IsOptional()
    // ingredientsToDisconnect?: string[]; // IDs of ingredients to disconnect

    // @IsArray()
    // @IsOptional()
    // stepsToDelete?: string[]; // IDs of steps to delete
    @IsOptional()
    mainPhoto?: {
        url: string;
        publicId: string;
    };

    @IsOptional()
    oldMainPhotoPublicId?: string; // ID старого фото для удаления

    @IsOptional()
    stepsToDelete?: string[]; // ID шагов для удаления

    @IsOptional()
    portions?: string;
}
