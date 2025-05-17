import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddRecipeDto } from 'src/dto/collection/add-recipe.dto';
import { AddRemoveFromFavDto } from 'src/dto/collection/add-remove-from-fav.dto';
import { CreateCollectionDto } from 'src/dto/collection/create-collection.dto';
import { DeleteRecipeFromCollectionDto } from 'src/dto/collection/delete-recipe.dto';
import { RemoveRecipesDto } from 'src/dto/collection/remove-recipes.dto';
import { UpdateCollectionDto } from 'src/dto/collection/update-collection.dto';

@Injectable()
export class FavouritesService {
    constructor(
        private readonly prisma: DatabaseService,
    ) { }

    async addRecipe(addRecipeDto: AddRemoveFromFavDto) {
        return this.prisma.favorite.upsert({
            where: {
                userId_recipeId: {
                    userId: addRecipeDto.userId,
                    recipeId: addRecipeDto.recipesIds[0]
                }
            },
            create: {
                userId: addRecipeDto.userId,
                recipeId: addRecipeDto.recipesIds[0]
            },
            update: {}
        });
    }

    async removeRecipe(removeRecipeDto: AddRemoveFromFavDto) {
        return this.prisma.favorite.delete({
            where: {
                userId_recipeId: {
                    userId: removeRecipeDto.userId,
                    recipeId: removeRecipeDto.recipesIds[0]
                }
            },
        });
    }

    async removeRecipes(removeRecipesDto: AddRemoveFromFavDto) {
        console.log("REMOVE", removeRecipesDto)
        return this.prisma.favorite.deleteMany({
            where: {
                userId: removeRecipesDto.userId,
                recipeId: { in: removeRecipesDto.recipesIds }
            }
        })
    }

    async findOne(userId: string) {
        return this.prisma.favorite.findMany({
            where: { userId: userId },
            include: { recipe: true }
        });
    }

    async findAll() {
        return this.prisma.favorite.findMany()
    }

}
