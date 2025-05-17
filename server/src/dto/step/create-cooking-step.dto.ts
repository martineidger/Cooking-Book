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

    @IsOptional()
    image?: Express.Multer.File;

    @IsInt()
    @IsOptional()
    durationMin?: number;

    @IsInt()
    @IsNotEmpty()
    order: number;
}