import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Lihat profil saya' })
  getMe(@CurrentUser() user: { id: string }) {
    return this.usersService.findMe(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Perbarui profil saya' })
  updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @Get()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: '[Admin] Daftar semua pengguna' })
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: '[Admin] Detail pengguna' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: '[Admin] Ubah status pengguna' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'active' | 'inactive' | 'suspended',
  ) {
    return this.usersService.updateStatus(id, status);
  }
}
