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
    @Min(1)
    @Type(() => Number)
    quantity: number;
}

export class CountPortionsDto {
    @IsNotEmpty({ each: true })
    @Transform(({ value }) => {
        return value.map((entry: string) => {
            const [id, quantity] = entry.split('=');
            return { id, quantity: Number(quantity) };
        });
    })
    @ValidateNested({ each: true }) // Теперь декоратор доступен
    @Type(() => IngredientEntryDto)
    ingredientIds: IngredientEntryDto[];
}