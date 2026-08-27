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
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Smartphone
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "IPOs & Live GMP", href: "/admin/ipos", icon: Flame },
  { label: "Credit Cards", href: "/admin/credit-cards", icon: CreditCard },
  { label: "Payment Apps", href: "/admin/payment-apps", icon: Smartphone },
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
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex flex-col lg:flex-row antialiased font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div>
            <span className="font-black text-sm text-slate-900 lowercase">ipo preipo.com</span>
            <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-200">
              ADMIN
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between z-50 transition-transform duration-200 lg:translate-x-0 shadow-xs ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Admin Branding */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <span className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-xs group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </span>
              <div>
                <h1 className="font-black text-sm text-slate-900 leading-tight lowercase">ipo preipo.com</h1>
                <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase block">
                  Admin Console
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
                      ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/60 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Public Portal</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {/* Admin User Chip */}
          <div className="flex items-center justify-between p-2 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user?.name ? user.name[0] : "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Admin"}</p>
                <span className="text-[10px] text-emerald-600 font-bold block">Superadmin</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-50/80 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white/80 border-b border-slate-200/80 sticky top-0 z-30 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-blue-600 font-bold">Admin</span>
            <span>/</span>
            <span className="text-slate-800 font-bold capitalize">
              {pathname === "/admin" ? "Overview" : pathname.replace("/admin/", "").replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/ipos"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Update GMP</span>
            </Link>
            <Link
              href="/admin/articles/new"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Article</span>
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
