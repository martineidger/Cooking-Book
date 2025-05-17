import { Controller, Get, Post, Body, Patch, Param, Delete, ExecutionContext, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':id/profile')
  findProfile(@Param('id') id: string) {
    return this.userService.findProfile(id);
  }


  @Get('me')
  async findMe(@CurrentUser() user: User) {
    // user будет правильно типизирован
    console.log("USER CONTROLLER ", user)
    return user;
  }

  // @Get('me')
  // async findMe(@Req() request: Request) {
  //   const user = (request as any).user;

  //   console.log("CURRENT CONTROLLER  ", user)
  //   if (!user) {
  //     throw new UnauthorizedException('User not authenticated');
  //   }


  //   return this.userService.findCurrentUser(user);
  // }
  // @Get('me')
  // async getCurrentUser(@Req() req: Request) {
  //   req.user содержит данные из JWT после AuthGuard
  //   const user = await this.userService.findOne(req.user.sub);
  //   Не возвращаем пароль
  //   const { password, ...result } = user;
  //   return result;
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
