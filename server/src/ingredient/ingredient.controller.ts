import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from 'src/dto/ingredient/create-ingredient.dto';
import { Ingredient, IngredientCategory, IngredientUnit } from '@prisma/client';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { CreateIngredientUnitDto } from 'src/dto/ingredient/create-ingredient-unit.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('ingredients')
@Public()
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) { }

  @Post('category')
  async createCategory(@Body() createCategoryDto: CreateBaseElement): Promise<IngredientCategory> {
    return this.ingredientService.createCategory(createCategoryDto);
  }

  // @Post('unit')
  // async createUnit(@Body() createUnitDto: CreateIngredientUnitDto): Promise<IngredientUnit> {
  //   return this.ingredientService.createUnit(createUnitDto);
  // }

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get('category')
  async findAllCategories() {
    return await this.ingredientService.findAllCategories();
  }

  @Get(':id')
  async findIngredient(@Param('id') id: string) {
    return await this.ingredientService.findIngredient(id);
  }

  @Get('unit')
  async findAllUnits() {
    return await this.ingredientService.findAllUnits();
  }

  @Get()
  async findAll() {
    return await this.ingredientService.findAll();
  }
}
