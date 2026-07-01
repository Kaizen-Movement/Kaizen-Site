"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SealMark } from "@/components/SealMark";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/types";

export default function CartPage() {
  const { lines, removeItem, totalCents } = useCart();

  return (
    <>
      <Header />
      <main className="min-h-[70vh] pt-24">
        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
          <p className="eyebrow mb-2">Your Cart</p>
          <h1 className="font-display text-4xl text-bone">Cart</h1>

          {lines.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center">
              <SealMark className="h-14 w-14 text-gold/25" />
              <p className="mt-6 text-bone/50">Your cart is empty.</p>
              <Link
                href="/collections/all"
                className="mt-6 border border-gold px-6 py-3 font-mono text-[11px] uppercase tracking-eyebrow text-gold transition-colors hover:bg-gold hover:text-void"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="mt-10">
              <div className="divide-y divide-white/10 border-y border-white/10">
                {lines.map((line) => (
                  <div
                    key={line.productId}
                    className="flex items-center justify-between py-5"
                  >
                    <div>
                      <p className="text-bone">{line.title}</p>
                      <p className="font-mono text-sm text-gold">
                        {formatPrice(line.priceCents)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(line.productId)}
                      className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/40 hover:text-crimson"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="font-mono text-sm uppercase tracking-eyebrow text-bone/60">
                  Total
                </span>
                <span className="font-mono text-xl text-gold">
                  {formatPrice(totalCents)}
                </span>
              </div>

              <button
                disabled
                title="Checkout arrives in the next build phase"
                className="mt-8 w-full cursor-not-allowed border border-white/15 py-4 font-mono text-[11px] uppercase tracking-eyebrow text-bone/40"
              >
                Checkout — Coming Soon
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
