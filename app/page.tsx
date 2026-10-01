import Link from "next/link";
import { Nav } from "@/components/Nav";
import { EmailCapture } from "@/components/EmailCapture";
import { Footer } from "@/components/Footer";
import { Wordmark } from "@/components/Wordmark";

/**
 * Landing page.
 *
 * Deliberately minimal: a short editorial hero + four large section tiles
 * that lead into the real content (AI Video / Shop / Values / Contact).
 * Everything that used to live here now lives at /ai-video.
 */

const SECTIONS = [
  {
    tag: "01",
    title: "AI Video",
    href: "/ai-video",
    body:
      "Original music videos for the artists shaping what comes next — scored, generated, and finished by a studio of trained AI specialists.",
    cta: "Enter the studio",
  },
  {
    tag: "02",
    title: "Shop",
    href: "/shop",
    body:
      "Limited apparel and objects for the Assyrian diaspora. Rooted in heritage, built for daily wear.",
    cta: "Browse the shop",
  },
  {
    tag: "03",
    title: "Our Values",
    href: "/values",
    body:
      "The beliefs underneath everything we make. Preservation, authenticity, and the long arc of a civilization.",
    cta: "Read our values",
  },
  {
    tag: "04",
    title: "Contact",
    href: "/contact",
    body:
      "Working on something that fits our mission — or want to collaborate? Reach out directly.",
    cta: "Get in touch",
  },
];

export default function Home() {
  return (
    <main>
      <Nav />

      {/* ───────── HERO ───────── */}
      <section className="relative isolate overflow-hidden bg-white pt-32 pb-16 md:pt-44 md:pb-20">
        {/* Ambient gold wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 20%, rgba(200,162,75,0.16) 0%, transparent 65%), radial-gradient(40% 40% at 15% 85%, rgba(200,162,75,0.08) 0%, transparent 60%)",
          }}
        />

        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="eyebrow inline-flex items-center">
            <span className="mr-3 inline-block h-px w-8 bg-gradient-to-r from-transparent to-gold" />
            Est. 2026 · For the Assyrian era
            <span className="ml-3 inline-block h-px w-8 bg-gradient-to-r from-gold to-transparent" />
          </p>

          <div className="mt-6 flex justify-center">
            <Wordmark size="xl" />
          </div>

          <h1 className="mt-8 font-display text-[36px] leading-[1.05] tracking-[-0.015em] text-ink md:text-[52px]">
            A creative studio{" "}
            <span className="italic text-gradient-gold">for the AI era.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-ink/60 md:text-lg">
            Rooted in Assyrian heritage. Built with the frontier of generative
            tools. Choose where to start.
          </p>
        </div>
      </section>

      {/* ───────── NEWSLETTER (acts as the visual divider between hero + tiles) ───────── */}
      <EmailCapture />

      {/* ───────── SECTION TILES ───────── */}
      <section className="relative bg-white pt-20 pb-28 md:pt-24 md:pb-36">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-hair bg-paper p-8 transition-all duration-500 ease-editorial hover:border-gold/0 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(200,162,75,0.35)] md:p-10"
                >
                  {/* gold corner glow on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(200,162,75,0.25) 0%, transparent 70%)",
                    }}
                  />
                  {/* gradient hairline on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 group-hover:scale-x-100"
                  />

                  <div className="relative flex items-start justify-between gap-6">
                    <span className="font-sans text-[11px] uppercase tracking-eyebrow text-ink/40 transition-colors duration-500 group-hover:text-gold">
                      {s.tag}
                    </span>
                    <span className="h-px w-12 self-center bg-hair transition-all duration-500 group-hover:w-20 group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-gold group-hover:to-transparent" />
                  </div>

                  <h2 className="relative mt-6 font-display text-[32px] leading-tight tracking-tight text-ink md:text-[40px]">
                    {s.title}
                  </h2>

                  <p className="relative mt-4 max-w-md font-sans text-[15px] leading-relaxed text-ink/60">
                    {s.body}
                  </p>

                  <div className="relative mt-8 flex items-center gap-2 font-sans text-[13px] uppercase tracking-eyebrow text-gold">
                    {s.cta}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M1 7h12M8 2l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
