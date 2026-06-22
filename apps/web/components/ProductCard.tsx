import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/dummy-data";
import { formatRupiah, formatNumber, discountPercent } from "@/lib/utils";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product: p }: ProductCardProps) {
  const discount = p.originalPrice ? discountPercent(p.originalPrice, p.price) : 0;

  return (
    <Link
      href={`/produk/${p.id}`}
      className="group flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {p.isSponsored && (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-amber-500 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white">
            Sponsor
          </span>
        )}
        {p.isNew && !p.isSponsored && (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-teal-500 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white">
            Baru
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-1.5 top-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2 sm:p-3 gap-1">
        <p className="line-clamp-2 text-[11px] sm:text-sm font-medium text-gray-800 leading-snug">
          {p.name}
        </p>

        <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            {formatRupiah(p.price)}
          </span>
          {p.originalPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              {formatRupiah(p.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 flex-wrap">
          <StarRating rating={p.rating} />
          <span className="text-gray-400 hidden sm:inline">({formatNumber(p.reviewCount)})</span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Terjual {formatNumber(p.soldCount)}</span>
          <span className="sm:hidden">{formatNumber(p.soldCount)} terjual</span>
        </div>

        <div className="mt-auto flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
          {p.seller.badge && (
            <span className="rounded bg-amber-50 px-1 py-0.5 text-[8px] sm:text-[10px] font-semibold text-amber-600 shrink-0">
              {p.seller.badge === "star" ? "⭐" : p.seller.badge === "top" ? "🏆" : "✓"}
            </span>
          )}
          <span className="truncate">{p.seller.city}</span>
        </div>
      </div>
    </Link>
  );
}
