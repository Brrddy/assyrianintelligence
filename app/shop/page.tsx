/* ============================================================================
 *  SHOP PAGE — Printful products + Stripe Checkout
 *  ----------------------------------------------------------------------------
 *  Products, photos, sizes and prices load live from Printful (cached 5 min).
 *  "Buy now" → /api/checkout → Stripe Checkout → /api/stripe-webhook creates
 *  the Printful order. Checkout settings live in config/site.ts (SHOP).
 *  Env vars: see .env.example.
 * ========================================================================== */

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { getShopProducts, type ShopProduct } from "@/lib/printful";

export const revalidate = 300;

export const metadata = {
  title: "Shop — Assyrian Intelligence",
};

async function loadProducts(): Promise<ShopProduct[]> {
  if (!process.env.PRINTFUL_TOKEN) return [];
  try {
    return await getShopProducts();
  } catch (e) {
    console.error("[shop] Printful fetch failed:", e);
    return [];
  }
}

export default async function ShopPage() {
  const products = await loadProducts();

  return (
    <main className="bg-paper">
      <Nav />

      {/* ───────── HERO ───────── */}
      <section
        id="top"
        className="relative isolate overflow-hidden bg-paper pt-32 pb-20 md:pt-40 md:pb-28"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aura-gold" />
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <Reveal>
            <p className="eyebrow flex items-center">
              <span className="mr-3 inline-block h-px w-8 bg-gradient-to-r from-gold to-transparent" />
              ASSYRIAN INTELLIGENCE
            </p>
          </Reveal>
          <Reveal>
            <h1 className="mt-5 font-display text-[44px] leading-[0.98] tracking-[-0.025em] text-ink md:text-[76px]">
              The <span className="italic text-gradient-gold">Collection.</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ink/65 md:text-lg">
              Uniting the Assyrian Nation
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────── PRODUCT GRID ───────── */}
      <section className="relative bg-paper pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          {products.length === 0 ? (
            <NotConnectedNotice />
          ) : (
            <div
              className={`grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 ${
                products.length > 2 ? "lg:grid-cols-3" : "mx-auto max-w-4xl"
              }`}
            >
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          {products.length > 0 && (
            <p className="mt-16 text-center font-sans text-[11px] uppercase tracking-eyebrow text-ink/40">
              Made to order · Ships in 5–10 business days · Secure checkout by Stripe
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* Shown until Printful is connected (or if it's temporarily unreachable). */
function NotConnectedNotice() {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl rounded-2xl border border-hair bg-bone p-8 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.12)] md:p-12">
        <p className="eyebrow inline-flex items-center justify-center">Store coming soon</p>
        <h2 className="mt-4 font-display text-3xl tracking-tight text-ink md:text-4xl">
          Launching Soon
        </h2>
        <p className="mt-4 font-sans text-sm leading-relaxed text-ink/60 md:text-base">
          We&apos;re finalizing the first drop. Check back shortly — every piece is built to the
          same standard as the work.
        </p>
        <div className="mt-7 hairline-gold" />
        <p className="mt-7 font-sans text-[11px] uppercase tracking-eyebrow text-ink/40">
          Uniting the Assyrian Nation
        </p>
      </div>
    </Reveal>
  );
}
