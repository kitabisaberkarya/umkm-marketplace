"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { categories } from "@/lib/dummy-data";

function NavbarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/produk?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex h-16 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <span className="text-sm font-bold text-white">U</span>
            </div>
            <span className="text-lg font-bold text-gray-900">UMKMku</span>
          </Link>

          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl">
            <div className="flex w-full rounded-xl border border-gray-200 overflow-hidden focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk UMKM Indonesia..."
                className="flex-1 px-4 py-2 text-sm outline-none bg-white"
              />
              <button
                type="submit"
                className="px-4 bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition"
              >
                Cari
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <Link
              href="/produk"
              className="hidden sm:inline-block px-3 py-2 text-sm text-gray-600 hover:text-teal-600"
            >
              Semua Produk
            </Link>
            <Link
              href="#"
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Masuk
            </Link>
            <Link
              href="#"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Category bar */}
        <div className="hidden sm:flex items-center gap-1 pb-2 overflow-x-auto">
          <Link
            href="/produk"
            className="whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700"
          >
            Semua
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className="whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700"
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarInner />
    </Suspense>
  );
}
