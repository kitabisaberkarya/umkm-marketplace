"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { categories } from "@/lib/dummy-data";
import { useCart } from "./CartProvider";

const LOGO_URL =
  "https://res.cloudinary.com/ddgjbfcyi/image/upload/v1780496713/LOGO_KITA_BISA_BERKARYA24_cphgun.png";

function NavbarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const { count } = useCart();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/produk?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">

        {/* ── Mobile top bar ── */}
        <div className="flex lg:hidden h-12 items-center gap-2">
          {/* Search bar — full width on mobile */}
          <form onSubmit={handleSearch} className="flex flex-1">
            <div className="flex w-full rounded-xl border border-gray-200 overflow-hidden focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
              <span className="flex items-center pl-3 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk UMKM..."
                className="flex-1 px-3 py-2 text-sm outline-none bg-white"
              />
              <button
                type="submit"
                className="px-3 bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
              >
                Cari
              </button>
            </div>
          </form>
        </div>

        {/* ── Desktop top bar ── */}
        <div className="hidden lg:flex h-16 items-center gap-4">
          <Link href="/" className="flex items-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_URL} alt="UMKMku" className="h-11 w-auto object-contain" />
          </Link>

          <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl">
            <div className="flex w-full rounded-xl border border-gray-200 overflow-hidden focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk UMKM Indonesia..."
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-white"
              />
              <button
                type="submit"
                className="px-5 bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
              >
                Cari
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 ml-auto shrink-0">
            <Link href="/produk" className="px-3 py-2 text-sm text-gray-600 hover:text-teal-600 rounded-lg hover:bg-gray-50">
              Semua Produk
            </Link>
            <Link href="/keranjang"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition"
              title="Keranjang">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <Link href="#" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
              Masuk
            </Link>
            <Link href="#" className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition">
              Daftar
            </Link>
          </div>
        </div>

        {/* ── Desktop category bar ── */}
        <div className="hidden lg:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-none">
          <Link href="/produk"
            className="whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition">
            Semua
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/kategori/${c.slug}`}
              className="whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition">
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
