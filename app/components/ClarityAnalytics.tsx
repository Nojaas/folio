"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/** Microsoft Clarity — deferred so it doesn't compete with LCP / TBT. */
export function ClarityAnalytics() {
  useEffect(() => {
    if (!PROJECT_ID) return;

    const start = () => Clarity.init(PROJECT_ID!);

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(start, 2500);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
