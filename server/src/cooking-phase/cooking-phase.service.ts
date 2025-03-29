import { Injectable } from '@nestjs/common';
import { CreateCookingPhaseDto } from './dto/create-cooking-phase.dto';
import { DatabaseService } from 'src/database/database.service';
import { UpdateCookingPhaseDto } from './dto/update-cooking-phase.dto';

@Injectable()
export class CookingPhaseService {
    constructor(private readonly db: DatabaseService) { }

    async create(createCookingPhaseDto: CreateCookingPhaseDto, recipeId: string) {
        const phase = await this.db.cookingPhase.create({
            data: {
                title: createCookingPhaseDto.title,
                durationMin: createCookingPhaseDto.durationMin,
                recipe: { connect: { id: recipeId } },
                steps: {
                    create: createCookingPhaseDto.steps?.map(step => ({
                        description: step.description,
                        order: step.order,
                        durationMin: step.durationMin,
                        image: step.image,
                    }))
                }
            }
        });

        return phase;
    }

    async findAll() {
        const phases = await this.db.cookingPhase.findMany({
            include: {
                steps: true,
            },
        });
        return phases;
    }

    async findOne(id: string) {
        const phase = await this.db.cookingPhase.findUnique({
            where: { id },
            include: {
                steps: true,
            },
        });

        if (!phase) {
            throw new Error('Этап не найден');
        }
        return phase;
    }

    async update(id: string, updateData: UpdateCookingPhaseDto) {
        const updatedPhase = await this.db.cookingPhase.update({
            where: { id },
            data: {
                ...updateData,
                steps: updateData.steps ? {
                    create: updateData.steps.map(step => ({
                        description: step.description || '',
                        order: step.order,
                        durationMin: step.durationMin || 0,
                        image: step.image || '',
                    })),
                } : undefined,
            },
        });
        return updatedPhase;
    }

    async remove(id: string) {
        const deletedPhase = await this.db.cookingPhase.delete({
            where: { id },
        });
        return deletedPhase;
    }
}
