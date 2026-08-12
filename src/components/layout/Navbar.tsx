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
  ShieldCheck,
  Flame,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DynamicTagline } from "@/components/common/DynamicTagline";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [ipoMenuOpen, setIpoMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState<"small" | "normal" | "large">("normal");
  const [fontToast, setFontToast] = useState<string>("");
  const [ipos, setIpos] = useState<any[]>([]);

  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadIPOs() {
      try {
        const res = await fetch("/api/ipos");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setIpos(json.data);
        }
      } catch (err) {
        console.error("Failed to load navbar ipos:", err);
      }
    }
    loadIPOs();
  }, []);

  const activeIpos = ipos.filter((i) => i.status === "live" || i.gmp > 0);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? ipos.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="relative xl:sticky top-0 z-50 w-full flex flex-col bg-white border-b border-slate-200 shadow-sm">

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
            <span className="text-[10px] text-slate-500 font-medium tracking-wide flex items-center gap-1">
              <span>Made with</span>
              <span className="text-rose-500">❤️</span>
              <DynamicTagline />
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
                      href="/ipo-performance"
                      className="group flex items-start gap-2.5 p-2 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Award className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 block">IPO Listing Performance</span>
                        <span className="text-[11px] text-slate-500">Listing gains &amp; CMP returns</span>
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

          {/* Search Trigger (Hidden on Mobile) */}
          <div className="relative hidden sm:block">
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

          {/* WhatsApp Channel CTA (Mobile Only - replaces Search) */}
          <a
            href="https://whatsapp.com/channel/0029Va9iedA754x7193Fpx1c"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden flex items-center gap-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-full transition-colors active:scale-95 shadow-xs"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.864-9.83 0-2.623-1.01-5.092-2.846-6.93C16.59 1.947 14.136.938 11.99.938c-5.444 0-9.866 4.416-9.87 9.832-.001 1.714.453 3.39 1.313 4.877L2.43 21.139l5.803-1.521c1.558.85 3.125 1.296 4.414 1.296zM17.486 14.4c-.299-.149-1.772-.875-2.046-.975-.275-.1-.475-.149-.675.15-.199.299-.772.975-.948 1.173-.175.199-.35.224-.65.074-1.258-.63-2.11-1.053-2.92-2.456-.215-.369-.215-.599-.074-.74.126-.127.279-.328.419-.492.141-.164.188-.279.281-.463.093-.185.047-.348-.023-.497-.069-.149-.675-1.628-.925-2.228-.243-.584-.49-.505-.675-.514-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375-.274.3-.1.525-1.047 1.42-.947.896-.73 2.193.023 3.394.753 1.2 1.4 2.1 2.9 3.5 1.5 1.4 2.5 2.1 3.5 2.5.83.33 1.48.3 2.03.22.61-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.22-.57-.37z" />
            </svg>
            Join WA
          </a>
        </div>
      </nav>
    </header>
  );
};
