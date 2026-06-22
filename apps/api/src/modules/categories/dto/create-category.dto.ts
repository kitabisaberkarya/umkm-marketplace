import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Makanan & Minuman' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'ID kategori induk (untuk subkategori)' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
