"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, 
  Flame, 
  FileText, 
  PlusCircle, 
  Users, 
  LayoutDashboard, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "IPOs & Live GMP", href: "/admin/ipos", icon: Flame },
  { label: "Articles & News", href: "/admin/articles", icon: FileText },
  { label: "Write Article", href: "/admin/articles/new", icon: PlusCircle },
  { label: "Pre-IPO Shares", href: "/admin/pre-ipo", icon: Sparkles },
  { label: "Investor Users", href: "/admin/users", icon: Users },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div>
            <span className="font-black text-sm text-white">IPOPreIPO</span>
            <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
              ADMIN
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between z-50 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Admin Branding */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md">
                <TrendingUp className="w-4 h-4" />
              </span>
              <div>
                <h1 className="font-black text-sm text-white leading-tight">IPOPreIPO</h1>
                <span className="text-[10px] text-blue-400 font-mono font-bold tracking-wider uppercase">
                  Control Center
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Live Public Portal</span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </Link>

          {/* Admin User Chip */}
          <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name[0] : "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || "Admin"}</p>
                <span className="text-[10px] text-emerald-400 font-mono block">SUPERADMIN</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-950 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-900/40 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-blue-400">root@ipopreipo</span>
            <span>/</span>
            <span className="text-slate-200">{pathname.replace(/^\//, "") || "admin"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles/new"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Article</span>
            </Link>
            <Link
              href="/admin/ipos"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Update GMP</span>
            </Link>
          </div>
        </header>

        {/* Page Children Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
