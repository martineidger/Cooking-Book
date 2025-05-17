import { Injectable } from "@nestjs/common";
import { IngredientUnit } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class IngredientUnitService {
    constructor(private readonly prisma: DatabaseService) { }

    async getPossibleUnitsForIngredients(ingredients: Array<{ ingredientId: string }>) {
        const ingredientIds = ingredients.map(i => i.ingredientId);
        const ingredientsWithCategories = await this.prisma.ingredient.findMany({
            where: { id: { in: ingredientIds } },
            include: {
                category: true
            }
        });

        const allUnits = await this.prisma.ingredientUnit.findMany();

        const result: Record<string, IngredientUnit[]> = {};

        for (const ing of ingredientsWithCategories) {
            // Здесь можно добавить логику фильтрации единиц измерения
            // Например, для ингредиентов в категории "Жидкости" возвращаем только VOLUME единицы
            // Это пример - адаптируйте под вашу бизнес-логику

            if (ing.category?.name.toLowerCase().includes('жидкость')) {
                result[ing.id] = allUnits.filter(unit => unit.unitType === 'VOLUME');
            } else {
                // По умолчанию возвращаем все единицы измерения типа WEIGHT
                result[ing.id] = allUnits.filter(unit => unit.unitType === 'WEIGHT');
            }
        }

        return result;
    }




    async validateIngredientUnits(ingredients: Array<{
        ingredientId: string;
        ingredientUnitId: string;
        quantity: number;
    }>) {
        for (const ingr of ingredients) {
            const unit = await this.prisma.ingredientUnit.findUnique({
                where: { id: ingr.ingredientUnitId },
                include: { baseUnit: true }
            });

            if (!unit) {
                throw new Error(`Единица измерения с ID ${ingr.ingredientUnitId} не найдена`);
            }

            const ingredient = await this.prisma.ingredient.findUnique({
                where: { id: ingr.ingredientId },
                include: { category: true }
            });

            // можно добавить дополнительную логику валидации что жидкие ингредиенты используют объемные единицы
        }
    }

    async calculateBaseQuantity(quantity: number, unitId: string): Promise<number> {
        const unit = await this.prisma.ingredientUnit.findUnique({
            where: { id: unitId },
            include: { baseUnit: true }
        });

        if (!unit) throw new Error('Unit not found');

        if (!unit.baseUnitId) return quantity;

        return quantity * (unit.multiplier || 1);
    }

    async convertIngredientQuantity(
        ingredientId: string,
        fromUnitId: string,
        toUnitId: string,
        quantity: number
    ): Promise<{ quantity: number; unit: IngredientUnit | null }> {
        if (fromUnitId === toUnitId) {
            const unit = await this.prisma.ingredientUnit.findUnique({ where: { id: fromUnitId } });
            return { quantity, unit };
        }

        const [fromUnit, toUnit] = await Promise.all([
            this.prisma.ingredientUnit.findUnique({
                where: { id: fromUnitId },
                include: { baseUnit: true }
            }),
            this.prisma.ingredientUnit.findUnique({
                where: { id: toUnitId },
                include: { baseUnit: true }
            })
        ]);

        if (!fromUnit || !toUnit) throw new Error('Units not found');
        if (fromUnit.unitType !== toUnit.unitType) {
            throw new Error('Cannot convert between different unit types');
        }

        const baseQuantity = quantity * (fromUnit.multiplier || 1);
        const convertedQuantity = baseQuantity / (toUnit.multiplier || 1);

        return {
            quantity: convertedQuantity,
            unit: toUnit
        };

    }
    async findAllUnits() {
        const units = await this.prisma.ingredientUnit.findMany();
        console.log("UNITS", units)
        return units;
    }
}