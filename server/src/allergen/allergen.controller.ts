import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllergenService } from './allergen.service';
import { CreateAllergenDto } from '../dto/allergen/create-allergen.dto';
import { UpdateAllergenDto } from '../dto/allergen/update-allergen.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('allergens')
@Public()
export class AllergenController {
  constructor(private readonly allergenService: AllergenService) { }

  @Post()
  create(@Body() createAllergenDto: CreateAllergenDto) {
    return this.allergenService.create(createAllergenDto);
  }

  @Get()
  async findAll() {
    return await this.allergenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allergenService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllergenDto: UpdateAllergenDto) {
    return this.allergenService.update(id, updateAllergenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allergenService.remove(id);
  }
}
