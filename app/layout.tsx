import ResizableNav from "@/app/components/ResizableNav";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Anek_Telugu } from "next/font/google";
import "./globals.css";

const AnekTelugu = Anek_Telugu({
  subsets: ["latin"],
  variable: "--font-caption",
});

export const metadata: Metadata = {
  title: "Jason Leroy . Software Engineer",
  description: "Portfolio de Jason Leroy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        GeistSans.variable,
        AnekTelugu.variable,
        GeistMono.variable,
        "min-h-screen bg-background font-sans antialiased mx-auto"
      )}
    >
      <body>
        <ResizableNav />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
