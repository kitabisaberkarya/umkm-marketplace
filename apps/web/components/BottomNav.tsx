"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

const LOGO_URL =
  "https://res.cloudinary.com/ddgjbfcyi/image/upload/v1780496713/LOGO_KITA_BISA_BERKARYA24_cphgun.png";

function HomeIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2zm6-8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function CartIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zm12 15a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export function BottomNav() {
  const { count } = useCart();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isProduk = pathname.startsWith("/produk") || pathname.startsWith("/kategori");
  const isKeranjang = pathname.startsWith("/keranjang") || pathname.startsWith("/checkout") || pathname.startsWith("/order");
  const isProfil = pathname.startsWith("/profil");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {/* Background bar */}
      <div className="bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-end h-16 max-w-md mx-auto px-1">

          {/* Beranda */}
          <Link href="/"
            className={`flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 pt-1 transition-colors ${isHome ? "text-teal-600" : "text-gray-400"}`}>
            <HomeIcon active={isHome} />
            <span className="text-[10px] font-semibold">Beranda</span>
          </Link>

          {/* Produk */}
          <Link href="/produk"
            className={`flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 pt-1 transition-colors ${isProduk ? "text-teal-600" : "text-gray-400"}`}>
            <GridIcon active={isProduk} />
            <span className="text-[10px] font-semibold">Produk</span>
          </Link>

          {/* Logo tengah — menonjol ke atas, apa adanya tanpa card */}
          <div className="flex flex-1 flex-col items-center justify-end" style={{ marginBottom: "-2px" }}>
            <Link href="/" className="flex flex-col items-center" style={{ marginTop: "-32px" }}>
              <img
                src={LOGO_URL}
                alt="UMKMku"
                style={{
                  height: 62,
                  width: 62,
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 12px rgba(13,148,136,0.35))",
                }}
              />
              <span style={{ fontSize: 9, color: "#0d9488", fontWeight: 700, marginTop: 2, letterSpacing: "0.03em" }}>
                UMKMku
              </span>
            </Link>
          </div>

          {/* Keranjang */}
          <Link href="/keranjang"
            className={`relative flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 pt-1 transition-colors ${isKeranjang ? "text-teal-600" : "text-gray-400"}`}>
            <CartIcon active={isKeranjang} />
            {count > 0 && (
              <span className="absolute top-0 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none">
                {count > 9 ? "9+" : count}
              </span>
            )}
            <span className="text-[10px] font-semibold">Keranjang</span>
          </Link>

          {/* Profil */}
          <Link href="#"
            className={`flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 pt-1 transition-colors ${isProfil ? "text-teal-600" : "text-gray-400"}`}>
            <UserIcon active={isProfil} />
            <span className="text-[10px] font-semibold">Profil</span>
          </Link>

        </div>
      </div>
    </nav>
  );
}
