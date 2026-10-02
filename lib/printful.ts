/* ============================================================================
 *  Printful API helpers (server-only).
 *  Docs: https://developers.printful.com/docs/
 *
 *  Env:
 *    PRINTFUL_TOKEN      — private token from developers.printful.com
 *    PRINTFUL_STORE_ID   — optional; only needed if the token covers >1 store
 * ========================================================================== */

const API = process.env.PRINTFUL_API_BASE || "https://api.printful.com";

export type ShopVariant = {
  id: number; // Printful sync_variant id
  size: string;
  color: string;
  price: number; // retail price, dollars
  currency: string;
  image: string | null;
};

export type ShopProduct = {
  id: number;
  name: string;
  image: string | null;
  variants: ShopVariant[];
};

function headers() {
  const token = process.env.PRINTFUL_TOKEN;
  if (!token) throw new Error("PRINTFUL_TOKEN is not set");
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  if (process.env.PRINTFUL_STORE_ID) h["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  return h;
}

export async function pf<T = any>(
  path: string,
  init: RequestInit & { revalidate?: number } = {}
): Promise<T> {
  const { revalidate, ...rest } = init;
  const res = await fetch(`${API}${path}`, {
    ...rest,
    headers: { ...headers(), ...(rest.headers || {}) },
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message || json?.result || res.statusText;
    const err = new Error(`Printful ${res.status} on ${path}: ${msg}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return json.result as T;
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "4XL", "5XL"];
const sizeRank = (s: string) => {
  const i = SIZE_ORDER.indexOf(s.toUpperCase());
  return i === -1 ? 99 : i;
};

function previewOf(v: any): string | null {
  const preview = v?.files?.find((f: any) => f.type === "preview")?.preview_url;
  return preview || v?.product?.image || null;
}

function toVariant(v: any): ShopVariant {
  // Printful names variants like "Product Name / Black / L"
  const parts = String(v.name || "").split("/").map((s: string) => s.trim());
  return {
    id: v.id,
    size: v.size || parts[parts.length - 1] || "One size",
    color: v.color || (parts.length >= 3 ? parts[parts.length - 2] : ""),
    price: Number(v.retail_price),
    currency: (v.currency || "USD").toLowerCase(),
    image: previewOf(v),
  };
}

/** All synced, non-ignored products with their purchasable variants. */
export async function getShopProducts(): Promise<ShopProduct[]> {
  const list = await pf<any[]>("/store/products?limit=100", { revalidate: 300 });
  const details = await Promise.all(
    list
      .filter((p) => !p.is_ignored)
      .map((p) => pf<any>(`/store/products/${p.id}`, { revalidate: 300 }))
  );
  return details
    .map((d) => {
      const variants = (d.sync_variants || [])
        .filter((v: any) => v.synced !== false && !v.is_ignored && Number(v.retail_price) > 0)
        .filter((v: any) => !v.availability_status || v.availability_status === "active")
        .map(toVariant)
        .sort((a: ShopVariant, b: ShopVariant) => sizeRank(a.size) - sizeRank(b.size));
      return {
        id: d.sync_product.id,
        name: d.sync_product.name,
        image: variants[0]?.image || d.sync_product.thumbnail_url || null,
        variants,
      };
    })
    .filter((p) => p.variants.length > 0);
}

/** Look up one variant server-side so price can't be tampered with client-side. */
export async function getVariant(id: number) {
  const r = await pf<any>(`/store/variants/${id}`);
  const v = r.sync_variant || r;
  if (v.is_ignored || !(Number(v.retail_price) > 0)) throw new Error("Variant not for sale");
  return { ...toVariant(v), name: String(v.name || "Item") };
}
