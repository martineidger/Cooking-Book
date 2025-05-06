import { Injectable } from "@nestjs/common";
import { CookingStep } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { CreateNoteDto } from "src/dto/note/create-note.dto";

@Injectable()
export class AdditionalService {
    constructor(
        private readonly prisma: DatabaseService,
    ) { }

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

    async addNote(createNoteDto: CreateNoteDto) {
        return await this.prisma.note.create({
            data: createNoteDto
        })
    }

    // async addRecipeToFavorites(userId: string, recipeId: string) {
    //     const favoriteRecipe = await this.prisma.favoriteRecipe.create({
    //         data: {
    //             userId: userId,
    //             recipeId: recipeId,
    //         },
    //     });
    //     return favoriteRecipe;
    // }

    async subscribeToCategory(userId, categoryId) {
        const subscription = await this.prisma.subscription.create({
            data: {
                userId: userId,
                categoryId: categoryId,
            },
        });
        return subscription;
    }
}