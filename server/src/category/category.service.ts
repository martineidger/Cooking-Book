import { Injectable } from '@nestjs/common';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateSubscriptionDto } from 'src/dto/subscription/create-subscription.dto';
//import { UpdateCategoryDto } from '../dto/category/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: DatabaseService) { }

  create(createCategoryDto: CreateBaseElement) {
    return this.prisma.category.create({
      data: createCategoryDto
    })
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id: id }
    })
  }


  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id: id.toString() },
    });
  }

  async createSubscription(subscribeDto: CreateSubscriptionDto) {
    return await this.prisma.subscription.create({
      data: {
        category: { connect: { id: subscribeDto.categoryId } },
        user: { connect: { id: subscribeDto.userId } }
      }
    })
  }

  async getRecipesByUserSubscriptions(userId: string) {
    const categories = await this.prisma.subscription.findMany({
      where: {
        userId: userId
      },
      select: {
        categoryId: true
      }
    })
    const categoryIds = categories.map(c => c.categoryId);

    return await this.prisma.recipe.findMany({
      where: {
        categories: {
          some: { categoryId: { in: categoryIds } }
        }
      }
    })
  }

  async getUserSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: {
        userId: userId
      },
      include: {
        category: true
      }
    })
  }
}
