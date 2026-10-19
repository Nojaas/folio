"use client";

import { MOBILE_MAX } from "@/lib/constants/layout";
import { useEffect, useState } from "react";

/** True below the `md` breakpoint — layout viewport only (zoom-safe). */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const sync = () => setIsMobile(mq.matches);

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}
