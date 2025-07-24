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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: AuthPayloadDto }) // Swagger doc manual
  @Throttle({ short: { ttl: 60000, limit: 5 } }) // 5 intentos de login por minuto
  login(@Req() req) {
    console.log('inside AuthController login method');
    console.log(req.user);

    if (!req.user) {
      throw new HttpException('Invalid credentials', 401);
    }

    return this.authService.login(req.user);
  }

  @Post('register')
  @Throttle({ short: { ttl: 300000, limit: 3 } }) // 3 registros por 5 minutos
  async register(@Body() createUserDto: CreateUserDto) {
    // Solo permitir registro en desarrollo
    if (process.env.NODE_ENV === 'production') {
      throw new HttpException('Registration is not allowed in production', 403);
    }

    console.log('inside AuthController register method');
    const user = await this.authService.register(createUserDto);
    if (!user) {
      throw new HttpException('User registration failed', 400);
    }
    return user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  status(@Req() req) {
    console.log('inside AuthController status method');
    console.log(req.user);
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  logout(@Req() req) {
    console.log('inside AuthController logout method');
    console.log('User logged out:', req.user.username);
    return {
      message: 'Logout successful',
      success: true,
    };
  }
}
