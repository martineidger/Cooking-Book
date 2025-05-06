import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAllergenDto } from '../dto/allergen/create-allergen.dto';
import { UpdateAllergenDto } from '../dto/allergen/update-allergen.dto';
import { DatabaseService } from 'src/database/database.service';
import { Allergen } from '@prisma/client';

@Injectable()
export class AllergenService {
  constructor(private readonly prisma: DatabaseService) { }

  create(createAllergenDto: CreateAllergenDto) {
    return 'This action adds a new allergen';
  }

  async findAll() {
    return await this.prisma.ingredientAllergen.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} allergen`;
  }

  update(id: string, updateAllergenDto: UpdateAllergenDto) {
    return `This action updates a #${id} allergen`;
  }

  remove(id: string) {
    return `This action removes a #${id} allergen`;
  }

  async getAllergensFromRecipe(recipeId: string): Promise<Allergen[]> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            ingredient: {
              include: {
                allergens: {
                  include: {
                    allergen: true
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

    const allergenMap = new Map<string, Allergen>();

    recipe.ingredients.forEach(recipeIngredient => {
      recipeIngredient.ingredient.allergens?.forEach(ingredientAllergen => {
        const allergen = ingredientAllergen.allergen;
        if (!allergenMap.has(allergen.id)) {
          allergenMap.set(allergen.id, allergen);
        }
      });
    });

    return Array.from(allergenMap.values());
  }
}
