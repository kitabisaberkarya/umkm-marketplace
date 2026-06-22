import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import {
  categories,
  getFeaturedProducts,
  getNewProducts,
  products,
} from "@/lib/dummy-data";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 10);
  const newArrivals = getNewProducts().slice(0, 10);
  const trending = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 10);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span>
                180+ Produk UMKM Tersedia
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Belanja Produk <span className="text-teal-200">UMKM Lokal</span>
                <br className="hidden sm:block" /> Langsung dari Pengrajin
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-teal-100">
                Temukan ribuan produk autentik dari pengrajin seluruh Indonesia.
                Makanan, fashion batik, kerajinan tangan, kecantikan herbal, dan
                lebih banyak lagi.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/produk"
                  className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-teal-700 shadow hover:bg-teal-50 transition"
                >
                  Mulai Belanja
                </Link>
                <Link
                  href="#"
                  className="rounded-xl border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition"
                >
                  Buka Toko Gratis →
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-teal-200">
                <span>✓ Gratis ongkir min. tertentu</span>
                <span>✓ Escrow Payment Aman</span>
                <span>✓ 100% Produk UMKM Lokal</span>
                <span>✓ Seller Gratis Berjualan</span>
              </div>
            </div>
          </div>
        </section>

        {/* Kategori */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Kategori Produk</h2>
            <Link href="/produk" className="text-sm text-teal-600 hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition hover:shadow-md hover:border-teal-200"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-center text-xs font-medium text-gray-700 leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400">{cat.count}+ produk</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Produk Unggulan */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            ⭐ Produk Unggulan
          </div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-xl font-bold text-gray-900">Pilihan Terbaik Kami</h2>
            <Link href="/produk?filter=featured" className="text-sm text-teal-600 hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Terlaris */}
        <section className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              🔥 Terlaris
            </div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h2 className="text-xl font-bold text-gray-900">Paling Banyak Dibeli</h2>
              <Link href="/produk?sort=terlaris" className="text-sm text-teal-600 hover:underline">
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {trending.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Produk Baru */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            ✨ Baru Masuk
          </div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-xl font-bold text-gray-900">Produk Terbaru</h2>
            <Link href="/produk?filter=baru" className="text-sm text-teal-600 hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Banner keuntungan */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
              Kenapa Pilih UMKMku?
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: "🆓", title: "Gratis untuk Penjual", desc: "Tidak ada komisi, biaya bulanan, atau hidden fee." },
                { icon: "🔒", title: "Transaksi Escrow Aman", desc: "Dana aman. Penjual terima uang setelah barang sampai." },
                { icon: "🚚", title: "Multi Kurir", desc: "JNE, J&T, SiCepat, AnterAja, Pos Indonesia, dan lainnya." },
                { icon: "⭐", title: "Produk Terverifikasi", desc: "Semua seller diverifikasi tim UMKMku sebelum berjualan." },
              ].map((f) => (
                <div key={f.title} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                    <span className="text-2xl">{f.icon}</span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Penjual */}
        <section className="bg-gradient-to-r from-teal-600 to-emerald-700 py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white">
              Punya produk UMKM? Jual di sini — Gratis!
            </h2>
            <p className="mt-3 text-teal-100">
              Buka toko online dalam 5 menit. Tidak ada biaya, tidak ada komisi.
            </p>
            <Link
              href="#"
              className="mt-8 inline-block rounded-xl bg-white px-8 py-3 text-base font-semibold text-teal-700 hover:bg-teal-50 transition shadow"
            >
              Buka Toko Sekarang
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
