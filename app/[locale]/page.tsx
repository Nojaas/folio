"use client";

import { AboutSection } from "@/app/components/AboutSection";
import { HeroMetallicTitle } from "@/app/components/HeroMetallicTitle";
import { ScrollProgress } from "@/app/components/ScrollProgress";
import { SiteNav } from "@/app/components/SiteNav";
import { DATA } from "@/data/resume";
import dynamic from "next/dynamic";

const ScrollStrandsBackground = dynamic(
  () =>
    import("@/app/components/ScrollStrandsBackground").then((m) => ({
      default: m.ScrollStrandsBackground,
    })),
  { ssr: false },
);
const ProjectsSection = dynamic(() =>
  import("@/app/components/ProjectsSection").then((m) => ({
    default: m.ProjectsSection,
  })),
);
const StackSection = dynamic(() =>
  import("@/app/components/StackSection").then((m) => ({
    default: m.StackSection,
  })),
);
const AvailabilitySection = dynamic(() =>
  import("@/app/components/AvailabilitySection").then((m) => ({
    default: m.AvailabilitySection,
  })),
);
const ContactSection = dynamic(() =>
  import("@/app/components/ContactSection").then((m) => ({
    default: m.ContactSection,
  })),
);
const Footer = dynamic(() =>
  import("@/app/components/Footer").then((m) => ({ default: m.Footer })),
);

export default function HomePage() {
  return (
    <>
      <ScrollStrandsBackground />
      <div className="absolute inset-x-0 top-0 z-50">
        <SiteNav />
      </div>
      <ScrollProgress />
      {/* svh not dvh: Safari resizes dvh when the URL bar toggles on scroll reverse → jank */}
      <main className="relative z-10 flex min-h-[100svh] w-full max-w-[100vw] flex-col overflow-x-hidden pb-[max(5.5rem,env(safe-area-inset-bottom))] md:pb-0">
        <section
          id="home"
          className="relative flex h-[100svh] flex-col justify-end px-2.5 pb-2 sm:pb-3"
        >
          <div className="w-full">
            <HeroMetallicTitle name={DATA.name} />
          </div>
        </section>

        <AboutSection />
        <ProjectsSection />
        <StackSection />
        <AvailabilitySection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
