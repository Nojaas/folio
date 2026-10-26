import { ClarityAnalytics } from "@/app/components/ClarityAnalytics";
import { ClickSparkProvider } from "@/app/components/ClickSparkProvider";
import { PersonJsonLd } from "@/app/components/PersonJsonLd";
import { SmoothScroll } from "@/app/components/SmoothScroll";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";

/** Titles / display lines — Satoshi (Fontshare kit, self-hosted) */
const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display-face",
  display: "swap",
  // Avoid next/font's size-adjusted Arial face ("… Fallback") showing in DevTools
  // and looking like the real face never loaded.
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** UI body / nav / labels — Inter */
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "fr_FR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") === "en" ? "en" : "fr";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        satoshi.variable,
        fontSans.variable,
        "min-h-screen bg-background font-sans antialiased",
      )}
    >
      <body>
        <PersonJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `if("scrollRestoration"in history)history.scrollRestoration="manual";window.scrollTo(0,0);`,
          }}
        />
        {/*
          FOUC guard aligned with ThemeProvider:
          stored light/dark → use it; else prefers-color-scheme; else dark.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="folio-theme",s=localStorage.getItem(k),d=document.documentElement,dark;if(s==="dark"||s==="light"){dark=s==="dark"}else{var prefDark=window.matchMedia("(prefers-color-scheme: dark)").matches,prefLight=window.matchMedia("(prefers-color-scheme: light)").matches;dark=prefDark||!prefLight;if(!prefDark&&!prefLight)localStorage.setItem(k,"dark")}d.classList.toggle("dark",dark);d.style.colorScheme=dark?"dark":"light"}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          <SmoothScroll>
            <ClickSparkProvider>
              <div className="relative">{children}</div>
            </ClickSparkProvider>
            <Analytics />
            <SpeedInsights />
            <ClarityAnalytics />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
