"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Sparkles, 
  Percent, 
  Briefcase,
  CreditCard,
  Smartphone,
  Building2,
  Menu,
  X,
  ChevronDown,
  Search,
  Zap,
  Clock,
  CheckCircle2,
  BarChart3,
  Calendar,
  Award,
  Home,
  UserCheck,
  User,
  LogOut,
  Bookmark,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { MOCK_IPOS } from "@/data/mockIpos";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ipoMenuOpen, setIpoMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState<"small" | "normal" | "large">("normal");
  const [fontToast, setFontToast] = useState<string>("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const activeIpos = MOCK_IPOS.filter((i) => i.status === "live" || i.gmp > 0);

  const changeFontSize = (size: "small" | "normal" | "large") => {
    setFontSize(size);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-font-size", size);
      document.documentElement.style.fontSize = ""; // Ensure layout rem geometry is preserved
      try {
        localStorage.setItem("user-font-size", size);
      } catch (e) {
        // ignore
      }

      const labels = {
        small: "Font size set to Compact (88%)",
        normal: "Font size set to Standard (100%)",
        large: "Font size set to Large (115%)"
      };
      setFontToast(labels[size]);
      setTimeout(() => setFontToast(""), 2200);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user-font-size") as "small" | "normal" | "large";
      if (saved && (saved === "small" || saved === "normal" || saved === "large")) {
        changeFontSize(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIpoMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? MOCK_IPOS.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-white border-b border-slate-200 shadow-sm">

      {/* Main Corporate Navigation */}
      <nav className="max-w-7xl mx-auto w-full px-4 py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-800 transition-colors">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <span className="font-black text-xl tracking-tight text-slate-900 font-sans">
                IPO<span className="text-blue-700">PREIPO</span>
              </span>
              <span className="text-xs text-blue-700 font-bold">.com</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Financial Intelligence &amp; Pre-IPO Hub
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden xl:flex items-center gap-1 font-semibold text-xs text-slate-700 relative">
          <Link
            href="/"
            className="p-2 rounded-md hover:bg-slate-100 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* IPO Mega Menu Trigger */}
          <div className="relative" ref={megaMenuRef}>
            <button
              onClick={() => setIpoMenuOpen(!ipoMenuOpen)}
              onMouseEnter={() => setIpoMenuOpen(true)}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1 font-bold ${
                ipoMenuOpen ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 hover:text-blue-700"
              }`}
            >
              IPO
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${ipoMenuOpen ? "rotate-180 text-blue-700" : ""}`} />
            </button>

            {/* Mega Menu Content Card */}
            {ipoMenuOpen && (
              <div 
                onMouseLeave={() => setIpoMenuOpen(false)}
                className="absolute top-full left-0 mt-1 w-[780px] bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 grid grid-cols-3 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Column 1: Mainboard */}
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-sm text-slate-900">Mainboard</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/?tab=live&category=mainboard"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">Live IPO</span>
                        <span className="text-[11px] text-slate-500">Live &amp; open IPOs</span>
                      </div>
                    </Link>

                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/?tab=upcoming&category=mainboard"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">Upcoming IPO</span>
                        <span className="text-[11px] text-slate-500">Coming soon</span>
                      </div>
                    </Link>

                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/?tab=listed&category=mainboard"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">Listed IPO</span>
                        <span className="text-[11px] text-slate-500">Recently listed</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Column 2: SME */}
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      <Percent className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-sm text-slate-900">SME Segment</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/?tab=live&category=sme"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-amber-800 block">Live SME IPO</span>
                        <span className="text-[11px] text-slate-500">Live &amp; open SME IPOs</span>
                      </div>
                    </Link>

                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/?tab=upcoming&category=sme"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-amber-800 block">Upcoming SME IPO</span>
                        <span className="text-[11px] text-slate-500">Coming soon</span>
                      </div>
                    </Link>

                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/?tab=listed&category=sme"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-amber-800 block">Listed SME IPO</span>
                        <span className="text-[11px] text-slate-500">Recently listed</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Column 3: IPO Reports & Tools */}
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      <BarChart3 className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-sm text-slate-900">IPO Tools &amp; Reports</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/allotment"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">IPO Allotment Engine</span>
                        <span className="text-[11px] text-slate-500">Check PAN allotment status</span>
                      </div>
                    </Link>

                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/calendar"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Calendar className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">IPO Calendar</span>
                        <span className="text-[11px] text-slate-500">Bidding &amp; listing dates</span>
                      </div>
                    </Link>

                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/anchor-lockins"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Zap className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">Anchor Lock-Ins Expiry</span>
                        <span className="text-[11px] text-slate-500">30 &amp; 90-day institutional release</span>
                      </div>
                    </Link>

                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/buybacks"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">Share Buybacks Hub</span>
                        <span className="text-[11px] text-slate-500">Tender offers &amp; acceptance ratios</span>
                      </div>
                    </Link>

                    <Link
                      onClick={() => setIpoMenuOpen(false)}
                      href="/articles"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">IPO &amp; Card Research</span>
                        <span className="text-[11px] text-slate-500">Expert DRHP reviews &amp; guides</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/pre-ipo"
            className="px-2.5 py-2 rounded-md hover:bg-amber-50 hover:text-amber-800 text-amber-700 font-bold transition-colors flex items-center gap-1"
          >
            Pre-IPO (Coming Soon)
          </Link>

          <Link
            href="/brokers"
            className="px-2.5 py-2 rounded-md hover:bg-slate-100 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Brokers
          </Link>

          <Link
            href="/payment-apps"
            className="px-2.5 py-2 rounded-md hover:bg-slate-100 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Payment Apps
          </Link>

          <Link
            href="/credit-cards"
            className="px-2.5 py-2 rounded-md hover:bg-slate-100 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Credit Cards
          </Link>

          <Link
            href="/banks"
            className="px-2.5 py-2 rounded-md hover:bg-slate-100 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Banks
          </Link>

          <Link
            href="/articles"
            className="px-2.5 py-2 rounded-md hover:bg-blue-50 text-blue-800 font-bold transition-colors flex items-center gap-1"
          >
            Blogs
          </Link>
        </div>

        {/* Right Action Tools: Search & Login */}
        <div className="flex items-center gap-2">
          {/* Accessibility Font Size Resizer: A- A A+ */}
          <div className="hidden md:flex items-center gap-1.5 mr-1">
            {fontToast && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shadow-2xs">
                {fontToast}
              </span>
            )}
            <div className="flex items-center gap-0.5 bg-slate-100 border border-slate-200/85 rounded p-0.5 text-[10px] font-bold">
              <button
                onClick={() => changeFontSize("small")}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  fontSize === "small"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-655 hover:text-slate-900 hover:bg-slate-200"
                }`}
                title="Decrease Font Size (A-)"
              >
                A-
              </button>
              <button
                onClick={() => changeFontSize("normal")}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  fontSize === "normal"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-655 hover:text-slate-900 hover:bg-slate-200"
                }`}
                title="Default Font Size (A)"
              >
                A
              </button>
              <button
                onClick={() => changeFontSize("large")}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  fontSize === "large"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-655 hover:text-slate-900 hover:bg-slate-200"
                }`}
                title="Increase Font Size (A+)"
              >
                A+
              </button>
            </div>
          </div>

          {/* Search Trigger */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Search IPOs..."
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl border border-slate-200 shadow-2xl p-3 z-50 space-y-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search IPO name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700"
                />

                {searchResults.length > 0 && (
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {searchResults.map((ipo) => (
                      <Link
                        key={ipo.id}
                        href={`/ipo/${ipo.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="p-2 block hover:bg-slate-50 rounded"
                      >
                        <strong className="text-slate-900 block">{ipo.name}</strong>
                        <span className="text-[11px] text-slate-500">
                          Price: ₹{ipo.priceBandMax} | GMP: +₹{ipo.gmp}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition-all font-bold text-xs shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-black text-[11px] flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="max-w-[90px] truncate leading-tight">{user.name}</span>
                  <span className="text-[9px] font-black uppercase text-blue-700 tracking-wider">
                    {user.role || "Retail"}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-blue-700" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 space-y-2 animate-in fade-in zoom-in duration-100 text-xs">
                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 block truncate">{user.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[9px] font-black uppercase">
                        {user.role || "investor"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 truncate block">{user.email}</span>
                  </div>

                  {/* 1-Click Demo Role Switcher Inside Menu */}
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">
                      ⚡ 1-CLICK DEMO ROLE SWITCH
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchRole("investor");
                          setUserDropdownOpen(false);
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          user.role === "investor"
                            ? "bg-blue-700 text-white border-blue-700 font-extrabold"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
                        }`}
                      >
                        Retail
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchRole("hni");
                          setUserDropdownOpen(false);
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          user.role === "hni"
                            ? "bg-purple-700 text-white border-purple-700 font-extrabold"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-purple-50"
                        }`}
                      >
                        B-HNI
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchRole("editor");
                          setUserDropdownOpen(false);
                          router.push("/editor");
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          user.role === "editor"
                            ? "bg-emerald-700 text-white border-emerald-700 font-extrabold"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"
                        }`}
                      >
                        Editor
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          switchRole("admin");
                          setUserDropdownOpen(false);
                          router.push("/admin");
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          user.role === "admin"
                            ? "bg-amber-600 text-white border-amber-600 font-extrabold"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  {/* Direct Portal Shortcuts */}
                  {user.role === "editor" && (
                    <Link
                      href="/editor"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-200 hover:bg-emerald-100"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Open Editorial Desk (/editor)
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 font-extrabold border border-amber-200 hover:bg-amber-100"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Open Admin Portal (/admin)
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    <User className="w-4 h-4 text-blue-700" />
                    My Investor Profile
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    <Bookmark className="w-4 h-4 text-amber-600" />
                    Saved Watchlist
                  </Link>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-700 font-bold"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            </div>
          )}

          {/* Auth Modal Component */}
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col gap-2 text-sm text-slate-800">
          <div className="font-bold text-xs uppercase text-slate-400 pt-1">Mainboard IPOs</div>
          <Link onClick={() => setMobileMenuOpen(false)} href="/?tab=live&category=mainboard" className="px-3 py-1.5 rounded-md hover:bg-slate-200">
            Live Mainboard IPOs
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="/?tab=upcoming&category=mainboard" className="px-3 py-1.5 rounded-md hover:bg-slate-200">
            Upcoming Mainboard IPOs
          </Link>

          <div className="font-bold text-xs uppercase text-slate-400 pt-2 border-t border-slate-200">SME IPOs</div>
          <Link onClick={() => setMobileMenuOpen(false)} href="/?tab=live&category=sme" className="px-3 py-1.5 rounded-md hover:bg-slate-200">
            Live SME IPOs
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="/?tab=upcoming&category=sme" className="px-3 py-1.5 rounded-md hover:bg-slate-200">
            Upcoming SME IPOs
          </Link>

          <div className="font-bold text-xs uppercase text-slate-400 pt-2 border-t border-slate-200">Financial Hubs</div>
          <Link onClick={() => setMobileMenuOpen(false)} href="/pre-ipo" className="px-3 py-2 rounded-md hover:bg-slate-200 text-amber-700 font-bold">
            Pre-IPO (Coming Soon)
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="/brokers" className="px-3 py-2 rounded-md hover:bg-slate-200">
            Broker Comparisons
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="/payment-apps" className="px-3 py-2 rounded-md hover:bg-slate-200">
            UPI &amp; Payment Apps
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="/credit-cards" className="px-3 py-2 rounded-md hover:bg-slate-200 text-blue-700 font-bold">
            Credit Cards Comparison
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="/banks" className="px-3 py-2 rounded-md hover:bg-slate-200">
            Banks &amp; Savings Accounts
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="/articles" className="px-3 py-2 rounded-md hover:bg-slate-200 text-emerald-800 font-bold">
            Blogs &amp; Guides
          </Link>
        </div>
      )}
    </header>
  );
};
