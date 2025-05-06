import { Injectable } from '@nestjs/common';
import { Ingredient, IngredientCategory, IngredientUnit } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { CreateIngredientUnitDto } from 'src/dto/ingredient/create-ingredient-unit.dto';
import { CreateIngredientDto } from 'src/dto/ingredient/create-ingredient.dto';

@Injectable()
export class IngredientService {
    constructor(private readonly prisma: DatabaseService) { }

    async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
        return this.prisma.ingredient.create({
            data: {
                name: createIngredientDto.name,
                category: { connect: { id: createIngredientDto.ingredientCategoryId } }
            }
        })
    }

    async createCategory(createCategoryDto: CreateBaseElement): Promise<IngredientCategory> {
        return this.prisma.ingredientCategory.create({
            data: createCategoryDto
        })
    }

    // async createUnit(createUntiDto: CreateIngredientUnitDto): Promise<IngredientUnit> {
    //     return this.prisma.ingredientUnit.create({
    //         data: createUntiDto
    //     })
    // }

    async findAllCategories() {
        return await this.prisma.ingredientCategory.findMany();
    }

    async findAllUnits() {
        return await this.prisma.ingredientUnit.findMany();
    }

    async findAll() {
        return await this.prisma.ingredient.findMany();
    }

    async findIngredient(ingrId: string) {
        return await this.prisma.ingredient.findUnique({
            where: { id: ingrId }
        })
    }
}
