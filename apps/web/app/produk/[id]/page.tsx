import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { StarRating } from "@/components/StarRating";
import { getProductById, getProductsByCategory, products } from "@/lib/dummy-data";
import { formatRupiah, formatNumber, discountPercent, productImage } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 6);

  const discount = product.originalPrice
    ? discountPercent(product.originalPrice, product.price)
    : 0;

  const images = [
    productImage(product.id, 600),
    productImage(`${product.id}-2`, 600),
    productImage(`${product.id}-3`, 600),
    productImage(`${product.id}-4`, 600),
  ];

  const reviews = [
    { user: "Budi S.", city: "Jakarta", rating: 5, comment: "Produk bagus sesuai deskripsi, packing rapi, pengiriman cepat! Recommended seller.", date: "2 hari lalu" },
    { user: "Sari W.", city: "Bandung", rating: 5, comment: "Sudah beli berkali-kali, kualitas konsisten. Akan beli lagi!", date: "1 minggu lalu" },
    { user: "Ahmad R.", city: "Surabaya", rating: 4, comment: "Produk oke, cuma pengiriman agak lama. Kualitas produknya sendiri memuaskan.", date: "2 minggu lalu" },
    { user: "Dewi P.", city: "Yogyakarta", rating: 5, comment: "Mantap! Ini produk UMKM terbaik yang pernah saya beli. Harga terjangkau, kualitas premium.", date: "3 minggu lalu" },
    { user: "Eko H.", city: "Medan", rating: 4, comment: "Cocok dengan ekspektasi saya. Penjual respon cepat dan ramah.", date: "1 bulan lalu" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-teal-600">Beranda</Link>
            <span>/</span>
            <Link href="/produk" className="hover:text-teal-600">Produk</Link>
            <span>/</span>
            <Link href={`/kategori/${product.categorySlug}`} className="hover:text-teal-600">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-800 truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: Images + Seller */}
            <div className="lg:col-span-1 space-y-4">
              {/* Main image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <Image
                  src={images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {discount > 0 && (
                  <span className="absolute right-3 top-3 rounded-lg bg-red-500 px-2 py-1 text-sm font-bold text-white">
                    -{discount}%
                  </span>
                )}
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 cursor-pointer ${i === 0 ? "border-teal-500" : "border-gray-100"} bg-white`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>

              {/* Seller Info */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 font-bold text-lg">
                    {product.seller.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.seller.name}</p>
                    <p className="text-xs text-gray-500">{product.seller.city}, {product.seller.province}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={product.seller.rating} />
                      <span className="text-xs text-gray-500">{product.seller.rating}/5</span>
                      {product.seller.badge && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                          {product.seller.badge === "star" ? "⭐ Star Seller" : product.seller.badge === "top" ? "🏆 Top Seller" : "✓ Trusted"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatNumber(product.seller.totalSales)} penjualan</p>
                  </div>
                </div>
                <Link
                  href="#"
                  className="mt-3 block w-full rounded-xl border border-teal-600 py-2 text-center text-sm font-medium text-teal-600 hover:bg-teal-50 transition"
                >
                  Kunjungi Toko
                </Link>
              </div>
            </div>

            {/* Right: Product Detail + Add to cart */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title + price */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.isSponsored && (
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Sponsor</span>
                  )}
                  {product.isNew && (
                    <span className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">Produk Baru</span>
                  )}
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{product.category}</span>
                </div>

                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-3">
                  <StarRating rating={product.rating} size="md" />
                  <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                  <span className="text-sm text-gray-400">({formatNumber(product.reviewCount)} ulasan)</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500">Terjual {formatNumber(product.soldCount)}</span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">{formatRupiah(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{formatRupiah(product.originalPrice)}</span>
                      <span className="rounded-lg bg-red-500 px-2 py-0.5 text-sm font-bold text-white">-{discount}%</span>
                    </>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="rounded-xl bg-teal-600 py-3 text-base font-semibold text-white hover:bg-teal-700 transition shadow">
                    + Keranjang
                  </button>
                  <button className="rounded-xl bg-red-500 py-3 text-base font-semibold text-white hover:bg-red-600 transition shadow">
                    Beli Sekarang
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>✓ Stok: <strong className="text-gray-800">{product.stock}</strong></span>
                  <span>✓ Berat: <strong className="text-gray-800">{product.weight}gr</strong></span>
                  <span>✓ Bayar setelah sampai tersedia</span>
                </div>
              </div>

              {/* Pengiriman */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Pengiriman dari {product.seller.city}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📦</span>
                    <div>
                      <p className="font-medium text-gray-800">JNE Regular</p>
                      <p className="text-xs text-gray-500">Estimasi 2-4 hari kerja</p>
                    </div>
                    <span className="ml-auto font-medium text-gray-800">Rp 18.000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚡</span>
                    <div>
                      <p className="font-medium text-gray-800">SiCepat BEST</p>
                      <p className="text-xs text-gray-500">Estimasi 1-2 hari kerja</p>
                    </div>
                    <span className="ml-auto font-medium text-gray-800">Rp 22.000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🚛</span>
                    <div>
                      <p className="font-medium text-gray-800">J&T Express</p>
                      <p className="text-xs text-gray-500">Estimasi 2-3 hari kerja</p>
                    </div>
                    <span className="ml-auto font-medium text-gray-800">Rp 19.000</span>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Deskripsi Produk</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ulasan */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Ulasan Pembeli</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{product.rating}</span>
                    <div>
                      <StarRating rating={product.rating} size="md" />
                      <p className="text-xs text-gray-500">{formatNumber(product.reviewCount)} ulasan</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                          {r.user[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{r.user}</span>
                        <span className="text-xs text-gray-400">dari {r.city}</span>
                        <span className="ml-auto text-xs text-gray-400">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} />
                      <p className="mt-1 text-sm text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Produk Terkait */}
          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Produk Serupa</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
