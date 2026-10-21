"use client";

import { AvailabilityDot } from "@/app/components/AvailabilityDot";
import { ContentRail, Section } from "@/app/components/Section";
import { SectionTitleReveal } from "@/app/components/SectionTitleReveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function AvailabilitySection() {
  const { t, locale } = useLocale();
  const copy = t.availability;

  const rows = [
    {
      key: "status",
      primary: (
        <span className="inline-flex items-center gap-3">
          <AvailabilityDot delayMs={400} className="size-2.5 text-foreground" />
          {copy.status.badge}
        </span>
      ),
      detail: copy.status.detail,
    },
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
        <div className="relative pl-6 sm:pl-8">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 left-0 w-px bg-foreground/20"
          />
          <div className="space-y-11 sm:space-y-14">
            {rows.map((row) => (
              <div key={row.key} className="space-y-2">
                <p className="font-display text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                  {row.primary}
                </p>
                <p className="text-sm text-muted-foreground sm:text-[15px]">
                  {row.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ContentRail>
    </Section>
  );
}
