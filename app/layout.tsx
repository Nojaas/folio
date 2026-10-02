import { ClickSparkProvider } from "@/app/components/ClickSparkProvider";
import { SmoothScroll } from "@/app/components/SmoothScroll";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jason-leroy.com"),
  title: "Jason Leroy · Fullstack Developer",
  description: "Jason Leroy's portfolio",
  alternates: {
    languages: {
      fr: "/",
      en: "/en",
    },
  },
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
        fontSans.variable,
        fontMono.variable,
        "dark min-h-screen bg-background font-sans antialiased",
      )}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `if("scrollRestoration"in history)history.scrollRestoration="manual";window.scrollTo(0,0);`,
          }}
        />
        <ThemeProvider>
          <SmoothScroll>
            <ClickSparkProvider>
              <div className="relative">{children}</div>
            </ClickSparkProvider>
            <Toaster />
            <Analytics />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
