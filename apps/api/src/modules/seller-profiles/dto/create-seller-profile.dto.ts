import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSellerProfileDto {
  @ApiProperty({ example: 'Toko Batik Nusantara' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  storeName: string;

  @ApiPropertyOptional({ example: 'Menjual batik berkualitas dari seluruh nusantara' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'Jl. Malioboro No. 1' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Yogyakarta' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'DI Yogyakarta' })
  @IsOptional()
  @IsString()
  province?: string;
}
