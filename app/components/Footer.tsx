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
    <footer className="w-full px-2.5 pb-2.5">
      <div className="grid w-full grid-cols-2 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <Link
          href={localePath(locale, "/#home")}
          className="justify-self-start text-[13px] font-medium tracking-tight text-foreground"
        >
          {DATA.name}
        </Link>

        <DownFastLink
          label={t.footer.role}
          href={DATA.contact.social.GitHub.url}
          external
          className="hidden justify-self-center text-[13px] text-foreground sm:inline-flex"
        />

        <p className="justify-self-end text-[13px] text-foreground">©{year}</p>
      </div>
    </footer>
  );
};
