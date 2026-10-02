import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getVariant } from "@/lib/printful";
import { SHOP } from "@/config/site";

/**
 * POST /api/checkout  { variantId: number, quantity?: number }
 * Creates a Stripe Checkout Session for one Printful variant and returns its URL.
 * Price always comes from Printful (server-side), never from the browser.
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: "Checkout isn't configured yet." }, { status: 500 });

  let variantId: number, quantity: number;
  try {
    const body = await req.json();
    variantId = Number(body.variantId);
    quantity = Math.min(10, Math.max(1, Math.floor(Number(body.quantity ?? 1))));
    if (!Number.isFinite(variantId)) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let variant;
  try {
    variant = await getVariant(variantId);
  } catch (e) {
    console.error("[checkout] variant lookup failed", e);
    return NextResponse.json({ error: "That item isn't available." }, { status: 404 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    req.headers.get("origin") ||
    new URL(req.url).origin;

  const stripe = new Stripe(key);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          price_data: {
            currency: variant.currency,
            unit_amount: Math.round(variant.price * 100),
            product_data: {
              name: variant.name,
              ...(variant.image ? { images: [variant.image] } : {}),
              metadata: { printful_sync_variant_id: String(variant.id) },
            },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: SHOP.shipCountries },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Standard shipping",
            fixed_amount: { amount: SHOP.shippingCents, currency: variant.currency },
            delivery_estimate: {
              minimum: { unit: "business_day", value: SHOP.deliveryDays[0] },
              maximum: { unit: "business_day", value: SHOP.deliveryDays[1] },
            },
          },
        },
      ],
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
      metadata: { items: JSON.stringify([{ v: variant.id, q: quantity }]) },
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout] stripe error", e);
    return NextResponse.json({ error: "Couldn't start checkout. Try again." }, { status: 500 });
  }
}
