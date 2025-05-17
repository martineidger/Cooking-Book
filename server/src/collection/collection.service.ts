import { Injectable } from '@nestjs/common';
import { RecipeCollection } from '@prisma/client';
import { contains } from 'class-validator';
import { DatabaseService } from 'src/database/database.service';
import { AddRecipeDto } from 'src/dto/collection/add-recipe.dto';
import { CopyMoveRecipesResultDto } from 'src/dto/collection/copy-move-recipes-result.dto';
import { CopyMoveRecipesDto } from 'src/dto/collection/copy-move-recipes.dto';
import { CreateCollectionDto } from 'src/dto/collection/create-collection.dto';
import { DeleteRecipeFromCollectionDto } from 'src/dto/collection/delete-recipe.dto';
import { RemoveRecipesDto } from 'src/dto/collection/remove-recipes.dto';
import { UpdateCollectionDto } from 'src/dto/collection/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    private readonly prisma: DatabaseService,
  ) { }

  async getCollectionsByRecipeId(recipeId: string) {
    return this.prisma.recipeCollection.findMany({
      where: {
        RecipeOnCollection: {
          some: {
            recipeId: recipeId
          }
        }
      },
      include: {
        RecipeOnCollection: {
          where: {
            recipeId: recipeId
          },
          select: {
            id: true,
            collection: true
          }
        },
        User: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async createCollection(createCollectionDto: CreateCollectionDto) {
    return this.prisma.recipeCollection.create({
      data: {
        name: createCollectionDto.name,
        isPublic: createCollectionDto.isPublic,
        RecipeOnCollection: {
          create: createCollectionDto.recipes?.map(recipeId => ({
            recipe: { connect: { id: recipeId } },
          })) || [],
        },
        User: { connect: { id: createCollectionDto.userId } }
      },
      include: {
        RecipeOnCollection: {
          include: {
            recipe: true
          }
        }
      }
    });
  }

  async getRecipesFromCollection(collectionId: string) {
    return this.prisma.recipeOnCollection.findMany({
      where: {
        recipeCollectionId: collectionId
      },
      include: {
        collection: true,
        recipe: true
      }
    })
  }

  async removeRecipe(removeRecipeDto: DeleteRecipeFromCollectionDto) {
    return this.prisma.recipeOnCollection.deleteMany({
      where: {
        recipeId: removeRecipeDto.recipeId,
        recipeCollectionId: { in: removeRecipeDto.collectionIds }
      }
    });
  }

  async removeRecipes(removeRecipesDto: RemoveRecipesDto) {
    return this.prisma.recipeOnCollection.deleteMany({
      where: {
        recipeCollectionId: removeRecipesDto.collectionId,
        recipeId: { in: removeRecipesDto.recipesIds }
      }
    })
  }

  async moveRecipes(moveRecipesDto: CopyMoveRecipesDto): Promise<CopyMoveRecipesResultDto | null> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Проверяем существование коллекций
      const [sourceCollection, targetCollection] = await Promise.all([
        tx.recipeCollection.findUnique({
          where: { id: moveRecipesDto.sourceCollectionId },
        }),
        tx.recipeCollection.findUnique({
          where: { id: moveRecipesDto.targetCollectionId },
        }),
      ]);

      if (!sourceCollection || !targetCollection) {
        throw new Error('Одна из коллекций не найдена');
      }

      // 2. Проверяем существование связей в исходной коллекции
      const existingSourceLinks = await tx.recipeOnCollection.findMany({
        where: {
          recipeCollectionId: moveRecipesDto.sourceCollectionId,
          recipeId: { in: moveRecipesDto.recipeIds },
        },
        select: { recipeId: true },
      });

      const existingSourceIds = existingSourceLinks.map(link => link.recipeId);
      const missingInSource = moveRecipesDto.recipeIds.filter(
        id => !existingSourceIds.includes(id)
      );

      if (missingInSource.length > 0) {
        throw new Error(
          `Следующие рецепты не найдены в исходной коллекции: ${missingInSource.join(', ')}`
        );
      }

      // 3. Проверяем какие рецепты уже есть в целевой коллекции
      const existingTargetLinks = await tx.recipeOnCollection.findMany({
        where: {
          recipeCollectionId: moveRecipesDto.targetCollectionId,
          recipeId: { in: moveRecipesDto.recipeIds },
        },
        select: { recipeId: true },
      });

      const existingTargetIds = existingTargetLinks.map(link => link.recipeId);
      const recipesToMove = moveRecipesDto.recipeIds.filter(
        id => !existingTargetIds.includes(id)
      );

      if (moveRecipesDto.mode === 'move') {
        await tx.recipeOnCollection.deleteMany({
          where: {
            recipeCollectionId: moveRecipesDto.sourceCollectionId,
            recipeId: { in: moveRecipesDto.recipeIds },
          },
        });
      }


      // 5. Добавляем в целевую коллекцию только те, которых там нет
      const createdLinks = await Promise.all(
        recipesToMove.map(recipeId =>
          tx.recipeOnCollection.create({
            data: {
              recipeId,
              recipeCollectionId: moveRecipesDto.targetCollectionId,
            },
          })
        )
      );

      // 6. Формируем информативный результат
      const result: CopyMoveRecipesResultDto = {
        totalRequested: moveRecipesDto.recipeIds.length,
        alreadyInTarget: existingTargetIds,
        successfullyMoved: createdLinks.map(link => link.recipeId),
        skipped: existingTargetIds.length,
        movedCount: createdLinks.length,
      };

      if (existingTargetIds.length > 0) {
        result.message = `Некоторые рецепты уже были в целевой коллекции: ${existingTargetIds.join(', ')}. Остальные успешно перемещены.`;
      } else {
        result.message = 'Все рецепты успешно перемещены';
      }

      return result;
    });
  }

  async addRecipeToCollections(addDto: {
    userId: string;
    recipeId: string;
    collectionIds: string[];
    addToFavorites?: boolean;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Проверяем существование рецепта
      const recipeExists = await tx.recipe.findUnique({
        where: { id: addDto.recipeId },
      });
      if (!recipeExists) {
        throw new Error('Рецепт не найден');
      }

      // 2. Проверяем существование коллекций
      const existingCollections = await tx.recipeCollection.findMany({
        where: {
          id: { in: addDto.collectionIds },
          userId: addDto.userId, // Проверяем, что коллекции принадлежат пользователю
        },
      });

      if (existingCollections.length !== addDto.collectionIds.length) {
        const missingIds = addDto.collectionIds.filter(
          id => !existingCollections.some(c => c.id === id)
        );
        throw new Error(
          `Некоторые коллекции не найдены или не принадлежат пользователю: ${missingIds.join(', ')}`
        );
      }

      // 3. Добавляем в коллекции (игнорируем уже существующие связи)
      const collectionPromises = addDto.collectionIds.map(collectionId =>
        tx.recipeOnCollection.upsert({
          where: {
            recipeId_recipeCollectionId: {
              recipeId: addDto.recipeId,
              recipeCollectionId: collectionId,
            },
          },
          create: {
            recipeId: addDto.recipeId,
            recipeCollectionId: collectionId,
          },
          update: {}, // Если связь уже есть - ничего не делаем
        })
      );

      // 4. Добавляем в избранное при необходимости
      let favoriteResult;
      if (addDto.addToFavorites) {
        favoriteResult = await tx.favorite.upsert({
          where: {
            userId_recipeId: {
              userId: addDto.userId,
              recipeId: addDto.recipeId,
            },
          },
          create: {
            userId: addDto.userId,
            recipeId: addDto.recipeId,
          },
          update: {},
        });
      }

      const collectionResults = await Promise.all(collectionPromises);

      return {
        addedToCollections: collectionResults.map(r => r.recipeCollectionId),
        addedToFavorites: addDto.addToFavorites ? favoriteResult !== null : false,
        message: `Рецепт успешно добавлен в ${collectionResults.length} коллекций${addDto.addToFavorites ? ' и в избранное' : ''
          }`,
      };
    });
  }

  async searchCollections(
    searchTerm: string,
    options: {
      sortBy?: 'createdAt' | 'updatedAt';
      sortOrder?: 'asc' | 'desc';
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<{
    data: RecipeCollection[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const {
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      pageSize = 10,
    } = options;

    const skip = (page - 1) * pageSize;
    const where = {
      name: {
        contains: searchTerm,
        mode: 'insensitive' as const,
      },
      isPublic: true,
    };

    const [total, data] = await Promise.all([
      this.prisma.recipeCollection.count({ where }),
      this.prisma.recipeCollection.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
        include: {
          RecipeOnCollection: {
            include: {
              recipe: true,
            },
          },
        },
      }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getUserCollections(
    userId: string,
    page: number = 1,
    limit: number = 10,
    // Добавляем параметр для проверки роли
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    const isAdmin: boolean = user?.role === "Admin";
    const skip = (page - 1) * limit;

    const whereCondition = {
      userId,
      ...(!isAdmin && { isPublic: true }) // Для не-админов показываем только публичные
    };

    const [collections, totalCount] = await Promise.all([
      this.prisma.recipeCollection.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          RecipeOnCollection: {
            select: {
              recipe: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        }
      }),
      this.prisma.recipeCollection.count({
        where: whereCondition
      })
    ]);

    return {
      data: collections.map(collection => ({
        id: collection.id,
        name: collection.name,
        isPublic: collection.isPublic,
        createdAt: collection.createdAt,
        recipesCount: collection.RecipeOnCollection.length
      })),
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  findOne(userId: string) {
    return this.prisma.recipeCollection.findMany({
      where: { userId: userId },
      include: {
        RecipeOnCollection: true
      }
    })
  }

  updateCollection(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.prisma.recipeCollection.update({
      where: { id: id },
      data: {
        name: updateCollectionDto.name,
        isPublic: updateCollectionDto.isPublic

      }
    })
  }

  removeCollection(collectionId: string) {
    return this.prisma.recipeCollection.delete({
      where: { id: collectionId }
    })
  }
}
