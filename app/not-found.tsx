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
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center px-2.5 pb-2.5">
      <div className="flex flex-col items-center gap-5 text-center sm:gap-6">
        <p
          aria-hidden
          className="font-display text-[clamp(4.5rem,18vw,9rem)] leading-none font-bold tracking-tighter text-foreground"
        >
          404
        </p>
        <h1 className="text-base font-medium tracking-tight text-muted-foreground sm:text-lg">
          {t.notFound.title}
        </h1>
        <DownFastLink
          label={t.notFound.home}
          href={localePath(locale)}
          className="text-sm font-medium text-foreground"
        />
      </div>
    </main>
  );
}
