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

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Difference />
      <Work />
      <Services />
      <Models />
      <Process />
      {/*
        Estimator and Contact share live state via EstimateProvider.
        Clicking "Request This Quote" in the Estimator scrolls to #contact;
        the Contact form then reads the latest selections from the provider
        so the email / clipboard summary is always current.
      */}
      <EstimateProvider>
        <Estimator />
        <Contact />
      </EstimateProvider>
      <Footer />
    </main>
  );
}
