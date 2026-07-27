"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, CreditCard, Briefcase, FileText } from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Pre-IPO", href: "/pre-ipo", icon: Flame },
    { label: "Cards", href: "/credit-cards", icon: CreditCard },
    { label: "Brokers", href: "/brokers", icon: Briefcase },
    { label: "Blogs", href: "/articles", icon: FileText }
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={idx}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "text-blue-705 scale-105 font-bold animate-in fade-in zoom-in-95 duration-100"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-blue-700 stroke-[2.5]" : "text-slate-400 stroke-[1.8]"}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
