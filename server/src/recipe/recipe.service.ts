import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from '../dto/recipe/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipe/update-recipe.dto';
import { DatabaseService } from 'src/database/database.service';
import { Allergen, CookingStep, Recipe } from '@prisma/client';
import { CreateNoteDto } from 'src/dto/note/create-note.dto';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    if (createRecipeDto.categories) {
      const categories = await this.prisma.category.findMany({
        where: {
          id: {
            in: createRecipeDto.categories?.map(cat => cat.categoryId),
          },
        },
      });

      if (categories.length !== createRecipeDto.categories?.length) {
        throw new Error('Некоторые категории не найдены.');
      }
    }


    return this.prisma.recipe.create({
      data: {
        user: { connect: { id: createRecipeDto.userId } },
        title: createRecipeDto.title,
        cuisine: { connect: { id: createRecipeDto.cuisineId } },
        description: createRecipeDto.description,
        categories: {
          create: createRecipeDto.categories?.map(cat => ({
            category: { connect: { id: cat.categoryId } }
          }))
        },
        portions: createRecipeDto.portions,
        ingredients: {
          create: createRecipeDto.ingredients?.map(ingr => ({
            ingredient: { connect: { id: ingr.ingredientId } },
            quantity: ingr.quantity,
            unit: { connect: { id: ingr.ingredientUnitId } }
          })) || []
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

  async findAllWithIngredientMatch(
    ingredientIds: string[],
    categoryId?: string,
    cuisineId?: string
  ): Promise<{ recipe: Recipe; matchCount: number; allergens: Allergen[] }[]> {
    // 1. Находим рецепты с совпадениями ингредиентов
    const recipes = await this.prisma.recipe.findMany({
      where: {
        ...(categoryId && { categories: { some: { categoryId } } }),
        ...(cuisineId && { cuisineId }),
        ingredients: {
          some: {
            ingredientId: {
              in: ingredientIds,
            },
          },
        },
      },
      include: {
        ingredients: {
          where: {
            ingredientId: {
              in: ingredientIds,
            },
          },
          include: {
            ingredient: {
              include: {
                allergens: {
                  include: {
                    allergen: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        ingredients: {
          _count: 'desc',
        },
      },
    });

    // 2. Формируем результат с аллергенами
    return recipes.map(recipe => {
      // Собираем уникальные аллергены из всех ингредиентов рецепта
      const allergenMap = new Map<string, Allergen>();

      recipe.ingredients.forEach(recipeIngredient => {
        recipeIngredient.ingredient.allergens?.forEach(ingredientAllergen => {
          const allergen = ingredientAllergen.allergen;
          if (!allergenMap.has(allergen.id)) {
            allergenMap.set(allergen.id, allergen);
          }
        });
      });

      return {
        recipe,
        matchCount: recipe.ingredients.length,
        allergens: Array.from(allergenMap.values()),
      };
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    cuisineId?: string,
    ingredientIds?: string[],
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<{
    recipes: { recipe: Recipe; allergens: Allergen[] }[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }> {
    // 1. Подготавливаем условия для фильтрации (where)
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

    // 2. Сортировка (orderBy)
    const orderBy = sortBy ? { [sortBy]: sortOrder } : undefined;

    // 3. Вычисляем offset (пропуск записей)
    const offset = (page - 1) * limit;

    // 4. Получаем ОБЩЕЕ количество рецептов (для пагинации)
    const total = await this.prisma.recipe.count({ where });

    // 5. Получаем рецепты с пагинацией
    const recipesPagination = await this.prisma.recipe.findMany({
      where,
      orderBy,
      skip: offset,    // Пропускаем предыдущие страницы
      take: +limit,     // Берем только `limit` записей
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        cuisine: true,
        categories: true,
        steps: true,
      },
    });

    // 6. Добавляем аллергены для каждого рецепта
    const recipes = await Promise.all(
      recipesPagination.map(async (recipe) => {
        const allergens = await this.getAllergensFromRecipe(recipe.id);
        return { recipe, allergens };
      })
    );

    // 7. Возвращаем данные с пагинацией
    return {
      recipes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), // Округляем вверх
    };
  }


  async findOne(id: string): Promise<{ recipe: Recipe; allergens: Allergen[] }> {
    // Получаем рецепт и аллергены параллельно
    const [recipe, allergens] = await Promise.all([
      this.prisma.recipe.findUnique({
        where: { id: id.toString() },
        include: {
          ingredients: {
            include: {
              ingredient: true // Важно включить связанные ингредиенты
            }
          },
          cuisine: true,
          categories: true,
        },
      }),
      this.getAllergensFromRecipe(id) // Предполагаем, что это асинхронный метод
    ]);

    if (!recipe) {
      throw new NotFoundException('Рецепт не найден');
    }

    return {
      recipe,
      allergens
    };
  }

  async findStep(recipeId: string, stepNumber: number): Promise<CookingStep | null> {
    return this.prisma.cookingStep.findFirst({
      where: {
        AND: {
          recipeId: recipeId.toString(),
          order: stepNumber
        }
      },
    });
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        ...(updateRecipeDto.title && { title: updateRecipeDto.title }),
        ...(updateRecipeDto.description && { description: updateRecipeDto.description }),
        ...(updateRecipeDto.cuisineId && { cuisine: { connect: { id: updateRecipeDto.cuisineId } } }),
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

  async findPortionsByIngredientCount(
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

  async addNote(createNoteDto: CreateNoteDto) {
    return await this.prisma.note.create({
      data: createNoteDto
    })
  }

  private async getAllergensFromRecipe(recipeId: string): Promise<Allergen[]> {
    // 1. Находим рецепт со всеми связанными ингредиентами и их аллергенами
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            ingredient: {
              include: {
                allergens: {
                  include: {
                    allergen: true // Включаем полные объекты аллергенов
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!recipe) {
      throw new NotFoundException('Рецепт не найден');
    }

    // 2. Собираем все уникальные аллергены
    const allergenMap = new Map<string, Allergen>();

    recipe.ingredients.forEach(recipeIngredient => {
      recipeIngredient.ingredient.allergens?.forEach(ingredientAllergen => {
        const allergen = ingredientAllergen.allergen;
        if (!allergenMap.has(allergen.id)) {
          allergenMap.set(allergen.id, allergen);
        }
      });
    });

    // 3. Преобразуем Map в массив и возвращаем
    return Array.from(allergenMap.values());
  }
}