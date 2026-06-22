"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatRupiah } from "@/lib/utils";
import { Suspense } from "react";

interface OrderData {
  orderId: string;
  items: { product: { id: string; name: string; image: string; seller: { name: string } }; quantity: number; }[];
  total: number;
  shipping: { name: string; est: string; price: number };
  payment: string;
  form: { name: string; address: string; district: string; city: string; province: string; zip: string };
  createdAt: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  bca: "Transfer BCA - 1234567890 a/n UMKMku Indonesia",
  bri: "Transfer BRI - 0987654321 a/n UMKMku Indonesia",
  mandiri: "Transfer Mandiri - 1122334455 a/n UMKMku Indonesia",
  "va-bca": "BCA Virtual Account",
  "va-bni": "BNI Virtual Account",
  qris: "QRIS - Scan QR di aplikasi e-wallet",
  cod: "Bayar di Tempat (COD)",
};

function OrderSuksesContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") ?? "";
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  const estimatedArrival = () => {
    if (!order) return "";
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const isCOD = order?.payment === "cod";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

          {/* Success header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
              <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pesanan Berhasil Dibuat!</h1>
            <p className="mt-2 text-gray-500">
              Terima kasih telah berbelanja di UMKMku. Pesananmu sedang diproses.
            </p>
          </div>

          {/* Order ID */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-center mb-4">
            <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">Nomor Pesanan</p>
            <p className="text-2xl font-bold text-teal-700 mt-1 font-mono tracking-widest">{orderId}</p>
            <p className="text-xs text-teal-500 mt-1">Simpan nomor ini untuk melacak pesananmu</p>
          </div>

          {/* Payment instruction */}
          {order && !isCOD && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-4">
              <h2 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <span>💰</span> Instruksi Pembayaran
              </h2>
              <p className="text-sm text-amber-700 mb-2">
                Segera lakukan pembayaran dalam <strong>2×24 jam</strong>. Pesanan akan otomatis dibatalkan jika melewati batas waktu.
              </p>
              <div className="rounded-xl bg-white border border-amber-200 p-3">
                <p className="text-sm font-semibold text-gray-800">Metode: {PAYMENT_LABELS[order.payment] ?? order.payment}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatRupiah(order.total)}</p>
              </div>
            </div>
          )}

          {/* Order details */}
          {order && (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 mb-4 space-y-4">
              <h2 className="font-bold text-gray-900">Detail Pesanan</h2>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">{item.product.seller.name} · {item.quantity} pcs</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>{formatRupiah(order.total - order.shipping.price)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pengiriman ({order.shipping.name})</span><span>{formatRupiah(order.shipping.price)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-1">
                  <span>Total Bayar</span><span className="text-teal-600">{formatRupiah(order.total)}</span>
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dikirim ke</p>
                <p className="text-sm font-semibold text-gray-800">{order.form.name}</p>
                <p className="text-sm text-gray-600">{order.form.address}, {order.form.district}</p>
                <p className="text-sm text-gray-600">{order.form.city}, {order.form.province} {order.form.zip}</p>
              </div>

              {/* Delivery estimate */}
              <div className="flex items-center gap-3 rounded-xl bg-teal-50 border border-teal-100 p-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="text-sm font-semibold text-teal-800">
                    {isCOD ? "Estimasi pengiriman" : "Estimasi tiba setelah pembayaran"}
                  </p>
                  <p className="text-sm text-teal-600">
                    {estimatedArrival()} · {order.shipping.est}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/produk"
              className="flex items-center justify-center rounded-xl border-2 border-teal-600 py-3 text-sm font-semibold text-teal-600 hover:bg-teal-50 transition"
            >
              Lanjut Belanja
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition"
            >
              Ke Beranda
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Ada pertanyaan? Hubungi{" "}
            <Link href="#" className="text-teal-600 hover:underline">Customer Service UMKMku</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function OrderSuksesPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuksesContent />
    </Suspense>
  );
}
