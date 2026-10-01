"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "subscribed" | "error";

/**
 * Newsletter signup — slim light-themed band.
 * Designed to sit mid-page between the hero and the section tiles on /,
 * framed by two gold hairlines so it reads as an editorial divider rather
 * than a separate section.
 */
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
      className="relative isolate overflow-hidden bg-white py-14 md:py-20"
    >
      {/* super soft gold wash — reads as continuous with the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 80% at 50% 50%, rgba(200,162,75,0.07) 0%, transparent 70%)",
        }}
      />
      {/* top + bottom gold hairlines frame the band */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-8">
        <h2 className="font-display text-[26px] leading-tight tracking-[-0.015em] text-ink md:text-[36px]">
          Subscribe to our{" "}
          <span className="italic text-gradient-gold">newsletter.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink/55 md:text-base">
          Stay up to date on all things Assyrian Intelligence.
        </p>

        {status === "subscribed" ? (
          <SuccessPanel onReset={() => setStatus("idle")} />
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-7 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
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
              className="flex-1 rounded-full border border-hair bg-white px-5 py-3 font-sans text-base text-ink placeholder:text-ink/30 transition-colors focus:border-gold focus:outline-none disabled:opacity-60"
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
                  Subscribe
                  <Arrow />
                </>
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mx-auto mt-4 max-w-lg font-sans text-sm text-red-600">
            {errorMsg}
          </p>
        )}

        <p className="mt-5 font-sans text-xs text-ink/35">
          No spam. Unsubscribe any time.
        </p>
      </div>
    </section>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto mt-7 flex max-w-md flex-col items-center gap-2">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full text-white"
        style={{
          background: "linear-gradient(135deg, #E7D9B2 0%, #C8A24B 60%, #9A7A2E 100%)",
          boxShadow: "0 12px 30px -10px rgba(200,162,75,0.6)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12l5 5L20 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mt-2 font-display text-xl tracking-tight text-ink">
        You&apos;re in.
      </p>
      <p className="font-sans text-sm text-ink/55">
        Check your inbox to confirm.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-1 font-sans text-xs text-gold underline-offset-4 hover:underline"
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
