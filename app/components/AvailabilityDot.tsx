"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type AvailabilityDotProps = {
  className?: string;
  /** Wait before showing the dot (ms) */
  delayMs?: number;
};

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
        "size-1.5 rounded-full bg-foreground",
        ready ? "animate-availability-dot" : "opacity-0",
        className,
      )}
    />
  );
}
