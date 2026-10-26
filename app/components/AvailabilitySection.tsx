"use client";

import { AvailabilityDot } from "@/app/components/AvailabilityDot";
import { LineContentReveal } from "@/app/components/LineContentReveal";
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
        <div className="flex flex-col">
          <LineContentReveal index={0} leadingLine={false}>
            {/* pb-6 matches divider gutters on mobile (same rhythm as facts below) */}
            <div className="space-y-3 pb-6 sm:pb-8">
              <p className="font-display inline-flex items-center gap-2.5 text-4xl leading-[0.95] font-bold tracking-tighter text-foreground sm:text-5xl">
                <AvailabilityDot
                  delayMs={520}
                  className="size-2.5 text-foreground sm:size-3"
                />
                {copy.status.badge}
              </p>
              <p className="max-w-md text-sm text-muted-foreground sm:text-[15px]">
                {copy.status.detail}
              </p>
            </div>
          </LineContentReveal>

          <LineContentReveal index={1} leadingLine>
            <div className="grid max-w-xl grid-cols-1 gap-0 pt-6 sm:grid-cols-2 sm:gap-x-10 sm:pt-8">
              {secondary.map((fact, i) => (
                <div
                  key={fact.key}
                  className={
                    i > 0
                      ? "space-y-1 border-t border-foreground/10 pt-6 sm:border-t-0 sm:pt-0"
                      : "space-y-1 pb-6 sm:pb-0"
                  }
                >
                  <p className="font-display text-xl font-bold tracking-tight text-foreground">
                    {fact.primary}
                  </p>
                  <p className="text-sm text-muted-foreground">{fact.detail}</p>
                </div>
              ))}
            </div>
          </LineContentReveal>
        </div>
      </ContentRail>
    </Section>
  );
}
