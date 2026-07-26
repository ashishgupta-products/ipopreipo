"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  Percent, 
  CreditCard, 
  Briefcase, 
  Smartphone, 
  Building2, 
  MessageSquare, 
  Users, 
  Menu, 
  X,
  Bell,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/admin/ipos", label: "Manage IPOs", icon: Sparkles, badge: "Live" },
    { href: "/admin/pre-ipo", label: "Pre-IPO Shares", icon: Percent },
    { href: "/admin/credit-cards", label: "Credit Cards", icon: CreditCard },
    { href: "/admin/brokers", label: "Stock Brokers", icon: Briefcase },
    { href: "/admin/payment-apps", label: "Payment Apps", icon: Smartphone },
    { href: "/admin/banks", label: "Banks & Accounts", icon: Building2 },
    { href: "/admin/reviews", label: "User Reviews", icon: MessageSquare, badge: "Pending" },
    { href: "/admin/users", label: "User Analytics", icon: Users }
  ];

  const currentNav = navItems.find((n) => n.href === pathname) || { label: "Admin Console" };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white text-slate-900 p-4 flex items-center justify-between border-b border-slate-200 shadow-xs shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
            A
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">IPOPreIPO Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-xs"
        />
      )}

      {/* Collapsible Admin Sidebar */}
      <aside
        className={`
        fixed md:sticky top-0 inset-y-0 left-0 z-50 md:z-30 h-screen bg-white text-slate-700 flex flex-col p-4 transition-all duration-300 ease-in-out border-r border-slate-200/80 shadow-xs shrink-0 justify-between overflow-y-auto custom-sidebar-scroll
        ${isCollapsed ? "md:w-20" : "md:w-64"}
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Top Header Section */}
        <div className="space-y-4 shrink-0 pb-3 border-b border-slate-100">
          <div className={`flex items-center justify-between px-1 ${isCollapsed ? "md:justify-center" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-600/20 shrink-0">
                A
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden transition-all duration-200">
                  <span className="font-extrabold text-slate-900 text-sm block leading-tight truncate">IPOPreIPO</span>
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block truncate">Admin Desk</span>
                </div>
              )}
            </div>

            {/* Desktop Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all border border-slate-200/60"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-blue-600" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* System Status Pill */}
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 space-y-1 text-xs">
              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-900">
                <span>Exchange API Sync</span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Feed
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">BSE &amp; NSE Bidding Stream Active</p>
            </div>
          ) : (
            <div className="flex justify-center p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60" title="Exchange Sync Active">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}
        </div>

        {/* Middle Navigation Section */}
        <div className="flex-1 overflow-y-auto my-3 space-y-1 text-xs">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1 sticky top-0 bg-white py-1 z-10">
              Management Portals
            </span>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "justify-between px-3.5 py-2.5"} rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-bold shadow-xs border border-blue-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Badge Section */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs shrink-0">
          <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 ${isCollapsed ? "justify-center p-2" : ""}`}>
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
              AD
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-bold text-slate-900 block text-xs truncate">Super Admin</span>
                <span className="text-[10px] text-slate-500 block truncate">admin@ipopreipo.com</span>
              </div>
            )}
          </div>
          <Link
            href="/"
            title={isCollapsed ? "Return to Main Site" : undefined}
            className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-xs ${isCollapsed ? "px-0" : ""}`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> {!isCollapsed && <span>Return to Main Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50/70 text-slate-900">
        {/* Desktop Executive Header Bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-medium">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <strong className="text-slate-900 font-extrabold text-sm">{currentNav.label}</strong>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync: 99.98% Uptime
            </div>
            <button className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all relative border border-slate-200/60 bg-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Super Admin Mode</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Workspace */}
        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
