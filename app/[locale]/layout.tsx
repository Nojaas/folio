import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/constants/site";
import { isLocale, type Locale } from "@/lib/i18n/dictionaries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const isEn = locale === "en";
  const path = isEn ? "/en" : "/";

  return {
    alternates: {
      canonical: path,
      languages: {
        fr: "/",
        en: "/en",
      },
    },
    openGraph: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}${isEn ? "/en" : ""}`,
      locale: isEn ? "en_US" : "fr_FR",
      alternateLocale: isEn ? ["fr_FR"] : ["en_US"],
    },
  };
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
