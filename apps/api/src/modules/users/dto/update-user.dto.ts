import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Budi Santoso' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsOptional()
  @IsString()
  @Matches(/^(\+62|62|0)8[1-9][0-9]{7,11}$/, {
    message: 'Format nomor telepon Indonesia tidak valid',
  })
  phone?: string;
}
