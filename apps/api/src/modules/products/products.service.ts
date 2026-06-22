import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductStatus } from '../../common/types/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, ProductFilterDto, UpdateProductDto } from './dto/create-product.dto';
import { paginate } from '../../common/dto/pagination.dto';

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const PRODUCT_WITH_IMAGES = {
  images: { orderBy: { order: 'asc' as const } },
  category: { select: { id: true, name: true, slug: true } },
  seller: { select: { id: true, storeName: true, slug: true, averageRating: true, city: true } },
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: ProductFilterDto) {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      province,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filter;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: ProductStatus.active };

    if (search) where['name'] = { contains: search, mode: 'insensitive' };
    if (categoryId) where['categoryId'] = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where['price'] = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      };
    }
    if (minRating !== undefined) where['averageRating'] = { gte: minRating };
    if (province) {
      where['seller'] = { province: { contains: province, mode: 'insensitive' } };
    }

    const allowedSortFields = ['price', 'createdAt', 'averageRating', 'viewCount'];
    const orderByField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PRODUCT_WITH_IMAGES,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
      }),
      this.prisma.product.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        ...PRODUCT_WITH_IMAGES,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { buyer: { select: { name: true, avatarUrl: true } } },
        },
      },
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');

    await this.prisma.product.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return { success: true, data: product };
  }

  async findBySeller(sellerId: string, status?: ProductStatus, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { sellerId };
    if (status) where['status'] = status;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { images: { take: 1, orderBy: { order: 'asc' } }, category: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async create(sellerId: string, dto: CreateProductDto) {
    const sellerProfile = await this.prisma.sellerProfile.findUnique({ where: { userId: sellerId } });
    if (!sellerProfile) {
      throw new NotFoundException('Profil toko tidak ditemukan. Buat toko terlebih dahulu.');
    }
    if (sellerProfile.verificationStatus !== 'verified') {
      throw new ForbiddenException('Toko Anda belum terverifikasi. Tunggu verifikasi admin.');
    }

    const baseSlug = toSlug(dto.name);
    let slug = baseSlug;
    let suffix = 1;
    while (await this.prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const product = await this.prisma.product.create({
      data: {
        sellerId: sellerProfile.id,
        categoryId: dto.categoryId,
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        weightGram: dto.weightGram,
        status: dto.status ?? ProductStatus.draft,
      },
      include: PRODUCT_WITH_IMAGES,
    });
    return { success: true, data: product };
  }

  async update(id: string, sellerId: string, dto: UpdateProductDto) {
    const product = await this.assertOwnership(id, sellerId);

    const data: Record<string, unknown> = { ...dto };
    if (dto.name) {
      const newSlug = toSlug(dto.name);
      if (newSlug !== product.slug) {
        let slug = newSlug;
        let suffix = 1;
        while (await this.prisma.product.findFirst({ where: { slug, NOT: { id } } })) {
          slug = `${newSlug}-${suffix++}`;
        }
        data['slug'] = slug;
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: PRODUCT_WITH_IMAGES,
    });
    return { success: true, data: updated };
  }

  async remove(id: string, sellerId: string) {
    await this.assertOwnership(id, sellerId);
    await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.inactive },
    });
    return { success: true, message: 'Produk berhasil dinonaktifkan' };
  }

  async addImages(productId: string, sellerId: string, imageUrls: string[]) {
    await this.assertOwnership(productId, sellerId);

    const existingCount = await this.prisma.productImage.count({ where: { productId } });
    const images = await this.prisma.$transaction(
      imageUrls.map((url, i) =>
        this.prisma.productImage.create({ data: { productId, url, order: existingCount + i } }),
      ),
    );
    return { success: true, data: images };
  }

  async removeImage(productId: string, imageId: string, sellerId: string) {
    await this.assertOwnership(productId, sellerId);
    await this.prisma.productImage.delete({ where: { id: imageId } });
    return { success: true, message: 'Gambar berhasil dihapus' };
  }

  private async assertOwnership(productId: string, userId: string) {
    const sellerProfile = await this.prisma.sellerProfile.findUnique({ where: { userId } });
    if (!sellerProfile) throw new ForbiddenException('Profil toko tidak ditemukan');

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    if (product.sellerId !== sellerProfile.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke produk ini');
    }
    return product;
  }
}
