import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UMKMku — Marketplace UMKM Indonesia",
  description:
    "Platform marketplace untuk seluruh produk UMKM Indonesia. Temukan kerajinan, kuliner, fashion, dan produk lokal berkualitas langsung dari pengrajin. Gratis untuk penjual.",
  keywords: ["umkm", "marketplace", "indonesia", "produk lokal", "kerajinan", "kuliner"],
  openGraph: {
    title: "UMKMku — Marketplace UMKM Indonesia",
    description: "Belanja produk UMKM lokal langsung dari pengrajin Indonesia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
