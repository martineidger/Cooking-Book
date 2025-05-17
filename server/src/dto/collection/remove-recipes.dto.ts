import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class RemoveRecipesDto {
    @IsNotEmpty()
    @IsString()
    collectionId?: string

    @IsNotEmpty()
    @IsString()
    userId?: string

    @IsNotEmpty()
    @IsArray()
    recipesIds: string[]


}