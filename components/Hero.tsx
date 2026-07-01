import Link from "next/link";
import { SealMark } from "./SealMark";
import type { HomepageHero } from "@/lib/types";

export function Hero({ content }: { content: HomepageHero }) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-white/10 bg-burgundy-vignette pt-24">
      {/* Oversized duotone signature mark — the recurring iconographic motif */}
      <div className="pointer-events-none absolute -right-[20%] top-1/2 h-[1100px] w-[1100px] -translate-y-1/2 bg-seal-radial">
        <SealMark animate className="h-full w-full text-burgundy" />
        <SealMark
          className="absolute inset-0 h-full w-full text-gold/50"
          style={{ transform: "scale(0.78)" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="mb-6 inline-block border border-gold/40 px-3 py-1 font-mono text-[11px] uppercase tracking-eyebrow text-gold">
            Kaizen — 改善 — Continuous Refinement
          </p>
          <h1 className="font-impact text-7xl uppercase leading-[0.92] tracking-tight text-bone md:text-8xl">
            {content.title}
          </h1>
          <p className="mt-5 font-display text-3xl italic text-crimson">
            {content.subtitle}
          </p>
          {content.description ? (
            <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/60">
              {content.description}
            </p>
          ) : null}

          <div className="mt-10 flex items-center gap-5">
            <Link
              href="/collections/all"
              className="border border-gold bg-gold px-7 py-3 font-mono text-[11px] uppercase tracking-eyebrow text-void transition-colors hover:bg-transparent hover:text-gold"
            >
              {content.primary_cta_label}
            </Link>
            <Link
              href="/about"
              className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-gold"
            >
              {content.secondary_cta_label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
