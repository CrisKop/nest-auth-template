import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() authPayloadDto: AuthPayloadDto, @Req() req) {
    console.log('inside AuthController login method');
    console.log(req.user);

    if (!req.user) {
      throw new HttpException('Invalid credentials', 401);
    }

    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('inside AuthController register method');
    const user = await this.authService.register(createUserDto);
    if (!user) {
      throw new HttpException('User registration failed', 400);
    }
    return user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req) {
    console.log('inside AuthController status method');
    console.log(req.user);
    return req.user;
  }
}
