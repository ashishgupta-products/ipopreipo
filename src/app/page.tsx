"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Percent, 
  ChevronRight,
  Zap,
  BarChart3,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Building2,
  Smartphone,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Newspaper,
  X
} from "lucide-react";
import { MOCK_PRE_IPOS } from "@/data/mockPreIpo";
import { MOCK_ANCHOR_LOCKINS } from "@/data/mockAnchorLockins";
import { Badge } from "@/components/common/Badge";
import { GMPCard } from "@/components/common/GMPCard";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { WatchlistButton } from "@/components/auth/WatchlistButton";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

import { IPOData } from "@/types/ipo";

function HomeDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTab, setSelectedTab] = useState<string>("live");
  const [showMainboard, setShowMainboard] = useState<boolean>(true);
  const [showSme, setShowSme] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [ipos, setIpos] = useState<IPOData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState<boolean>(true);
  const [showWhatsAppBanner, setShowWhatsAppBanner] = useState<boolean>(false);

  // Check if WhatsApp banner was dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("dismissed-whatsapp-banner");
    if (!dismissed) {
      setShowWhatsAppBanner(true);
    }
  }, []);

  // Load news feed & database articles
  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              setNews(json.data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load news feed:", err);
      } finally {
        setNewsLoading(false);
      }
    }

    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              setArticles(json.data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setArticlesLoading(false);
      }
    }

    loadNews();
    loadArticles();
  }, []);

  // Load live IPOs
  useEffect(() => {
    async function loadIPOs() {
      try {
        const res = await fetch("/api/ipos");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              setIpos(json.data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch live IPOs, using mock data fallback.", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadIPOs();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const isAlreadyListed = (ipo: any) => {
    if (ipo.status === "listed") return true;
    if (ipo.listingDate && ipo.listingDate < todayStr) return true;
    return false;
  };

  const isLive = (ipo: any) => {
    if (isAlreadyListed(ipo)) return false;
    if (ipo.status === "live") {
      if (ipo.closeDate && ipo.closeDate < todayStr) return false;
      return true;
    }
    if (ipo.openDate && ipo.closeDate && ipo.openDate <= todayStr && todayStr <= ipo.closeDate) {
      return true;
    }
    return false;
  };

  const isUpcoming = (ipo: any) => {
    if (isAlreadyListed(ipo) || isLive(ipo)) return false;
    if (ipo.status === "upcoming") {
      if (ipo.openDate && ipo.openDate <= todayStr) return false;
      return true;
    }
    if (ipo.openDate && ipo.openDate > todayStr) return true;
    return false;
  };

  const isAllotment = (ipo: any) => {
    if (isAlreadyListed(ipo) || isLive(ipo) || isUpcoming(ipo)) return false;
    if (ipo.status === "closed" || ipo.status === "allotment_out") return true;
    if (ipo.closeDate && ipo.closeDate < todayStr && (!ipo.listingDate || ipo.listingDate >= todayStr)) return true;
    return false;
  };

  // Sync filters from URL search params whenever URL or data changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const categoryParam = searchParams.get("category");
    
    if (tabParam) {
      setSelectedTab(tabParam);
    } else if (ipos.length > 0) {
      // Smart tab default: if no Live IPOs, switch to first tab with active listings
      const hasLive = ipos.some(isLive);
      if (!hasLive && ipos.some(isUpcoming)) {
        setSelectedTab("upcoming");
      } else if (!hasLive && ipos.some(isAllotment)) {
        setSelectedTab("allotment");
      } else if (!hasLive && ipos.some(isAlreadyListed)) {
        setSelectedTab("listed");
      } else {
        setSelectedTab("live");
      }
    } else {
      setSelectedTab("live");
    }

    if (categoryParam === "sme") {
      setShowMainboard(false);
      setShowSme(true);
    } else if (categoryParam === "mainboard") {
      setShowMainboard(true);
      setShowSme(false);
    } else {
      // Default: show both Mainboard & SME for complete market view
      setShowMainboard(true);
      setShowSme(true);
    }
  }, [searchParams, ipos]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}-${month}-${year.slice(-2)}`;
    }
    return dateStr;
  };

  const updateTab = (newTab: string) => {
    setSelectedTab(newTab);
    const params = new URLSearchParams();
    params.set("tab", newTab);
    if (showMainboard && showSme) {
      params.set("category", "all");
    } else if (!showMainboard && showSme) {
      params.set("category", "sme");
    } else if (showMainboard && !showSme) {
      params.set("category", "mainboard");
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const updateCategoryCheckboxes = (newMainboard: boolean, newSme: boolean) => {
    if (!newMainboard && !newSme) {
      if (showMainboard) {
        newSme = true;
      } else {
        newMainboard = true;
      }
    }
    setShowMainboard(newMainboard);
    setShowSme(newSme);

    const params = new URLSearchParams();
    if (selectedTab !== "live") params.set("tab", selectedTab);
    if (newMainboard && newSme) {
      params.set("category", "all");
    } else if (!newMainboard && newSme) {
      params.set("category", "sme");
    } else if (newMainboard && !newSme) {
      params.set("category", "mainboard");
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  // Filtering Logic
  const filteredIpos = ipos
    .filter((ipo) => {
      // Category checkbox filters
      if (showMainboard && !showSme && ipo.category !== "mainboard") return false;
      if (showSme && !showMainboard && ipo.category !== "sme") return false;
      if (!showMainboard && !showSme) return false;

      if (selectedTab === "live" && !isLive(ipo)) return false;
      if (selectedTab === "allotment" && !isAllotment(ipo)) return false;
      if (selectedTab === "upcoming" && !isUpcoming(ipo)) return false;
      if (selectedTab === "listed" && !isAlreadyListed(ipo)) return false;

      return true;
    })
    .sort((a, b) => {
      if (selectedTab === "live") {
        const closeA = a.closeDate || "";
        const closeB = b.closeDate || "";
        if (closeA && closeB) return closeA.localeCompare(closeB);
        return (b.gmpPercent || 0) - (a.gmpPercent || 0);
      }
      if (selectedTab === "allotment") {
        const altA = a.allotmentDate || a.closeDate || "";
        const altB = b.allotmentDate || b.closeDate || "";
        return altB.localeCompare(altA);
      }
      if (selectedTab === "upcoming") {
        const openA = a.openDate || "";
        const openB = b.openDate || "";
        if (!openA) return 1;
        if (!openB) return -1;
        return openA.localeCompare(openB);
      }
      if (selectedTab === "listed") {
        const listA = a.listingDate || "";
        const listB = b.listingDate || "";
        return listB.localeCompare(listA);
      }
      return 0;
    });

  const liveCount = ipos.filter(isLive).length;
  const allotmentCount = ipos.filter(isAllotment).length;
  const upcomingCount = ipos.filter(isUpcoming).length;
  const listedCount = ipos.filter(isAlreadyListed).length;

  // Counts for the current active tab
  const currentTabIpos = ipos.filter((ipo) => {
    if (selectedTab === "live") return isLive(ipo);
    if (selectedTab === "allotment") return isAllotment(ipo);
    if (selectedTab === "upcoming") return isUpcoming(ipo);
    if (selectedTab === "listed") return isAlreadyListed(ipo);
    return true;
  });
  const tabMainboardCount = currentTabIpos.filter((i) => i.category === "mainboard").length;
  const tabSmeCount = currentTabIpos.filter((i) => i.category === "sme").length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-center animate-pulse">
            <img src="/logo.svg" alt="IPO Preipo Logo" className="w-12 h-12 object-contain" />
          </div>
          <div className="flex gap-1.5 py-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" />
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
          </div>
          <p className="text-xs text-slate-500 font-bold animate-pulse">Fetching Live Grey Market Premiums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-6 font-sans bg-[#f8fafc] pb-16">

      {/* WhatsApp Channel Mobile Banner */}
      {showWhatsAppBanner && (
        <div className="md:hidden bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden flex flex-col space-y-3 animate-fade-in border border-emerald-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
          
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex gap-3">
              <div className="shrink-0">
                <svg className="w-10 h-10 drop-shadow-md" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#25D366" />
                  <circle cx="24" cy="24" r="20" fill="#25D366" stroke="white" strokeWidth="2" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 12C17.373 12 12 17.373 12 24C12 26.459 12.74 28.746 14.009 30.663L12.539 35.462L17.514 34.037C19.364 35.193 21.605 35.864 24 35.864C30.627 35.864 36 30.491 36 23.864C36 17.237 30.627 12 24 12ZM30.245 28.173C29.965 28.96 28.759 29.604 27.927 29.779C27.354 29.901 26.611 29.993 24.09 28.953C20.868 27.623 18.791 24.343 18.63 24.126C18.476 23.909 17.339 22.404 17.339 20.85C17.339 19.296 18.133 18.541 18.457 18.205C18.72 17.932 19.159 17.802 19.582 17.802C19.719 17.802 19.842 17.809 19.951 17.816C20.271 17.83 20.435 17.844 20.647 18.349C20.913 18.99 21.56 20.57 21.642 20.734C21.724 20.898 21.806 21.116 21.697 21.334C21.594 21.552 21.505 21.661 21.348 21.845C21.191 22.03 21.048 22.173 20.891 22.364C20.748 22.528 20.584 22.706 20.761 23.013C20.939 23.313 21.552 24.315 22.459 25.12C23.632 26.163 24.587 26.497 24.934 26.64C25.262 26.777 25.459 26.743 25.644 26.532C25.869 26.273 26.611 25.401 26.891 24.998C27.171 24.596 27.451 24.658 27.826 24.801C28.208 24.944 30.245 25.947 30.662 26.152C31.078 26.356 31.358 26.459 31.46 26.636C31.562 26.813 31.562 27.393 31.282 28.178L30.245 28.173Z" fill="white" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  Join WhatsApp Channel
                  <span className="bg-white/20 text-[9px] uppercase px-1.5 py-0.5 rounded font-black tracking-wider animate-pulse">Live GMP</span>
                </h4>
                <p className="text-[11px] text-emerald-100 font-medium leading-tight">
                  Get every update on time straight to your WhatsApp!
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setShowWhatsAppBanner(false);
                localStorage.setItem("dismissed-whatsapp-banner", "true");
              }}
              className="text-white/75 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2.5 pt-1 relative z-10">
            <a 
              href="https://whatsapp.com/channel/0029Vb3ARRK4CrfqyqsTkP1B" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-xs py-2 rounded-xl text-center shadow-xs transition-colors"
            >
              Join Channel
            </a>
            <button 
              onClick={() => {
                setShowWhatsAppBanner(false);
                localStorage.setItem("dismissed-whatsapp-banner", "true");
              }}
              className="px-4 py-2 border border-white/30 hover:border-white/50 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="space-y-3">
        {/* Top Controls Row: Status Tabs + View Switcher */}
        <div className="flex flex-row items-center justify-between gap-3 overflow-x-auto py-1">
          {/* Status Tabs (Left side) */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-xs font-bold shrink-0">
            <button
              onClick={() => updateTab("live")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-200 ${
                selectedTab === "live" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live ({liveCount})
            </button>
            <button
              onClick={() => updateTab("allotment")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-200 ${
                selectedTab === "allotment" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Allotment ({allotmentCount})
            </button>
            <button
              onClick={() => updateTab("upcoming")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-200 ${
                selectedTab === "upcoming" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => updateTab("listed")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-200 ${
                selectedTab === "listed" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Listed ({listedCount})
            </button>
          </div>

          {/* View Switcher (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-xs font-bold shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
            >
              Table
            </button>
          </div>
        </div>

        {/* Checkboxes Row (Below Live / Tabs) */}
        <div className="flex items-center gap-3 py-0.5">
          <label className={`inline-flex items-center gap-2 cursor-pointer select-none text-xs font-bold transition-all px-3 py-1.5 rounded-xl border ${
            showMainboard 
              ? "bg-blue-50/70 border-blue-200 text-blue-900 shadow-3xs" 
              : "bg-white border-slate-200/80 text-slate-600 hover:border-slate-300"
          }`}>
            <input
              type="checkbox"
              checked={showMainboard}
              onChange={(e) => updateCategoryCheckboxes(e.target.checked, showSme)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Mainboard ({tabMainboardCount})
            </span>
          </label>

          <label className={`inline-flex items-center gap-2 cursor-pointer select-none text-xs font-bold transition-all px-3 py-1.5 rounded-xl border ${
            showSme 
              ? "bg-amber-50/70 border-amber-200 text-amber-900 shadow-3xs" 
              : "bg-white border-slate-200/80 text-slate-600 hover:border-slate-300"
          }`}>
            <input
              type="checkbox"
              checked={showSme}
              onChange={(e) => updateCategoryCheckboxes(showMainboard, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer accent-amber-600"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              SME ({tabSmeCount})
            </span>
          </label>
        </div>
      </div>

      {/* Main content view */}
      {viewMode === "table" && (
        <div 
          key={`table-${selectedTab}-${showMainboard}-${showSme}`}
          className="hidden md:block overflow-x-auto rounded-2xl bg-white border border-slate-200/60 shadow-xs animate-fade-in"
        >
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/60 text-[11px]">
              <tr>
                <th className="py-3 px-3">IPO Company Name</th>
                <th className="py-3 px-3">Segment</th>
                <th className="py-3 px-3">Price Band</th>
                <th className="py-3 px-3">Min Lot</th>
                <th className="py-3 px-3">{selectedTab === "listed" ? "Listed Price" : selectedTab === "allotment" ? "Allotment Date" : "Subscription"}</th>
                <th className="py-3 px-3">{selectedTab === "listed" ? "Listing Gain" : "Live GMP"}</th>
                <th className="py-3 px-3">{selectedTab === "allotment" ? "Listing Date" : selectedTab === "upcoming" ? "Opens On" : selectedTab === "listed" ? "Listing Date" : "Bidding Dates"}</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredIpos.map((ipo) => (
                <tr key={ipo.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    <div className="flex items-center gap-2.5">
                      <CompanyLogo name={ipo.name} logoUrl={ipo.logoUrl} size="sm" className="rounded-lg shadow-2xs" />
                      <div>
                        <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-750 block font-bold text-xs sm:text-sm leading-tight transition-colors">
                          {ipo.name}
                        </Link>
                        <div className="mt-1 flex items-center gap-1">
                          <Badge 
                            status={ipo.status} 
                            openDate={ipo.openDate} 
                            closeDate={ipo.closeDate} 
                            allotmentDate={ipo.allotmentDate} 
                            listingDate={ipo.listingDate} 
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <Badge category={ipo.category} />
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-800">₹{ipo.minInvestment.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">{ipo.lotSize} shares</span>
                  </td>

                   <td className={`py-3.5 px-3 font-extrabold ${isAlreadyListed(ipo) ? "text-slate-800" : selectedTab === "allotment" ? "text-purple-700" : "text-blue-700"}`}>
                    {isAlreadyListed(ipo) 
                      ? (ipo.listingPrice || ipo.expectedListingPrice ? `₹${ipo.listingPrice || ipo.expectedListingPrice}` : "--") 
                      : selectedTab === "allotment"
                        ? (formatDate(ipo.allotmentDate) || "Awaiting")
                        : `${ipo.totalSubscription || 0}x`}
                  </td>

                  <td className={`py-3.5 px-3 font-extrabold ${!isAlreadyListed(ipo) && (!ipo.gmpTrends || ipo.gmpTrends.length === 0) ? "text-slate-400 font-medium" : (ipo.gmp < 0 ? "text-rose-600" : "text-emerald-600")}`}>
                    {isAlreadyListed(ipo) ? (
                      `${ipo.listingGainPercent !== undefined ? (ipo.listingGainPercent >= 0 ? "+" : "") + ipo.listingGainPercent.toFixed(1) : (ipo.gmpPercent >= 0 ? "+" : "") + ipo.gmpPercent.toFixed(1)}%`
                    ) : (
                      ipo.gmpTrends && ipo.gmpTrends.length > 0 ? (
                        ipo.gmp !== 0 
                          ? `${ipo.gmp > 0 ? "+" : "-"}₹${Math.abs(ipo.gmp)} (${ipo.gmp > 0 ? "+" : "-"}${Math.abs(ipo.gmpPercent).toFixed(1)}%)` 
                          : "₹0"
                      ) : (
                        "--"
                      )
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 text-xs font-semibold">
                    {selectedTab === "allotment" 
                      ? (formatDate(ipo.listingDate) || "--")
                      : selectedTab === "upcoming"
                        ? formatDate(ipo.openDate)
                        : isAlreadyListed(ipo)
                          ? (formatDate(ipo.listingDate) || "--")
                          : `${formatDate(ipo.openDate)} to ${formatDate(ipo.closeDate)}`}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <WatchlistButton ipoSlug={ipo.slug} ipoId={ipo.id} ipoName={ipo.name} />
                      {selectedTab === "allotment" ? (
                        <Link
                          href={`/allotment?ipo=${ipo.id}`}
                          className="inline-flex items-center gap-1 font-bold text-xs text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md border border-purple-200 transition-colors"
                        >
                          Check Allotment <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          className="inline-flex items-center gap-1 font-bold text-xs text-slate-800 hover:text-[#4f46e5] transition-colors"
                        >
                          Details <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View (Active on mobile even if viewMode is table) */}
      <div 
        key={`grid-${selectedTab}-${showMainboard}-${showSme}`}
        className={`${viewMode === "table" ? "md:hidden" : ""} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in`}
      >
        {filteredIpos.map((ipo) => {
          const rec = ipo.recommendation || "Neutral";
          let recBadge = { text: rec, bg: "bg-amber-50 text-amber-700 border-amber-250/60" };
          if (rec === "Avoid") {
            recBadge.bg = "bg-rose-50 text-rose-700 border-rose-250/60";
          } else if (rec.startsWith("Apply") || rec.toLowerCase().includes("apply")) {
            recBadge.bg = "bg-emerald-50 text-emerald-700 border-emerald-250/60";
          } else if (rec === "Neutral" || rec === "May Apply") {
            recBadge.bg = "bg-amber-50 text-amber-800 border-amber-250/60";
          }

          return (
            <div
              key={ipo.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                {/* Top Row: Category (Left), Status & Watchlist (Right) */}
                <div className="flex items-center justify-between">
                  <Badge category={ipo.category} />
                  <div className="flex items-center gap-1.5">
                    <Badge 
                      status={ipo.status} 
                      openDate={ipo.openDate} 
                      closeDate={ipo.closeDate} 
                      allotmentDate={ipo.allotmentDate} 
                      listingDate={ipo.listingDate} 
                    />
                    <WatchlistButton ipoSlug={ipo.slug} ipoId={ipo.id} ipoName={ipo.name} />
                  </div>
                </div>

                {/* Company Logo, Name & Price Band */}
                <div className="flex items-start gap-3">
                  <CompanyLogo name={ipo.name} logoUrl={ipo.logoUrl} size="md" className="rounded-xl shadow-2xs shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-750 transition-colors">
                      <h3 className="font-extrabold text-slate-850 text-sm sm:text-base leading-tight truncate">
                        {ipo.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                      ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold text-[11px]">Price Band</span>
                    <strong className="text-slate-800 font-extrabold text-xs block truncate">
                      ₹{ipo.priceBandMin}-{ipo.priceBandMax}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold text-[11px]">Min Lot Cost</span>
                    <strong className="text-slate-800 font-extrabold text-xs block truncate">
                      ₹{ipo.minInvestment.toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold text-[11px]">Issue Size</span>
                    <strong className="text-slate-800 font-extrabold text-xs block truncate">
                      ₹{ipo.issueSizeTotalCr} Cr
                    </strong>
                  </div>

                  {/* Row 2 */}
                  <div className="border-t border-slate-200/60 pt-2">
                    <span className="text-slate-400 block mb-0.5 font-semibold text-[11px]">Allotment</span>
                    <strong className="text-slate-850 font-extrabold text-xs block truncate">{formatDate(ipo.allotmentDate)}</strong>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2">
                    <span className="text-slate-400 block mb-0.5 font-semibold text-[11px]">Refund Init</span>
                    <strong className="text-slate-850 font-extrabold text-xs block truncate">{formatDate(ipo.refundDate)}</strong>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2">
                    <span className="text-slate-400 block mb-0.5 font-semibold text-[11px]">Listing Date</span>
                    <strong className="text-slate-850 font-extrabold text-xs block truncate">{formatDate(ipo.listingDate)}</strong>
                  </div>

                  {/* Row 3 */}
                  <div className="border-t border-slate-200/60 pt-2">
                    <span className="text-slate-400 block mb-0.5 font-semibold text-[11px]">
                      {isAlreadyListed(ipo) ? "Listed At" : selectedTab === "allotment" ? "Allotment Date" : "Live Sub"}
                    </span>
                    <strong className={`${isAlreadyListed(ipo) ? "text-slate-800" : selectedTab === "allotment" ? "text-purple-700" : "text-blue-700"} font-extrabold text-xs block truncate`}>
                      {isAlreadyListed(ipo) ? `₹${ipo.listingPrice || ipo.expectedListingPrice}` : selectedTab === "allotment" ? (formatDate(ipo.allotmentDate) || "Awaiting") : `${ipo.totalSubscription}x`}
                    </strong>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2">
                    <span className={`${!isAlreadyListed(ipo) && (!ipo.gmpTrends || ipo.gmpTrends.length === 0) ? "text-slate-400 font-semibold" : (ipo.gmp < 0 ? "text-rose-700" : "text-emerald-700 font-bold")} block mb-0.5 text-[11px]`}>
                      {isAlreadyListed(ipo) ? "Listing Gain" : "GMP Rate"}
                    </span>
                    <strong className={`${!isAlreadyListed(ipo) && (!ipo.gmpTrends || ipo.gmpTrends.length === 0) ? "text-slate-500 font-bold" : (ipo.gmp < 0 ? "text-rose-700" : "text-emerald-700")} font-extrabold text-xs block truncate`}>
                      {isAlreadyListed(ipo) ? (
                        `${ipo.listingGainPercent !== undefined ? (ipo.listingGainPercent >= 0 ? "+" : "") + ipo.listingGainPercent.toFixed(1) : (ipo.gmpPercent >= 0 ? "+" : "") + ipo.gmpPercent.toFixed(1)}%`
                      ) : (
                        ipo.gmpTrends && ipo.gmpTrends.length > 0 ? (
                          ipo.gmp !== 0 
                            ? `${ipo.gmp > 0 ? "+" : "-"}₹${Math.abs(ipo.gmp)} (${ipo.gmp > 0 ? "+" : "-"}${Math.abs(ipo.gmpPercent).toFixed(1)}%)` 
                            : "₹0"
                        ) : (
                          "--"
                        )
                      )}
                    </strong>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2">
                    <span className={`${!isAlreadyListed(ipo) && (!ipo.gmpTrends || ipo.gmpTrends.length === 0) ? "text-slate-400 font-semibold" : (ipo.gmp < 0 ? "text-rose-700 font-bold" : "text-emerald-700 font-bold")} block mb-0.5 text-[11px]`}>
                      {isAlreadyListed(ipo) 
                        ? (ipo.listingGainPercent !== undefined && ipo.listingGainPercent < 0 ? "Listed Loss" : "Listed Profit") 
                        : (ipo.gmpTrends && ipo.gmpTrends.length > 0 ? (ipo.gmp < 0 ? "Est. Loss" : "Est. Profit") : "Est. Gain")}
                    </span>
                    <strong className={`${!isAlreadyListed(ipo) && (!ipo.gmpTrends || ipo.gmpTrends.length === 0) ? "text-slate-500 font-bold" : (ipo.gmp < 0 ? "text-rose-700" : "text-emerald-700")} font-extrabold text-xs block truncate`}>
                      {isAlreadyListed(ipo) ? (
                        `₹${Math.abs(( (ipo.listingPrice || ipo.expectedListingPrice) - ipo.priceBandMax ) * ipo.lotSize).toLocaleString("en-IN")}`
                      ) : (
                        ipo.gmpTrends && ipo.gmpTrends.length > 0 ? (
                          ipo.gmp !== 0 ? `₹${Math.abs(ipo.gmp * ipo.lotSize).toLocaleString("en-IN")}` : "₹0"
                        ) : (
                          "--"
                        )
                      )}
                    </strong>
                  </div>
                </div>

             {/* Action Buttons */}
             <div className={`pt-3.5 border-t border-slate-100 grid ${
               selectedTab === "upcoming" 
                 ? "grid-cols-1" 
                 : isAlreadyListed(ipo) 
                   ? "grid-cols-2" 
                   : (selectedTab === "allotment" || isAllotment(ipo))
                     ? "grid-cols-2"
                     : "grid-cols-2"
             } gap-2`}>
               <Link
                 href={`/ipo/${ipo.slug}`}
                 className="py-2.5 px-1 rounded-xl bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center text-center font-semibold"
               >
                 Full Details
               </Link>
               {selectedTab === "allotment" || isAllotment(ipo) ? (
                 <Link
                   href={`/allotment?ipo=${ipo.id}`}
                   className="py-2.5 px-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center text-center font-semibold gap-1"
                 >
                   Check Allotment
                 </Link>
               ) : !isAlreadyListed(ipo) && selectedTab !== "upcoming" ? (
                 <Link
                   href={`/ipo/${ipo.slug}#subscription`}
                   className="py-2.5 px-1 rounded-xl border border-slate-205 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center text-center font-semibold"
                 >
                   Subscription
                 </Link>
               ) : isAlreadyListed(ipo) ? (
                 <a
                   href={`https://www.google.com/search?q=${encodeURIComponent(ipo.name + " share price")}`}
                   target="_blank"
                   rel="noreferrer"
                   className="py-2.5 px-1 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center text-center font-semibold"
                 >
                   Watch Live
                 </a>
               ) : null}
             </div>
          </div>
        );
      })}
      </div>

      {/* Empty State Banner if no IPOs match */}
      {filteredIpos.length === 0 && (
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center flex flex-col items-center justify-center space-y-4 my-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              No {selectedTab === "live" ? "Live Bidding" : selectedTab === "allotment" ? "Allotment Phase" : selectedTab === "upcoming" ? "Upcoming" : "Listed"} IPOs Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium leading-relaxed">
              {selectedTab === "live" && upcomingCount > 0 
                ? `There are no IPOs actively open for bidding today, but ${upcomingCount} upcoming IPOs are scheduled to open soon.`
                : "No IPO records match the currently selected status and segment filters."}
            </p>
          </div>
          {selectedTab === "live" && upcomingCount > 0 && (
            <button
              onClick={() => updateTab("upcoming")}
              className="px-5 py-2.5 bg-[#0c1220] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              View Upcoming IPOs ({upcomingCount}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Pre-IPO Teaser Section */}
      <section className="pt-1">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-white border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50/30 rounded-full blur-2xl -z-10 translate-x-12 -translate-y-12" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3.5">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-855 border border-amber-200/60">
                  <Percent className="w-3.5 h-3.5 animate-pulse" />
                  UNLISTED &amp; PRE-IPO SHARES DESK
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-600 text-white uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Access Unlisted Pre-IPO Equities Before Public Filings
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed max-w-2xl">
                We are building a premium portal to inquire and trade pre-IPO shares in leading Indian conglomerates (Tata Capital, NSE India, Reliance Retail, and boAt Lifestyle) with secure CDSL/NSDL demat transfers. Stay tuned!
              </p>
              <div className="pt-1.5">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-400 text-white font-bold text-xs select-none shadow-xs">
                  Coming Soon
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-2.5 opacity-60 pointer-events-none select-none relative">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
                <span className="bg-slate-900 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded shadow-md tracking-wider">Preview Only</span>
              </div>
              {MOCK_PRE_IPOS.slice(0, 2).map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-white/80 border border-slate-250/70 backdrop-blur-xs flex justify-between items-center text-xs shadow-2xs">
                  <div>
                    <strong className="text-slate-800 block font-bold">{item.companyName}</strong>
                    <span className="text-slate-400 font-semibold">{item.sector}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-amber-700 text-sm block">₹{item.estimatedPrice}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Est. Price</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Hubs Grid for SEO and Internal Linking */}
      <section className="pt-1 space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2 px-1">
          <Sparkles className="w-4.5 h-4.5 text-blue-700 animate-pulse" />
          Compare &amp; Research Financial Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Credit Cards */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 border-t-4 border-t-blue-600 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md hover:border-blue-500/35 transition-all duration-300 group">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-750">6 Cards</span>
              </div>
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-blue-750 transition-colors">Credit Cards Comparison</h3>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Compare annual fees, reward rates, lounge access privileges, and cashback terms across premium card issuers.
              </p>
            </div>
            <Link href="/credit-cards" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 group-hover:text-blue-650 transition-colors">
              Find Best Card <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Card 2: Stock Brokers */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 border-t-4 border-t-indigo-600 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md hover:border-indigo-500/35 transition-all duration-300 group">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-50 text-indigo-750">4 Platforms</span>
              </div>
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-755 transition-colors">Stock Brokers Desk</h3>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Review brokerage charges, leverage rates, account setup fees, and technical trading stability ratings.
              </p>
            </div>
            <Link href="/brokers" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-800 group-hover:text-indigo-650 transition-colors">
              Compare Brokers <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Card 3: UPI & Payment Apps */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 border-t-4 border-t-emerald-600 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md hover:border-emerald-500/35 transition-all duration-300 group">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-750">4 Apps</span>
              </div>
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-emerald-755 transition-colors">UPI &amp; Payment Apps</h3>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Analyze transaction failure rates, scratch card rewards reality check, and UPI Lite support limits.
              </p>
            </div>
            <Link href="/payment-apps" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 group-hover:text-emerald-650 transition-colors">
              Compare Payment Apps <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Card 4: Banks */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 border-t-4 border-t-purple-600 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md hover:border-purple-500/35 transition-all duration-300 group">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-50 text-purple-750">3 Types</span>
              </div>
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-purple-755 transition-colors">Banks &amp; Savings Account</h3>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Compare FD peak yields, monthly minimum balances, and savings interest rates across Indian banks.
              </p>
            </div>
            <Link href="/banks" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-800 group-hover:text-purple-650 transition-colors">
              Compare Banks <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="pt-1 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-slate-805" />
            Latest IPO Research &amp; Articles
          </h2>
          <Link href="/articles" className="text-xs text-blue-800 font-bold hover:text-blue-600 transition-colors flex items-center gap-1">
            Read All Guides <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {articlesLoading ? (
          <div className="col-span-3 py-8 text-center text-xs font-semibold text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200/60 shadow-2xs">
            Loading latest research articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-3 py-8 text-center text-xs font-semibold text-slate-400 bg-white rounded-2xl border border-slate-200/60 shadow-2xs">
            No research reports published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 col-span-3 w-full">
            {articles.slice(0, 3).map((article) => (
              <div 
                key={article.id} 
              className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-100">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                    <Clock className="w-3 h-3" />
                    {article.readingTimeMins} Min
                  </span>
                </div>
                
                <h3 className="font-bold text-sm text-slate-850 group-hover:text-blue-755 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="text-[11px] text-slate-505 font-semibold leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-3.5 border-t border-slate-100/80">
                <span>By {article.author.name}</span>
                <span>{article.publishDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      </section>

      {/* Anchor Lock-In Section */}
      <section className="pt-1">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Lock className="w-4 h-4 text-slate-850" />
              <span>Anchor Lock-In Expiry Schedule</span>
            </div>
            <Link href="/anchor-lockins" className="text-xs text-blue-800 font-bold hover:text-blue-600 transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-xs text-slate-505 font-semibold leading-relaxed">
            Monitor institutional anchor lock-in expiration dates (30-day &amp; 90-day) to evaluate post-lock-in share supply.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
            {MOCK_ANCHOR_LOCKINS.slice(0, 2).map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center hover:border-slate-350 transition-colors shadow-3xs">
                <div>
                  <strong className="text-slate-850 block font-bold">{item.ipoName}</strong>
                  <span className="text-slate-400 font-semibold">Listed: {item.listingDate}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-indigo-700 block">30-Day: {item.lockIn30DaysDate}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">{item.lockIn30DaysStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center text-slate-500 font-bold text-sm">Loading IPO Intelligence Dashboard...</div>}>
      <HomeDashboardContent />
    </Suspense>
  );
}
