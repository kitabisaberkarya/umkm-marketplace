"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { formatRupiah } from "@/lib/utils";

const SHIPPING_FEE = 18000;

export default function KeranjangPage() {
  const { items, removeFromCart, updateQty, total, count } = useCart();
  const router = useRouter();

  const grandTotal = total + (items.length > 0 ? SHIPPING_FEE : 0);

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <span className="text-7xl mb-6 block">🛒</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-500 mb-8">Belum ada produk di keranjang kamu. Yuk mulai belanja!</p>
            <Link
              href="/produk"
              className="rounded-xl bg-teal-600 px-8 py-3 text-base font-semibold text-white hover:bg-teal-700 transition"
            >
              Mulai Belanja
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-teal-600">Beranda</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Keranjang ({count} item)</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Keranjang Belanja</h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map(({ product: p, quantity }) => (
                <div key={p.id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <Link href={`/produk/${p.id}`} className="shrink-0">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                  </Link>

                  <div className="flex flex-1 min-w-0 flex-col gap-1">
                    <Link href={`/produk/${p.id}`} className="font-medium text-gray-900 hover:text-teal-600 line-clamp-2 text-sm">
                      {p.name}
                    </Link>
                    <p className="text-xs text-gray-400">{p.seller.name} · {p.seller.city}</p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(p.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-base font-medium"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                        <button
                          onClick={() => updateQty(p.id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-base font-medium"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatRupiah(p.price * quantity)}</p>
                        {quantity > 1 && (
                          <p className="text-xs text-gray-400">{formatRupiah(p.price)} / item</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(p.id)}
                    className="shrink-0 self-start text-gray-300 hover:text-red-400 transition"
                    title="Hapus"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              <Link href="/produk" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:underline mt-2">
                ← Lanjut Belanja
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
                <h2 className="font-bold text-gray-900 text-lg">Ringkasan Belanja</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Harga ({count} item)</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim (estimasi)</span>
                    <span>{formatRupiah(SHIPPING_FEE)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs">
                    <span>Biaya Layanan</span>
                    <span>Gratis</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total Pembayaran</span>
                  <span className="text-teal-600">{formatRupiah(grandTotal)}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full rounded-xl bg-teal-600 py-3.5 text-base font-semibold text-white hover:bg-teal-700 transition shadow"
                >
                  Checkout ({count} item)
                </button>

                <div className="flex flex-col gap-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="text-teal-500">✓</span> Dijamin aman dengan sistem Escrow
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-teal-500">✓</span> Gratis retur 7 hari
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-teal-500">✓</span> 100% produk UMKM asli Indonesia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
