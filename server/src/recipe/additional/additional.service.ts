import { Injectable } from "@nestjs/common";
import { CookingStep } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { CreateNoteDto } from "src/dto/note/create-note.dto";
import { GetRecipeNotesDto } from "src/dto/recipe/get-recipe-notes.dto";
import { CreateSubscriptionDto } from "src/dto/subscription/create-subscription.dto";

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

    async getRecipeNotes(getNotesDto: GetRecipeNotesDto) {
        return await this.prisma.note.findMany({
            where: {
                recipeId: getNotesDto.recipeId,
                OR: [{
                    isPublic: true
                }, {
                    userId: getNotesDto.userId
                }]
            },
            include: {
                user: true
            }
        })
    }


}