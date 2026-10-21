"use client";

import { AvailabilityDot } from "@/app/components/AvailabilityDot";
import { LineContentReveal } from "@/app/components/LineContentReveal";
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
        <div className="flex flex-col">
          {rows.map((row, index) => {
            const isLast = index === rows.length - 1;

            return (
              <LineContentReveal
                key={`${locale}-${row.key}`}
                index={index}
                leadingLine={index > 0}
                trailingLine={isLast}
              >
                <div className="space-y-2 py-5 sm:py-6">
                  <p className="font-display text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                    {row.primary}
                  </p>
                  <p className="text-sm text-muted-foreground sm:text-[15px]">
                    {row.detail}
                  </p>
                </div>
              </LineContentReveal>
            );
          })}
        </div>
      </ContentRail>
    </Section>
  );
}
