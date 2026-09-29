import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/ui/Nav";

// Below the fold: still server-rendered, but their animation code is split
// into separate chunks so it doesn't hold up the hero's hydration.
const Marquee = dynamic(() => import("@/components/ui/Marquee"));
const KineticWords = dynamic(() => import("@/components/sections/KineticWords"));
const Intro = dynamic(() => import("@/components/sections/Intro"));
const Services = dynamic(() => import("@/components/sections/Services"));
const ProcessStepper = dynamic(() => import("@/components/sections/ProcessStepper"));
const Results = dynamic(() => import("@/components/sections/Results"));
const ScaleSection = dynamic(() => import("@/components/sections/ScaleSection"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <Marquee />
        <KineticWords />
        <Intro />
        <Services />
        <ProcessStepper />
        <Results />
        <ScaleSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
