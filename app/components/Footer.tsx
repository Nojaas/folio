"use client";

import { DownFastLink } from "@/app/components/DownFastLink";
import { DATA } from "@/data/resume";
import { localePath } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import Link from "next/link";

export const Footer = () => {
  const year = new Date().getFullYear();
  const { t, locale } = useLocale();

  return (
    <footer className="relative w-full px-2.5 pb-2.5">
      <div className="flex w-full items-center justify-between gap-3">
        <Link
          href={localePath(locale, "/#home")}
          className="text-[13px] font-medium tracking-tight text-foreground"
        >
          {DATA.name}
        </Link>
        <p className="text-[13px] text-foreground">©{year}</p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-2.5 hidden justify-center sm:flex">
        <DownFastLink
          label={t.footer.role}
          href={DATA.contact.social.GitHub.url}
          external
          className="pointer-events-auto text-[13px] text-foreground"
        />
      </div>
    </footer>
  );
};
