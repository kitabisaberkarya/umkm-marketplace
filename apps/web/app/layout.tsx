import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

const LOGO_URL =
  "https://res.cloudinary.com/ddgjbfcyi/image/upload/v1780496713/LOGO_KITA_BISA_BERKARYA24_cphgun.png";

export const metadata: Metadata = {
  title: "UMKMku — Marketplace UMKM Indonesia",
  description:
    "Platform marketplace untuk seluruh produk UMKM Indonesia. Temukan kerajinan, kuliner, fashion, dan produk lokal berkualitas langsung dari pengrajin. Gratis untuk penjual.",
  keywords: ["umkm", "marketplace", "indonesia", "produk lokal", "kerajinan", "kuliner"],
  icons: {
    icon: [{ url: LOGO_URL, type: "image/png" }],
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
  openGraph: {
    title: "UMKMku — Marketplace UMKM Indonesia",
    description: "Belanja produk UMKM lokal langsung dari pengrajin Indonesia.",
    type: "website",
    images: [{ url: LOGO_URL }],
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
        <Providers>
          {/* Extra bottom padding on mobile for fixed bottom nav */}
          <div className="flex flex-col flex-1 pb-20 lg:pb-0">
            {children}
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
