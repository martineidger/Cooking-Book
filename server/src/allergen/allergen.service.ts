import { Injectable } from '@nestjs/common';
import { CreateAllergenDto } from '../dto/allergen/create-allergen.dto';
import { UpdateAllergenDto } from '../dto/allergen/update-allergen.dto';
import { DatabaseService } from 'src/database/database.service';

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
}
