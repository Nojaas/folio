"use client";

import { useLayoutEffect, useState } from "react";

const CENTER_LABEL = "Fullstack developer";

/** Width of the centered footer label — shared rail for content left edge */
export function useCenterLabelWidth() {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const el = document.createElement("span");
      el.textContent = CENTER_LABEL;
      el.style.cssText = [
        "position:absolute",
        "visibility:hidden",
        "white-space:nowrap",
        "font-size:13px",
        "font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif",
        "pointer-events:none",
      ].join(";");
      document.body.appendChild(el);
      setWidth(el.getBoundingClientRect().width);
      document.body.removeChild(el);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return width;
}

export { CENTER_LABEL };
