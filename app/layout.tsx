import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

/**
 * Typography — editorial pairing.
 * - Fraunces: variable display serif w/ characterful soft / opsz axes.
 * - Space Grotesk: clean modern geometric sans for body and UI.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Assyrian Intelligence — AI Music & Music Videos",
  description:
    "Original music and music videos crafted with the world's most capable AI tools, by a trained expert team.",
};

/**
 * Mobile-first viewport.
 * - `viewportFit: "cover"` makes safe-area-inset-* work under the notch / home bar.
 * - Allowing user zoom (maximumScale: 5) keeps the page accessible.
 * - themeColor controls the iOS Safari URL bar tint.
 */
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
