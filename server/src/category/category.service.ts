import { Injectable } from '@nestjs/common';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateSubscriptionDto } from 'src/dto/subscription/create-subscription.dto';
//import { UpdateCategoryDto } from '../dto/category/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: DatabaseService) { }

  async checkSub(userId: string, catId: string) {
    const sub = await this.prisma.subscription.count({
      where: {
        categoryId: catId,
        userId: userId
      }
    })

    return sub !== 0;
  }

  async getDetail(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: id },
      // select: {
      //   id: true,
      //   description: true,
      //   name: true,
      //   recipes: true,
      //   Subscription: true
      // },
      include: {
        Subscription: true,
        recipes: {
          include: {
            recipe: {
              include: {
                ingredients: {
                  include: {
                    ingredient: true,
                    unit: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    return {
      ...category,
      recipesCount: category?.recipes.length,
      subscriptionsCount: category?.Subscription.length
    }
  }
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

  async deleteSubscription(subscribeDto: CreateSubscriptionDto) {
    return await this.prisma.subscription.delete({
      where: {
        userId_categoryId: {
          categoryId: subscribeDto.categoryId,
          userId: subscribeDto.userId
        }

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
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
            unit: true
          }
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
        category: {
          include: {
            recipes: {
              include: {
                recipe: true
              }
            }
          }
        }

      }
    })
  }
}
