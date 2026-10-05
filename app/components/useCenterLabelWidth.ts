"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLayoutEffect, useState } from "react";

/**
 * Width of the centered header “Disponible / Available” label —
 * shared rail for content left edge.
 */
export function useCenterLabelWidth() {
  const { t } = useLocale();
  const label = t.nav.available;
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const el = document.createElement("span");
      el.textContent = label;
      el.style.cssText = [
        "position:absolute",
        "visibility:hidden",
        "white-space:nowrap",
        "font-size:13px",
        "font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif",
        "pointer-events:none",
      ].join(";");
      document.body.appendChild(el);
      // Match header cluster: label + gap-1.5 + availability dot (size-1.5)
      setWidth(el.getBoundingClientRect().width + 6 + 6);
      document.body.removeChild(el);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [label]);

  return width;
}
