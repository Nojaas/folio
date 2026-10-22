"use client";

import { AvailabilityDot } from "@/app/components/AvailabilityDot";
import { ContentRail, Section } from "@/app/components/Section";
import { SectionTitleReveal } from "@/app/components/SectionTitleReveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function AvailabilitySection() {
  const { t, locale } = useLocale();
  const copy = t.availability;

  const secondary = [
    {
      key: "location",
      primary: copy.location.primary,
      detail: copy.location.detail,
    },
    {
      key: "engagement",
      primary: copy.engagement.primary,
      detail: copy.engagement.detail,
    },
  ];

  return (
    <Section
      id="availability"
      className="flex w-full flex-col justify-center space-y-14 py-24 sm:space-y-16 sm:py-32"
      aria-label={copy.label}
    >
      <SectionTitleReveal
        key={`availability-title-${locale}`}
        className="px-2.5 text-4xl font-bold tracking-tighter text-foreground sm:text-5xl"
      >
        <h2>{copy.title}</h2>
      </SectionTitleReveal>

      <ContentRail>
        <div className="space-y-8">
          <div className="space-y-3 border-b border-foreground/10 pb-8">
            <p className="font-display inline-flex items-center gap-2.5 text-[clamp(2.25rem,7vw,3.75rem)] leading-[0.95] font-bold tracking-tighter text-foreground">
              <AvailabilityDot
                delayMs={400}
                className="size-2.5 text-foreground sm:size-3"
              />
              {copy.status.badge}
            </p>
            <p className="max-w-md text-sm text-muted-foreground sm:text-[15px]">
              {copy.status.detail}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
            {secondary.map((fact) => (
              <div key={fact.key} className="space-y-1">
                <p className="font-display text-xl font-bold tracking-tight text-foreground sm:text-xl">
                  {fact.primary}
                </p>
                <p className="text-sm text-muted-foreground">{fact.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentRail>
    </Section>
  );
}
