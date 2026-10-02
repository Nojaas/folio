"use client";

import { DownFastLink } from "@/app/components/DownFastLink";
import { localePath } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, t } = useLocale();
  const next = locale === "fr" ? "en" : "fr";

  return (
    <DownFastLink
      label={next.toUpperCase()}
      href={localePath(next)}
      className={cn(
        "text-[13px] uppercase tracking-tight text-foreground",
        className,
      )}
      aria-label={locale === "fr" ? t.nav.switchToEn : t.nav.switchToFr}
    />
  );
}
