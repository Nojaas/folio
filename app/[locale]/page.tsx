"use client";

import { Contact } from "@/app/components/Contact";
import { Footer } from "@/app/components/Footer";
import { HeroTitle } from "@/app/components/HeroTitle";
import { ProjectsList } from "@/app/components/ProjectsList";
import { ScrollLineReveal } from "@/app/components/ScrollLineReveal";
import { ScrollProgress } from "@/app/components/ScrollProgress";
import { ContentRail, Section } from "@/app/components/Section";
import SiteNav from "@/app/components/SiteNav";
import { TechVelocity } from "@/app/components/TechVelocity";
import { DATA } from "@/data/resume";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function isExternal(href?: string) {
  return Boolean(href && /^https?:\/\//.test(href));
}

export default function HomePage() {
  const { t, locale } = useLocale();

  const projects = DATA.projects.map((project) => ({
    ...project,
    description: t.projects.items[project.id],
  }));

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-50">
        <SiteNav />
      </div>
      <ScrollProgress />
      <main className="flex min-h-[100dvh] flex-col">
        <section
          id="home"
          className="relative flex h-[100dvh] flex-col justify-end overflow-x-hidden px-2.5 pb-3"
        >
          <div className="w-full overflow-x-hidden overflow-y-visible">
            <HeroTitle />
          </div>
        </section>

        <section
          id="about"
          className="relative flex min-h-[100dvh] flex-col justify-center py-24 sm:py-32"
        >
          <ContentRail>
            <ScrollLineReveal
              key={locale}
              className="text-pretty text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-2xl"
            >
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </ScrollLineReveal>
          </ContentRail>
        </section>

        <TechVelocity />

        <Section
          id="projects"
          className="flex min-h-[100dvh] w-full flex-col justify-center space-y-12 py-24 sm:py-32"
        >
          <ScrollLineReveal
            key={`projects-title-${locale}`}
            lockWhenComplete
            className="pl-[2.5rem] text-3xl font-bold tracking-tighter text-foreground sm:text-5xl"
          >
            <h2>
              {t.projects.titleLine1} <br />
              {t.projects.titleLine2}
            </h2>
          </ScrollLineReveal>

          <ContentRail>
            <ProjectsList projects={projects} isExternal={isExternal} />
          </ContentRail>
        </Section>

        <Contact />
        <Footer />
      </main>
    </>
  );
}
