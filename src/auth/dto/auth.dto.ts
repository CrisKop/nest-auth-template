import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDto {
  @ApiProperty({
    description: 'Nombre de usuario del usuario',
    example: 'nombre_usuario',
  })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '12345678',
  })
  password: string;

  role?: string;
}
