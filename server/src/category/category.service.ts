import { Injectable } from '@nestjs/common';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { DatabaseService } from 'src/database/database.service';
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

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id: id.toString() },
    });
  }

  async createSubscription(categoryId: string, userId: string) {
    return await this.prisma.subscription.create({
      data: {
        category: { connect: { id: categoryId } },
        user: { connect: { id: userId } }
      }
    })
  }
}
