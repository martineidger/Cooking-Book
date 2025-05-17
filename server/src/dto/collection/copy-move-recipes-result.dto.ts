import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CopyMoveRecipesResultDto {
    @IsNotEmpty()
    @IsNumber()
    totalRequested: number

    @IsNotEmpty()
    @IsArray()
    alreadyInTarget: string[]

    @IsNotEmpty()
    @IsArray()
    successfullyMoved: string[]

    @IsNotEmpty()
    @IsNumber()
    skipped: number

    @IsNotEmpty()
    @IsNumber()
    movedCount: number

    @IsNotEmpty()
    @IsString()
    message?: string
}