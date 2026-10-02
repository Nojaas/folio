"use client";

import { AvailabilityDot } from "@/app/components/AvailabilityDot";
import { DownFastLabel } from "@/app/components/DownFastLink";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { DATA } from "@/data/resume";
import { localePath } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { motion } from "motion/react";
import Link from "next/link";

const DELAY = 0.2;

function NavItem({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function SiteNav() {
  const { t, locale } = useLocale();

  return (
    <header className="relative w-full px-2.5 pt-2.5">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
        <NavItem delay={DELAY} className="inline-flex justify-self-start">
          <Link
            href={localePath(locale, "/#home")}
            className="text-[13px] font-medium tracking-tight text-foreground"
          >
            {DATA.name}
          </Link>
        </NavItem>

        <NavItem delay={DELAY * 2} className="inline-flex justify-self-center">
          <motion.a
            href={`mailto:${DATA.contact.email}`}
            aria-label={t.nav.available}
            initial="rest"
            whileHover="hover"
            className="inline-flex items-center gap-1.5 text-[13px] text-foreground"
          >
            <DownFastLabel
              label={t.nav.available}
              className="text-[13px] text-foreground"
            />
            <AvailabilityDot />
          </motion.a>
        </NavItem>

        <div className="flex items-center justify-self-end gap-2 sm:gap-3">
          <NavItem delay={DELAY * 3} className="inline-flex">
            <LanguageToggle />
          </NavItem>
          <NavItem delay={DELAY * 4} className="inline-flex">
            <AnimatedThemeToggler />
          </NavItem>
        </div>
      </div>
    </header>
  );
}
