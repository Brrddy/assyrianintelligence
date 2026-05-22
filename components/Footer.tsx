import { Wordmark } from "./Wordmark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="safe-bottom safe-x relative bg-white py-10">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-8">
        <Wordmark size="sm" />
        <p className="font-sans text-xs text-ink/40">
          © {year} Assyrian Intelligence. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
