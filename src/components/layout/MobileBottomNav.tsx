"use client";

import React, { useState } from "react";
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
  FileText 
} from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "IPOs", href: "/", icon: TrendingUp },
    { label: "Pre-IPO", href: "/pre-ipo", icon: Flame }
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
            {/* IPO Sub-links */}
            <div className="space-y-1.5">
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-wider block">IPOs &amp; SME Segment</span>
              <div className="grid grid-cols-2 gap-2">
                <Link onClick={() => setMenuOpen(false)} href="/?tab=live&category=mainboard" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  Live Mainboard
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/?tab=upcoming&category=mainboard" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Clock className="w-4 h-4 text-sky-600" />
                  Upcoming Mainboard
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/?tab=live&category=sme" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Live SME IPOs
                </Link>
                <Link onClick={() => setMenuOpen(false)} href="/?tab=upcoming&category=sme" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Upcoming SME
                </Link>
              </div>
            </div>

            {/* Other Portals */}
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
                <Link onClick={() => setMenuOpen(false)} href="/articles" className="col-span-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center gap-2 font-bold text-slate-700">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  Blogs &amp; Guides
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
