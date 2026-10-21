"use client";

import { DownFastLink } from "@/app/components/DownFastLink";
import { localePath } from "@/lib/i18n/dictionaries";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
} from "@/lib/i18n/locale-cookie";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  className?: string;
  /** `island` — muted white for the Dynamic Island shell */
  tone?: "page" | "island";
};

export function LanguageToggle({
  className,
  tone = "page",
}: LanguageToggleProps) {
  const { locale, t } = useLocale();
  const next = locale === "fr" ? "en" : "fr";

  return (
    <DownFastLink
      label={locale.toUpperCase()}
      nextLabel={next.toUpperCase()}
      href={localePath(next)}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
      }}
      className={cn(
        "text-[13px] uppercase tracking-tight",
        tone === "island"
          ? "rounded-full px-2.5 py-2.5 text-white/45 transition-colors hover:text-white/80 sm:px-2.5 sm:py-1.5"
          : "text-foreground",
        className,
      )}
      aria-label={locale === "fr" ? t.nav.switchToEn : t.nav.switchToFr}
    />
  );
}
