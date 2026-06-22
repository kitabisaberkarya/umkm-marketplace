import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { SellerProfilesService } from './seller-profiles.service';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('seller-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'seller-profiles', version: '1' })
export class SellerProfilesController {
  constructor(private readonly service: SellerProfilesService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @Roles(UserRole.seller)
  @ApiOperation({ summary: '[Seller] Daftarkan toko' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateSellerProfileDto) {
    return this.service.create(user.id, dto);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.seller)
  @ApiOperation({ summary: '[Seller] Lihat profil toko saya' })
  getMyProfile(@CurrentUser() user: { id: string }) {
    return this.service.findMyProfile(user.id);
  }

  @Public()
  @Get('store/:slug')
  @ApiOperation({ summary: 'Lihat profil toko publik' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: '[Admin] Daftar semua profil toko' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Patch(':id/verification')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: '[Admin] Verifikasi/tolak toko' })
  updateVerification(
    @Param('id') id: string,
    @Body('status') status: 'verified' | 'rejected',
    @Body('notes') notes?: string,
  ) {
    return this.service.updateVerification(id, status, notes);
  }
}
