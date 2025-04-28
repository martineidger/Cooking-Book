import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    text: string

    @IsBoolean()
    @IsNotEmpty()
    isPublic: boolean

    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    recipeId: string
}