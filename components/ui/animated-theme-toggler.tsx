"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type Props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: Props) => {
  const [isDark, setIsDark] = useState(false);
  const [, setIsAnimating] = useState<null | "sun" | "moon">(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    // Always rotate 90deg: right for sun, left for moon
    const nextIsDark = !isDark;
    setIsAnimating(nextIsDark ? "moon" : "sun");

    await document.startViewTransition(() => {
      flushSync(() => {
        setIsDark(nextIsDark);
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", nextIsDark ? "dark" : "light");
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );

    setTimeout(() => setIsAnimating(null), 400);
  }, [isDark]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "items-center flex justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/80 h-11 w-11 z-20",
        className
      )}
    >
      {isDark ? (
        <span
          className="inline-flex"
          style={{
            display: "inline-flex",
            transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
            transform: `rotate(0)`,
          }}
        >
          <Moon />
        </span>
      ) : (
        <span
          className="inline-flex"
          style={{
            display: "inline-flex",
            transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
            transform: `rotate(90deg)`,
          }}
        >
          <Sun />
        </span>
      )}
    </button>
  );
};
