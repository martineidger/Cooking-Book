import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from '../dto/recipe/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipe/update-recipe.dto';
import { Cuisine, Recipe } from '@prisma/client';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) { }

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return await this.recipeService.create(createRecipeDto);
  }

  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('cuisineId') cuisineId?: string,
    @Query('ingredientIds') ingredientIds?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<Recipe[]> {
    const ingredientIdsArray = ingredientIds ? ingredientIds.split(',') : undefined;
    return await this.recipeService.findAll(categoryId, cuisineId, ingredientIdsArray, sortBy, sortOrder);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Recipe | null> {
    return await this.recipeService.findOne(String(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return await this.recipeService.update(String(id), updateRecipeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Recipe> {
    return await this.recipeService.remove(String(id));
  }
}