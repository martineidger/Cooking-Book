import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from 'src/dto/collection/create-collection.dto';
import { UpdateCollectionDto } from 'src/dto/collection/update-collection.dto';
import { AddRecipeDto } from 'src/dto/collection/add-recipe.dto';
import { FavouritesService } from './favourites/favourites.service';
import { CopyMoveRecipesDto } from 'src/dto/collection/copy-move-recipes.dto';
import { DeleteRecipeFromCollectionDto } from 'src/dto/collection/delete-recipe.dto';
import { AddRemoveFromFavDto } from 'src/dto/collection/add-remove-from-fav.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RemoveRecipesDto } from 'src/dto/collection/remove-recipes.dto';

@Controller('collection')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly favoritesService: FavouritesService
  ) { }

  @Get('user/:id')
  async getUserCollections(@Param('id') id: string, @Query('page') page: string, @Query('limit') limit: string) {
    return this.collectionService.getUserCollections(id, +page, +limit)
  }

  @Post('add-to-collections')
  addRecipe(@Body() addRecipeDto: AddRecipeDto) {
    return this.collectionService.addRecipeToCollections(addRecipeDto);
  }

  @Post('add-to-fav')
  addToFav(@Body() addRecipeDto: AddRemoveFromFavDto) {
    return this.favoritesService.addRecipe(addRecipeDto);
  }

  @Post()
  createCollection(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.createCollection(createCollectionDto)
  }

  @Get()
  getById(@Query('collectionId') collectionId: string) {
    return this.collectionService.getById(collectionId);
  }

  @Get(':id')
  findUserCollections(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Get('fav/:userId')
  findOne(@Param('userId') userId: string) {
    return this.favoritesService.findOne(userId);
  }

  @Get(':id/recipes')
  @Public()
  async getRecipesFromCollection(@Param('id') id: string) {
    return this.collectionService.getRecipesFromCollection(id);
  }

  @Get('by-recipe/:recipeId')
  async getCollectionsByRecipeId(@Param('recipeId') recipeId: string) {
    return this.collectionService.getCollectionsByRecipeId(recipeId);
  }

  @Post('copy')
  async copyRecipes(@Body() copyRecipesDto: CopyMoveRecipesDto) {
    return await this.collectionService.moveRecipes({ ...copyRecipesDto, mode: 'copy' });
  }

  @Post('move')
  async moveRecipes(@Body() copyRecipesDto: CopyMoveRecipesDto) {
    return await this.collectionService.moveRecipes({ ...copyRecipesDto, mode: 'move' });
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionService.updateCollection(id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionService.removeCollection(id);
  }

  @Put('remove-from-collection')
  removeRecipeFromCollection(@Body() removeDto: DeleteRecipeFromCollectionDto) {
    return this.collectionService.removeRecipe(removeDto);
  }

  @Put('remove-recipes')
  removeRecipesFromCollection(@Body() removeDto: RemoveRecipesDto) {
    return this.collectionService.removeRecipes(removeDto);
  }

  @Put('remove-from-fav')
  removeFromFavorites(@Body() removeDto: AddRemoveFromFavDto) {
    return this.favoritesService.removeRecipes(removeDto);
  }

  @Get('search')
  @Public()
  async searchCollections(
    @Query('searchTerm') searchTerm: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'updatedAt',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.collectionService.searchCollections(searchTerm, {
      sortBy,
      sortOrder,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }
}
