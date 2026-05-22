import { MODELS } from "@/config/site";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/* ----------------------------------------------------------------------------
 * The model list is in config/site.ts (MODELS).
 * Add or remove entries freely — the grid auto-flows.
 * -------------------------------------------------------------------------- */

export function Models() {
  return (
    <section id="models" className="relative isolate overflow-hidden bg-paper py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 80% 20%, rgba(200,162,75,0.10) 0%, transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="What we use"
            title={
              <>
                Premium-tier models,
                <br />
                <span className="italic text-gold">hand-picked per shot.</span>
              </>
            }
            lede="We're not loyal to any one model — only to the result. The stack rotates as the frontier moves."
          />
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 font-sans text-[11px] uppercase tracking-eyebrow text-gold">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Stack updated regularly
            </span>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-hair bg-hair sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {MODELS.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) * 0.04}>
              <div className="group relative flex h-full flex-col gap-4 overflow-hidden bg-white p-6 transition-colors duration-500 hover:bg-paper md:p-7">
                {/* gold sheen on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-gold/40 px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-eyebrow text-gold">
                    {m.category}
                  </span>
                  <span className="font-sans text-[10px] text-ink/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-xl leading-tight tracking-tight text-ink">
                  {m.name}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-ink/60">
                  {m.blurb}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl font-sans text-sm leading-relaxed text-ink/50">
            We license the premium tier of every model on this list — paying for
            the highest-fidelity output so your video benefits from each tool at
            its full ceiling.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
