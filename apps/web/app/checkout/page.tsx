"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { formatRupiah } from "@/lib/utils";

const SHIPPING_OPTIONS = [
  { id: "jne-reg", name: "JNE Reguler", est: "2-4 hari kerja", price: 18000, logo: "📦" },
  { id: "jnt-express", name: "J&T Express", est: "2-3 hari kerja", price: 19000, logo: "🚛" },
  { id: "sicepat-best", name: "SiCepat BEST", est: "1-2 hari kerja", price: 22000, logo: "⚡" },
  { id: "anteraja", name: "AnterAja", est: "2-4 hari kerja", price: 16000, logo: "🏍️" },
];

const PAYMENT_METHODS = [
  {
    group: "Transfer Bank",
    methods: [
      { id: "bca", name: "Transfer BCA", logo: "🏦", detail: "No Rek: 1234567890 a/n UMKMku Indonesia" },
      { id: "bri", name: "Transfer BRI", logo: "🏦", detail: "No Rek: 0987654321 a/n UMKMku Indonesia" },
      { id: "mandiri", name: "Transfer Mandiri", logo: "🏦", detail: "No Rek: 1122334455 a/n UMKMku Indonesia" },
    ],
  },
  {
    group: "Virtual Account",
    methods: [
      { id: "va-bca", name: "BCA Virtual Account", logo: "💳", detail: "Kode VA akan dikirim ke WhatsApp/email" },
      { id: "va-bni", name: "BNI Virtual Account", logo: "💳", detail: "Kode VA akan dikirim ke WhatsApp/email" },
    ],
  },
  {
    group: "Bayar di Tempat",
    methods: [
      { id: "qris", name: "QRIS", logo: "📱", detail: "Scan QR di aplikasi e-wallet manapun" },
      { id: "cod", name: "Bayar di Tempat (COD)", logo: "💵", detail: "Bayar saat barang sampai, tersedia untuk area tertentu" },
    ],
  },
];

const PROVINCES = [
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "DIY Yogyakarta",
  "Banten", "Bali", "Sumatera Utara", "Sumatera Barat", "Sumatera Selatan",
  "Riau", "Kepulauan Riau", "Jambi", "Bengkulu", "Lampung", "Bangka Belitung",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur",
  "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Maluku", "Maluku Utara", "NTB", "NTT", "Papua", "Papua Barat", "Aceh", "Gorontalo",
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [shipping, setShipping] = useState(SHIPPING_OPTIONS[0].id);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].methods[0].id);
  const [form, setForm] = useState({
    name: "", phone: "", address: "", district: "", city: "", province: "DKI Jakarta", zip: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedShipping = SHIPPING_OPTIONS.find((o) => o.id === shipping)!;
  const grandTotal = total + selectedShipping.price;

  function setField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nama harus diisi";
    if (!form.phone.trim() || form.phone.length < 9) errs.phone = "Nomor HP tidak valid";
    if (!form.address.trim()) errs.address = "Alamat harus diisi";
    if (!form.district.trim()) errs.district = "Kecamatan harus diisi";
    if (!form.city.trim()) errs.city = "Kota/Kabupaten harus diisi";
    if (!form.zip.trim() || form.zip.length < 5) errs.zip = "Kode pos tidak valid";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    const orderId = `UMK-${Date.now().toString(36).toUpperCase()}`;
    localStorage.setItem("last-order", JSON.stringify({
      orderId, items, total: grandTotal, shipping: selectedShipping, payment, form,
      createdAt: new Date().toISOString(),
    }));
    clearCart();
    setTimeout(() => router.push(`/order/sukses?id=${orderId}`), 800);
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl mb-4 block">🛒</span>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Keranjang kosong</h2>
            <Link href="/produk" className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
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
            <Link href="/keranjang" className="hover:text-teal-600">Keranjang</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Checkout</span>
          </nav>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            {["Keranjang", "Checkout", "Selesai"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <div className="h-px w-8 bg-gray-200" />}
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${i === 1 ? "bg-teal-600 text-white" : i === 0 ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-400"}`}>
                  <span>{i + 1}</span>
                  <span>{step}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left: Form */}
              <div className="lg:col-span-2 space-y-4">

                {/* Alamat Pengiriman */}
                <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">1</span>
                    Alamat Pengiriman
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penerima *</label>
                      <input
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="Nama lengkap penerima"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${errors.name ? "border-red-400" : "border-gray-200"}`}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP / WhatsApp *</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        type="tel"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${errors.phone ? "border-red-400" : "border-gray-200"}`}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi *</label>
                      <select
                        value={form.province}
                        onChange={(e) => setField("province", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                      >
                        {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kota / Kabupaten *</label>
                      <input
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="Nama kota/kabupaten"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${errors.city ? "border-red-400" : "border-gray-200"}`}
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan *</label>
                      <input
                        value={form.district}
                        onChange={(e) => setField("district", e.target.value)}
                        placeholder="Nama kecamatan"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${errors.district ? "border-red-400" : "border-gray-200"}`}
                      />
                      {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos *</label>
                      <input
                        value={form.zip}
                        onChange={(e) => setField("zip", e.target.value)}
                        placeholder="12345"
                        maxLength={5}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${errors.zip ? "border-red-400" : "border-gray-200"}`}
                      />
                      {errors.zip && <p className="mt-1 text-xs text-red-500">{errors.zip}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap *</label>
                      <textarea
                        value={form.address}
                        onChange={(e) => setField("address", e.target.value)}
                        placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan..."
                        rows={3}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none ${errors.address ? "border-red-400" : "border-gray-200"}`}
                      />
                      {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catatan untuk Penjual (opsional)</label>
                      <input
                        value={form.note}
                        onChange={(e) => setField("note", e.target.value)}
                        placeholder="Misal: jangan dikemas terlalu ketat, warna biru ya..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                  </div>
                </section>

                {/* Metode Pengiriman */}
                <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">2</span>
                    Metode Pengiriman
                  </h2>
                  <div className="space-y-2">
                    {SHIPPING_OPTIONS.map((o) => (
                      <label
                        key={o.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${shipping === o.id ? "border-teal-500 bg-teal-50" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={o.id}
                          checked={shipping === o.id}
                          onChange={() => setShipping(o.id)}
                          className="accent-teal-600"
                        />
                        <span className="text-xl">{o.logo}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{o.name}</p>
                          <p className="text-xs text-gray-500">Estimasi {o.est}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{formatRupiah(o.price)}</span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Metode Pembayaran */}
                <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">3</span>
                    Metode Pembayaran
                  </h2>
                  <div className="space-y-4">
                    {PAYMENT_METHODS.map((group) => (
                      <div key={group.group}>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group.group}</p>
                        <div className="space-y-2">
                          {group.methods.map((m) => (
                            <label
                              key={m.id}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition ${payment === m.id ? "border-teal-500 bg-teal-50" : "border-gray-100 hover:border-gray-200"}`}
                            >
                              <input
                                type="radio"
                                name="payment"
                                value={m.id}
                                checked={payment === m.id}
                                onChange={() => setPayment(m.id)}
                                className="mt-0.5 accent-teal-600"
                              />
                              <span className="text-xl">{m.logo}</span>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                                <p className="text-xs text-gray-500">{m.detail}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
                  <h2 className="font-bold text-gray-900">Ringkasan Pesanan</h2>

                  {/* Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map(({ product: p, quantity }) => (
                      <div key={p.id} className="flex gap-3 items-start">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-800 line-clamp-2 font-medium">{p.name}</p>
                          <p className="text-xs text-gray-400">x{quantity}</p>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 shrink-0">{formatRupiah(p.price * quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span><span>{formatRupiah(total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Pengiriman</span><span>{formatRupiah(selectedShipping.price)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs">
                      <span>Biaya Layanan</span><span>Gratis</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                    <span>Total Bayar</span>
                    <span className="text-teal-600 text-lg">{formatRupiah(grandTotal)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-teal-600 py-3.5 text-base font-semibold text-white hover:bg-teal-700 transition shadow disabled:opacity-60"
                  >
                    {submitting ? "Memproses..." : "Bayar Sekarang"}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Dengan memesan, kamu menyetujui{" "}
                    <Link href="#" className="text-teal-600 hover:underline">Syarat & Ketentuan</Link> UMKMku
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
