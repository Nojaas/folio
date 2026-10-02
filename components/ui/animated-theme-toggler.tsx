"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

type Props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: Props) => {
  const { setTheme } = useTheme();
  const { locale } = useLocale();
  const [isDark, setIsDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    requestAnimationFrame(() => setReady(true));
  }, []);

  const toggleTheme = useCallback(() => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    setTheme(nextIsDark ? "dark" : "light");
  }, [isDark, setTheme]);

  const ariaLabel =
    locale === "en"
      ? isDark
        ? "Switch to light mode"
        : "Switch to dark mode"
      : isDark
        ? "Passer en mode clair"
        : "Passer en mode sombre";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={cn(
        "relative z-20 flex size-fit items-center justify-center overflow-hidden text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={ready ? { opacity: 0, y: isDark ? 8 : -8 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isDark ? -8 : 8 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex"
        >
          {isDark ? (
            <Moon className="size-3.5" strokeWidth={1.75} />
          ) : (
            <Sun className="size-3.5" strokeWidth={1.75} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};
