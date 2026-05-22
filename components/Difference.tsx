import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * "The Difference" — the four reasons clients pick us.
 * Static layout (all cards always expanded); hover applies a gold highlight
 * to match the Services section behavior.
 */

const POINTS = [
  {
    tag: "01",
    title: "Premium-tier only",
    short: "We pay for the ceiling.",
    long:
      "We license the highest-fidelity tier of every model we use. Veo 3.1, Sora 2 Pro, Flux Ultra — the version that produces the best output, every time, even when it costs more.",
  },
  {
    tag: "02",
    title: "Trained, not just users",
    short: "Specialists, not dabblers.",
    long:
      "Our team isn't experimenting with AI — we've shipped with these tools at scale. We know each model's failure modes cold, which means fewer surprises and a faster path to a result you'll actually use.",
  },
  {
    tag: "03",
    title: "End-to-end pipeline",
    short: "Concept to master, one roof.",
    long:
      "Direction, generation, VFX, color, sound, and delivery all happen inside the studio. No agency middlemen, no handoff loss, no \"that's a different vendor.\" One creative spine from brief to final cut.",
  },
  {
    tag: "04",
    title: "Editorial finishing",
    short: "We finish like a studio.",
    long:
      "Generative output is the start, not the end. We grade, sound-design, and master each piece with the same care a feature gets — because the difference between AI-made and AI-finished is everything.",
  },
];

export function Difference() {
  return (
    <section
      id="difference"
      className="relative isolate overflow-hidden bg-white py-24 md:py-32"
    >
      {/* soft gold aura */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aura-gold" />

      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionHeader
          eyebrow="The Difference"
          title={
            <>
              Most studios use AI.
              <br />
              <span className="italic text-gradient-gold">We're built around it.</span>
            </>
          }
          lede="Four reasons artists and labels keep coming back."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2 md:gap-5">
          {POINTS.map((p, i) => (
            <Reveal key={p.tag} delay={(i % 2) * 0.06}>
              <article className="group relative h-full overflow-hidden rounded-xl border border-hair bg-paper p-7 transition-all duration-500 ease-editorial hover:border-gold/0 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(200,162,75,0.35)] md:p-8">
                {/* gold corner glow on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(200,162,75,0.25) 0%, transparent 70%)",
                  }}
                />
                {/* gradient hairline that grows on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 group-hover:scale-x-100"
                />

                <div className="relative flex items-start justify-between gap-6">
                  <span className="font-sans text-[11px] uppercase tracking-eyebrow text-ink/40 transition-colors duration-500 group-hover:text-gold">
                    {p.tag}
                  </span>
                  <span className="h-px w-12 self-center bg-hair transition-all duration-500 group-hover:w-20 group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-gold group-hover:to-transparent" />
                </div>

                <h3 className="relative mt-5 font-display text-2xl leading-tight tracking-tight text-ink md:text-[28px]">
                  {p.title}
                </h3>
                <p className="relative mt-2 font-sans text-sm text-ink/55">
                  {p.short}
                </p>

                <p className="relative mt-5 font-sans text-[15px] leading-relaxed text-ink/75">
                  {p.long}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
