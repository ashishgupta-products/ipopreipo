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
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0">
                    <img src="/logo.svg" alt="IPO Preipo Logo" className="w-full h-full object-cover" />
                  </div>
                  <p className="font-bold leading-tight">
                    📱 Install IPO Preipo App for live GMP alerts!
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
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-2xs"
                  title="WhatsApp"
                >
                  <svg className="w-8 h-8 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#25D366" />
                    <circle cx="24" cy="24" r="20" fill="#25D366" stroke="white" strokeWidth="2" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M24 12C17.373 12 12 17.373 12 24C12 26.459 12.74 28.746 14.009 30.663L12.539 35.462L17.514 34.037C19.364 35.193 21.605 35.864 24 35.864C30.627 35.864 36 30.491 36 23.864C36 17.237 30.627 12 24 12ZM30.245 28.173C29.965 28.96 28.759 29.604 27.927 29.779C27.354 29.901 26.611 29.993 24.09 28.953C20.868 27.623 18.791 24.343 18.63 24.126C18.476 23.909 17.339 22.404 17.339 20.85C17.339 19.296 18.133 18.541 18.457 18.205C18.72 17.932 19.159 17.802 19.582 17.802C19.719 17.802 19.842 17.809 19.951 17.816C20.271 17.83 20.435 17.844 20.647 18.349C20.913 18.99 21.56 20.57 21.642 20.734C21.724 20.898 21.806 21.116 21.697 21.334C21.594 21.552 21.505 21.661 21.348 21.845C21.191 22.03 21.048 22.173 20.891 22.364C20.748 22.528 20.584 22.706 20.761 23.013C20.939 23.313 21.552 24.315 22.459 25.12C23.632 26.163 24.587 26.497 24.934 26.64C25.262 26.777 25.459 26.743 25.644 26.532C25.869 26.273 26.611 25.401 26.891 24.998C27.171 24.596 27.451 24.658 27.826 24.801C28.208 24.944 30.245 25.947 30.662 26.152C31.078 26.356 31.358 26.459 31.46 26.636C31.562 26.813 31.562 27.393 31.282 28.178L30.245 28.173Z" fill="white" />
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
