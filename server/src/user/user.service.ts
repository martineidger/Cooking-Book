import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findProfile(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        role: true,
        _count: {
          select: {
            recipes: true,
            collections: {
              where: {
                isPublic: true
              }
            },
            following: true,
            followers: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
      stats: {
        recipeCount: user._count.recipes,
        publicCollectionCount: user._count.collections,
        followingCount: user._count.following,
        followersCount: user._count.followers
      }
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({
      where: {
        role: { not: 'Admin' }
      }
    })
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email: email },
      include: {
        recipes: true,
        subscriptions: true
      }
    })
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

  async findCurrentUser(user) {
    const userEntity = await this.prisma.user.findUnique(user.userId); // или user.sub в зависимости от вашей JWT структуры

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    console.log("CURRENT", userEntity);
    return userEntity;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // return await this.prisma.user.update({
    //   where: {id : id},
    //   data: updateUserDto
    // })
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
