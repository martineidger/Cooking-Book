import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class DeleteRecipeFromCollectionDto {
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