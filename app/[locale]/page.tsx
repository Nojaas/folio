"use client";

import { AboutAvailableLink } from "@/app/components/AboutAvailableLink";
import { AboutCvBadge } from "@/app/components/AboutCvBadge";
import { Contact } from "@/app/components/Contact";
import { Footer } from "@/app/components/Footer";
import { HeroMetallicTitle } from "@/app/components/HeroMetallicTitle";
import { ProjectsFlowingMenu } from "@/app/components/ProjectsFlowingMenu";
import { ScrollProgress } from "@/app/components/ScrollProgress";
import { ScrollStrandsBackground } from "@/app/components/ScrollStrandsBackground";
import { ContentRail, Section } from "@/app/components/Section";
import { SectionTitleReveal } from "@/app/components/SectionTitleReveal";
import { SiteNav } from "@/app/components/SiteNav";
import { StackSection } from "@/app/components/StackSection";
import { DATA } from "@/data/resume";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function HomePage() {
  const { t, locale } = useLocale();

  const projects = DATA.projects.map((project) => ({
    ...project,
    description: t.projects.items[project.id],
  }));

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

        <section
          id="about"
          className="relative flex min-h-[100svh] flex-col justify-center space-y-12 py-24 sm:py-32"
        >
          <div className="flex items-center justify-between gap-6 px-2.5">
            <SectionTitleReveal
              key={`about-title-${locale}`}
              className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl"
            >
              <h2>{t.about.title}</h2>
            </SectionTitleReveal>
          </div>

          <ContentRail>
            <div className="space-y-6 text-pretty text-lg font-medium leading-tight tracking-tight text-foreground sm:space-y-8 sm:text-xl">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>
                <AboutAvailableLink label={t.about.p3Available} />
                {t.about.p3Rest}
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <AboutCvBadge />
            </div>
          </ContentRail>
        </section>

        <Section
          id="projects"
          className="flex min-h-[100svh] w-full flex-col justify-center space-y-12 py-24 sm:py-32"
        >
          <SectionTitleReveal
            key={`projects-title-${locale}`}
            className="px-2.5 text-4xl font-bold tracking-tighter text-foreground sm:text-5xl"
          >
            <h2>
              {t.projects.titleLine1} <br />
              {t.projects.titleLine2}
            </h2>
          </SectionTitleReveal>

          <ContentRail>
            <ProjectsFlowingMenu
              key={`projects-flow-${locale}`}
              projects={projects}
              aria-label={t.projects.titleLine1}
            />
          </ContentRail>
        </Section>

        <StackSection />

        <Contact />
        <Footer />
      </main>
    </>
  );
}
