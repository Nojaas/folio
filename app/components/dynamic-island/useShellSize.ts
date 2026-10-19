"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Measures island content box for spring width/height morph. */
export function useShellSize(remeasureKey: string) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const update = () => {
      setSize({
        width: Math.ceil(el.offsetWidth),
        height: Math.ceil(el.offsetHeight),
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [remeasureKey]);

  return { measureRef, size };
}
