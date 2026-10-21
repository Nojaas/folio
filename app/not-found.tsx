"use client";

import { DownFastLink } from "@/app/components/DownFastLink";
import GlitchText from "@/components/GlitchText";
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
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 sm:px-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <GlitchText
          mode="noise"
          trigger="always"
          speed={1}
          intensity={0.2}
          burstDuration={0.6}
          offset={0}
          skew={5}
          flicker
          fontWeight={600}
          enableShadows={false}
          shadowColors={["#ff0000", "#00ffff"]}
        >
          404
        </GlitchText>
        <h1 className="text-md font-semibold tracking-tight text-foreground sm:text-xl">
          {t.notFound.title}
        </h1>
        <DownFastLink
          label={t.notFound.home}
          href={localePath(locale)}
          className="text-sm text-foreground"
        />
      </div>
    </main>
  );
}
