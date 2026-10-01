"use client";

/* ============================================================================
 *  SHOP PAGE — Shopify Buy Button SDK integration
 *  ----------------------------------------------------------------------------
 *  Products live in Shopify. Printify fulfills. Checkout is hosted by Shopify.
 *  This page only browses + launches Shopify's hosted cart/checkout — no backend
 *  required on our side.
 *
 *  HOW TO CONNECT (fill in SHOPIFY_CONFIG below):
 *    1. Shopify admin → Sales channels → "Buy Button" → install if missing.
 *    2. Shopify admin → Apps → Develop apps → Create app → "Storefront API"
 *       access scopes → grant unauthenticated_read_product_listings,
 *       unauthenticated_read_product_inventory, and
 *       unauthenticated_write_checkouts. Copy the Storefront access token.
 *    3. For each product you want to show: Shopify admin → Products → open the
 *       product → copy the numeric ID from the URL (the long number at the end).
 *    4. Paste the values below. No deploy needed for testing once the dev
 *       server is running.
 * ========================================================================== */

import { useEffect, useRef } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

/* ---------------------------------------------------------------------------
 *  EDIT THESE VALUES — placeholders below.
 *  Until they're replaced, the page shows a "store not connected" notice.
 * ------------------------------------------------------------------------- */
const SHOPIFY_CONFIG = {
  domain: "your-store.myshopify.com",
  storefrontAccessToken: "YOUR_STOREFRONT_ACCESS_TOKEN",
  products: [
    // Display order — top-left first.
    // { id: "1234567890123" },
    // { id: "1234567890124" },
  ] as { id: string }[],
};

/* ---------------------------------------------------------------------------
 *  Brand palette mirrored from tailwind.config.ts so the Shopify-injected
 *  components match the site exactly. Don't edit here in isolation; if the
 *  brand changes, change tailwind.config.ts and these together.
 * ------------------------------------------------------------------------- */
const BRAND = {
  ink: "#0A0A0A",
  paper: "#FAFAF7",
  bone: "#FFFFFF",
  gold: "#C8A24B",
  goldDeep: "#9A7A2E",
  goldSoft: "#E7D9B2",
  hair: "#E8E5DC",
  fontDisplay:
    'var(--font-display), Georgia, "Times New Roman", serif',
  fontSans:
    'var(--font-sans), system-ui, -apple-system, "Segoe UI", sans-serif',
} as const;

const SDK_URL =
  "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    ShopifyBuy?: any;
  }
}

function isUnconfigured(cfg: typeof SHOPIFY_CONFIG) {
  return (
    !cfg.domain ||
    cfg.domain === "your-store.myshopify.com" ||
    !cfg.storefrontAccessToken ||
    cfg.storefrontAccessToken === "YOUR_STOREFRONT_ACCESS_TOKEN" ||
    cfg.products.length === 0
  );
}

/** Lazy-load the Shopify Buy Button SDK once per page lifetime. */
function loadShopifySDK(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.ShopifyBuy && window.ShopifyBuy.UI) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SDK_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Shopify SDK failed to load")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Shopify SDK failed to load"));
    document.head.appendChild(script);
  });
}

export default function ShopPage() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const productRefs = useRef<Array<HTMLDivElement | null>>([]);
  const unconfigured = isUnconfigured(SHOPIFY_CONFIG);

  useEffect(() => {
    if (unconfigured) return;

    let cancelled = false;

    loadShopifySDK()
      .then(() => {
        if (cancelled || !window.ShopifyBuy) return;

        const client = window.ShopifyBuy.buildClient({
          domain: SHOPIFY_CONFIG.domain,
          storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
        });

        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          if (cancelled) return;

          SHOPIFY_CONFIG.products.forEach((p, i) => {
            const node = productRefs.current[i];
            if (!node) return;

            ui.createComponent("product", {
              id: p.id,
              node,
              moneyFormat: "%24%7B%7Bamount%7D%7D", // ${{amount}}
              options: PRODUCT_OPTIONS,
            });
          });
        });
      })
      .catch((err) => {
        // Silent fail — placeholder grid stays visible.
        // eslint-disable-next-line no-console
        console.warn("[shop] Shopify SDK failed:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [unconfigured]);

  return (
    <main className="bg-paper">
      <Nav />

      {/* ───────── HERO ───────── */}
      <section
        id="top"
        className="relative isolate overflow-hidden bg-paper pt-32 pb-20 md:pt-40 md:pb-28"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 aura-gold"
        />
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <Reveal>
            <p className="eyebrow flex items-center">
              <span className="mr-3 inline-block h-px w-8 bg-gradient-to-r from-gold to-transparent" />
              ASSYRIAN INTELLIGENCE
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-[44px] leading-[0.98] tracking-[-0.025em] text-ink md:text-[76px]">
              The <span className="italic text-gradient-gold">Collection.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ink/65 md:text-lg">
              Uniting the Assyrian Nation
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────── PRODUCT GRID ───────── */}
      <section className="relative bg-paper pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          {unconfigured ? (
            <NotConnectedNotice />
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
            >
              {SHOPIFY_CONFIG.products.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    productRefs.current[i] = el;
                  }}
                  className="shopify-product-slot min-h-[420px]"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* ───────── Brand-matched overrides for Shopify-injected DOM ─────────
          The Buy Button SDK styles components via `options.styles` (set below),
          but a few host-side rules keep typography + spacing consistent with
          the rest of the site. Scoped via .shopify-product-slot. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .shopify-product-slot .shopify-buy__product {
          font-family: ${BRAND.fontSans};
          color: ${BRAND.ink};
        }
        .shopify-product-slot .shopify-buy__product__title {
          font-family: ${BRAND.fontDisplay};
          letter-spacing: -0.01em;
        }
        .shopify-product-slot img {
          border-radius: 6px;
        }
      `,
        }}
      />
    </main>
  );
}

/* ---------------------------------------------------------------------------
 *  Shopify Buy Button SDK style overrides — keep the injected components on
 *  brand. The SDK lets you style each "component" (product / cart / toggle /
 *  modalProduct) via `options.styles`. Defaults are Shopify blue; we override
 *  to gold / ink.
 * ------------------------------------------------------------------------- */
const goldButton = {
  "background-color": BRAND.gold,
  "color": BRAND.ink,
  "font-family": BRAND.fontSans,
  "font-weight": "500",
  "letter-spacing": "0.04em",
  "border-radius": "999px",
  ":hover": {
    "background-color": BRAND.goldDeep,
    "color": BRAND.bone,
  },
  ":focus": {
    "background-color": BRAND.goldDeep,
    "color": BRAND.bone,
  },
} as const;

const PRODUCT_OPTIONS = {
  product: {
    iframe: false,
    contents: {
      img: true,
      title: true,
      price: true,
      options: true,
      quantity: false,
      button: true,
      description: false,
    },
    text: {
      button: "Add to cart",
    },
    styles: {
      product: {
        "@media (min-width: 601px)": {
          "max-width": "100%",
          "margin-left": "0",
          "margin-bottom": "0",
        },
        "text-align": "left",
      },
      title: {
        "font-family": BRAND.fontDisplay,
        "font-size": "22px",
        "color": BRAND.ink,
        "font-weight": "500",
        "letter-spacing": "-0.01em",
      },
      price: {
        "font-family": BRAND.fontSans,
        "font-size": "15px",
        "color": BRAND.goldDeep,
        "font-weight": "500",
      },
      compareAt: {
        "color": "rgba(10,10,10,0.4)",
      },
      button: goldButton,
    },
  },
  productSet: {
    styles: {
      products: {
        "@media (min-width: 601px)": {
          "margin-left": "0",
        },
      },
    },
  },
  modalProduct: {
    contents: {
      img: false,
      imgWithCarousel: true,
      button: false,
      buttonWithQuantity: true,
      description: true,
    },
    text: {
      button: "Add to cart",
    },
    styles: {
      product: {
        "@media (min-width: 601px)": {
          "max-width": "100%",
          "margin-left": "0px",
          "margin-bottom": "0px",
        },
      },
      title: {
        "font-family": BRAND.fontDisplay,
        "font-weight": "500",
        "color": BRAND.ink,
      },
      price: {
        "font-family": BRAND.fontSans,
        "color": BRAND.goldDeep,
        "font-weight": "500",
      },
      button: goldButton,
    },
  },
  cart: {
    text: {
      total: "Subtotal",
      button: "Checkout",
      notice: "Shipping and taxes calculated at checkout.",
    },
    styles: {
      button: goldButton,
      title: {
        "font-family": BRAND.fontDisplay,
        "color": BRAND.ink,
      },
      subtotalText: {
        "font-family": BRAND.fontSans,
      },
      subtotal: {
        "font-family": BRAND.fontDisplay,
        "color": BRAND.ink,
      },
      notice: {
        "font-family": BRAND.fontSans,
        "color": "rgba(10,10,10,0.55)",
      },
    },
  },
  toggle: {
    styles: {
      toggle: {
        "background-color": BRAND.ink,
        "border-radius": "999px",
        ":hover": { "background-color": BRAND.goldDeep },
        ":focus": { "background-color": BRAND.goldDeep },
      },
      count: {
        "color": BRAND.gold,
        "font-family": BRAND.fontSans,
      },
      iconPath: {
        "fill": BRAND.gold,
      },
    },
  },
} as const;

/* ---------------------------------------------------------------------------
 *  Empty-state shown until SHOPIFY_CONFIG is filled in.
 * ------------------------------------------------------------------------- */
function NotConnectedNotice() {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl rounded-2xl border border-hair bg-bone p-8 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.12)] md:p-12">
        <p className="eyebrow inline-flex items-center justify-center">
          Store coming soon
        </p>
        <h2 className="mt-4 font-display text-3xl tracking-tight text-ink md:text-4xl">
          Launching Soon
        </h2>
        <p className="mt-4 font-sans text-sm leading-relaxed text-ink/60 md:text-base">
          We're finalizing the first drop. Check back shortly — every piece is
          built to the same standard as the work.
        </p>
        <div className="mt-7 hairline-gold" />
        <p className="mt-7 font-sans text-[11px] uppercase tracking-eyebrow text-ink/40">
          Uniting the Assyrian Nation
        </p>
      </div>
    </Reveal>
  );
}
