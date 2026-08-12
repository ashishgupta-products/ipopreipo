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
  Newspaper,
  Award,
  Calendar
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
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-wider block">IPO Tools &amp; Utilities</span>
              <div className="grid grid-cols-2 gap-2">
                <Link onClick={() => setMenuOpen(false)} href="/allotment" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Award className="w-4 h-4 text-purple-600" />
                  Allotment
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/calendar" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Calendar className="w-4 h-4 text-indigo-650" />
                  Calendar
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/anchor-lockins" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Zap className="w-4 h-4 text-indigo-700" />
                  Anchor Release
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/buybacks" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Buybacks
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/ipo-performance" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-150 border border-slate-150 flex items-center gap-2 font-bold text-slate-700 col-span-2 justify-center">
                  <Award className="w-4 h-4 text-rose-600" />
                  Listing Performance Tracker
                </Link>
              </div>
            </div>

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

            {/* Social Media Communities Row */}
            <div className="space-y-2 pt-2.5 border-t border-slate-100">
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-wider block text-center">Join Our Social Communities</span>
              <div className="flex items-center justify-center gap-4 py-1">
                {/* WhatsApp */}
                <a 
                  href="https://whatsapp.com/channel/0029Vb3ARRK4CrfqyqsTkP1B" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-700 transition-all active:scale-95 shadow-3xs"
                  title="WhatsApp"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.45 4.817 1.452 5.53 0 10.028-4.502 10.03-10.03.001-2.678-1.03-5.195-2.903-7.07C16.659 1.639 14.15 1.6 12.008 1.6c-5.535 0-10.03 4.5-10.033 10.03-.001 1.83.488 3.618 1.417 5.192l-.995 3.637 3.737-.981zm11.387-5.464c-.307-.154-1.817-.897-2.097-1-.28-.103-.483-.154-.686.154-.203.308-.787.994-.965 1.2-.177.205-.355.23-.662.077-2.186-1.084-3.648-2.01-4.71-3.834-.28-.48-.03-.74.22-1.011.223-.244.492-.578.738-.867.246-.29.328-.493.493-.822.164-.328.082-.615-.04-.871-.123-.256-.686-1.657-.942-2.274-.25-.6-.523-.518-.718-.528l-.612-.01c-.21 0-.553.08-.84.394-.288.313-1.098 1.075-1.098 2.624 0 1.55 1.125 3.047 1.28 3.253.154.205 2.215 3.383 5.366 4.743.75.324 1.333.518 1.787.662.753.24 1.438.207 1.98.127.604-.09 1.817-.743 2.073-1.462.256-.718.256-1.333.18-1.462-.077-.128-.282-.205-.59-.36z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com/example-profile" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-95 shadow-3xs"
                  title="Instagram"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://youtube.com/example-channel" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 hover:text-red-700 transition-all active:scale-95 shadow-3xs"
                  title="YouTube"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.525 3.545 12 3.545 12 3.545s-7.525 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.026 0 12 0 12s0 3.974.502 5.837a3.003 3.003 0 002.11 2.11C4.475 20.455 12 20.455 12 20.455s7.525 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.974 24 12 24 12s0-3.974-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* X */}
                <a 
                  href="https://x.com/example-profile" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 shadow-3xs"
                  title="X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a 
                  href="https://facebook.com/example-profile" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 transition-all active:scale-95 shadow-3xs"
                  title="Facebook"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a 
                  href="https://t.me/example-channel" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 hover:text-sky-600 transition-all active:scale-95 shadow-3xs"
                  title="Telegram"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.18l-1.92 9.06c-.14.63-.52.79-1.05.49l-2.93-2.16-1.41 1.36c-.16.16-.29.29-.6.29l.21-2.98 5.43-4.91c.24-.21-.05-.33-.37-.12l-6.71 4.22-2.89-.9c-.63-.2-1.25-.33-.63-.6l11.29-4.35c.52-.2 1.01.12.82.75z"/>
                  </svg>
                </a>
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
