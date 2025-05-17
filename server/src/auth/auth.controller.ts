import { Body, ConflictException, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const canRegister = await this.authService.validateUserForRegistry(registerDto.email)
    if (!canRegister) {
      throw new ConflictException('User with such email already exists');
    }

    const user = await this.authService.register(registerDto);
    return this.authService.login(user);
  }

  @Post('refresh')
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}