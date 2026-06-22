"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { Product } from "@/lib/dummy-data";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

type Action =
  | { type: "SET"; items: CartItem[] }
  | { type: "ADD"; product: Product; qty: number }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; qty: number }
  | { type: "CLEAR" };

function reducer(items: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "SET":
      return action.items;
    case "ADD": {
      const idx = items.findIndex((i) => i.product.id === action.product.id);
      if (idx >= 0) {
        const next = [...items];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + action.qty };
        return next;
      }
      return [...items, { product: action.product, quantity: action.qty }];
    }
    case "REMOVE":
      return items.filter((i) => i.product.id !== action.id);
    case "UPDATE":
      if (action.qty <= 0) return items.filter((i) => i.product.id !== action.id);
      return items.map((i) => (i.product.id === action.id ? { ...i, quantity: action.qty } : i));
    case "CLEAR":
      return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("umkmku-cart");
      if (raw) dispatch({ type: "SET", items: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("umkmku-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, qty = 1) => dispatch({ type: "ADD", product, qty }), []);
  const removeFromCart = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);
  const updateQty = useCallback((id: string, qty: number) => dispatch({ type: "UPDATE", id, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
