import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Anek_Telugu } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
        GeistSans.variable,
        AnekTelugu.variable,
        GeistMono.variable,
        "font-sans h-full bg-background text-foreground"
      )}
    >
      <body>{children}</body>
    </html>
  );
}
