"use client";

import { WORK } from "@/config/site";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/* ----------------------------------------------------------------------------
 * PAST WORK / EMBED GALLERY
 *
 *   To add a real video, open `config/site.ts` and replace each
 *   `embedUrl: "PLACEHOLDER_..."` with a real YouTube or Facebook embed URL:
 *
 *     YouTube:  https://www.youtube.com/embed/VIDEO_ID
 *     Facebook: https://www.facebook.com/plugins/video.php?href=ENCODED_URL
 *
 *   Make sure `provider` matches ("youtube" | "facebook").
 * -------------------------------------------------------------------------- */

export function Work() {
  return (
    <section id="work" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionHeader
          eyebrow="Recent Work"
          title={
            <>
              The shots. <span className="italic text-gold">The world.</span>
            </>
          }
          lede="A selection from recent music video productions. Each piece is end-to-end ours — from treatment to finishing."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2 md:gap-10">
          {WORK.map((item, i) => (
            <Reveal key={item.id} delay={(i % 2) * 0.05}>
              <article className="group">
                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-paper ring-1 ring-hair">
                  {isPlaceholder(item.embedUrl) ? (
                    <PlaceholderCard token={item.embedUrl} />
                  ) : (
                    <iframe
                      src={item.embedUrl}
                      title={item.title}
                      className="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-xl tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-ink/55">
                      {item.caption}
                    </p>
                  </div>
                  <span className="mt-1 shrink-0 font-sans text-[11px] uppercase tracking-eyebrow text-ink/40">
                    {String(i + 1).padStart(2, "0")} / {String(WORK.length).padStart(2, "0")}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function isPlaceholder(s: string) {
  return /^PLACEHOLDER_/.test(s);
}

function PlaceholderCard({ token }: { token: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-paper p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M5 4l14 8-14 8V4z" fill="#C8A24B" />
        </svg>
      </div>
      <p className="font-sans text-[11px] uppercase tracking-eyebrow text-ink/50">
        Paste embed URL
      </p>
      <code className="font-sans text-xs text-ink/40">{token}</code>
    </div>
  );
}
