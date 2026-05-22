import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <Reveal>
        <p className="eyebrow">
          <span className={`mr-3 inline-block h-px w-8 translate-y-[-3px] bg-gold align-middle ${align === "center" ? "hidden" : ""}`} />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-[34px] leading-[1.05] tracking-[-0.015em] text-ink md:text-[56px]">
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink/65 md:text-lg">
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}
