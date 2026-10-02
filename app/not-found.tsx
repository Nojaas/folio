"use client";

import { DownFastLink } from "@/app/components/DownFastLink";
import { dictionaries, localePath, type Locale } from "@/lib/i18n/dictionaries";
import { usePathname } from "next/navigation";

function localeFromPath(pathname: string | null): Locale {
  return pathname === "/en" || Boolean(pathname?.startsWith("/en/"))
    ? "en"
    : "fr";
}

export default function NotFound() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const t = dictionaries[locale];

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 sm:px-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t.notFound.title}
        </h1>
        <DownFastLink
          label={t.notFound.back}
          href={localePath(locale)}
          className="text-sm text-foreground"
        />
      </div>
    </main>
  );
}
