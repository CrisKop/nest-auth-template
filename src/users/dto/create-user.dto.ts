import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario (único)',
    example: 'johndoe',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Contraseña segura del usuario',
    example: 'supersecret123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario en el sistema',
    example: 'user',
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  })
  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin', 'superadmin'])
  role?: string;
}
