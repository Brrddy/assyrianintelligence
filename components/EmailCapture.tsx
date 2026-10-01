"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "subscribed" | "error";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("subscribed");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section
      id="subscribe"
      className="relative isolate overflow-hidden bg-ink py-20 text-white md:py-28"
    >
      {/* ambient gold wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(200,162,75,0.18) 0%, transparent 65%), radial-gradient(40% 40% at 90% 100%, rgba(200,162,75,0.10) 0%, transparent 60%)",
        }}
      />
      {/* top gold hairline */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
        <p className="font-sans text-[11px] uppercase tracking-eyebrow text-gold">
          <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-gradient-to-r from-transparent via-gold to-gold align-middle" />
          Dispatches
          <span className="ml-3 inline-block h-px w-8 translate-y-[-3px] bg-gradient-to-r from-gold via-gold to-transparent align-middle" />
        </p>

        <h2 className="mt-5 font-display text-[34px] leading-[1.05] tracking-[-0.015em] md:text-[52px]">
          Occasional dispatches on new work{" "}
          <span className="italic text-gradient-gold">and the tools shaping it.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-white/60">
          A short newsletter — releases, behind-the-scenes, and what we're
          watching at the frontier. No noise.
        </p>

        {status === "subscribed" ? (
          <SuccessPanel onReset={() => setStatus("idle")} />
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="subscribe-email" className="sr-only">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              autoComplete="email"
              required
              disabled={status === "sending"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-sans text-base text-white placeholder:text-white/35 backdrop-blur-sm transition-colors focus:border-gold focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "sending" || !email}
              className="btn-gold shrink-0 disabled:cursor-wait disabled:opacity-80"
            >
              {status === "sending" ? (
                <>
                  <Spinner />
                  Joining…
                </>
              ) : (
                <>
                  Join the list
                  <Arrow />
                </>
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mx-auto mt-4 max-w-lg font-sans text-sm text-red-300">
            {errorMsg}
          </p>
        )}

        <p className="mt-6 font-sans text-xs text-white/35">
          No spam. Unsubscribe any time.
        </p>
      </div>
    </section>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-ink"
        style={{
          background: "linear-gradient(135deg, #E7D9B2 0%, #C8A24B 60%, #9A7A2E 100%)",
          boxShadow: "0 12px 30px -10px rgba(200,162,75,0.6)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12l5 5L20 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="font-display text-2xl tracking-tight text-white">
        You&apos;re in.
      </p>
      <p className="font-sans text-sm text-white/55">
        Check your inbox to confirm — then we&apos;ll be in touch.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 font-sans text-xs text-gold underline-offset-4 hover:underline"
      >
        Add another email →
      </button>
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

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1 7h12M8 2l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
