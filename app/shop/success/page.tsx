import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Order confirmed — Assyrian Intelligence" };

export default function SuccessPage() {
  return (
    <main className="bg-paper">
      <Nav />
      <section className="relative isolate overflow-hidden pt-40 pb-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aura-gold" />
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="eyebrow">Order confirmed</p>
          <h1 className="mt-5 font-display text-[40px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[60px]">
            Tawdi — <span className="italic text-gradient-gold">thank you.</span>
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-ink/65">
            Your piece is being made to order. A receipt is on its way to your email, and
            you&apos;ll get tracking as soon as it ships (usually 5–10 business days).
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link href="/shop" className="btn-ghost">Back to the shop</Link>
            <Link href="/" className="btn-gold">Home</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
