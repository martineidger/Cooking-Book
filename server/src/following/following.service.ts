import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateFollowingDto } from 'src/dto/following/create-following.dto';


@Injectable()
export class FollowingService {
  constructor(private readonly prisma: DatabaseService) { }

  async findRecipes(id: string) {
    const followings = await this.prisma.userSubscription.findMany({
      where: {
        followerId: id
      },
      select: {
        followingId: true
      }
    })

    return this.prisma.recipe.findMany({
      where: {
        userId: { in: followings.map(foll => foll.followingId) }
      },
      include: {
        ingredients: {
          include: {
            ingredient: { select: { name: true } },
            unit: true
          }
        },
        cuisine: true,
        categories: { include: { category: true } },
        steps: { orderBy: { order: 'asc' } },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  followUser(createFollowingDto: CreateFollowingDto) {
    return this.prisma.userSubscription.create({
      data: {
        follower: { connect: { id: createFollowingDto.followerId } },
        following: { connect: { id: createFollowingDto.followingId } }
      },
      include: {
        follower: true,
        following: true
      }
    })
  }

  async unfollowUser(unfollowDto: CreateFollowingDto) {
    return this.prisma.userSubscription.delete({
      where: {
        followerId_followingId: {
          followerId: unfollowDto.followerId,
          followingId: unfollowDto.followingId
        }
      }
    })
  }

  async findUserFollowings(userId: string) {

    return await this.prisma.userSubscription.findMany({
      where: {
        followerId: userId
      },
      include: {
        following: {
          include: {
            recipes: true
          }
        }
      }
    })
  }

  async findUserFollowers(userId: string) {

    return await this.prisma.userSubscription.findMany({
      where: {
        followingId: userId
      },
      include: {
        follower: true
      }
    })

  }

  async checkStatus(checkDto: CreateFollowingDto) {
    const sub = await this.prisma.userSubscription.count({
      where: {
        followerId: checkDto.followerId,
        followingId: checkDto.followingId
      }
    })

    return sub > 0;
  }

}
