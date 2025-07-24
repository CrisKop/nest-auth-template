import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class AuthPayloadDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}
