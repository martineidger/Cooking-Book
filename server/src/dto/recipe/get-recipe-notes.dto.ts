import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetRecipeNotesDto {
    @IsString()
    @IsNotEmpty()
    recipeId: string

    @IsString()
    @IsOptional()
    userId?: string
}