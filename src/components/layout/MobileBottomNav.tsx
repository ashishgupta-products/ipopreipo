"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Flame, Briefcase, CreditCard, Smartphone, Building2 } from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "IPOs", href: "/", icon: TrendingUp },
    { label: "Pre-IPO", href: "/pre-ipo", icon: Flame },
    { label: "Brokers", href: "/brokers", icon: Briefcase },
    { label: "Cards", href: "/credit-cards", icon: CreditCard },
    { label: "Payments", href: "/payment-apps", icon: Smartphone },
    { label: "Banks", href: "/banks", icon: Building2 }
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-1 py-1 flex items-center justify-around select-none overflow-hidden h-14">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={idx}
            href={item.href}
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
    </div>
  );
};
