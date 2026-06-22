"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const LOGO_URL =
  "https://res.cloudinary.com/ddgjbfcyi/image/upload/v1780496713/LOGO_KITA_BISA_BERKARYA24_cphgun.png";

type Tipe = "pembeli" | "penjual" | null;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTipe = searchParams.get("tipe") as Tipe;

  const [step, setStep] = useState<"pilih" | "form">(initialTipe ? "form" : "pilih");
  const [tipe, setTipe] = useState<Tipe>(initialTipe);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nama: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    namaToko: "",
    kotaToko: "",
    agree: false,
  });

  useEffect(() => {
    if (initialTipe) { setTipe(initialTipe); setStep("form"); }
  }, [initialTipe]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm(f => ({ ...f, [target.name]: value }));
    setError("");
  }

  function pilihTipe(t: Tipe) {
    setTipe(t);
    setStep("form");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama || !form.email || !form.password) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (!form.agree) {
      setError("Anda harus menyetujui syarat & ketentuan.");
      return;
    }
    if (tipe === "penjual" && !form.namaToko) {
      setError("Nama toko wajib diisi.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false);
    localStorage.setItem("umkm_user", JSON.stringify({ email: form.email, name: form.nama, tipe }));
    router.push(tipe === "penjual" ? "/?welcome=penjual" : "/?welcome=pembeli");
  }

  /* ── Step 1: Pilih tipe ── */
  if (step === "pilih") {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white shadow-xl border border-gray-100 p-7 sm:p-8">
          <div className="text-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_URL} alt="UMKMku" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900">Daftar ke UMKMku</h1>
            <p className="text-sm text-gray-500 mt-1">Pilih jenis akun Anda</p>
          </div>

          <div className="space-y-3">
            {/* Pembeli */}
            <button
              onClick={() => pilihTipe("pembeli")}
              className="w-full group flex items-center gap-4 rounded-2xl border-2 border-gray-100 p-4 text-left hover:border-teal-400 hover:bg-teal-50 transition-all"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-2xl group-hover:bg-teal-200 transition">
                🛍️
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">Daftar sebagai Pembeli</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Belanja ribuan produk UMKM lokal. Gratis, tanpa biaya apapun.
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-teal-500 shrink-0 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Penjual */}
            <button
              onClick={() => pilihTipe("penjual")}
              className="w-full group flex items-center gap-4 rounded-2xl border-2 border-gray-100 p-4 text-left hover:border-amber-400 hover:bg-amber-50 transition-all"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl group-hover:bg-amber-200 transition">
                🏪
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">Daftar sebagai Penjual</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Buka toko online UMKM Anda. Gratis, tanpa komisi, tanpa biaya bulanan.
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-amber-500 shrink-0 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-teal-600 font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── Step 2: Form ── */
  const isPenjual = tipe === "penjual";
  const accentColor = isPenjual ? "amber" : "teal";

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl bg-white shadow-xl border border-gray-100 p-7 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setStep("pilih")}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">
              {isPenjual ? "🏪 Daftar Penjual" : "🛍️ Daftar Pembeli"}
            </h1>
            <p className="text-xs text-gray-500">Isi data diri Anda</p>
          </div>
        </div>

        {/* Tipe badge */}
        <div className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${isPenjual ? "bg-amber-50 text-amber-700" : "bg-teal-50 text-teal-700"}`}>
          <span>{isPenjual ? "🏪" : "🛍️"}</span>
          <span>Akun {isPenjual ? "Penjual (Seller)" : "Pembeli"} — Gratis selamanya</span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input name="nama" value={form.nama} onChange={handleChange}
              placeholder="Budi Santoso" autoComplete="name"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="nama@email.com" autoComplete="email"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">No. WhatsApp</label>
            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">+62</span>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="8123456789"
                className="flex-1 rounded-r-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
            </div>
          </div>

          {/* Seller fields */}
          {isPenjual && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Toko</label>
                <input name="namaToko" value={form.namaToko} onChange={handleChange}
                  placeholder="Toko Batik Nusantara"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kota / Kabupaten</label>
                <input name="kotaToko" value={form.kotaToko} onChange={handleChange}
                  placeholder="Yogyakarta"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input name="password" type={show ? "text" : "password"} value={form.password} onChange={handleChange}
                placeholder="Min. 8 karakter" autoComplete="new-password"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-11 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {show
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                  }
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
              placeholder="Ulangi password" autoComplete="new-password"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" name="agree" checked={form.agree}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 cursor-pointer" />
            <span className="text-xs text-gray-500 leading-relaxed">
              Saya menyetujui{" "}
              <Link href="#" className="text-teal-600 hover:underline">Syarat & Ketentuan</Link>
              {" "}dan{" "}
              <Link href="#" className="text-teal-600 hover:underline">Kebijakan Privasi</Link>
              {" "}UMKMku.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-md ${
              isPenjual
                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30"
                : "bg-teal-600 hover:bg-teal-700 shadow-teal-600/30"
            }`}
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Mendaftarkan..." : isPenjual ? "Buat Akun Penjual" : "Buat Akun Pembeli"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-teal-600 font-semibold hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-8 border-b border-gray-100 bg-white/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="UMKMku" className="h-9 w-auto" />
        </Link>
        <Link href="/login" className="text-sm text-teal-600 font-semibold hover:underline">
          Sudah punya akun? Masuk
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
