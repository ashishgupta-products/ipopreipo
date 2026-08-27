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
  title: "ipo preipo.com | Live IPO GMP, Bidding & Pre-IPO Analytics",
  description: "Professional financial portal for tracking Indian Mainboard IPOs, SME IPOs, real-time exchange bidding, grey market premiums (GMP), anchor lock-in dates, and unlisted pre-IPO equities on ipo preipo.com.",
  keywords: "ipo preipo, ipo preipo.com, live ipo gmp, pre-ipo shares, upcoming ipos 2026, sme ipo list, anchor lock-in expiry, ipo allotment status check",
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
