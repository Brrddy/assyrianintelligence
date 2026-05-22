"use client";

import { PRICING, type TurnaroundKey } from "@/config/site";
import { useEstimate } from "./EstimateContext";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const moneyExact = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function Estimator() {
  const { state, setState, compute, formatSeconds } = useEstimate();
  const computed = compute();

  const setField = <K extends keyof typeof state>(key: K, value: (typeof state)[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  return (
    <section id="estimator" className="relative isolate overflow-hidden bg-paper py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aura-gold" />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionHeader
          eyebrow="Price Estimator"
          title={
            <>
              Build your video.{" "}
              <span className="italic text-gold">See the price.</span>
            </>
          }
          lede="Configure the brief — the estimate updates live. Submit it through Contact and we'll get back with a firm quote within 48 hours."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 lg:grid-cols-[1fr_420px] lg:gap-14">
          {/* ─── FORM ─── */}
          <Reveal>
            <div className="space-y-12">
              {/* Song length */}
              <Field
                label="Song length"
                hint={formatSeconds(state.seconds)}
              >
                <input
                  type="range"
                  className="slider-gold mt-4"
                  min={PRICING.song.minSeconds}
                  max={PRICING.song.maxSeconds}
                  step={PRICING.song.stepSeconds}
                  value={state.seconds}
                  onChange={(e) => setField("seconds", Number(e.target.value))}
                  aria-label="Song length in seconds"
                />
                <div className="mt-2 flex justify-between font-sans text-[11px] uppercase tracking-eyebrow text-ink/40">
                  <span>{formatSeconds(PRICING.song.minSeconds)}</span>
                  <span>{formatSeconds(PRICING.song.maxSeconds)}</span>
                </div>
              </Field>

              {/* Concept */}
              <Field
                label="Video concept / idea"
                required
                hint="The more detail the better."
              >
                <textarea
                  rows={5}
                  required
                  value={state.concept}
                  onChange={(e) => setField("concept", e.target.value)}
                  placeholder="Describe the vision. Mood, references, narrative beats, characters, world…"
                  className="mt-4 w-full resize-y rounded-md border border-hair bg-paper p-4 font-sans text-base text-ink placeholder:text-ink/30 focus:border-gold focus:bg-white focus:outline-none"
                />
              </Field>

              {/* Steppers row */}
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <Field label="Consistent characters" hint="Locked likeness across shots.">
                  <Stepper
                    value={state.characters}
                    min={1}
                    onChange={(n) => setField("characters", n)}
                    aria-label="Number of consistent characters"
                  />
                </Field>
                <Field label="Consistent scenes / locations" hint="Unique worlds to render.">
                  <Stepper
                    value={state.scenes}
                    min={1}
                    onChange={(n) => setField("scenes", n)}
                    aria-label="Number of consistent scenes"
                  />
                </Field>
              </div>

              {/* Visual style */}
              <Field label="Visual style" hint="Doesn't affect price. Just direction.">
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                  <select
                    value={state.styleIsOther ? "__other__" : state.style}
                    onChange={(e) => {
                      if (e.target.value === "__other__") {
                        setState((p) => ({ ...p, styleIsOther: true, style: "" }));
                      } else {
                        setState((p) => ({ ...p, styleIsOther: false, style: e.target.value }));
                      }
                    }}
                    className="w-full appearance-none rounded-md border border-hair bg-paper px-4 py-3 font-sans text-base text-ink focus:border-gold focus:bg-white focus:outline-none"
                  >
                    {PRICING.stylePresets.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="__other__">Other…</option>
                  </select>
                </div>
                {state.styleIsOther && (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Describe the style"
                    value={state.style}
                    onChange={(e) => setField("style", e.target.value)}
                    className="mt-3 w-full rounded-md border border-hair bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-ink/30 focus:border-gold focus:bg-white focus:outline-none"
                  />
                )}
              </Field>

              {/* Turnaround */}
              <Field label="Turnaround">
                <div role="radiogroup" aria-label="Turnaround" className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {(Object.keys(PRICING.turnaround) as TurnaroundKey[]).map((k) => {
                    const t = PRICING.turnaround[k];
                    const active = state.turnaround === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setField("turnaround", k)}
                        className={`group rounded-md border p-4 text-left transition-all duration-300 ease-editorial ${
                          active
                            ? "border-gold bg-gold/5"
                            : "border-hair bg-paper hover:border-ink/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-display text-lg ${active ? "text-gold" : "text-ink"}`}>
                            {t.label}
                          </span>
                          <span className={`font-sans text-xs ${active ? "text-gold" : "text-ink/50"}`}>
                            {t.surcharge === 0 ? "Included" : `+${money(t.surcharge)}`}
                          </span>
                        </div>
                        <div className="mt-1 font-sans text-[11px] uppercase tracking-eyebrow text-ink/50">
                          {t.window}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* Add-ons */}
              <Field label="Add-ons">
                <div className="mt-4 space-y-3">
                  <AddOn
                    label="Lip-sync accuracy"
                    sub={`+${Math.round(PRICING.lipSyncPct * 100)}% of subtotal`}
                    on={state.lipSync}
                    onChange={(v) => setField("lipSync", v)}
                  />
                  <AddOn
                    label="Revisions package"
                    sub={`+${money(PRICING.revisionsPackageFlat)} flat`}
                    on={state.revisions}
                    onChange={(v) => setField("revisions", v)}
                  />
                </div>
              </Field>
            </div>
          </Reveal>

          {/* ─── SUMMARY CARD ─── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-ink text-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.5)]">
                {/* gold ambient gradient inside the card */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(70% 50% at 90% 0%, rgba(200,162,75,0.20) 0%, transparent 60%), radial-gradient(60% 40% at 0% 100%, rgba(200,162,75,0.10) 0%, transparent 60%)",
                  }}
                />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

                <div className="relative p-7 md:p-9">
                  <p className="font-sans text-[11px] uppercase tracking-eyebrow text-gold">
                    Your estimate
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-4xl tracking-tight text-gradient-gold md:text-5xl">
                      {money(computed.low)}
                    </span>
                    <span className="font-display text-2xl text-white/40">—</span>
                    <span className="font-display text-4xl tracking-tight text-gradient-gold md:text-5xl">
                      {money(computed.high)}
                    </span>
                  </div>

                  <p className="mt-2 font-sans text-xs text-white/50">
                    Midpoint {moneyExact(computed.total)} · range ±{Math.round(PRICING.rangePct * 100)}%
                  </p>

                  <div className="my-7 h-px w-full bg-white/10" />

                  {/* Itemized */}
                  <ul className="space-y-3">
                    {computed.lines.map((l, i) => (
                      <li
                        key={i}
                        className="flex items-start justify-between gap-4 font-sans text-[13px]"
                      >
                        <span className="text-white/70">{l.label}</span>
                        <span className="shrink-0 tabular-nums text-white">
                          {l.amount === 0 ? "—" : moneyExact(l.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="my-6 h-px w-full bg-white/10" />

                  {/* Disclaimer */}
                  <p className="rounded-md border border-gold/30 bg-gold/10 p-3 font-sans text-xs leading-relaxed text-gold">
                    This is a preliminary estimate only. For an accurate quote,
                    please contact us.
                  </p>

                  <a
                    href="#contact"
                    className="mt-6 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-sans text-sm font-medium text-ink transition-all duration-300 hover:brightness-110"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #e7d9b2 0%, #c8a24b 50%, #9a7a2e 100%)",
                      boxShadow:
                        "0 1px 0 rgba(255,255,255,0.45) inset, 0 12px 30px -10px rgba(200,162,75,0.6)",
                    }}
                  >
                    Request This Quote
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Sub-components ------------------------------------------------ */

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="font-sans text-[12px] uppercase tracking-eyebrow text-ink/70">
          {label}
          {required && <span className="ml-1 text-gold">*</span>}
        </label>
        {hint && (
          <span className="font-sans text-xs text-ink/40">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Stepper({
  value,
  min = 1,
  max = 99,
  onChange,
  ...rest
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
  "aria-label"?: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className="mt-4 inline-flex items-center gap-1 rounded-full border border-hair bg-paper p-1"
      role="group"
      aria-label={rest["aria-label"]}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <span className="min-w-[44px] text-center font-display text-xl tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        aria-label="Increase"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-white hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function AddOn({
  label,
  sub,
  on,
  onChange,
}: {
  label: string;
  sub: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!on);
        }
      }}
      className={`flex w-full items-center justify-between rounded-md border p-4 text-left transition-colors ${
        on ? "border-gold bg-gold/5" : "border-hair bg-paper hover:border-ink/30"
      }`}
    >
      <div>
        <div className={`font-display text-lg ${on ? "text-gold" : "text-ink"}`}>
          {label}
        </div>
        <div className="font-sans text-[11px] uppercase tracking-eyebrow text-ink/50">
          {sub}
        </div>
      </div>
      <span className="toggle" data-on={on} aria-hidden="true" />
    </button>
  );
}
