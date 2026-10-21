"use client";

import { AboutCvBadge } from "@/app/components/AboutCvBadge";
import { ContentRail } from "@/app/components/Section";
import { SectionTitleReveal } from "@/app/components/SectionTitleReveal";
import ScrollReveal from "@/components/ScrollReveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const BODY_TEXT =
  "space-y-6 text-pretty text-lg font-medium leading-tight tracking-tight text-foreground sm:space-y-8 sm:text-xl";

/** ScrollReveal defaults — tweak presets here */
const REVEAL = {
  textClassName: BODY_TEXT,
  mode: "scrub",
  splitBy: "words",
  effect: "fade",
  stagger: 0.05,
  duration: 0.4,
  smoothing: 0.8,
  wordAnimationEnd: "bottom 90% bottom 90%",
  baseOpacity: 0.1,
  baseRotation: 0,
  baseOffset: 0,
  enableBlur: false,
  blurStrength: 0,
} as const;

export function AboutSection() {
  const { t, locale } = useLocale();
  const body = [
    t.about.p1,
    t.about.p2,
    `${t.about.p3Available}${t.about.p3Rest}`,
  ].join("\n\n");

  return (
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
        <ScrollReveal key={`about-body-${locale}`} {...REVEAL}>
          {body}
        </ScrollReveal>
        <div className="mt-6 flex justify-center">
          <AboutCvBadge />
        </div>
      </ContentRail>
    </section>
  );
}
