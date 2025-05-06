import { Controller, Get, Post, Body, Param, Put, Delete, Query, Patch, ParseArrayPipe, ValidationPipe, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CountPortionsDto } from '../dto/recipe/count-portions.dto';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from '../dto/recipe/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/recipe/update-recipe.dto';
import { Allergen, CookingStep, Cuisine, IngredientUnit, Note, Recipe, Role } from '@prisma/client';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { CreateNoteDto } from 'src/dto/note/create-note.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { ServingsService } from './servings/servings.service';
import { AdditionalService } from './additional/additional.service';
import { PortionsResponseDto } from 'src/dto/recipe/portions-responce.dto';


@Controller('recipes')
@Public()
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly servingsService: ServingsService,
    private readonly additionalService: AdditionalService
  ) { }

  @Post('notes')
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.additionalService.addNote(createNoteDto);
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
  ): Promise<{
    recipe: Recipe & {
      ingredients: Array<{
        ingredientId: string;
        quantity: number;
        unit: IngredientUnit;
        ingredient: { name: string };
      }>;
    };
    minPortionsCount: number;
    ingredientsDetail: Array<{
      ingredientId: string;
      name: string;
      requiredPerPortion: number;
      available: number;
      unit: IngredientUnit;
    }>;
  }[]> {

    const ingredients = new Map<string, number>();
    query.ingredientIds.forEach(({ id, quantity }) => {
      ingredients.set(id, quantity);
    });

    return this.servingsService.findServingsByIngredientCount(ingredients);
  }

  @Get('count-portions-partial')
  async findPartialMatches(
    @Query(new ValidationPipe({ transform: true })) query: CountPortionsDto,
  ): Promise<PortionsResponseDto[]> {
    const ingredients = new Map<string, number>();
    query.ingredientIds.forEach(({ id, quantity }) => {
      ingredients.set(id, quantity);
    });

    return this.servingsService.findServingsByIngredientCountPartial(ingredients);
  }

  @Get(':id/steps/:stepNumber')
  async getRecipeStep(
    @Param('id') id: string,
    @Param('stepNumber') stepNumber: number
  ) {
    return this.additionalService.findStep(id, stepNumber);
  }

  @Get(':id')
  // @Roles(Role.Admin)
  async findOne(@Param('id') id: string): Promise<{ recipe: Recipe; allergens: Allergen[] }> {
    return await this.recipeService.findOne(String(id));
  }

  // @Get()
  // async findAll(
  //   @Query('page') page: number = 1,          // Текущая страница (по умолчанию 1)
  //   @Query('limit') limit: number = 10,       // Количество рецептов на странице (по умолчанию 10)
  //   @Query('categoryId') categoryId?: string,
  //   @Query('cuisineId') cuisineId?: string,
  //   @Query('ingredientIds') ingredientIds?: string,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  // ): Promise<{
  //   recipes: { recipe: Recipe; allergens: Allergen[] }[],
  //   total: number,      // Общее количество рецептов
  //   page: number,       // Текущая страница
  //   limit: number,      // Лимит на странице
  //   totalPages: number  // Всего страниц
  // }> {
  //   const ingredientIdsArray = ingredientIds ? ingredientIds.split(',') : undefined;
  //   return await this.recipeService.findAll(
  //     page,
  //     limit,
  //     categoryId,
  //     cuisineId,
  //     ingredientIdsArray,
  //     sortBy,
  //     sortOrder
  //   );
  // }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categoryId') categoryId?: string,
    @Query('cuisineId') cuisineId?: string,
    @Query('ingredientIds') ingredientIds?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('searchTerm') searchTerm?: string, // Добавляем параметр поиска
  ): Promise<{
    recipes: { recipe: Recipe; allergens: Allergen[] }[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }> {
    const ingredientIdsArray = ingredientIds ? ingredientIds.split(',') : undefined;
    return await this.recipeService.findAll(
      page,
      limit,
      categoryId,
      cuisineId,
      ingredientIdsArray,
      sortBy,
      sortOrder,
      searchTerm // Передаем в сервис
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