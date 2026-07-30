"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp, 
  Flame, 
  Building2, 
  Menu, 
  X, 
  Zap, 
  Clock, 
  Briefcase, 
  CreditCard, 
  Smartphone, 
  FileText,
  ArrowDownToLine,
  Home,
  Newspaper
} from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandaloneApp, setIsStandaloneApp] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches 
      || (window.navigator as any).standalone;
    
    if (isStandalone) {
      localStorage.setItem("ipopreipo_installed", "true");
      setIsStandaloneApp(true);
      return;
    }

    const isInstalled = localStorage.getItem("ipopreipo_installed") === "true";
    setIsStandaloneApp(isInstalled);

    if (isInstalled) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      localStorage.setItem("ipopreipo_installed", "true");
      setIsStandaloneApp(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      alert("To install: Tap Safari's Share button (square icon with upward arrow) and select 'Add to Home Screen'.");
      localStorage.setItem("ipopreipo_installed", "true");
      setIsStandaloneApp(true);
      return;
    }

    if (!deferredPrompt) {
      alert("App installation is ready! If this button doesn't trigger, please open your browser menu (three dots) and tap 'Install App' or 'Add to Home Screen'.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem("ipopreipo_installed", "true");
      setIsStandaloneApp(true);
    }
    setDeferredPrompt(null);
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Pre-IPO", href: "/pre-ipo", icon: Flame },
    { label: "News", href: "/articles", icon: Newspaper }
  ];

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9997] xl:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Slide-Up Bottom Sheet */}
      {menuOpen && (
        <div className="xl:hidden fixed bottom-14 inset-x-0 bg-white border-t border-slate-200 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-4 space-y-4 z-[9998] animate-in slide-in-from-bottom duration-300 max-h-[75vh] overflow-y-auto">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">Explore Portal</span>
            <button 
              onClick={() => setMenuOpen(false)} 
              className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* PWA Install Promotion Box */}
            {!isStandaloneApp && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col gap-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4.5 h-4.5 text-blue-300 shrink-0" />
                  <p className="font-bold leading-tight">
                    📱 Install IPOPreIPO App for live GMP alerts!
                  </p>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-white hover:bg-slate-100 text-blue-900 font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shadow-xs active:scale-95"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  Add to Home Screen
                </button>
              </div>
            )}


            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-wider block">Financial Utilities</span>
              <div className="grid grid-cols-2 gap-2">
                <Link onClick={() => setMenuOpen(false)} href="/brokers" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Brokers
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/credit-cards" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Credit Cards
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/payment-apps" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  Payment Apps
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/banks" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Banks
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Bottom Nav */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-4 py-1 flex items-center justify-around select-none overflow-hidden h-14">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href && !menuOpen;
          return (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all duration-200 flex-1 ${
                isActive
                  ? "text-blue-700 font-bold scale-105"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? "text-blue-700 stroke-[2.5]" : "text-slate-400 stroke-[1.8]"}`} />
              <span className="text-[9px] tracking-tight whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}

        {/* Dynamic Menu Tab Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all duration-200 flex-1 ${
            menuOpen
              ? "text-blue-700 font-bold scale-105"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <Menu className={`w-4.5 h-4.5 ${menuOpen ? "text-blue-700 stroke-[2.5]" : "text-slate-400 stroke-[1.8]"}`} />
          <span className="text-[9px] tracking-tight whitespace-nowrap">Menu</span>
        </button>
      </div>
    </>
  );
};
