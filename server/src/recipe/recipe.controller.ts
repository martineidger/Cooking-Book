import { Controller, Get, Post, Body, Param, Put, Delete, Query, Patch, ParseArrayPipe, ValidationPipe, UseGuards, HttpException, HttpStatus, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
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
import { AnyFilesInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryInterceptor } from 'src/common/interceptors/photo.interceptor';


@Controller('recipes')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly servingsService: ServingsService,
    private readonly additionalService: AdditionalService
  ) { }

  @Post('note')
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return await this.additionalService.addNote(createNoteDto);
  }


  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainPhoto', maxCount: 1 },
      { name: 'steps', maxCount: 10 },
    ]),
    //AnyFilesInterceptor(),
    CloudinaryInterceptor,
  )
  async create(
    @Body() body) {
    return await this.recipeService.create(body);
  }

  @Get('with-ingredients')
  @Public()
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
  @Public()
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
  @Public()
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
  @Public()
  async getRecipeStep(
    @Param('id') id: string,
    @Param('stepNumber') stepNumber: number
  ) {
    return this.additionalService.findStep(id, stepNumber);
  }

  @Get(':id')
  @Public()
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
  @Public()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categoryIds') categoryIds?: string,
    @Query('cuisineIds') cuisineIds?: string,
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
      categoryIds,
      cuisineIds,
      ingredientIdsArray,
      sortBy,
      sortOrder,
      searchTerm // Передаем в сервис
    );
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainPhoto', maxCount: 1 },
      { name: 'steps', maxCount: 10 },
    ]),
    CloudinaryInterceptor,
  )
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return await this.recipeService.update(String(id), updateRecipeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Recipe> {
    return await this.recipeService.remove(id);
  }

  @Get(':id/notes')
  @Public()
  async getRecipeNotes(@Param('id') id: string, @Query('userId') userId?: string) {
    return await this.additionalService.getRecipeNotes({ recipeId: id, userId: userId });
  }

  @Get('user/:userId')
  @Public()
  async getUserRecipes(@Param('userId') id: string, @Query('page') page: string, @Query('limit') limit: string) {
    return this.recipeService.getUserRecipes(id, +page, +limit);
  }
}