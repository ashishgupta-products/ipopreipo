import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IPOPreIPO.com | Live IPO GMP, Bidding & Pre-IPO Analytics",
  description: "Professional financial portal for tracking Indian Mainboard IPOs, SME IPOs, real-time exchange bidding, grey market premiums (GMP), anchor lock-in dates, and unlisted pre-IPO equities.",
  keywords: "IPOPreIPO, IPOPreIPO.com, Live IPO GMP, Pre-IPO Shares, Upcoming IPOs 2026, SME IPO List, Anchor Lock-in Expiry, IPO Allotment Status Check",
  manifest: "/manifest.json"
};

import { AppShell } from "@/components/layout/AppShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
