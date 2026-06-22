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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/types/enums';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Daftar kategori (dengan subkategori opsional)' })
  @ApiQuery({ name: 'withChildren', required: false, type: Boolean })
  findAll(@Query('withChildren') withChildren?: boolean) {
    return this.service.findAll(withChildren);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Detail kategori' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: '[Admin] Buat kategori baru' })
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: '[Admin] Perbarui kategori' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: '[Admin] Hapus kategori' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
