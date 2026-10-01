import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Difference } from "@/components/Difference";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Models } from "@/components/Models";
import { Process } from "@/components/Process";
import { Estimator } from "@/components/Estimator";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { EstimateProvider } from "@/components/EstimateContext";

/**
 * /ai-video — the AI music video studio pitch page.
 *
 * Hero → Difference → Work → Services → Models → Process → Estimator → Contact.
 *
 * The Estimator and Contact share live state via EstimateProvider so clicking
 * "Request This Quote" in the Estimator carries selections into the Contact form.
 *
 * Newsletter signup intentionally lives only on the home page (/) — single
 * surface so the subscriber flow stays focused.
 */
export default function AiVideoPage() {
  return (
    <main>
      <Nav />
      <Hero />
      <Difference />
      <Work />
      <Services />
      <Models />
      <Process />
      <EstimateProvider>
        <Estimator />
        <Contact />
      </EstimateProvider>
      <Footer />
    </main>
  );
}
