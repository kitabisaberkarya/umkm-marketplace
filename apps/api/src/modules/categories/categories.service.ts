import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(withChildren = false) {
    const categories = await this.prisma.category.findMany({
      where: { parentId: null, isActive: true },
      include: withChildren
        ? { children: { where: { isActive: true } } }
        : undefined,
      orderBy: { name: 'asc' },
    });
    return { success: true, data: categories };
  }

  async findOne(id: string) {
    const cat = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
    if (!cat) throw new NotFoundException('Kategori tidak ditemukan');
    return { success: true, data: cat };
  }

  async create(dto: CreateCategoryDto) {
    const slug = toSlug(dto.name);
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Kategori dengan nama ini sudah ada');

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Kategori induk tidak ditemukan');
    }

    const category = await this.prisma.category.create({
      data: { name: dto.name, slug, parentId: dto.parentId, imageUrl: dto.imageUrl },
    });
    return { success: true, data: category };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Kategori tidak ditemukan');

    const data: Record<string, unknown> = { ...dto };
    if (dto.name) data['slug'] = toSlug(dto.name);

    const updated = await this.prisma.category.update({ where: { id }, data });
    return { success: true, data: updated };
  }

  async remove(id: string) {
    const cat = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { children: true, products: true } } },
    });
    if (!cat) throw new NotFoundException('Kategori tidak ditemukan');
    if (cat._count.children > 0 || cat._count.products > 0) {
      throw new ConflictException(
        'Kategori tidak dapat dihapus karena masih memiliki subkategori atau produk',
      );
    }
    await this.prisma.category.delete({ where: { id } });
    return { success: true, message: 'Kategori berhasil dihapus' };
  }
}
