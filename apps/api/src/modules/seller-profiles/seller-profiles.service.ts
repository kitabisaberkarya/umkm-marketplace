import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

@Injectable()
export class SellerProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSellerProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Pengguna tidak ditemukan');
    if (user.role !== 'seller') throw new ForbiddenException('Akun Anda bukan role seller');

    const existing = await this.prisma.sellerProfile.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Toko sudah terdaftar untuk akun ini');

    const baseSlug = toSlug(dto.storeName);
    let slug = baseSlug;
    let suffix = 1;
    while (await this.prisma.sellerProfile.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const profile = await this.prisma.sellerProfile.create({
      data: {
        userId,
        storeName: dto.storeName,
        slug,
        description: dto.description,
        address: dto.address,
        city: dto.city,
        province: dto.province,
      },
    });
    return { success: true, data: profile };
  }

  async findAll(query: PaginationDto & { verificationStatus?: string }) {
    const { page = 1, limit = 20, search, verificationStatus } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) where['storeName'] = { contains: search, mode: 'insensitive' };
    if (verificationStatus) where['verificationStatus'] = verificationStatus;

    const [data, total] = await Promise.all([
      this.prisma.sellerProfile.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sellerProfile.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findBySlug(slug: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { slug },
      include: {
        user: { select: { name: true, createdAt: true } },
        products: {
          where: { status: 'active' },
          take: 12,
          include: { images: { take: 1, orderBy: { order: 'asc' } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!profile) throw new NotFoundException('Toko tidak ditemukan');
    return { success: true, data: profile };
  }

  async findMyProfile(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profil toko belum dibuat');
    return { success: true, data: profile };
  }

  async updateVerification(id: string, status: 'verified' | 'rejected', notes?: string) {
    const profile = await this.prisma.sellerProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profil toko tidak ditemukan');

    const updated = await this.prisma.sellerProfile.update({
      where: { id },
      data: { verificationStatus: status },
    });
    return { success: true, data: updated, notes };
  }
}
