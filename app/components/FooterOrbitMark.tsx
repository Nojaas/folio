"use client";

import CircularText from "@/components/CircularText";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";

/** Orbit-style CircularText — sole footer mark (copyright) */
export function FooterOrbitMark({ className }: { className?: string }) {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  const text = t.footer.orbitRing.replace("{year}", String(year));

  return (
    <div
      className={cn("relative shrink-0 text-foreground", className)}
      role="contentinfo"
      aria-label={text.trim()}
    >
      <CircularText
        text={text}
        size={132}
        fontSize={14}
        fontWeight={700}
        spinDuration={40}
        onHover="pause"
        direction="clockwise"
        fill={true}
        repeat={1}
        tilt={50}
        hoverTilt={10}
        draggable={true}
        className="select-none"
      >
        <Asterisk className="size-8" aria-hidden />
      </CircularText>
    </div>
  );
}
