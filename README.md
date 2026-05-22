# Assyrian Intelligence — Landing Page

Single-page marketing site for an AI music & music-video studio. Premium, editorial, gold-accented. Built with Next.js 14 (App Router) + Tailwind CSS + Framer Motion.

---

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Deploy

Zero-config on Vercel:

```bash
npx vercel       # or push to GitHub and import the repo at vercel.com/new
```

No environment variables required.

---

## Where to edit things

**All business constants live in [`config/site.ts`](config/site.ts)** — pricing, model list, past-work embeds, service copy, contact info. Open that file first.

| Want to change…                          | File / location                           |
| ---------------------------------------- | ----------------------------------------- |
| Pricing (rates, surcharges, %)           | `config/site.ts` → `PRICING`              |
| Past-work YouTube/Facebook embeds        | `config/site.ts` → `WORK[*].embedUrl`     |
| Model list (add / remove / re-tag)       | `config/site.ts` → `MODELS`               |
| Services copy                            | `config/site.ts` → `SERVICES`             |
| Process steps                            | `config/site.ts` → `PROCESS`              |
| Contact email / phone / socials          | `config/site.ts` → `CONTACT`              |
| Form delivery (mailto → Formspree/etc.) | `components/Contact.tsx` → `submitEstimate()` (clearly commented swap point) |
| Brand colors                             | `tailwind.config.ts` → `theme.extend.colors` |
| Fonts                                    | `app/layout.tsx` (`Fraunces` + `Space Grotesk` via `next/font`) |

---

## TODO placeholders to fill in

Search the repo for `TODO` — every placeholder is marked. Specifically:

1. **`config/site.ts` → `CONTACT`** — replace:
   - `email`     → real email address (displayed in the contact block)
   - `phone`     → real phone number
   - `instagram` / `x` / `youtube` → real handles
   - `formEndpoint` → **REQUIRED** for the form to actually send. Get one in ~2 minutes:
     1. Sign up at <https://formspree.io> (free tier, ~50 submissions/month)
     2. Create a new form using the email above
     3. Copy your endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`)
     4. Paste it as the value of `CONTACT.formEndpoint`
2. **`config/site.ts` → `WORK[*].embedUrl`** — replace each `PLACEHOLDER_YT_*` / `PLACEHOLDER_FB_*` with a real YouTube or Facebook embed URL.
   - YouTube:  `https://www.youtube.com/embed/VIDEO_ID`
   - Facebook: `https://www.facebook.com/plugins/video.php?href=ENCODED_VIDEO_URL`
   - Set `provider` to `"youtube"` or `"facebook"` accordingly.
3. **`components/Contact.tsx` → `submitContact()`** — *optional.* Default is a direct POST to Formspree. To switch providers (Resend, Web3Forms, your own API route) replace the body of `submitContact()`. The `// === SWAP POINT ===` comment marks the exact spot — the `payload` object already contains every field.

---

## How the estimator + contact share state

`components/EstimateContext.tsx` exposes an `EstimateProvider` that wraps both the `Estimator` and the `Contact` sections in `app/page.tsx`. The Estimator writes to the shared state on every change; the Contact form reads from it when the user clicks **Send Estimate** — so the mailto body and the "Copy my estimate" clipboard payload always contain the latest selections, the itemized breakdown, and the estimated price range.

The calibration anchor: a **4:00 video with 2 consistent characters and 2 consistent scenes**, Standard turnaround, no add-ons → midpoint **$1,625**, displayed as **$1,500 – $1,750**. All other prices flow from this baseline; retune in `config/site.ts → PRICING`.

---

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (custom palette, hairline dividers, gold accents)
- **Framer Motion** (reveal-on-scroll, respects `prefers-reduced-motion`)
- **TypeScript**
- Google Fonts via `next/font`: **Fraunces** (display serif) + **Space Grotesk** (sans)
