"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme resolution:
 * - Stored user choice (light/dark) wins
 * - Else follow prefers-color-scheme (system)
 * - Else / no preference → dark (`defaultTheme` + system fallback)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="folio-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
