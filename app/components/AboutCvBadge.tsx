"use client";

import CircularText from "@/components/CircularText";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { ArrowDownToLine } from "lucide-react";

/** Badge-style CircularText — CV / resume download near the about title */
export function AboutCvBadge({ className }: { className?: string }) {
  const { t } = useLocale();

  return (
    <a
      href="/cv.pdf"
      download
      // Ring text must appear in the accessible name (axe label-content-name-mismatch).
      aria-label={`${t.contact.cv} — ${t.about.cvRing.trim()}`}
      className={cn(
        "inline-flex shrink-0 select-none text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30",
        className,
      )}
    >
      <CircularText
        text={t.about.cvRing}
        size={132}
        fontSize={14}
        fontWeight={700}
        hoverTilt={20}
        spinDuration={30}
        ring={true}
        fill={true}
        onHover="speedUp"
        direction="clockwise"
        repeat={2}
        draggable={false}
      >
        <ArrowDownToLine className="size-8" strokeWidth={1.75} aria-hidden />
      </CircularText>
    </a>
  );
}
