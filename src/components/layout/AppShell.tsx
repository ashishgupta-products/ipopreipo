"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminOrEditor = pathname.startsWith("/admin") || pathname.startsWith("/editor");

  if (isAdminOrEditor) {
    return <main className="min-h-screen w-full bg-slate-950 text-slate-100">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pb-16 xl:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
