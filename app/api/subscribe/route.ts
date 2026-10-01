import { NextResponse } from "next/server";

/**
 * Newsletter subscription endpoint.
 *
 * Called by <EmailCapture /> on the landing page. Takes a JSON body
 * `{ email: string }` and forwards it to Beehiiv's Subscriptions API,
 * keeping the API key server-side.
 *
 * Beehiiv API docs:
 *   https://developers.beehiiv.com/docs/v2/f9ead63b50e2a-create-a-subscription
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  // Parse body
  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 }
    );
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error("[subscribe] missing BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID env vars");
    return NextResponse.json(
      { error: "Newsletter is temporarily unavailable." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "assyrianintelligence.com",
          utm_medium: "organic",
          referring_site: "https://assyrianintelligence.com",
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[subscribe] Beehiiv error", res.status, text);
      // Don't surface Beehiiv's internals to the client.
      return NextResponse.json(
        { error: "Couldn't subscribe right now. Try again in a moment." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] network error", err);
    return NextResponse.json(
      { error: "Network error. Try again." },
      { status: 500 }
    );
  }
}
