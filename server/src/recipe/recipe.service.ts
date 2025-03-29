import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { DatabaseService } from 'src/database/database.service';
import { Recipe } from '@prisma/client';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.create({
      data: createRecipeDto,
    });
  }

  async findAll(
    categoryId?: string,
    cuisineId?: string,
    ingredientIds?: string[],
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<Recipe[]> {
    const where = {
      ...(categoryId && { categories: { some: { categoryId } } }),
      ...(cuisineId && { cuisineId }),
      ...(ingredientIds && {
        ingredients: {
          some: {
            ingredientId: {
              in: ingredientIds,
            },
          },
        },
      }),
    };

    const orderBy = sortBy ? { [sortBy]: sortOrder } : undefined;

    return this.prisma.recipe.findMany({
      where,
      orderBy,
      include: {
        ingredients: true,
        cuisine: true,
        categories: true,
      },
    });
  }

  async findOne(id: number): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({
      where: { id: id.toString() },
      include: {
        ingredients: true,
        cuisine: true,
        categories: true,
      },
    });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.update({
      where: { id: id.toString() },
      data: updateRecipeDto,
    });
  }

  async remove(id: number): Promise<Recipe> {
    return this.prisma.recipe.delete({
      where: { id: id.toString() },
    });
  }
}