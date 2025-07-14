import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.usersService.findByUsername(username);
    if (!findUser) return null;

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      findUser.password,
    );

    if (!isPasswordValid) return null;

    const { password: _, ...userData } = findUser.toObject?.() ?? findUser;
    return userData;
  }

  login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id || user.idm,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Verificar que no exista el username
    const existing = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (existing) {
      throw new Error('Username already taken');
    }

    // Reutiliza el método del servicio
    const user = await this.usersService.create(createUserDto);

    return {
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
