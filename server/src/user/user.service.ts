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
        followingCount: user._count.followers,
        followersCount: user._count.following
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
    const user = await this.prisma.user.update({
      where: { id: id },
      data: {
        //avatarUrl: updateUserDto.avatarUrl,
        //email: updateUserDto.email,
        username: updateUserDto.username
      },
      include: {
        recipes: true,
        following: true,
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
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
      stats: {
        recipeCount: user._count.recipes,
        publicCollectionCount: user._count.collections,
        followingCount: user._count.followers,
        followersCount: user._count.following
      }
    }
  }

  async remove(id: string) {
    return await this.prisma.$transaction(async (prisma) => {
      // 1. Delete all UserSubscriptions (following/followers)
      await prisma.userSubscription.deleteMany({
        where: { OR: [{ followerId: id }, { followingId: id }] }
      });

      // 2. Delete all subscriptions to categories
      await prisma.subscription.deleteMany({
        where: { userId: id }
      });

      // 3. Delete all favorites
      await prisma.favorite.deleteMany({
        where: { userId: id }
      });

      // 4. Delete all notes
      await prisma.note.deleteMany({
        where: { userId: id }
      });

      // 5. Handle recipe collections and their relations
      const collections = await prisma.recipeCollection.findMany({
        where: { userId: id },
        select: { id: true }
      });

      await prisma.recipeOnCollection.deleteMany({
        where: { recipeCollectionId: { in: collections.map(c => c.id) } }
      });

      await prisma.recipeCollection.deleteMany({
        where: { userId: id }
      });

      // 6. Handle user's recipes and all their relations
      const recipes = await prisma.recipe.findMany({
        where: { userId: id },
        select: { id: true }
      });

      const recipeIds = recipes.map(r => r.id);

      await prisma.ingredientOnRecipe.deleteMany({
        where: { recipeId: { in: recipeIds } }
      });

      await prisma.cookingStep.deleteMany({
        where: { recipeId: { in: recipeIds } }
      });

      await prisma.categoryOnRecipe.deleteMany({
        where: { recipeId: { in: recipeIds } }
      });

      await prisma.recipeOnCollection.deleteMany({
        where: { recipeId: { in: recipeIds } }
      });

      await prisma.favorite.deleteMany({
        where: { recipeId: { in: recipeIds } }
      });


      await prisma.recipe.deleteMany({
        where: { userId: id }
      });

      // 7. Finally delete the user
      return await prisma.user.delete({
        where: { id }
      });
    });
  }
}
