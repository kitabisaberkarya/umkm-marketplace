"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/dummy-data";
import { useCart } from "./CartProvider";

interface Props {
  product: Product;
}

export function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [toasted, setToasted] = useState(false);

  function showToast() {
    setToasted(true);
    setTimeout(() => setToasted(false), 2500);
  }

  function handleAdd() {
    addToCart(product, qty);
    showToast();
  }

  function handleBuy() {
    addToCart(product, qty);
    router.push("/checkout");
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toasted && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-50 border border-teal-200 px-4 py-2.5 text-sm font-medium text-teal-700 animate-in fade-in duration-200">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Produk berhasil ditambahkan ke keranjang!
        </div>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Jumlah:</span>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition text-lg font-medium"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold text-gray-900">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition text-lg font-medium"
          >
            +
          </button>
        </div>
        <span className="text-xs text-gray-400">Stok: {product.stock}</span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-teal-600 py-3 text-base font-semibold text-teal-600 hover:bg-teal-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          + Keranjang
        </button>
        <button
          onClick={handleBuy}
          className="rounded-xl bg-red-500 py-3 text-base font-semibold text-white hover:bg-red-600 transition shadow"
        >
          Beli Sekarang
        </button>
      </div>

      {/* Wishlist + share */}
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Wishlist
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Bagikan
        </button>
      </div>
    </div>
  );
}
