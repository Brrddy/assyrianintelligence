import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Core values — the beliefs underneath everything Assyrian Intelligence makes.
 * Starts with a "Rooted in Heritage" ethos statement, followed by 5 numbered
 * principles. Visual pattern mirrors the Process section (gold-ringed numerals
 * on an airy editorial layout).
 */

const ROOT_PRINCIPLE = {
  tag: "The Root",
  title: "Rooted in Heritage.",
  body:
    "Everything starts from Assyrian identity: our history, language, faith traditions, and the continuity from ancient Mesopotamia to today's diaspora.",
};

const VALUES = [
  {
    n: "01",
    title: "Preserve Through Innovation.",
    body:
      "We use AI to protect what's at risk of fading — Syriac/Aramaic dialects, oral histories, music, and art — so it lives on for the next generation.",
  },
  {
    n: "02",
    title: "Authenticity Over Aesthetics.",
    body:
      "We get the details right. Accurate history, real symbolism, and respect for the culture come before what looks cool or goes viral.",
  },
  {
    n: "03",
    title: "Builders of Civilization.",
    body:
      "Our ancestors gave the world writing, libraries, and law. We carry that spirit forward by creating, not just consuming, the tools that shape the future.",
  },
  {
    n: "04",
    title: "One Nation, Everywhere.",
    body:
      "We connect Assyrians across borders — from Chicago to Sydney to Nineveh — and make the culture accessible to youth who grew up far from the homeland.",
  },
  {
    n: "05",
    title: "Pride With Purpose.",
    body:
      "We celebrate who we are loudly and unapologetically, and back it with work that strengthens the community: education, visibility, and economic opportunity.",
  },
];

export function Values() {
  return (
    <section
      id="values"
      className="relative isolate overflow-hidden bg-white pt-36 pb-24 md:pt-44 md:pb-32"
    >
      {/* ambient gold wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgba(200,162,75,0.14) 0%, transparent 65%), radial-gradient(40% 35% at 15% 85%, rgba(200,162,75,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionHeader
          eyebrow="Our Values"
          title={
            <>
              What we stand for.{" "}
              <span className="italic text-gradient-gold">Why we build.</span>
            </>
          }
          lede="The beliefs underneath everything we make. Rooted in heritage, aimed at tomorrow."
        />

        {/* ─── Root ethos — larger, framed differently ─── */}
        <Reveal delay={0.05}>
          <article className="group relative mt-16 overflow-hidden rounded-2xl border border-gold/30 bg-paper p-8 shadow-[0_30px_80px_-30px_rgba(200,162,75,0.35)] md:mt-20 md:p-12">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,162,75,0.25) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <p className="font-sans text-[11px] uppercase tracking-eyebrow text-gold">
                — {ROOT_PRINCIPLE.tag} —
              </p>
              <h3 className="mt-5 font-display text-[32px] leading-[1.05] tracking-[-0.015em] text-ink md:text-[48px]">
                {ROOT_PRINCIPLE.title}
              </h3>
              <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-ink/70 md:text-lg">
                {ROOT_PRINCIPLE.body}
              </p>
            </div>
          </article>
        </Reveal>

        {/* ─── The five principles ─── */}
        <ol className="mt-16 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={(i % 2) * 0.06} as="li">
              <div className="flex flex-col gap-5">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,162,75,0.10) 0%, rgba(231,217,178,0.15) 100%)",
                    boxShadow:
                      "inset 0 0 0 1px rgba(200,162,75,0.5), 0 10px 25px -10px rgba(200,162,75,0.4)",
                  }}
                >
                  <span className="font-display text-xl text-gradient-gold">
                    {v.n}
                  </span>
                </div>
                <div className="h-px w-12 bg-gradient-to-r from-gold to-transparent" />
                <h3 className="font-display text-2xl leading-tight tracking-tight text-ink md:text-[26px]">
                  {v.title}
                </h3>
                <p className="font-sans text-[15px] leading-relaxed text-ink/70">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
