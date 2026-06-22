export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                <span className="text-sm font-bold text-white">U</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">UMKMku</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Masuk
              </a>
              <a
                href="#"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                Daftar
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
            Marketplace UMKM Indonesia
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Belanja Produk{" "}
            <span className="text-teal-600">UMKM Lokal</span>
            <br />
            Langsung dari Pengrajin
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            UMKMku menghubungkan pembeli dengan ribuan penjual UMKM Indonesia.
            Temukan produk autentik — kerajinan, kuliner, fashion, dan lebih banyak lagi.
            Gratis untuk penjual.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#"
              className="rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              Mulai Belanja
            </a>
            <a
              href="#"
              className="rounded-xl border border-gray-200 px-6 py-3 text-base font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              Daftar sebagai Penjual →
            </a>
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Kategori Populer
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href="#"
                className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-gray-800"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cat.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Kenapa UMKMku?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900">
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Penjual */}
      <section className="bg-teal-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Punya produk UMKM? Jual di sini — Gratis!
          </h2>
          <p className="mt-4 text-teal-100">
            Buka toko online dalam 5 menit. Tidak ada biaya langganan, tidak ada komisi penjualan.
          </p>
          <a
            href="#"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3 text-base font-semibold text-teal-700 hover:bg-teal-50"
          >
            Buka Toko Sekarang
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          © 2026 UMKMku. Platform Marketplace UMKM Indonesia.
        </div>
      </footer>
    </main>
  );
}

const CATEGORIES = [
  { name: "Makanan & Minuman", icon: "🍱" },
  { name: "Fashion & Batik", icon: "👗" },
  { name: "Kerajinan Tangan", icon: "🏺" },
  { name: "Kecantikan", icon: "💄" },
  { name: "Agro & Herbal", icon: "🌿" },
  { name: "Elektronik Lokal", icon: "🔌" },
];

const FEATURES = [
  {
    icon: "🆓",
    title: "Gratis untuk Penjual",
    desc: "Tidak ada biaya pendaftaran atau komisi. Monetisasi kami berasal dari iklan, bukan dari kantong penjual.",
  },
  {
    icon: "🔒",
    title: "Transaksi Aman",
    desc: "Dana pembeli ditahan sistem escrow. Penjual menerima pembayaran setelah barang sampai ke pembeli.",
  },
  {
    icon: "🚚",
    title: "Multi-Kurir",
    desc: "Bandingkan harga ongkos kirim dari JNE, J&T, SiCepat, dan kurir lain dalam satu checkout.",
  },
];
