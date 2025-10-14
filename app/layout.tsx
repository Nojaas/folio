import { CustomAnalytics } from "@/app/components/CustomAnalytics";
import ResizableNav from "@/app/components/ResizableNav";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
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
  title: "Jason Leroy . Développeur Full Stack",
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
        <CustomAnalytics />
      </body>
    </html>
  );
}
