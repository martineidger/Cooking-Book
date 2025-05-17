import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class AddRemoveFromFavDto {
    @IsString()
    @IsNotEmpty()
    userId: string

    @IsArray()
    @IsNotEmpty()
    recipesIds: string[]
}