import type { Locale } from "@/lib/i18n/dictionaries";

export const LOCALE_COOKIE = "folio-locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Best supported locale from Accept-Language (default: fr). */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "fr";

  const tags = header
    .split(",")
    .map((part) => {
      const [range, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const code = range?.split("-")[0]?.toLowerCase() ?? "";
      const q = qParam ? Number(qParam.split("=")[1]) || 0 : 1;
      return { code, q };
    })
    .filter((t) => t.code)
    .sort((a, b) => b.q - a.q);

  for (const { code } of tags) {
    if (code === "en") return "en";
    if (code === "fr") return "fr";
  }

  return "fr";
}

export function isLocaleCookie(value: string | undefined): value is Locale {
  return value === "en" || value === "fr";
}
