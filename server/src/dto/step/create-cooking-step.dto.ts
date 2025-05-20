import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateCookingStepDto {
    @IsString()
    @IsOptional()
    id?: string

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
    photo?: {
        url: string;
        publicId: string;
    };

    @IsInt()
    @IsOptional()
    durationMin?: number;

    @IsInt()
    @IsNotEmpty()
    order: number;
    oldPhotoPublicId?: string;
}