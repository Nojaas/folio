"use client";

import { LineContentReveal } from "@/app/components/LineContentReveal";
import { PillTabs } from "@/app/components/PillTabs";
import { ContentRail, Section } from "@/app/components/Section";
import { SectionTitleReveal } from "@/app/components/SectionTitleReveal";
import { StackLogoLoop } from "@/app/components/StackLogoLoop";
import { STACK_CATEGORIES, type StackCategoryId } from "@/data/stack";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useState } from "react";

export function StackSection() {
  const { t, locale } = useLocale();
  const isMobile = useIsMobile();
  const [active, setActive] = useState<StackCategoryId>("frontend");
  const [hasNavigated, setHasNavigated] = useState(false);

  const items = STACK_CATEGORIES.map((category) => ({
    id: category.id,
    label:
      category.id === "product" && isMobile
        ? t.stack.categories.product.labelShort
        : t.stack.categories[category.id].label,
  }));

  const category = STACK_CATEGORIES.find((c) => c.id === active)!;
  const copy = t.stack.categories[active];
  const rows = [copy.description, ...category.items];
  const revealSpeed = hasNavigated ? "fast" : "normal";

  return (
    <Section
      id="stack"
      className="flex w-full flex-col justify-center space-y-12 py-16 sm:py-24"
      aria-label={t.stack.label}
    >
      <SectionTitleReveal
        key={`stack-title-${locale}`}
        className="px-2.5 text-4xl font-bold tracking-tighter text-foreground sm:text-5xl"
      >
        <h2>{t.stack.title}</h2>
      </SectionTitleReveal>

      <ContentRail>
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-3">
            <StackLogoLoop category={active} />

            <div key={active} className="flex flex-col">
              {rows.map((row, index) => {
                const isDesc = index === 0;
                const isLast = index === rows.length - 1;

                return (
                  <LineContentReveal
                    key={`${active}-${isDesc ? "desc" : row}`}
                    index={index}
                    leadingLine={!isDesc}
                    trailingLine={isLast}
                    speed={revealSpeed}
                  >
                    {isDesc ? (
                      <p className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                        {row}
                      </p>
                    ) : (
                      <div className="font-display py-4 text-2xl font-bold tracking-tight text-foreground sm:py-5 sm:text-3xl md:text-4xl">
                        {row}
                      </div>
                    )}
                  </LineContentReveal>
                );
              })}
            </div>
          </div>

          <PillTabs
            items={items}
            active={active}
            wide={isMobile}
            aria-label={t.stack.categoriesLabel}
            onChange={(id) => {
              setHasNavigated(true);
              setActive(id);
            }}
            className={isMobile ? "w-full" : undefined}
          />
        </div>
      </ContentRail>
    </Section>
  );
}
