import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/types/enums';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductFilterDto, UpdateProductDto } from './dto/create-product.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Cari & filter produk aktif' })
  findAll(@Query() filter: ProductFilterDto) {
    return this.service.findAll(filter);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Detail produk (by slug)' })
  findOne(@Param('slug') slug: string) {
    return this.service.findOne(slug);
  }

  @Get('seller/my-products')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.seller)
  @ApiOperation({ summary: '[Seller] Daftar produk milik saya' })
  findMySelllerProducts(
    @CurrentUser() user: { id: string },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.findBySeller(user.id, undefined, page, limit);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @Roles(UserRole.seller)
  @ApiOperation({ summary: '[Seller] Tambah produk baru' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateProductDto) {
    return this.service.create(user.id, dto);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.seller)
  @ApiOperation({ summary: '[Seller] Perbarui produk' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.seller)
  @ApiOperation({ summary: '[Seller] Nonaktifkan produk' })
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.remove(id, user.id);
  }

  @Post(':id/images')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.seller)
  @ApiOperation({ summary: '[Seller] Tambah gambar produk' })
  addImages(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body('imageUrls') imageUrls: string[],
  ) {
    return this.service.addImages(id, user.id, imageUrls);
  }

  @Delete(':productId/images/:imageId')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.seller)
  @ApiOperation({ summary: '[Seller] Hapus gambar produk' })
  removeImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.removeImage(productId, imageId, user.id);
  }
}
