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
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {p.isSponsored && (
          <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Sponsor
          </span>
        )}
        {p.isNew && !p.isSponsored && (
          <span className="absolute left-2 top-2 rounded-md bg-teal-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Baru
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 gap-1">
        <p className="line-clamp-2 text-sm font-medium text-gray-800 leading-snug">
          {p.name}
        </p>

        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-base font-bold text-gray-900">
            {formatRupiah(p.price)}
          </span>
          {p.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatRupiah(p.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <StarRating rating={p.rating} />
          <span className="text-gray-400">({formatNumber(p.reviewCount)})</span>
          <span className="mx-1 text-gray-200">|</span>
          <span>Terjual {formatNumber(p.soldCount)}</span>
        </div>

        <div className="mt-auto flex items-center gap-1 text-xs text-gray-400">
          {p.seller.badge && (
            <span className="rounded bg-amber-50 px-1 py-0.5 text-[10px] font-semibold text-amber-600">
              {p.seller.badge === "star" ? "⭐ Star" : p.seller.badge === "top" ? "🏆 Top" : "✓ Trusted"}
            </span>
          )}
          <span className="truncate">{p.seller.city}</span>
        </div>
      </div>
    </Link>
  );
}
