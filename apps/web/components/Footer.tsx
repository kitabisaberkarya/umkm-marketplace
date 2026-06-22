import Link from "next/link";
import { categories } from "@/lib/dummy-data";

const LOGO_URL =
  "https://res.cloudinary.com/ddgjbfcyi/image/upload/v1780496713/LOGO_KITA_BISA_BERKARYA24_cphgun.png";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO_URL}
                alt="UMKMku"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Marketplace #1 untuk produk UMKM Indonesia. Gratis untuk semua
              penjual.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Kategori</h4>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kategori/${c.slug}`}
                    className="text-sm text-gray-500 hover:text-teal-600"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Penjual</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-teal-600">Buka Toko</Link></li>
              <li><Link href="#" className="hover:text-teal-600">Panduan Berjualan</Link></li>
              <li><Link href="#" className="hover:text-teal-600">Kebijakan Seller</Link></li>
              <li><Link href="#" className="hover:text-teal-600">Iklan Berbayar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Bantuan</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-teal-600">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-teal-600">Cara Belanja</Link></li>
              <li><Link href="#" className="hover:text-teal-600">Pengembalian</Link></li>
              <li><Link href="#" className="hover:text-teal-600">Hubungi Kami</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2026 UMKMku. Platform Marketplace UMKM Indonesia.</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="#" className="hover:text-gray-600">Privasi</Link>
            <Link href="#" className="hover:text-gray-600">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-gray-600">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
