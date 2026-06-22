import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, Product } from "@/lib/dummy-data";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ q?: string; kategori?: string; sort?: string; filter?: string; min?: string; max?: string }>;
}

const SORT_OPTIONS = [
  { value: "relevan", label: "Paling Relevan" },
  { value: "terlaris", label: "Terlaris" },
  { value: "termurah", label: "Harga Terendah" },
  { value: "termahal", label: "Harga Tertinggi" },
  { value: "rating", label: "Rating Tertinggi" },
];

export default async function ProdukPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const kategori = params.kategori ?? "";
  const sort = params.sort ?? "relevan";
  const filter = params.filter ?? "";
  const min = params.min ? Number(params.min) : 0;
  const max = params.max ? Number(params.max) : Infinity;

  let result: Product[] = [...products];

  if (q) {
    const ql = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(ql) ||
        p.description.toLowerCase().includes(ql) ||
        p.tags.some((t) => t.toLowerCase().includes(ql)) ||
        p.seller.city.toLowerCase().includes(ql)
    );
  }
  if (kategori) result = result.filter((p) => p.categorySlug === kategori);
  if (filter === "baru") result = result.filter((p) => p.isNew);
  if (filter === "featured") result = result.filter((p) => p.isFeatured);
  if (min > 0) result = result.filter((p) => p.price >= min);
  if (max < Infinity) result = result.filter((p) => p.price <= max);

  if (sort === "terlaris") result.sort((a, b) => b.soldCount - a.soldCount);
  else if (sort === "termurah") result.sort((a, b) => a.price - b.price);
  else if (sort === "termahal") result.sort((a, b) => b.price - a.price);
  else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

  const activeCategory = categories.find((c) => c.slug === kategori);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-teal-600">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">
              {activeCategory ? activeCategory.name : q ? `Hasil pencarian: "${q}"` : "Semua Produk"}
            </span>
          </nav>

          <div className="flex gap-6">
            {/* Sidebar Filter */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategori</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/produk"
                        className={`block rounded-lg px-2 py-1.5 text-sm ${!kategori ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        Semua Kategori
                      </Link>
                    </li>
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/produk?kategori=${c.slug}${q ? `&q=${q}` : ""}`}
                          className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${kategori === c.slug ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                          <span>{c.icon}</span>
                          <span>{c.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Harga</h3>
                  <div className="space-y-1">
                    {[
                      { label: "Di bawah Rp50rb", min: 0, max: 50000 },
                      { label: "Rp50rb – Rp150rb", min: 50000, max: 150000 },
                      { label: "Rp150rb – Rp500rb", min: 150000, max: 500000 },
                      { label: "Di atas Rp500rb", min: 500000, max: 0 },
                    ].map((r) => (
                      <Link
                        key={r.label}
                        href={`/produk?${kategori ? `kategori=${kategori}&` : ""}min=${r.min}${r.max ? `&max=${r.max}` : ""}`}
                        className={`block rounded-lg px-2 py-1.5 text-sm ${min === r.min && (max === r.max || (r.max === 0 && max === Infinity)) ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {r.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter</h3>
                  <div className="space-y-1">
                    <Link
                      href={`/produk?${kategori ? `kategori=${kategori}&` : ""}filter=featured`}
                      className={`block rounded-lg px-2 py-1.5 text-sm ${filter === "featured" ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      ⭐ Unggulan
                    </Link>
                    <Link
                      href={`/produk?${kategori ? `kategori=${kategori}&` : ""}filter=baru`}
                      className={`block rounded-lg px-2 py-1.5 text-sm ${filter === "baru" ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      ✨ Produk Baru
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-4 rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{result.length}</span> produk ditemukan
                  {q && <span className="text-gray-500"> untuk &ldquo;{q}&rdquo;</span>}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 hidden sm:inline">Urutkan:</span>
                  <div className="flex gap-1">
                    {SORT_OPTIONS.map((o) => (
                      <Link
                        key={o.value}
                        href={`/produk?${kategori ? `kategori=${kategori}&` : ""}${q ? `q=${encodeURIComponent(q)}&` : ""}sort=${o.value}`}
                        className={`rounded-lg px-3 py-1 text-xs font-medium transition ${sort === o.value ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                      >
                        {o.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {result.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-5xl mb-4">🔍</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Produk tidak ditemukan</h3>
                  <p className="text-gray-500 text-sm mb-6">Coba kata kunci atau kategori yang berbeda.</p>
                  <Link href="/produk" className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700">
                    Lihat Semua Produk
                  </Link>
                </div>
              ) : (
                <Suspense>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                    {result.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
