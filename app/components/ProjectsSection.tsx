"use client";

import { ProjectsFlowingMenu } from "@/app/components/ProjectsFlowingMenu";
import { ContentRail, Section } from "@/app/components/Section";
import { SectionTitleReveal } from "@/app/components/SectionTitleReveal";
import { DATA } from "@/data/resume";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function ProjectsSection() {
  const { t, locale } = useLocale();

  const projects = DATA.projects.map((project) => ({
    ...project,
    description: t.projects.items[project.id],
  }));

  return (
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
  );
}
