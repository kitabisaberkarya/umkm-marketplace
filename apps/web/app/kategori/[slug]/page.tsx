import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/lib/dummy-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function KategoriPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(slug);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Category Hero */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <nav className="mb-4 text-sm text-teal-200">
              <Link href="/" className="hover:text-white">Beranda</Link>
              <span className="mx-2">/</span>
              <Link href="/produk" className="hover:text-white">Produk</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{category.name}</span>
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <p className="mt-1 text-teal-200">
                  {categoryProducts.length} produk tersedia dari pengrajin seluruh Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Other categories quick nav */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <Link
              href="/produk"
              className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 hover:border-teal-400 hover:text-teal-600"
            >
              Semua
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/${c.slug}`}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition border ${c.slug === slug ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600"}`}
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>

          {/* Products */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold">{categoryProducts.length}</span> produk
            </p>
            <div className="flex gap-2">
              <Link href={`/kategori/${slug}?sort=terlaris`} className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:bg-teal-50">
                Terlaris
              </Link>
              <Link href={`/kategori/${slug}?sort=termurah`} className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:bg-teal-50">
                Termurah
              </Link>
              <Link href={`/kategori/${slug}?sort=rating`} className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:bg-teal-50">
                Rating
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
