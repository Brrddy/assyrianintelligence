"use client";

import { useState } from "react";
import { CONTACT } from "@/config/site";
import {
  formatSummary,
  useEstimate,
} from "./EstimateContext";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/* ----------------------------------------------------------------------------
 * Delivery method — direct POST, no email client needed.
 *
 * Default backend: Formspree (free tier, no server code, no API keys).
 * Set CONTACT.formEndpoint in config/site.ts.
 *
 * TO SWAP IN ANOTHER PROVIDER (Resend / Web3Forms / your own API route):
 *   replace the body of `submitContact()` below — single swap point.
 * -------------------------------------------------------------------------- */

type FormFields = {
  name: string;
  email: string;
  message: string;
};

const initialForm: FormFields = { name: "", email: "", message: "" };

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const { state, compute, formatSeconds } = useEstimate();
  const [form, setForm] = useState<FormFields>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const computed = compute();
  const summary = formatSummary(state, computed, formatSeconds);

  // === SWAP POINT =========================================================
  // Replace this function to use a different provider. The payload object
  // contains everything (form fields + estimate summary + raw selections).
  // ========================================================================
  const submitContact = async (payload: Record<string, unknown>) => {
    const endpoint = CONTACT.formEndpoint;

    if (!endpoint || endpoint.startsWith("TODO")) {
      throw new Error(
        "Form not configured. Set CONTACT.formEndpoint in config/site.ts."
      );
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const turnaroundLabel =
      state.turnaround === "standard"
        ? "Standard"
        : state.turnaround === "priority"
        ? "Priority"
        : "Express";

    const payload = {
      // Formspree-friendly fields
      _subject: `Quote request — ${form.name || "new client"}`,
      name: form.name,
      email: form.email,
      message: form.message || "(no message)",

      // Full estimate as a single readable block (lands cleanly in any inbox)
      estimate_summary: summary,

      // Structured selections (in case you wire this to a CRM later)
      song_length: formatSeconds(state.seconds),
      characters: state.characters,
      scenes: state.scenes,
      style: state.style,
      turnaround: turnaroundLabel,
      lipSync: state.lipSync ? "Yes" : "No",
      revisionsPackage: state.revisions ? "Yes" : "No",
      estimated_range_low: Math.round(computed.low),
      estimated_range_high: Math.round(computed.high),
      estimated_midpoint: Math.round(computed.total),
    };

    try {
      await submitContact(payload);
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-white py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aura-gold" />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionHeader
          eyebrow="Contact"
          title={
            <>
              Let&apos;s make something{" "}
              <span className="italic text-gold">unforgettable.</span>
            </>
          }
          lede="Send your selections — we'll respond within 48 hours with a firm quote and next steps."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* ─── Form ─── */}
          <Reveal>
            {status === "sent" ? (
              <SuccessPanel onReset={resetForm} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="name"
                  label="Name"
                  required
                  disabled={status === "sending"}
                  value={form.name}
                  onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  required
                  disabled={status === "sending"}
                  value={form.email}
                  onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                />
                <div>
                  <label
                    htmlFor="message"
                    className="font-sans text-[12px] uppercase tracking-eyebrow text-ink/70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    disabled={status === "sending"}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Anything else we should know?"
                    className="mt-3 w-full resize-y rounded-md border border-hair bg-white p-4 font-sans text-base text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-gold disabled:cursor-wait disabled:opacity-80"
                  >
                    {status === "sending" ? (
                      <>
                        <Spinner />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Estimate
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {status === "error" && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <strong className="font-sans">Couldn't send.</strong>{" "}
                    {errorMsg}
                  </div>
                )}

                <p className="pt-1 font-sans text-xs text-ink/40">
                  Submitting sends your full estimate — every selection, the
                  itemized breakdown, and the price range — straight to our inbox.
                </p>
              </form>
            )}
          </Reveal>

          {/* ─── Side panel: live attached summary preview ─── */}
          <Reveal delay={0.1}>
            <aside className="relative overflow-hidden rounded-xl border border-hair bg-paper p-6 md:p-8 shadow-[0_20px_50px_-30px_rgba(200,162,75,0.25)]">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              <div className="flex items-center justify-between">
                <p className="font-sans text-[11px] uppercase tracking-eyebrow text-gold">
                  Attached to your message
                </p>
                <span className="font-sans text-[11px] text-ink/40">
                  Auto-synced
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">
                Your live estimate
              </h3>

              <ul className="mt-6 space-y-3 font-sans text-sm">
                <Row k="Song length" v={formatSeconds(state.seconds)} />
                <Row k="Characters" v={String(state.characters)} />
                <Row k="Scenes" v={String(state.scenes)} />
                <Row k="Style" v={state.style || "—"} />
                <Row
                  k="Turnaround"
                  v={`${
                    state.turnaround === "standard"
                      ? "Standard"
                      : state.turnaround === "priority"
                      ? "Priority"
                      : "Express"
                  }`}
                />
                <Row
                  k="Add-ons"
                  v={
                    [
                      state.lipSync ? "Lip-sync" : null,
                      state.revisions ? "Revisions" : null,
                    ]
                      .filter(Boolean)
                      .join(", ") || "None"
                  }
                />
              </ul>

              <div className="my-6 h-px w-full bg-hair" />

              <div className="flex items-baseline justify-between">
                <span className="font-sans text-[11px] uppercase tracking-eyebrow text-ink/60">
                  Estimated range
                </span>
                <span className="font-display text-2xl tracking-tight text-ink">
                  {computed.low.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}{" "}
                  –{" "}
                  {computed.high.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>

              <p className="mt-4 font-sans text-[11px] leading-relaxed text-ink/40">
                Preliminary estimate. The full itemized breakdown is included
                in your email automatically.
              </p>
            </aside>
          </Reveal>
        </div>

        {/* Contact details */}
        <Reveal delay={0.15}>
          <div className="mt-16 border-t border-hair pt-10">
            <ContactLine label="Email" value={CONTACT.email} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- helpers ------------------------------------------------------- */

function Input({
  id,
  label,
  type = "text",
  required,
  disabled,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-sans text-[12px] uppercase tracking-eyebrow text-ink/70"
      >
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-md border border-hair bg-white px-4 py-3 font-sans text-base text-ink focus:border-gold focus:outline-none disabled:opacity-60"
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-white p-8 md:p-10">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,162,75,0.25) 0%, transparent 70%)",
        }}
      />
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-white"
        style={{
          background:
            "linear-gradient(135deg, #E7D9B2 0%, #C8A24B 60%, #9A7A2E 100%)",
          boxShadow: "0 12px 30px -10px rgba(200,162,75,0.6)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="mt-6 font-display text-3xl tracking-tight text-ink">
        Sent. Talk soon.
      </h3>
      <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-ink/65">
        Your estimate landed in our inbox with every detail. Expect a reply
        within 48 hours with a firm quote and next steps.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 font-sans text-sm text-gold underline-offset-4 hover:underline"
      >
        Send another →
      </button>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span className="font-sans text-[11px] uppercase tracking-eyebrow text-ink/50">
        {k}
      </span>
      <span className="text-right font-sans text-sm text-ink">{v}</span>
    </li>
  );
}

function ContactLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="font-sans text-[11px] uppercase tracking-eyebrow text-gold">
        {label}
      </div>
      <div className="mt-2 break-words font-display text-lg tracking-tight text-ink">
        {value}
      </div>
    </div>
  );
}
