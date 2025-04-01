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
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
