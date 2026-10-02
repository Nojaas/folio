import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { isLocale, type Locale } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
