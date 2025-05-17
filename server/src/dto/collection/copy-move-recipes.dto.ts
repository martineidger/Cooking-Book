import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CopyMoveRecipesDto {
    @IsNotEmpty()
    @IsString()
    sourceCollectionId: string;

    @IsNotEmpty()
    @IsString()
    targetCollectionId: string;

    @IsNotEmpty()
    @IsArray()
    recipeIds: string[];

    @IsNotEmpty()
    @IsString()
    mode: 'copy' | 'move'
}