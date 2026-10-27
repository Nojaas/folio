"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type AvailabilityDotProps = {
  className?: string;
  /** Wait before showing the dot (ms) */
  delayMs?: number;
};

/**
 * Appear (opacity transition) and blink (keyframes) must live on separate
 * nodes — PSI flags dual opacity animations on the same element as non-composited.
 */
export function AvailabilityDot({
  className,
  delayMs = 1500,
}: AvailabilityDotProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-1.5 transition-opacity duration-500 ease-out",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <span
        className={cn(
          "size-full rounded-full bg-current",
          ready && "animate-availability-dot",
        )}
      />
    </span>
  );
}
