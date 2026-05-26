"use client";

/**
 * Shared state between the Estimator and the Contact form.
 *
 * The Estimator writes here on every change. The Contact form reads from here
 * when the user submits — so the email body / clipboard copy always carry
 * the latest selections, even if the user navigated away and back.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRICING, type TurnaroundKey } from "@/config/site";

export type EstimateState = {
  seconds: number;
  concept: string;
  characters: number;
  scenes: number;
  style: string;
  styleIsOther: boolean;
  turnaround: TurnaroundKey;
  lipSync: boolean;
  revisions: boolean;
};

export type LineItem = { label: string; amount: number };

export type EstimateComputed = {
  subtotal: number;
  total: number;
  low: number;
  high: number;
  lines: LineItem[];
};

const initialState: EstimateState = {
  seconds: PRICING.song.defaultSeconds,
  concept: "",
  characters: 1,
  scenes: 1,
  style: PRICING.stylePresets[0],
  styleIsOther: false,
  turnaround: "standard",
  lipSync: false,
  revisions: false,
};

type Ctx = {
  state: EstimateState;
  setState: React.Dispatch<React.SetStateAction<EstimateState>>;
  compute: () => EstimateComputed;
  formatSeconds: (s: number) => string;
};

const EstimateCtx = createContext<Ctx | null>(null);

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EstimateState>(initialState);

  const formatSeconds = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }, []);

  const compute = useCallback((): EstimateComputed => {
    const lines: LineItem[] = [];

    // Per-minute pricing prorated in 30-second increments.
    //   firstMinuteFee       covers the first 60s   ($firstMinuteFee/2 per 30s)
    //   eachAdditionalMinute covers each addl  60s  ($eachAdditionalMinute/2 per 30s)
    // Example: 3:30 → $350 + 2.5 × $200 = $850.
    const per30First = PRICING.firstMinuteFee / 2;
    const per30Addl  = PRICING.eachAdditionalMinute / 2;
    const halfMinutes = Math.max(1, Math.round(state.seconds / 30));
    const firstHalves = Math.min(halfMinutes, 2);     // first two 30s blocks
    const addlHalves  = Math.max(0, halfMinutes - 2); // 30s blocks beyond the first minute
    const songCost = firstHalves * per30First + addlHalves * per30Addl;
    lines.push({
      label: `Song length (${formatSeconds(state.seconds)})`,
      amount: songCost,
    });

    const addlChars = Math.max(0, state.characters - 1);
    if (addlChars > 0) {
      lines.push({
        label: `Additional characters (${addlChars} × $${PRICING.eachAdditionalCharacter})`,
        amount: addlChars * PRICING.eachAdditionalCharacter,
      });
    }

    const addlScenes = Math.max(0, state.scenes - 1);
    if (addlScenes > 0) {
      lines.push({
        label: `Additional scenes (${addlScenes} × $${PRICING.eachAdditionalScene})`,
        amount: addlScenes * PRICING.eachAdditionalScene,
      });
    }

    const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
    let total = subtotal;

    if (state.lipSync) {
      const amt = subtotal * PRICING.lipSyncPct;
      lines.push({
        label: `Lip-sync accuracy (+${Math.round(PRICING.lipSyncPct * 100)}% of subtotal)`,
        amount: amt,
      });
      total += amt;
    }

    if (state.revisions) {
      lines.push({
        label: "Revisions package (flat)",
        amount: PRICING.revisionsPackageFlat,
      });
      total += PRICING.revisionsPackageFlat;
    }

    const t = PRICING.turnaround[state.turnaround];
    if (t.surcharge > 0) {
      lines.push({
        label: `Turnaround — ${t.label} (${t.window})`,
        amount: t.surcharge,
      });
      total += t.surcharge;
    } else {
      lines.push({
        label: `Turnaround — ${t.label} (${t.window})`,
        amount: 0,
      });
    }

    const low  = total * (1 - PRICING.rangePct);
    const high = total * (1 + PRICING.rangePct);

    return { subtotal, total, low, high, lines };
  }, [state, formatSeconds]);

  const value = useMemo<Ctx>(
    () => ({ state, setState, compute, formatSeconds }),
    [state, compute, formatSeconds]
  );

  return <EstimateCtx.Provider value={value}>{children}</EstimateCtx.Provider>;
}

export function useEstimate() {
  const ctx = useContext(EstimateCtx);
  if (!ctx) throw new Error("useEstimate must be used inside <EstimateProvider>");
  return ctx;
}

/**
 * Build the plain-text summary that gets emailed / copied.
 * Single source of truth — same string used in mailto and clipboard.
 */
export function formatSummary(
  state: EstimateState,
  computed: EstimateComputed,
  formatSeconds: (s: number) => string
): string {
  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const addons: string[] = [];
  if (state.lipSync) addons.push("Lip-sync accuracy");
  if (state.revisions) addons.push("Revisions package");
  const addonsLine = addons.length ? addons.join(", ") : "None";

  const t = PRICING.turnaround[state.turnaround];

  return [
    "ASSYRIAN INTELLIGENCE — QUOTE REQUEST",
    "─────────────────────────────────────",
    "",
    "SELECTIONS",
    `• Song length:  ${formatSeconds(state.seconds)}`,
    `• Characters:   ${state.characters}`,
    `• Scenes:       ${state.scenes}`,
    `• Visual style: ${state.style}${state.styleIsOther ? "  (custom)" : ""}`,
    `• Turnaround:   ${t.label}  (${t.window})`,
    `• Add-ons:      ${addonsLine}`,
    "",
    "CONCEPT",
    state.concept.trim() || "(no concept provided)",
    "",
    "ITEMIZED BREAKDOWN",
    ...computed.lines.map(
      (l) => `• ${l.label.padEnd(48)} ${money(l.amount)}`
    ),
    "",
    `ESTIMATED RANGE:  ${money(computed.low)} – ${money(computed.high)}`,
    `Midpoint:         ${money(computed.total)}`,
    "",
    "Note: preliminary estimate only. Final quote provided after review.",
  ].join("\n");
}
