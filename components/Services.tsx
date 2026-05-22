import { SERVICES } from "@/config/site";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const ICONS = [
  // 0 — video / film
  (
    <path
      d="M3 6h14v12H3V6zm14 3l4-2v10l-4-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 1 — vfx / particles
  (
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </g>
  ),
  // 2 — concept / pencil
  (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
      <path d="M14 6l3 3" />
    </g>
  ),
  // 3 — post / waveform
  (
    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none">
      <path d="M3 12h2M7 8v8M11 4v16M15 8v8M19 12h2" />
    </g>
  ),
];

export function Services() {
  return (
    <section id="services" className="relative isolate overflow-hidden bg-white py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aura-gold" />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionHeader
          eyebrow="Services"
          title={
            <>
              What we make.{" "}
              <span className="italic text-gold">End to end.</span>
            </>
          }
          lede="Every discipline a music video needs, from one team — so the work stays coherent from first frame to delivery."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-hair bg-hair md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="group relative flex h-full flex-col gap-6 overflow-hidden bg-white p-8 transition-all duration-500 hover:bg-paper md:p-9">
                {/* gold corner glow on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(200,162,75,0.25) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-gold"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,162,75,0.12) 0%, rgba(231,217,178,0.18) 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(200,162,75,0.25)",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    {ICONS[i] ?? ICONS[0]}
                  </svg>
                </div>
                <h3 className="font-display text-2xl leading-tight tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-ink/65">
                  {s.body}
                </p>
                <div className="mt-auto pt-4">
                  <span className="font-sans text-[11px] uppercase tracking-eyebrow text-ink/40 transition-colors group-hover:text-gold">
                    {String(i + 1).padStart(2, "0")} · {s.title.split(" ")[0]}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
