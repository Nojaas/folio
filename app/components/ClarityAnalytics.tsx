"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/** Microsoft Clarity — init once on the client when the project id is set. */
export function ClarityAnalytics() {
  useEffect(() => {
    if (!PROJECT_ID) return;
    Clarity.init(PROJECT_ID);
  }, []);

  return null;
}
