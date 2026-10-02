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
      sparkSize={12}
      sparkRadius={18}
      sparkCount={10}
      duration={450}
      className="min-h-[100dvh] w-full"
    >
      {children}
    </ClickSpark>
  );
}
