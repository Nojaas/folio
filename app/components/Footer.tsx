"use client";

import { DownFastLink } from "@/app/components/DownFastLink";
import { DATA } from "@/data/resume";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Children, useRef, useState, type ReactNode } from "react";

function FooterItem({
  children,
  progress,
  locked,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  locked: boolean;
}) {
  const scrubY = useTransform(progress, [0, 1], ["115%", "0%"]);

  return (
    <div className="scroll-line-mask">
      <motion.div
        className="will-change-transform"
        style={locked ? { y: "0%" } : { y: scrubY }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function FooterReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [locked, setLocked] = useState(false);
  const items = Children.toArray(children);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (locked) return;
    if (value >= 0.95) setLocked(true);
  });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={rootRef} className={cn(className)}>
      {items.map((child, index) => (
        <FooterItem key={index} progress={scrollYProgress} locked={locked}>
          {child}
        </FooterItem>
      ))}
    </div>
  );
}

export const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useLocale();

  return (
    <footer className="w-full px-2.5 pb-2.5">
      <FooterReveal className="flex w-full items-center justify-center gap-3 sm:justify-between max-sm:[&_.scroll-line-mask:first-child]:hidden">
        <DownFastLink
          label={t.footer.role}
          href={DATA.contact.social.GitHub.url}
          external
          className="hidden shrink-0 text-[13px] text-foreground sm:inline-flex"
        />

        <p className="text-center text-[13px] text-foreground sm:text-right">
          © {year} {DATA.name}. {t.footer.rights}
        </p>
      </FooterReveal>
    </footer>
  );
};
