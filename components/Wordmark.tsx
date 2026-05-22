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
    xl: "text-5xl md:text-6xl",
  } as const;

  const color = inverted ? "text-white" : "text-ink";

  return (
    <span className={`inline-flex items-baseline gap-2 ${sizes[size]} ${color}`}>
      <span className="font-display italic font-medium tracking-tight">
        Assyrian
      </span>
      <span
        className="inline-block h-1.5 w-1.5 translate-y-[-3px] rounded-full"
        style={{
          background: "linear-gradient(135deg, #E7D9B2 0%, #C8A24B 60%, #9A7A2E 100%)",
          boxShadow: "0 0 8px rgba(200,162,75,0.6)",
        }}
      />
      <span className="font-sans uppercase tracking-[0.18em]">
        Intelligence
      </span>
    </span>
  );
}
