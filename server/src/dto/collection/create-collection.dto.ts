import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateCollectionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    isPublic: boolean;

    @IsArray()
    @IsOptional()
    recipes?: string[]

    @IsString()
    @IsNotEmpty()
    userId: string
}