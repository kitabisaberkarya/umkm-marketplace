import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, select: USER_SELECT, skip, take: limit }),
      this.prisma.user.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
    if (!user) throw new NotFoundException('Pengguna tidak ditemukan');
    return { success: true, data: user };
  }

  async findMe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_SELECT,
        sellerProfile: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            verificationStatus: true,
            averageRating: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Pengguna tidak ditemukan');
    return { success: true, data: user };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

    if (dto.phone && dto.phone !== user.phone) {
      const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existing) throw new ConflictException('Nomor telepon sudah digunakan');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: USER_SELECT,
    });
    return { success: true, data: updated };
  }

  async updateStatus(id: string, status: 'active' | 'inactive' | 'suspended') {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status },
      select: USER_SELECT,
    });
    return { success: true, data: updated };
  }
}
