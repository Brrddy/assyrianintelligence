import { PROCESS } from "@/config/site";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function Process() {
  return (
    <section id="process" className="relative isolate overflow-hidden bg-white py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45% 35% at 15% 80%, rgba(200,162,75,0.10) 0%, transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionHeader
          eyebrow="Process"
          title={
            <>
              Four steps.{" "}
              <span className="italic text-gold">Zero guesswork.</span>
            </>
          }
          lede="A predictable rhythm from kickoff to delivery. You always know what's coming next, and why."
        />

        <ol className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-2 md:gap-x-16 md:gap-y-20 lg:grid-cols-4 lg:gap-x-10">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.07} as="li">
              <div className="flex flex-col gap-6">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,162,75,0.10) 0%, rgba(231,217,178,0.15) 100%)",
                    boxShadow:
                      "inset 0 0 0 1px rgba(200,162,75,0.5), 0 10px 25px -10px rgba(200,162,75,0.4)",
                  }}
                >
                  <span className="font-display text-2xl text-gradient-gold">{p.n}</span>
                </div>
                <div className="h-px w-12 bg-gradient-to-r from-gold to-transparent" />
                <h3 className="font-display text-2xl leading-tight tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-ink/65">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
