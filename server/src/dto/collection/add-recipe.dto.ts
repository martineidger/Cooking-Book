import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class AddRecipeDto {
    @IsArray()
    @IsNotEmpty()
    collectionIds: string[]

    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    recipeId: string
}