/**
 * Text-only wordmark. No image asset.
 * "Assyrian" in display serif (italic), "Intelligence" in tracked sans.
 * Variants control sizing; gold dot is the only ornamentation.
 */
export function Wordmark({
  size = "sm",
  inverted = false,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  inverted?: boolean;
}) {
  const sizes = {
    sm: "text-[15px]",
    md: "text-xl",
    lg: "text-3xl",
    xl: "", // handled separately below
  } as const;

  const color = inverted ? "text-white" : "text-ink";

  // Hero size: stacked on phones/tablets so it never runs off-screen,
  // inline from lg up.
  if (size === "xl") {
    return (
      <span
        className={`inline-flex flex-col items-center gap-3 lg:flex-row lg:items-baseline lg:gap-2 ${color}`}
      >
        <span className="font-display text-[56px] italic font-medium leading-none tracking-tight sm:text-[72px] lg:text-6xl">
          Assyrian
        </span>
        <span
          className="hidden h-1.5 w-1.5 translate-y-[-3px] rounded-full lg:inline-block"
          style={dotStyle}
        />
        <span className="flex items-center gap-3 lg:contents">
          <span aria-hidden className="h-px w-6 bg-gradient-to-r from-transparent to-gold lg:hidden" />
          <span className="font-sans text-[15px] uppercase tracking-[0.42em] [margin-right:-0.42em] sm:text-lg lg:text-6xl lg:tracking-[0.18em] lg:[margin-right:0]">
            Intelligence
          </span>
          <span aria-hidden className="h-px w-6 bg-gradient-to-r from-gold to-transparent lg:hidden" />
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-baseline gap-2 ${sizes[size]} ${color}`}>
      <span className="font-display italic font-medium tracking-tight">
        Assyrian
      </span>
      <span
        className="inline-block h-1.5 w-1.5 translate-y-[-3px] rounded-full"
        style={dotStyle}
      />
      <span className="font-sans uppercase tracking-[0.18em]">
        Intelligence
      </span>
    </span>
  );
}

const dotStyle = {
  background: "linear-gradient(135deg, #E7D9B2 0%, #C8A24B 60%, #9A7A2E 100%)",
  boxShadow: "0 0 8px rgba(200,162,75,0.6)",
} as const;
