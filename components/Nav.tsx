"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

/**
 * Site-wide nav.
 *
 * Multi-page site: links are routes (not anchors). Active route is highlighted
 * in gold. The wordmark + flag always route back to the landing page.
 *
 * The "Get an Estimate" CTA jumps straight into the AI-Video page at
 * the Estimator anchor (/ai-video#estimator) from anywhere on the site.
 */
type NavLink = { href: string; label: string };

const LINKS: NavLink[] = [
  { href: "/ai-video", label: "AI Video" },
  { href: "/shop",     label: "Shop" },
  { href: "/values",   label: "Values" },
  { href: "/contact",  label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Track scroll — drives the nav's "scrolled" treatment (crisper border/shadow).
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

  // Close mobile menu when the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header
      className={`safe-top safe-x fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ease-editorial ${
        scrolled
          ? "border-hair bg-white/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(200,162,75,0.08)]"
          : "border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link
          href="/"
          aria-label="Assyrian Intelligence — home"
          className="flex shrink-0 items-center gap-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assyrian-flag.svg"
            alt=""
            aria-hidden="true"
            className="h-6 w-auto rounded-[2px] ring-1 ring-hair/60"
          />
          <Wordmark size="sm" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative font-sans text-[13px] transition-colors ${
                    active ? "text-gold" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/ai-video#estimator"
            className="btn-gold hidden md:inline-flex"
          >
            Get an Estimate
          </Link>
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

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-hair bg-white transition-[max-height,opacity] duration-500 ease-editorial md:hidden ${
          open ? "max-h-[420px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block py-2 font-sans text-base transition-colors ${
                    active ? "text-gold" : "text-ink/80 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="pt-2">
            <Link
              href="/ai-video#estimator"
              onClick={() => setOpen(false)}
              className="btn-gold w-full"
            >
              Get an Estimate
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
