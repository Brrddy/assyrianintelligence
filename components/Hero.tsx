"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MODELS } from "@/config/site";

export function Hero() {
  const [idx, setIdx] = useState(0);

  // Cycle the "active model" label inside the studio panel.
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % MODELS.length), 2400);
    return () => clearInterval(id);
  }, []);

  const model = MODELS[idx];

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-white pt-32 pb-24 md:pt-40 md:pb-28"
    >
      {/* Ambient gold gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 55% at 18% 30%, rgba(200,162,75,0.14) 0%, rgba(200,162,75,0.04) 35%, transparent 70%), radial-gradient(50% 45% at 85% 75%, rgba(200,162,75,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
          {/* ── Left: copy ─────────────────────────────────────── */}
          <div className="md:col-span-7">
            <p className="eyebrow flex items-center">
              <span className="mr-3 inline-block h-px w-8 bg-gradient-to-r from-gold to-transparent" />
              AI-native music video studio
            </p>

            <h1 className="mt-5 font-display text-[44px] leading-[0.98] tracking-[-0.025em] text-ink md:text-[76px]">
              Music videos,
              <br />
              <span className="italic">made for the </span>
              <span className="relative inline-block italic">
                <span className="text-gradient-gold">AI era.</span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, #C8A24B 30%, #E7D9B2 60%, transparent 100%)",
                  }}
                />
              </span>
            </h1>

            <p className="mt-7 max-w-xl font-sans text-base leading-relaxed text-ink/65 md:text-lg">
              Assyrian Intelligence is a creative studio of trained AI specialists.
              We direct, generate, and finish original music videos for the artists
              shaping what comes next.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#estimator" className="btn-gold group">
                Get an Estimate
                <Arrow />
              </a>
              <a href="#work" className="btn-ghost">
                See Our Work
              </a>
            </div>
          </div>

          {/* ── Right: studio "now rendering" visual panel ─────── */}
          <div className="md:col-span-5">
            <StudioPanel model={model} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
 * StudioPanel — animated "now rendering" tile.
 * Dark base + animated gold radial gradient + cycling model name.
 * Everything here is CSS-driven so it works even if JS hiccups.
 * ────────────────────────────────────────────────────────────── */
function StudioPanel({
  model,
}: {
  model: { name: string; category: string; blurb: string };
}) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-ink/10 bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
      {/* base radial gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 70% 30%, rgba(200,162,75,0.55) 0%, rgba(154,122,46,0.25) 30%, transparent 65%), radial-gradient(80% 70% at 20% 90%, rgba(231,217,178,0.25) 0%, transparent 60%)",
        }}
      />

      {/* slow rotating gradient sweep (pure CSS, motion-safe gated) */}
      <div
        aria-hidden
        className="absolute -inset-1/4 opacity-60 mix-blend-screen motion-safe:animate-[spin_22s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(200,162,75,0.35) 30%, transparent 55%, rgba(231,217,178,0.18) 80%, transparent 100%)",
        }}
      />

      {/* film grain */}
      <div className="grain absolute inset-0" />

      {/* subtle scanlines */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* content */}
      <div className="relative flex h-full flex-col justify-between p-6 text-white md:p-7">
        {/* top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-gold"
              style={{ boxShadow: "0 0 12px 2px rgba(200,162,75,0.7)" }}
            />
            <span className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
              Now rendering
            </span>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white/40">
            Studio · Live
          </span>
        </div>

        {/* center — pulsing gold ring */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative h-28 w-28 md:h-32 md:w-32">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full border border-gold/40 motion-safe:animate-[panel-pulse_3s_ease-in-out_infinite]"
            />
            <div
              aria-hidden
              className="absolute inset-3 rounded-full border border-gold/60 motion-safe:animate-[panel-pulse_3s_ease-in-out_infinite_0.4s]"
            />
            <div
              aria-hidden
              className="absolute inset-7 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #E7D9B2 0%, #C8A24B 60%, #9A7A2E 100%)",
                boxShadow: "0 0 40px 4px rgba(200,162,75,0.45)",
              }}
            />
          </div>
        </div>

        {/* bottom — cycling model name */}
        <div>
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white/40">
            Active model
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-1"
            >
              <div className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
                {model.name}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gold/40 px-2 py-0.5 font-sans text-[10px] uppercase tracking-eyebrow text-gold">
                  {model.category}
                </span>
                <span className="font-sans text-[11px] text-white/55">
                  {model.blurb}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* progress bar */}
          <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 bg-gradient-to-r from-gold-deep via-gold to-gold-soft motion-safe:animate-[studio-progress_2.4s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
