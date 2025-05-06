// src/dto/recipe/count-portions.dto.ts
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    validate,
    ValidateNested // Добавляем этот импорт
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class IngredientEntryDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNumber()
    //@Min(1)
    @Type(() => Number)
    quantity: number;
}

export class CountPortionsDto {
    @IsNotEmpty({ each: true })
    @Transform(({ value }) => {
        // value может быть массивом или строкой в зависимости от того, как приходят параметры
        const entries = Array.isArray(value) ? value : [value];
        return entries.map((entry: string) => {
            const [id, quantity] = entry.split('=');
            return { id, quantity: Number(quantity) };
        });
    })
    @ValidateNested({ each: true })
    @Type(() => IngredientEntryDto)
    ingredientIds: IngredientEntryDto[];
}