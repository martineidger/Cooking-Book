import { Injectable, NotFoundException } from "@nestjs/common";
import { IngredientUnit, Recipe } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { IngredientUnitService } from "src/ingredient/unit/ingredient-unit.service";

@Injectable()
export class ServingsService {
    constructor(
        private readonly prisma: DatabaseService,
        private readonly unitService: IngredientUnitService
    ) { }

    async findServingsByIngredientCount(
        ingredients: Map<string, number>
    ): Promise<{
        recipe: Recipe & {
            ingredients: Array<{
                ingredientId: string;
                quantity: number;
                unit: IngredientUnit;
                ingredient: { name: string };
            }>;
        };
        minPortionsCount: number;
        ingredientsDetail: Array<{
            ingredientId: string;
            name: string;
            requiredPerPortion: number;
            available: number;
            unit: IngredientUnit;
        }>;
    }[]> {
        const recipes = await this.prisma.recipe.findMany({
            include: {
                ingredients: {
                    include: {
                        ingredient: { select: { name: true } },
                        unit: true
                    }
                },
            },
        });

        const results: {
            recipe: Recipe & {
                ingredients: Array<{
                    ingredientId: string;
                    quantity: number;
                    unit: IngredientUnit;
                    ingredient: { name: string };
                }>;
            };
            minPortionsCount: number;
            ingredientsDetail: Array<{
                ingredientId: string;
                name: string;
                requiredPerPortion: number;
                available: number;
                unit: IngredientUnit;
            }>;
        }[] = [];

        for (const recipe of recipes) {
            let minPortions: number | null = null;
            const ingredientsDetail: {
                ingredientId: string;
                name: string;
                requiredPerPortion: number;
                available: number;
                unit: IngredientUnit;
            }[] = [];

            for (const recipeIngredient of recipe.ingredients) {
                const available = ingredients.get(recipeIngredient.ingredientId) ?? 0;
                const requiredPerPortion = recipeIngredient.quantity / recipe.portions;

                if (recipeIngredient.quantity <= 0) continue;

                const portionsForIngredient = Math.floor(available / requiredPerPortion);

                ingredientsDetail.push({
                    ingredientId: recipeIngredient.ingredientId,
                    name: recipeIngredient.ingredient.name,
                    requiredPerPortion,
                    available,
                    unit: recipeIngredient.unit
                });

                if (minPortions === null || portionsForIngredient < minPortions) {
                    minPortions = portionsForIngredient;
                }

                if (minPortions <= 0) break;
            }

            if (minPortions && minPortions > 0) {
                results.push({
                    recipe,
                    minPortionsCount: minPortions,
                    ingredientsDetail
                });
            }
        }

        return results;
    }

    async findServingsByIngredientCountPartial(
        ingredients: Map<string, number>
    ): Promise<{
        recipe: Recipe;
        possiblePortions: number;
        missingIngredients: { ingredientId: string; missingAmount: number }[];
    }[]> {
        // Получаем все рецепты с их ингредиентами
        const recipes = await this.prisma.recipe.findMany({
            include: {
                ingredients: {
                    select: {
                        ingredientId: true,
                        ingredient: true,
                        quantity: true,
                        unit: true
                    }
                },
            },
        });

        const results: {
            recipe: Recipe;
            possiblePortions: number;
            missingIngredients: { name: string, ingredientId: string; missingAmount: number }[];
        }[] = [];

        for (const recipe of recipes) {
            let possiblePortions: number | null = null;
            const missingIngredients: { name: string, ingredientId: string; missingAmount: number }[] = [];
            let hasAllIngredients = true;

            // Проверяем, содержит ли рецепт хотя бы один из указанных ингредиентов
            const containsAnyIngredient = recipe.ingredients.some(ing =>
                ingredients.has(ing.ingredientId)
            );

            if (!containsAnyIngredient) continue;

            // Вычисляем максимальное количество порций для каждого ингредиента
            for (const recipeIngredient of recipe.ingredients) {
                if (recipeIngredient.quantity <= 0) continue;

                const available = ingredients.get(recipeIngredient.ingredientId) ?? 0;
                const portionsForIngredient = Math.floor(
                    (available * recipe.portions) / recipeIngredient.quantity
                );

                // Если ингредиент отсутствует в переданном наборе
                if (!ingredients.has(recipeIngredient.ingredientId)) {
                    hasAllIngredients = false;
                    missingIngredients.push({
                        name: recipeIngredient.ingredient.name,
                        ingredientId: recipeIngredient.ingredientId,
                        missingAmount: recipeIngredient.quantity
                    });
                    continue;
                }

                // Обновляем минимальное количество порций
                if (possiblePortions === null || portionsForIngredient < possiblePortions) {
                    possiblePortions = portionsForIngredient;
                }

                // Если не хватает ингредиента
                if (available < recipeIngredient.quantity) {
                    const missingAmount = recipeIngredient.quantity - available;
                    missingIngredients.push({
                        name: recipeIngredient.ingredient.name,
                        ingredientId: recipeIngredient.ingredientId,
                        missingAmount: missingAmount
                    });
                }
            }

            // Добавляем результат только если есть совпадения
            if (containsAnyIngredient) {
                results.push({
                    recipe: recipe,
                    possiblePortions: possiblePortions ?? 0,
                    missingIngredients: missingIngredients
                });
            }
        }

        return results;
    }

    async calculateServingsByIngredientCount(
        ingredients: Map<string, number>
    ): Promise<{ Recipe: Recipe; minPortionsCount: number }[]> {
        const recipes = await this.prisma.recipe.findMany({
            include: {
                ingredients: true,

            },
        });

        // Явно указываем тип для результатов
        const results: Array<{ Recipe: Recipe; minPortionsCount: number }> = [];

        for (const recipe of recipes) {
            const portionsPerIngredient = recipe.ingredients
                .filter(ingredient => ingredient.quantity > 0)
                .map(ingredient => {
                    const available = ingredients.get(ingredient.ingredientId) || 0;
                    return Math.floor((available * recipe.portions) / ingredient.quantity);
                });

            // Пропускаем рецепты без валидных ингредиентов
            if (portionsPerIngredient.length === 0) {
                continue;
            }

            const minPortions = Math.min(...portionsPerIngredient);

            // Добавляем только рецепты, которые можно приготовить
            if (minPortions > 0) {
                results.push({
                    Recipe: recipe,
                    minPortionsCount: minPortions
                });
            }
        }

        return results;
    }

    async calculateIngredientsForServingsNumber(
        recipeId: string,
        desiredServings: number
    ): Promise<Array<{
        ingredientId: string;
        name: string;
        originalQuantity: number;
        calculatedQuantity: number;
        unit: IngredientUnit;
        possibleUnits: IngredientUnit[];
    }>> {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                ingredients: {
                    include: {
                        ingredient: { select: { name: true } },
                        unit: true
                    }
                }
            }
        });

        if (!recipe) throw new NotFoundException('Рецепт не найден');

        const possibleUnitsMap = await this.unitService.getPossibleUnitsForIngredients(recipe.ingredients);

        return recipe.ingredients.map(ingredient => {
            const calculatedQuantity = (ingredient.quantity / recipe.portions) * desiredServings;

            return {
                ingredientId: ingredient.ingredientId,
                name: ingredient.ingredient.name,
                originalQuantity: ingredient.quantity,
                calculatedQuantity,
                unit: ingredient.unit,
                possibleUnits: possibleUnitsMap[ingredient.ingredientId] || []
            };
        });
    }

}