import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { CreateCookingStepDto } from '../step/create-cooking-step.dto';

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

    @IsArray()
    @IsOptional()
    ingredients?: { ingredientId: string }[];

    @IsString()
    @IsOptional()
    cuisineId?: string;

    @IsArray()
    @IsOptional()
    categories?: { categoryId: string }[];


}