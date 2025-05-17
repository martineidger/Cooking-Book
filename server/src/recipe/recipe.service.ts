import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from '../dto/recipe/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipe/update-recipe.dto';
import { DatabaseService } from 'src/database/database.service';
import { Allergen, CookingStep, IngredientUnit, Prisma, Recipe } from '@prisma/client';
import { CreateNoteDto } from 'src/dto/note/create-note.dto';
import { IngredientUnitService } from 'src/ingredient/unit/ingredient-unit.service';
import { AllergenService } from 'src/allergen/allergen.service';
import { PhotosService } from 'src/photos/photos.service';

@Injectable()
export class RecipeService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly unitService: IngredientUnitService,
    private readonly allergenService: AllergenService,
    private readonly photosService: PhotosService
  ) { }


  async getUserRecipes(id: string, page: number = 1, limit: number = 5) {
    // Проверка и преобразование параметров
    const pageNumber = isNaN(Number(page)) ? 1 : Number(page);
    const limitNumber = isNaN(Number(limit)) ? 5 : Number(limit);

    // Проверка, что ID существует
    if (!id) {
      throw new Error('User ID is required');
    }

    const offset = (pageNumber - 1) * limitNumber;

    try {
      const allCount = await this.prisma.recipe.count({
        where: {
          userId: id
        }
      });

      const recipes = await this.prisma.recipe.findMany({
        where: {
          userId: id
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
              unit: true
            }
          },
          cuisine: true,
          categories: true,
          user: true
        },
        skip: offset,
        take: limitNumber,
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        recipes: recipes,
        hasMore: allCount > offset + limitNumber,
        total: allCount,
        page: pageNumber,
        limit: limitNumber
      };
    } catch (error) {
      console.error('Error in getUserRecipes:', error);
      throw new Error('Failed to fetch user recipes');
    }
  }

  // async getUserRecipes(id: string, page: number = 1, limit: number = 5) {
  //   const offset = (page - 1) * limit;
  //   const allCount = await this.prisma.recipe.count({
  //     where: {
  //       userId: id
  //     }
  //   });

  //   const recipes = await this.prisma.recipe.findMany({
  //     where: {
  //       userId: id
  //     },
  //     include: {
  //       ingredients: {
  //         include: {
  //           ingredient: true,
  //           unit: true
  //         }
  //       },
  //       cuisine: true,
  //       categories: true,
  //       user: true
  //     },
  //     skip: offset,
  //     take: limit,
  //     orderBy: {
  //       createdAt: 'desc' // Добавляем сортировку по дате создания
  //     }
  //   })

  //   return {
  //     recipes: recipes,
  //     hasMore: allCount - (page * limit)
  //   }
  // }

  async create(createRecipeDto: CreateRecipeDto, photo) {
    let photoPath;
    if (photo) {
      console.log("ADDING PHOTO")
      photoPath = (await this.photosService.uploadImage(photo)).url;
    }
    // Валидация категорий
    if (createRecipeDto.categories) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: createRecipeDto.categories.map(cat => cat.categoryId) } },
      });
      if (categories.length !== createRecipeDto.categories.length) {
        throw new Error('Некоторые категории не найдены.');
      }
    }

    // Валидация единиц измерения
    await this.unitService.validateIngredientUnits(createRecipeDto.ingredients!);

    const newRecipe = await this.prisma.recipe.create({
      data: {
        user: { connect: { id: createRecipeDto.userId } },
        title: createRecipeDto.title,
        ...(createRecipeDto.cuisineId && { cuisine: { connect: { id: createRecipeDto.cuisineId } } }),
        description: createRecipeDto.description,
        categories: {
          create: createRecipeDto.categories?.map(cat => ({
            category: { connect: { id: cat.categoryId } }
          }))
        },
        portions: createRecipeDto.portions,
        ingredients: {
          create: await Promise.all(createRecipeDto.ingredients?.map(async ingr => ({
            ingredient: { connect: { id: ingr.ingredientId } },
            quantity: ingr.quantity,
            unit: { connect: { id: ingr.ingredientUnitId } },
            //baseQuantity: await this.unitService.calculateBaseQuantity(ingr.quantity, ingr.ingredientUnitId)
          })) || [])
        },
        steps: {
          create: createRecipeDto.steps?.map(step => ({
            title: step.title,
            description: step.description,
            order: step.order,
            durationMin: step.durationMin || 0,
          })) || [],
        },
        imageUrl: photoPath
      },
      include: {
        ingredients: {
          include: {
            ingredient: { select: { name: true } },
            unit: true
          }
        },
        cuisine: true,
        categories: { include: { category: true } },
        steps: { orderBy: { order: 'asc' } },
        user: true
      }
    });

    return {
      recipe: newRecipe,
      allergens: [this.allergenService.getAllergensFromRecipe(newRecipe.id)]
    }
  }

  async findOne(id: string): Promise<{
    recipe: Recipe;
    allergens: Allergen[];
    possibleUnits: Record<string, IngredientUnit[]>; // Доступные единицы для каждого ингредиента
  }> {
    const [recipe, allergens] = await Promise.all([
      this.prisma.recipe.findUnique({
        where: { id },
        include: {
          ingredients: {
            include: {
              ingredient: { select: { name: true } },
              unit: true
            }
          },
          cuisine: true,
          categories: { include: { category: true } },
          steps: { orderBy: { order: 'asc' } },
          user: true
        },
      }),
      this.allergenService.getAllergensFromRecipe(id)
    ]);

    if (!recipe) {
      throw new NotFoundException('Рецепт не найден');
    }

    const possibleUnits = await this.unitService.getPossibleUnitsForIngredients(recipe.ingredients);

    return {
      recipe,
      allergens,
      possibleUnits
    };
  }


  async findAllWithIngredientMatch(
    ingredientIds: string[],
    categoryId?: string,
    cuisineId?: string
  ): Promise<{ recipe: Recipe; matchCount: number; allergens: Allergen[] }[]> {
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

                  }
                },

              },

            },
            unit: true,
          },

        },
        user: true
      },
      orderBy: {
        ingredients: {
          _count: 'desc',
        },
      },
    });

    return recipes.map(recipe => {
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
    searchTerm?: string,
  ): Promise<{
    recipes: { recipe: Recipe; allergens: Allergen[] }[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }> {
    // 1. Подготавливаем условия для фильтрации (where)
    const where: Prisma.RecipeWhereInput = {
      AND: [
        {
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
        },
        ...(searchTerm ? [{
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' as const } },
            { description: { contains: searchTerm, mode: 'insensitive' as const } },
          ],
        }] : []),
      ].filter(Boolean),
    };

    // 2. Сортировка (orderBy) - исправленная версия
    let orderBy: Prisma.RecipeOrderByWithRelationInput | undefined;
    if (sortBy) {
      // Явно указываем возможные поля для сортировки
      switch (sortBy) {
        case 'title':
          orderBy = { title: sortOrder };
          break;

        // Добавьте другие поддерживаемые поля сортировки
        default:
          orderBy = { title: 'desc' }; // Сортировка по умолчанию
      }
    }

    // 3. Вычисляем offset
    const offset = (page - 1) * limit;

    // 4. Получаем общее количество рецептов
    const total = await this.prisma.recipe.count({ where });

    // 5. Получаем рецепты с пагинацией (без аллергенов)
    const recipesPagination = await this.prisma.recipe.findMany({
      where,
      orderBy,
      skip: offset,
      take: +limit,
      include: {
        ingredients: {
          include: {
            ingredient: true,
            unit: true,
          },
        },
        cuisine: true,
        categories: {
          include: {
            category: true,
          },
        },
        steps: true,
        user: true
      },
    });

    const recipes = await Promise.all(
      recipesPagination.map(async (recipe) => {
        const allergens = await this.allergenService.getAllergensFromRecipe(recipe.id);
        return {
          recipe: {
            ...recipe,
            categories: recipe.categories.map(c => c.category),
          },
          allergens
        };
      })
    );

    // 7. Возвращаем данные с пагинацией
    return {
      recipes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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







}