"use client";

import Script from "next/script";

export function CustomAnalytics() {
  const isDev = process.env.NODE_ENV === "development";

  // En développement, on utilise l'URL standard
  // En production, on utilise notre chemin personnalisé pour bypasser les bloqueurs
  const src = isDev
    ? "https://va.vercel-scripts.com/v1/script.debug.js"
    : "/stats/v1/script.js";

  if (isDev) {
    return null; // Pas d'analytics en dev
  }

  return (
    <Script src={src} strategy="afterInteractive" data-endpoint="/stats/v1" />
  );
}
