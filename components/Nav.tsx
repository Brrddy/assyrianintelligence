"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { href: "#work",       label: "Work" },
  { href: "#services",   label: "Services" },
  { href: "#models",     label: "Stack" },
  { href: "#process",    label: "Process" },
  { href: "#estimator",  label: "Estimator" },
  { href: "#contact",    label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Track scroll position — drives both the wordmark fade and the
  // nav's translucent / bordered "scrolled" treatment.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`safe-top safe-x fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ease-editorial ${
        scrolled
          ? "border-hair bg-white/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(200,162,75,0.08)]"
          : "border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <a
          href="#top"
          aria-label="Assyrian Intelligence — home"
          className="shrink-0"
        >
          <Wordmark size="sm" />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-sans text-[13px] text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#estimator" className="btn-gold hidden md:inline-flex">
            Get an Estimate
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — animates open via max-height + opacity. */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-hair bg-white transition-[max-height,opacity] duration-500 ease-editorial md:hidden ${
          open ? "max-h-[420px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-sans text-base text-ink/80 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#estimator"
              onClick={() => setOpen(false)}
              className="btn-gold w-full"
            >
              Get an Estimate
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
