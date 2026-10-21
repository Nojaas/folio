"use client";

import { AboutSection } from "@/app/components/AboutSection";
import { AvailabilitySection } from "@/app/components/AvailabilitySection";
import { ContactSection } from "@/app/components/ContactSection";
import { Footer } from "@/app/components/Footer";
import { HeroMetallicTitle } from "@/app/components/HeroMetallicTitle";
import { ProjectsSection } from "@/app/components/ProjectsSection";
import { ScrollProgress } from "@/app/components/ScrollProgress";
import { ScrollStrandsBackground } from "@/app/components/ScrollStrandsBackground";
import { SiteNav } from "@/app/components/SiteNav";
import { StackSection } from "@/app/components/StackSection";
import { DATA } from "@/data/resume";

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
          className="relative flex h-[100svh] flex-col justify-end px-2.5 pb-0"
        >
          <div className="w-full">
            <HeroMetallicTitle text={`${DATA.name}.`} />
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
