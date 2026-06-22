import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'Batik Tulis Yogyakarta Motif Parang' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Batik tulis asli buatan pengrajin Yogyakarta...' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 500, description: 'Berat dalam gram' })
  @IsInt()
  @Min(1)
  weightGram: number;

  @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.draft })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  weightGram?: number;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}

export class ProductFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minRating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: ['price', 'createdAt', 'averageRating', 'viewCount'] })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
