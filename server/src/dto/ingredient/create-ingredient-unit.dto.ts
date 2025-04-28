import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateIngredientUnitDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    gramsAmount: number;

}