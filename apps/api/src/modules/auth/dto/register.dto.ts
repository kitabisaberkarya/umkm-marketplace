import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum RegisterRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'budi@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '08123456789' })
  @IsString()
  @Matches(/^(\+62|62|0)8[1-9][0-9]{7,11}$/, {
    message: 'Format nomor telepon Indonesia tidak valid',
  })
  phone: string;

  @ApiProperty({ minLength: 8, example: 'P@ssw0rd123' })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @ApiPropertyOptional({ enum: RegisterRole, default: RegisterRole.BUYER })
  @IsOptional()
  @IsEnum(RegisterRole)
  role?: RegisterRole = RegisterRole.BUYER;
}
