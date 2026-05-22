import type { ReactNode } from "react";

/**
 * Reveal wrapper.
 *
 * Previously used framer-motion `whileInView` + `initial: opacity 0` to do
 * a scroll-reveal effect. iOS Safari intermittently fails to trigger that
 * animation under React 19 / Next 16, leaving the entire page invisible
 * (content rendered at opacity 0 server-side and never animated to 1).
 *
 * Reveal is now a pass-through — content is always visible. We keep the
 * same component API so existing call sites don't change.
 */
export function Reveal({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  /** Retained for API compatibility; ignored. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const Tag = as as React.ElementType;
  return <Tag className={className}>{children}</Tag>;
}
