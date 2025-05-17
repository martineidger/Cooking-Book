import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('cuisines')
@Public()
export class CuisineController {
  constructor(private readonly cuisineService: CuisineService) { }

  @Post()
  async create(@Body() createCuisineDto: CreateBaseElement) {
    return await this.cuisineService.create(createCuisineDto);
  }

  @Get()
  findAll() {
    return this.cuisineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cuisineService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCuisineDto: UpdateCuisineDto) {
  //   return this.cuisineService.update(+id, updateCuisineDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuisineService.remove(+id);
  }
}
