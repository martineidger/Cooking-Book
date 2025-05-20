import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FollowingService } from './following.service';
import { CreateFollowingDto } from 'src/dto/following/create-following.dto';

@Controller('follow')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) { }

  @Post()
  create(@Body() createFollowingDto: CreateFollowingDto) {
    return this.followingService.followUser(createFollowingDto);
  }

  @Delete()
  delete(@Body() createFollowingDto: CreateFollowingDto) {
    return this.followingService.unfollowUser(createFollowingDto);
  }

  @Get('status')
  findAll(@Query('followerId') followerId: string, @Query('followingId') followingId: string,) {
    return this.followingService.checkStatus({ followerId: followerId, followingId: followingId });
  }

  @Get('recipes/:id')
  async findRecipes(@Param('id') id: string) {
    return await this.followingService.findRecipes(id);
  }

  @Get('followings/:userId')
  findFollowings(@Param('userId') id: string) {
    return this.followingService.findUserFollowings(id);
  }

  @Get('followers/:userId')
  findFollowers(@Param('userId') id: string) {
    return this.followingService.findUserFollowers(id);
  }


}
