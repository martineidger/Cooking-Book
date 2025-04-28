import { Controller, Get, Post, Body, Param, Put, Delete, Query, Patch, ParseArrayPipe, ValidationPipe, UseGuards } from '@nestjs/common';
import { CountPortionsDto } from '../dto/recipe/count-portions.dto';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from '../dto/recipe/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipe/update-recipe.dto';
import { Allergen, CookingStep, Cuisine, Note, Recipe, Role } from '@prisma/client';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { CreateNoteDto } from 'src/dto/note/create-note.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('recipes')
@Public()
// @UseGuards(AuthGuard('jwt'))
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) { }

  @Post('notes')
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.recipeService.addNote(createNoteDto);
  }

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return await this.recipeService.create(createRecipeDto);
  }

  @Get('with-ingredients')
  async findRecipesByIngredients(
    @Query('ingredientIds', new ParseArrayPipe({ items: String, separator: ',' }))
    ingredientIds: string[],
    @Query('categoryId') categoryId?: string,
    @Query('cuisineId') cuisineId?: string
  ): Promise<{ recipe: Recipe; matchCount: number; allergens: Allergen[] }[]> {
    return this.recipeService.findAllWithIngredientMatch(
      ingredientIds,
      categoryId,
      cuisineId
    );
  }

  @Get('count-portions')
  async findMany(
    @Query(new ValidationPipe({ transform: true })) query: CountPortionsDto,
  ): Promise<{ Recipe: Recipe; minPortionsCount: number }[]> {

    const ingredients = new Map<string, number>();
    query.ingredientIds.forEach(({ id, quantity }) => {
      ingredients.set(id, quantity);
    });

    return this.recipeService.findPortionsByIngredientCount(ingredients);
  }

  @Get(':id/cook')
  async findStep(@Param('id') id: string, @Query('step-number') stepNumber: string): Promise<CookingStep | null> {
    return await this.recipeService.findStep(id, +stepNumber);
  }

  @Get(':id')
  // @Roles(Role.Admin)
  // @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string): Promise<{ recipe: Recipe; allergens: Allergen[] }> {
    return await this.recipeService.findOne(String(id));
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,          // Текущая страница (по умолчанию 1)
    @Query('limit') limit: number = 10,       // Количество рецептов на странице (по умолчанию 10)
    @Query('categoryId') categoryId?: string,
    @Query('cuisineId') cuisineId?: string,
    @Query('ingredientIds') ingredientIds?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<{
    recipes: { recipe: Recipe; allergens: Allergen[] }[],
    total: number,      // Общее количество рецептов
    page: number,       // Текущая страница
    limit: number,      // Лимит на странице
    totalPages: number  // Всего страниц
  }> {
    const ingredientIdsArray = ingredientIds ? ingredientIds.split(',') : undefined;
    return await this.recipeService.findAll(
      page,
      limit,
      categoryId,
      cuisineId,
      ingredientIdsArray,
      sortBy,
      sortOrder
    );
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