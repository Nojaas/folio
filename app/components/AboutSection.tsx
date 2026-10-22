"use client";

import { AboutCvBadge } from "@/app/components/AboutCvBadge";
import { ContentRail } from "@/app/components/Section";
import { SectionTitleReveal } from "@/app/components/SectionTitleReveal";
import ScrollReveal from "@/components/ScrollReveal";
import { MOBILE_MAX } from "@/lib/constants/layout";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useEffect, useState } from "react";

const BODY_TEXT =
  "space-y-6 text-pretty text-lg font-medium leading-tight tracking-tight text-foreground sm:space-y-8 sm:text-xl";

/** ScrollReveal defaults — tweak presets here */
const REVEAL = {
  textClassName: BODY_TEXT,
  mode: "scrub" as const,
  splitBy: "words" as const,
  effect: "fade" as const,
  stagger: 0.05,
  duration: 0.4,
  smoothing: 1,
  baseOpacity: 0.1,
  baseRotation: 0,
  baseOffset: 0,
  enableBlur: false,
  blurStrength: 0,
  /** Only true Safari (not Chrome iOS) remaps scrub → enter */
  safariEnterFallback: true,
};

const END_DESKTOP = "bottom 90% bottom 90%";
const END_MOBILE = "center center";

export function AboutSection() {
  const { t, locale } = useLocale();
  const [wordAnimationEnd, setWordAnimationEnd] = useState(END_DESKTOP);
  const body = [
    `${t.about.lead} ${t.about.p1}`,
    t.about.p2,
    `${t.about.p3Available}${t.about.p3Rest}`,
  ].join("\n\n");

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const sync = () =>
      setWordAnimationEnd(mq.matches ? END_MOBILE : END_DESKTOP);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
        {/*
          Hang first line mid-column via float spacer (not text-indent —
          indent breaks ScrollReveal's inline-block words).
        */}
        <div className="about-lead-hang">
          <ScrollReveal
            key={`about-body-${locale}-${wordAnimationEnd}`}
            {...REVEAL}
            wordAnimationEnd={wordAnimationEnd}
          >
            {body}
          </ScrollReveal>
        </div>
        <div className="mt-6 flex justify-center">
          <AboutCvBadge />
        </div>
      </ContentRail>
    </section>
  );
}
