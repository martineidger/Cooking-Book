import { Injectable } from '@nestjs/common';
import { CreateBaseElement } from 'src/dto/base/create-base-element.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CuisineService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(createCuisineDto: CreateBaseElement) {
    return await this.prisma.cuisine.create({
      data: createCuisineDto
    })
  }

  findAll() {
    return `This action returns all cuisine`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cuisine`;
  }

  // update(id: number, updateCuisineDto: UpdateCuisineDto) {
  //   return `This action updates a #${id} cuisine`;
  // }

  remove(id: number) {
    return `This action removes a #${id} cuisine`;
  }
}
