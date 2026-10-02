import { NextResponse } from "next/server";
import Stripe from "stripe";
import { pf } from "@/lib/printful";

/**
 * Stripe → Printful.
 * When a Checkout Session is paid, create the matching Printful order.
 *
 * Env:
 *   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 *   PRINTFUL_CONFIRM_ORDERS=true  → orders go straight to production
 *                                   (unset = created as drafts you approve in Printful)
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) return NextResponse.json({ error: "not configured" }, { status: 500 });

  const stripe = new Stripe(key);
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, req.headers.get("stripe-signature") || "", secret);
  } catch (e) {
    console.error("[webhook] bad signature", e);
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as any;
  if (session.payment_status !== "paid") return NextResponse.json({ received: true });

  // Printful external_id: max 32 chars, unique per order → also our idempotency key.
  const externalId = String(session.payment_intent || session.id).slice(-32);

  try {
    // Skip if this order already exists (Stripe retries webhooks).
    try {
      await pf(`/orders/@${externalId}`);
      return NextResponse.json({ received: true, duplicate: true });
    } catch (e: any) {
      if (e?.status !== 404) throw e;
    }

    const ship =
      session.collected_information?.shipping_details || session.shipping_details || null;
    const addr = ship?.address || session.customer_details?.address;
    if (!addr) throw new Error("No shipping address on session " + session.id);

    const items = JSON.parse(session.metadata?.items || "[]") as { v: number; q: number }[];
    if (!items.length) throw new Error("No items in session metadata " + session.id);

    const confirm = process.env.PRINTFUL_CONFIRM_ORDERS === "true";
    const order = await pf<any>(`/orders${confirm ? "?confirm=true" : ""}`, {
      method: "POST",
      body: JSON.stringify({
        external_id: externalId,
        shipping: "STANDARD",
        recipient: {
          name: ship?.name || session.customer_details?.name || "Customer",
          email: session.customer_details?.email || undefined,
          phone: session.customer_details?.phone || undefined,
          address1: addr.line1,
          address2: addr.line2 || undefined,
          city: addr.city,
          state_code: addr.state || undefined,
          country_code: addr.country,
          zip: addr.postal_code,
        },
        items: items.map((i) => ({ sync_variant_id: i.v, quantity: i.q })),
      }),
    });
    console.log(`[webhook] Printful order ${order.id} (${confirm ? "confirmed" : "draft"}) for ${externalId}`);
    return NextResponse.json({ received: true, printfulOrder: order.id });
  } catch (e) {
    // Non-2xx makes Stripe retry for up to 3 days.
    console.error("[webhook] Printful order failed", e);
    return NextResponse.json({ error: "printful order failed" }, { status: 500 });
  }
}
