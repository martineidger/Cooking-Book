import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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


  async create(createRecipeDto: CreateRecipeDto) {
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
        ...(createRecipeDto.mainPhoto && {
          imageUrl: createRecipeDto.mainPhoto.url,
          imageId: createRecipeDto.mainPhoto.publicId
        }),
        categories: {
          create: createRecipeDto.categories?.map(cat => ({
            category: { connect: { id: cat.categoryId } }
          }))
        },
        portions: +createRecipeDto.portions,
        ingredients: {
          create: await Promise.all(createRecipeDto.ingredients?.map(async ingr => ({
            ingredient: { connect: { id: ingr.ingredientId } },
            quantity: +ingr.quantity,
            unit: { connect: { id: ingr.ingredientUnitId } },
            //baseQuantity: await this.unitService.calculateBaseQuantity(ingr.quantity, ingr.ingredientUnitId)
          })) || [])
        },
        steps: {
          create: createRecipeDto.steps?.map(step => ({
            title: step.title,
            description: step.description,
            order: +step.order,
            durationMin: Number(step.durationMin) || 0,
            ...(step.photo && {
              imageUrl: step.photo.url,
              imageId: step.photo.publicId
            }),
          })) || [],
        },
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


  // async findAll(
  //   page: number = 1,
  //   limit: number = 10,
  //   categoryIds?: string,
  //   cuisineIds?: string,
  //   ingredientIds?: string[],
  //   sortBy?: string,
  //   sortOrder: 'asc' | 'desc' = 'asc',
  //   searchTerm?: string,
  // ): Promise<{
  //   recipes: { recipe: Recipe; allergens: Allergen[] }[],
  //   total: number,
  //   page: number,
  //   limit: number,
  //   totalPages: number
  // }> {
  //   const categories = categoryIds?.split(',');
  //   const cuisines = cuisineIds?.split(',');
  //   const where: Prisma.RecipeWhereInput = {
  //     AND: [
  //       {
  //         ...(categoryIds && { categories: { some: { categoryId: { in: categories } } } }),
  //         ...(cuisineIds && { cuisineId: { in: cuisines } }),
  //         ...(ingredientIds && {
  //           ingredients: {
  //             some: {
  //               ingredientId: {
  //                 in: ingredientIds,
  //               },
  //             },
  //           },
  //         }),
  //       },
  //       ...(searchTerm ? [{
  //         OR: [
  //           { title: { contains: searchTerm, mode: 'insensitive' as const } },
  //           { description: { contains: searchTerm, mode: 'insensitive' as const } },
  //         ],
  //       }] : []),
  //     ].filter(Boolean),
  //   };

  //   let orderBy: Prisma.RecipeOrderByWithRelationInput | undefined;
  //   if (sortBy) {
  //     switch (sortBy) {
  //       case 'title':
  //         orderBy = { title: sortOrder };
  //         break;
  //       case 'createdAt':
  //         orderBy = { createdAt: sortOrder };
  //         break;
  //       default:
  //         orderBy = { createdAt: 'desc' }; // Сортировка по умолчанию
  //     }
  //   }

  //   const offset = (page - 1) * limit;

  //   const total = await this.prisma.recipe.count({ where });

  //   const recipesPagination = await this.prisma.recipe.findMany({
  //     where,
  //     orderBy,
  //     skip: offset,
  //     take: +limit,
  //     include: {
  //       ingredients: {
  //         include: {
  //           ingredient: true,
  //           unit: true,
  //         },
  //       },
  //       cuisine: true,
  //       categories: {
  //         include: {
  //           category: true,
  //         },
  //       },
  //       steps: true,
  //       user: true
  //     },
  //   });

  //   const recipes = await Promise.all(
  //     recipesPagination.map(async (recipe) => {
  //       const allergens = await this.allergenService.getAllergensFromRecipe(recipe.id);
  //       return {
  //         recipe: {
  //           ...recipe,
  //           categories: recipe.categories.map(c => c.category),
  //         },
  //         allergens
  //       };
  //     })
  //   );

  //   return {
  //     recipes,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryIds?: string,
    cuisineIds?: string,
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
    const categories = categoryIds?.split(',');
    const cuisines = cuisineIds?.split(',');
    const where: Prisma.RecipeWhereInput = {
      AND: [
        {
          ...(categoryIds && { categories: { some: { categoryId: { in: categories } } } }),
          ...(cuisineIds && { cuisineId: { in: cuisines } }),
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

    const total = await this.prisma.recipe.count({ where });

    if (sortBy === 'cookingTime') {
      // Получаем *все* рецепты под фильтр (без сортировки и пагинации)
      const allRecipes = await this.prisma.recipe.findMany({
        where,
        include: {
          ingredients: {
            include: { ingredient: true, unit: true },
          },
          cuisine: true,
          categories: { include: { category: true } },
          steps: true,
          user: true,
        },
      });

      const recipesWithTime = await Promise.all(
        allRecipes.map(async (recipe) => {
          const totalCookingTime = recipe.steps.reduce((sum, step) => sum + (step.durationMin || 0), 0);
          const allergens = await this.allergenService.getAllergensFromRecipe(recipe.id);

          return {
            recipe: {
              ...recipe,
              categories: recipe.categories.map(c => c.category),
            },
            allergens,
            totalCookingTime,
          };
        })
      );

      // Сортируем вручную
      recipesWithTime.sort((a, b) =>
        sortOrder === 'asc' ? a.totalCookingTime - b.totalCookingTime : b.totalCookingTime - a.totalCookingTime
      );

      // Пагинация вручную
      const paginatedRecipes = recipesWithTime.slice((page - 1) * limit, page * limit);

      return {
        recipes: paginatedRecipes.map(({ recipe, allergens }) => ({ recipe, allergens })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Для других сортировок передаем в Prisma напрямую
    let orderBy: Prisma.RecipeOrderByWithRelationInput | undefined;
    if (sortBy) {
      switch (sortBy) {
        case 'title':
          orderBy = { title: sortOrder };
          break;
        case 'createdAt':
          orderBy = { createdAt: sortOrder };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    }

    const offset = (page - 1) * limit;

    const recipesPagination = await this.prisma.recipe.findMany({
      where,
      orderBy,
      skip: offset,
      take: +limit,
      include: {
        ingredients: { include: { ingredient: true, unit: true } },
        cuisine: true,
        categories: { include: { category: true } },
        steps: true,
        user: true,
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
          allergens,
        };
      })
    );

    return {
      recipes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }




  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<{ recipe: Recipe, allergens: Allergen[] }> {
    let oldPhotoDeleted = false;
    let updating = false;
    let deleting = false;
    let creating = false;

    const currentRecipe = await this.prisma.recipe.findUnique({
      where: { id },
      select: {
        imageId: true,
        imageUrl: true
      }
    });

    if (updateRecipeDto.oldMainPhotoPublicId) {
      this.photosService.deleteImage(updateRecipeDto.oldMainPhotoPublicId)
      if (updateRecipeDto.mainPhoto)
        updating = true;
      else
        deleting = true;
      oldPhotoDeleted = true;
    }

    if (!oldPhotoDeleted && updateRecipeDto.mainPhoto)
      creating = true;

    if (updateRecipeDto.stepsToDelete?.length) {
      await this.prisma.cookingStep.deleteMany({
        where: { id: { in: updateRecipeDto.stepsToDelete } }
      });
    }

    // Получаем оставшиеся шаги после удаления
    const remainingSteps = await this.prisma.cookingStep.findMany({
      where: { recipeId: id },
      orderBy: { order: 'asc' }
    });

    // Обновляем порядок оставшихся шагов
    for (let i = 0; i < remainingSteps.length; i++) {
      await this.prisma.cookingStep.update({
        where: { id: remainingSteps[i].id },
        data: { order: i + 1 }
      });
    }

    if (updateRecipeDto.categoriesToDisconnect?.length) {
      await this.prisma.categoryOnRecipe.deleteMany({
        where: {
          recipeId: id,
          categoryId: {
            in: updateRecipeDto.categoriesToDisconnect,
          },
        },
      });
    }

    // 3. Добавьте новые категории
    if (updateRecipeDto.categories?.length) {
      await this.prisma.categoryOnRecipe.createMany({
        data: updateRecipeDto.categories.map(category => ({
          recipeId: id,
          categoryId: category.categoryId, // Важно: передаем строку, а не объект
        })),
        skipDuplicates: true,
      });
    }

    if (updateRecipeDto.ingredientsToDisconnect?.length) {
      await this.prisma.ingredientOnRecipe.deleteMany({
        where: {
          recipeId: id,
          ingredientId: { in: updateRecipeDto.ingredientsToDisconnect }
        }
      });
    }

    if (updateRecipeDto.ingredients?.length) {
      // Проверяем существование ингредиентов
      const ingredientIds = updateRecipeDto.ingredients.map(i => i.ingredientId).filter(id => id !== undefined);;
      const existingCount = await this.prisma.ingredient.count({
        where: { id: { in: ingredientIds } }
      });

      if (existingCount !== ingredientIds.length) {
        throw new BadRequestException('One or more ingredients not found');
      }

      // Обновляем/создаём связи
      for (const ingr of updateRecipeDto.ingredients.filter(ing => ing.ingredientId !== undefined)) {
        await this.prisma.ingredientOnRecipe.upsert({
          where: {
            recipeId_ingredientId: {
              recipeId: id,
              ingredientId: ingr.ingredientId
            }
          },
          update: {
            quantity: Number(ingr.quantity),
            ingredientUnitId: ingr.ingredientUnitId
          },
          create: {
            recipeId: id,
            ingredientId: ingr.ingredientId,
            quantity: Number(ingr.quantity),
            ingredientUnitId: ingr.ingredientUnitId ?? ''
          }
        });
      }
    }

    const recipe = await this.prisma.recipe.update({
      where: { id },
      data: {
        ...(updateRecipeDto.title && { title: updateRecipeDto.title }),
        ...(updateRecipeDto.description && { description: updateRecipeDto.description }),
        ...(updateRecipeDto.cuisineId && {
          cuisine: { connect: { id: updateRecipeDto.cuisineId } },
        }),
        ...(updateRecipeDto.portions && { portions: +updateRecipeDto.portions }),


        // steps: {
        //   updateMany: updateRecipeDto.steps
        //     ?.filter(step => step.id)
        //     .map(step => ({
        //       where: { id: step.id },
        //       data: {
        //         title: step.title,
        //         description: step.description,
        //         order: +step.order,
        //         durationMin: Number(step.durationMin) ?? 0,
        //         ...(step.photo && {
        //           imageUrl: step.photo.url,
        //           imageId: step.photo.publicId
        //         }),
        //         ...(step.oldPhotoPublicId && !step.photo && {
        //           imageUrl: null,
        //           imageId: null
        //         })
        //       }
        //     })) || [],
        //   deleteMany: updateRecipeDto.stepsToDelete?.map(id => ({ id })) || [],

        //   create: updateRecipeDto.steps
        //     ?.filter(step => !step.id)
        //     .map(step => ({
        //       title: step.title,
        //       description: step.description,
        //       order: +step.order,
        //       durationMin: Number(step.durationMin) || 0,
        //       ...(step.photo && {
        //         imageUrl: step.photo.url,
        //         imageId: step.photo.publicId
        //       })
        //     })) || []
        // },
        steps: {
          // Обновляем существующие шаги
          updateMany: updateRecipeDto.steps
            ?.filter(step => step.id)
            .map(step => ({
              where: { id: step.id },
              data: {
                title: step.title,
                description: step.description,
                order: +step.order,
                durationMin: Number(step.durationMin) ?? 0,
                ...(step.photo && {
                  imageUrl: step.photo.url,
                  imageId: step.photo.publicId
                }),
                ...(step.oldPhotoPublicId && !step.photo && {
                  imageUrl: null,
                  imageId: null
                })
              }
            })) || [],

          // Добавляем новые шаги
          create: updateRecipeDto.steps
            ?.filter(step => !step.id)
            .map((step, index) => ({
              title: step.title,
              description: step.description,
              order: remainingSteps.length + index + 1,
              durationMin: Number(step.durationMin) || 0,
              ...(step.photo && {
                imageUrl: step.photo.url,
                imageId: step.photo.publicId
              })
            })) || []
        },

        // imageId: updateRecipeDto.mainPhoto?.publicId ?? null,
        // imageUrl: updateRecipeDto.mainPhoto?.url ?? null,
        // imageId: updateRecipeDto.mainPhoto?.publicId ?? currentRecipe?.imageId ?? null,
        // imageUrl: updateRecipeDto.mainPhoto?.url ?? currentRecipe?.imageUrl ?? null,

        imageUrl: (creating || updating) && !deleting ? updateRecipeDto.mainPhoto?.url : null,
        imageId: (creating || updating) && !deleting ? updateRecipeDto.mainPhoto?.publicId : null

      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
            unit: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        user: true,
        steps: true
      }
    });

    return {
      recipe: recipe,
      allergens: await this.allergenService.getAllergensFromRecipe(id)
    }
  }


  async remove(id: string): Promise<Recipe> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      select: {
        imageId: true
      }
    });

    if (recipe?.imageId) {
      await this.photosService.deleteImage(recipe.imageId);
    }

    return this.prisma.recipe.delete({
      where: { id: id },
    });
  }
}