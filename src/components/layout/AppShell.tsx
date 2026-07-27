"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { InstallBanner } from "@/components/common/InstallBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminOrEditor = pathname.startsWith("/admin") || pathname.startsWith("/editor");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (reg) => console.log("SW registered:", reg.scope),
          (err) => console.log("SW registration failed:", err)
        );
      });
    }
  }, []);

  if (isAdminOrEditor) {
    return <main className="min-h-screen w-full bg-slate-950 text-slate-100">{children}</main>;
  }

  return (
    <>
      <InstallBanner />
      <Navbar />
      <main className="flex-1 w-full pb-16 xl:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
