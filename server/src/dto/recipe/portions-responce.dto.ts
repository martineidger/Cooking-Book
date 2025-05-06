import { Recipe } from "@prisma/client";

export class PortionsResponseDto {
    recipe: Recipe;
    possiblePortions: number;
    missingIngredients: {
        ingredientId: string;
        missingAmount: number
    }[];
}