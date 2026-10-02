"use client";

import { useMemo, useState } from "react";
import type { ShopProduct } from "@/lib/printful";

const money = (n: number, cur = "usd") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur.toUpperCase() }).format(n);

export function ProductCard({ product }: { product: ShopProduct }) {
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))),
    [product.variants]
  );
  const [color, setColor] = useState(colors[0] || "");
  const forColor = product.variants.filter((v) => !color || v.color === color);
  const [variantId, setVariantId] = useState<number | null>(null);
  const selected = forColor.find((v) => v.id === variantId) || null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prices = forColor.map((v) => v.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const cur = forColor[0]?.currency;
  const priceLabel = selected
    ? money(selected.price, selected.currency)
    : minP === maxP
      ? money(minP, cur)
      : `${money(minP, cur)} – ${money(maxP, cur)}`;
  const image = selected?.image || forColor[0]?.image || product.image;

  async function buy() {
    if (!selected) return setError("Pick a size first.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: selected.id, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed.");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-hair bg-bone">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
          />
        ) : null}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[22px] tracking-[-0.01em] text-ink">{product.name}</h3>
        <p className="shrink-0 font-sans text-[15px] font-medium text-gold-deep">{priceLabel}</p>
      </div>

      {colors.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                setVariantId(null);
              }}
              className={`rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${
                c === color ? "border-ink bg-ink text-white" : "border-ink/15 text-ink hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
        {forColor.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={v.id === variantId}
            onClick={() => {
              setVariantId(v.id);
              setError("");
            }}
            className={`min-w-[44px] rounded-full border px-3 py-2 font-sans text-xs font-medium transition-colors ${
              v.id === variantId
                ? "border-ink bg-ink text-white"
                : "border-ink/15 text-ink hover:border-ink"
            }`}
          >
            {v.size}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className="btn-gold mt-6 w-full disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? "Opening checkout…" : selected ? "Buy now" : "Select a size"}
      </button>
      {error && <p className="mt-3 font-sans text-sm text-red-700">{error}</p>}
    </article>
  );
}
