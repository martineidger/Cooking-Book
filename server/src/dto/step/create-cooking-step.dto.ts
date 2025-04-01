import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateCookingStepDto {

    @IsString()
    @IsNotEmpty()
    recipeId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsInt()
    @IsOptional()
    durationMin?: number;

    @IsInt()
    @IsNotEmpty()
    order: number;
}