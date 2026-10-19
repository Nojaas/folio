"use client";

import ClickSpark from "@/components/ClickSpark";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";

export function ClickSparkProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch — default dark matches site default
  const sparkColor =
    mounted && resolvedTheme === "light" ? "#111111" : "#ffffff";

  return (
    <ClickSpark
      sparkColor={sparkColor}
      sparkSize={14}
      sparkRadius={20}
      sparkCount={8}
      glow={0.5}
      duration={400}
      easing="ease-out"
      shape="streak"
      layer="front"
      className="min-h-[100dvh] w-full"
    >
      {children}
    </ClickSpark>
  );
}
