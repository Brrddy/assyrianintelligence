import { Nav } from "@/components/Nav";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

/**
 * Standalone contact page.
 *
 * No EstimateProvider wrapper → <Contact /> renders in general-contact mode:
 * no estimate side panel, submit button reads "Send Message", payload is just
 * name/email/message. For the AI-video quote flow, see /ai-video.
 */
export default function ContactPage() {
  return (
    <main>
      <Nav />
      {/* Top padding gives the fixed nav visual breathing room. */}
      <div className="pt-20 md:pt-24">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
