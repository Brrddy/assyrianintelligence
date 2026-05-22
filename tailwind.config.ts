import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette — keep tight: white, black, gold accents.
        ink: "#0A0A0A",
        bone: "#FFFFFF",
        paper: "#FAFAF7",
        gold: {
          DEFAULT: "#C8A24B", // primary gold
          soft: "#E7D9B2",    // washed gold for borders / hairlines
          deep: "#9A7A2E",    // hover / pressed
        },
        hair: "#E8E5DC",      // hairline divider
      },
      fontFamily: {
        // Editorial display serif + clean modern sans, loaded via next/font in layout.tsx
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
