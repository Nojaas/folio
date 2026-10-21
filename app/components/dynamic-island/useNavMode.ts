"use client";

import { SCROLL_THRESHOLD } from "@/app/components/dynamic-island/constants";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

/** True once the page has scrolled past the island “available → nav” threshold. */
export function useNavMode() {
  const [navMode, setNavMode] = useState(false);

  useLenis((instance) => {
    const next = instance.scroll > SCROLL_THRESHOLD;
    setNavMode((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > SCROLL_THRESHOLD;
      setNavMode((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return navMode;
}
