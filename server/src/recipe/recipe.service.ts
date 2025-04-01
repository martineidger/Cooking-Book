import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from '../dto/recipe/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipe/update-recipe.dto';
import { DatabaseService } from 'src/database/database.service';
import { Recipe } from '@prisma/client';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.create({
      data: {
        user: { connect: { id: createRecipeDto.userId } },
        title: createRecipeDto.title,
        cuisine: { connect: { id: createRecipeDto.cuisineId } },
        description: createRecipeDto.description,
        categories: {
          connect: createRecipeDto.categories?.map(cat => ({
            id: cat.categoryId
          })) || [],
        },
        ingredients: {
          connect: createRecipeDto.ingredients?.map(ingr => ({
            id: ingr.ingredientId
          })) || [],
        },
        steps: {
          create: createRecipeDto.steps?.map(step => ({
            title: step.title,
            description: step.description,
            order: step.order,
            durationMin: step.durationMin || 0,
          })) || [],
        },
      },
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

  async findOne(id: string): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({
      where: { id: id.toString() },
      include: {
        ingredients: true,
        cuisine: true,
        categories: true,
      },
    });
  }

  // async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
  //   return this.prisma.recipe.update({
  //     where: { id: id.toString() },
  //     data: updateRecipeDto,
  //   });
  // }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        ...(updateRecipeDto.title && { title: updateRecipeDto.title }), // Update title if provided
        ...(updateRecipeDto.description && { description: updateRecipeDto.description }), // Update description if provided
        ...(updateRecipeDto.cuisineId && { cuisine: { connect: { id: updateRecipeDto.cuisineId } } }), // Update cuisine if provided
        categories: {
          connect: updateRecipeDto.categories?.map(cat => ({
            id: cat.categoryId
          })) || [],
          disconnect: updateRecipeDto.categoriesToDisconnect?.map(catId => ({
            id: catId
          })) || [],
        },
        ingredients: {
          connect: updateRecipeDto.ingredients?.map(ingr => ({
            id: ingr.ingredientId
          })) || [],
          disconnect: updateRecipeDto.ingredientsToDisconnect?.map(ingrId => ({
            id: ingrId
          })) || [],
        },
        steps: {
          deleteMany: updateRecipeDto.stepsToDelete?.map(stepId => ({
            id: stepId
          })) || [],
          create: updateRecipeDto.steps?.map(step => ({
            title: step.title,
            description: step.description,
            order: step.order,
            durationMin: step.durationMin || 0,
          })) || [],
        },
      },
    });
  }

  async remove(id: string): Promise<Recipe> {
    return this.prisma.recipe.delete({
      where: { id: id.toString() },
    });
  }
}