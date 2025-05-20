import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { CreateSubscriptionDto } from 'src/dto/subscription/create-subscription.dto';
import { Subscription } from '@prisma/client';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('categories')
@Public()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('subscribe')
  async createSubscription(
    @Body() subscribeDto: CreateSubscriptionDto
  ): Promise<Subscription> {
    return await this.categoryService.createSubscription(subscribeDto);
  }

  @Delete('subscribe')
  async deleteSubscription(
    @Body() subscribeDto: CreateSubscriptionDto
  ): Promise<Subscription> {
    return await this.categoryService.deleteSubscription(subscribeDto);
  }

  @Get('check')
  async checkSubscription(@Query('userId') userId: string, @Query('categoryId') catId: string) {
    return this.categoryService.checkSub(userId, catId);
  }

  @Get('sub/get-recipes')
  async getRecipesBySub(@Query('userId') id: string) {
    return this.categoryService.getRecipesByUserSubscriptions(id);
  }

  @Get(':id/detail')
  async getDetails(@Param('id') id: string) {
    return await this.categoryService.getDetail(id);
  }

  @Post()
  async create(@Body() createCategoryDto: CreateBaseElement) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @Get('for-user/:id')
  async getUserSubscriptions(@Param('id') id: string) {
    return await this.categoryService.getUserSubscriptions(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id);
  }
}
