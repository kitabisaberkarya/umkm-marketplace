import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hapus data lama (urutan penting — FK constraints)
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await argon2.hash('Admin123!');
  const buyerHash = await argon2.hash('Buyer123!');
  const sellerHash = await argon2.hash('Seller123!');

  // Buat users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin UMKMku',
      email: 'admin@umkmku.id',
      phone: '08100000001',
      passwordHash: adminHash,
      role: UserRole.admin,
      status: UserStatus.active,
    },
  });

  const buyer = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@test.com',
      phone: '08123456789',
      passwordHash: buyerHash,
      role: UserRole.buyer,
      status: UserStatus.active,
    },
  });

  const sellerUser = await prisma.user.create({
    data: {
      name: 'Siti Rahayu',
      email: 'siti@test.com',
      phone: '08987654321',
      passwordHash: sellerHash,
      role: UserRole.seller,
      status: UserStatus.active,
    },
  });

  // Buat kategori
  const kategoriFashion = await prisma.category.create({
    data: { name: 'Fashion & Pakaian', slug: 'fashion-pakaian', isActive: true },
  });

  const kategoriBatik = await prisma.category.create({
    data: {
      name: 'Batik & Tenun',
      slug: 'batik-tenun',
      parentId: kategoriFashion.id,
      isActive: true,
    },
  });

  const kategoriMakanan = await prisma.category.create({
    data: { name: 'Makanan & Minuman', slug: 'makanan-minuman', isActive: true },
  });

  const kategoriKerajinan = await prisma.category.create({
    data: { name: 'Kerajinan Tangan', slug: 'kerajinan-tangan', isActive: true },
  });

  // Buat profil toko
  const tokoSiti = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser.id,
      storeName: 'Batik Siti Nusantara',
      slug: 'batik-siti-nusantara',
      description: 'Menjual batik tulis dan cap berkualitas dari pengrajin Yogyakarta',
      city: 'Yogyakarta',
      province: 'DI Yogyakarta',
      verificationStatus: 'verified',
    },
  });

  // Buat produk
  const produk1 = await prisma.product.create({
    data: {
      sellerId: tokoSiti.id,
      categoryId: kategoriBatik.id,
      name: 'Batik Tulis Parang Rusak Premium',
      slug: 'batik-tulis-parang-rusak-premium',
      description:
        'Batik tulis asli Yogyakarta dengan motif Parang Rusak yang penuh makna. Dikerjakan oleh pengrajin berpengalaman, menggunakan lilin dan pewarna alami.',
      price: 350000,
      stock: 25,
      weightGram: 400,
      status: 'active',
      averageRating: 4.8,
      totalReviews: 12,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: produk1.id,
      url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600',
      order: 0,
    },
  });

  const produk2 = await prisma.product.create({
    data: {
      sellerId: tokoSiti.id,
      categoryId: kategoriBatik.id,
      name: 'Kain Lurik Tenun Klaten',
      slug: 'kain-lurik-tenun-klaten',
      description: 'Kain lurik tradisional tenun tangan dari Klaten. Motif garis-garis khas Jawa.',
      price: 175000,
      stock: 40,
      weightGram: 350,
      status: 'active',
      averageRating: 4.5,
      totalReviews: 8,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: produk2.id,
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      order: 0,
    },
  });

  // Buat keranjang untuk buyer
  await prisma.cart.create({
    data: {
      userId: buyer.id,
      items: { create: [{ productId: produk1.id, qty: 1 }] },
    },
  });

  console.log('Seeding selesai!');
  console.log('---');
  console.log('Akun demo:');
  console.log(`  Admin   : admin@umkmku.id / Admin123!`);
  console.log(`  Buyer   : budi@test.com / Buyer123!`);
  console.log(`  Seller  : siti@test.com / Seller123!`);
}

main()
  .catch((e) => {
    console.error('Seed gagal:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
