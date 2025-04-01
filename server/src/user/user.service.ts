import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: createUserDto
    })
  }

  async findAll() {
    return await this.prisma.user.findMany()
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        recipes: true,
        subscriptions: true
      }
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // return await this.prisma.user.update({
    //   where: {id : id},
    //   data: updateUserDto
    // })
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
