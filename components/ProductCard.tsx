import Link from "next/link";
import Image from "next/image";
import { SealMark } from "./SealMark";
import { formatPrice, type Product } from "@/lib/types";

// coverUrl is a resolved, short-lived signed URL (or null while artwork is
// pending) — never a raw R2 key or public bucket URL.
export function ProductCard({
  product,
  coverUrl,
}: {
  product: Product;
  coverUrl: string | null;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block border border-white/10 bg-charcoal transition-all hover:border-crimson/50 hover:shadow-[0_0_24px_-8px_rgba(140,19,39,0.6)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-panel">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <SealMark className="h-16 w-16 text-gold/25" />
          </div>
        )}
        {product.is_recommended && (
          <span className="absolute left-3 top-3 border border-gold/50 bg-void/70 px-2 py-1 font-mono text-[9px] uppercase tracking-eyebrow text-gold">
            Recommended
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-display text-base text-bone">{product.title}</p>
        {product.short_description && (
          <p className="mt-1 line-clamp-1 text-xs text-bone/50">
            {product.short_description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-sm text-gold">
            {formatPrice(product.price_cents)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-bone/50 transition-colors group-hover:text-gold">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
