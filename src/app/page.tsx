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
  Clock
} from "lucide-react";
import { MOCK_IPOS } from "@/data/mockIpos";
import { MOCK_PRE_IPOS } from "@/data/mockPreIpo";
import { MOCK_ANCHOR_LOCKINS } from "@/data/mockAnchorLockins";
import { MOCK_ARTICLES } from "@/data/mockArticles";
import { Badge } from "@/components/common/Badge";
import { GMPCard } from "@/components/common/GMPCard";
import { CompanyLogo } from "@/components/common/CompanyLogo";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function HomeDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Sync filters from URL search params whenever URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const categoryParam = searchParams.get("category");
    if (tabParam) setSelectedTab(tabParam);
    if (categoryParam) setCategoryFilter(categoryParam);
  }, [searchParams]);

  const updateFilters = (newTab?: string, newCategory?: string) => {
    const nextTab = newTab !== undefined ? newTab : selectedTab;
    const nextCat = newCategory !== undefined ? newCategory : categoryFilter;

    setSelectedTab(nextTab);
    setCategoryFilter(nextCat);

    const params = new URLSearchParams();
    if (nextTab !== "all") params.set("tab", nextTab);
    if (nextCat !== "all") params.set("category", nextCat);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  // Filtering Logic
  const filteredIpos = MOCK_IPOS.filter((ipo) => {
    if (categoryFilter === "mainboard" && ipo.category !== "mainboard") return false;
    if (categoryFilter === "sme" && ipo.category !== "sme") return false;

    if (selectedTab === "live" && ipo.status !== "live") return false;
    if (selectedTab === "upcoming" && ipo.status !== "upcoming") return false;
    if (selectedTab === "listed" && ipo.status !== "listed") return false;
    if (selectedTab === "high_gmp" && ipo.gmpPercent < 15) return false;

    return true;
  });

  const liveCount = MOCK_IPOS.filter((i) => i.status === "live").length;
  const upcomingCount = MOCK_IPOS.filter((i) => i.status === "upcoming").length;
  const avgGmpGain = (
    MOCK_IPOS.filter((i) => i.gmpPercent > 0).reduce((acc, i) => acc + i.gmpPercent, 0) /
    (MOCK_IPOS.filter((i) => i.gmpPercent > 0).length || 1)
  ).toFixed(1);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-6 font-sans bg-[#f8fafc] pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              INSTITUTIONAL-GRADE FINANCIAL &amp; IPO INTELLIGENCE
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Indian IPO Bidding, <span className="text-blue-700">Live GMP</span> &amp; Pre-IPO Desk
            </h1>
            <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
              Real-time tracking for BSE &amp; NSE Mainboard IPOs, SME issues, grey market premiums, anchor lock-in expiry schedules, credit card reviews, and unlisted equity allocations.
            </p>
          </div>

          {/* Quick Summary Stat Box */}
          <div className="grid grid-cols-3 gap-4 shrink-0 bg-slate-50/85 p-3.5 rounded-2xl border border-slate-200/60 text-xs font-bold w-full lg:w-auto shadow-2xs">
            <div className="text-center px-1">
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5 font-bold">Live Bidding</span>
              <strong className="text-emerald-600 text-sm block font-extrabold">{liveCount} Open</strong>
            </div>
            <div className="text-center border-x border-slate-200/70 px-3">
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5 font-bold">Upcoming</span>
              <strong className="text-slate-800 text-sm block font-extrabold">{upcomingCount} Filings</strong>
            </div>
            <div className="text-center px-1">
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5 font-bold">Avg Gain</span>
              <strong className="text-blue-700 text-sm block font-extrabold">+{avgGmpGain}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
        {/* Left Segment Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => updateFilters(undefined, "all")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                categoryFilter === "all" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Segments
            </button>
            <button
              onClick={() => updateFilters(undefined, "mainboard")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                categoryFilter === "mainboard" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mainboard
            </button>
            <button
              onClick={() => updateFilters(undefined, "sme")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                categoryFilter === "sme" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              SME IPOs
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-xs font-bold overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => updateFilters("all", undefined)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                selectedTab === "all" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All IPOs
            </button>
            <button
              onClick={() => updateFilters("live", undefined)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                selectedTab === "live" ? "bg-[#10b981] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live Bidding ({liveCount})
            </button>
            <button
              onClick={() => updateFilters("upcoming", undefined)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                selectedTab === "upcoming" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => updateFilters("high_gmp", undefined)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                selectedTab === "high_gmp" ? "bg-amber-400 text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              High GMP (&gt; 15%)
            </button>
            <button
              onClick={() => updateFilters("listed", undefined)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                selectedTab === "listed" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Recently Listed
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-xs font-bold shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Main content view */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200/60 shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/60 text-[11px]">
              <tr>
                <th className="py-3 px-3">IPO Company Name</th>
                <th className="py-3 px-3">Segment</th>
                <th className="py-3 px-3">Price Band</th>
                <th className="py-3 px-3">Min Lot</th>
                <th className="py-3 px-3">Subscription</th>
                <th className="py-3 px-3">Live GMP</th>
                <th className="py-3 px-3">Bidding Dates</th>
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
                          <Badge status={ipo.status} />
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

                  <td className="py-3.5 px-3 font-extrabold text-blue-700">
                    {ipo.totalSubscription}x
                  </td>

                  <td className="py-3.5 px-3 font-extrabold text-emerald-600">
                    +₹{ipo.gmp} (+{ipo.gmpPercent.toFixed(1)}%)
                  </td>

                  <td className="py-3.5 px-3 text-slate-400 text-xs font-semibold">
                    {ipo.openDate} to {ipo.closeDate}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href={`/ipo/${ipo.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-xs text-slate-800 hover:text-[#4f46e5] transition-colors"
                    >
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIpos.map((ipo) => (
            <div
              key={ipo.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <CompanyLogo name={ipo.name} logoUrl={ipo.logoUrl} size="md" className="rounded-lg shadow-2xs" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-slate-800 hover:text-blue-750 transition-colors line-clamp-1">
                        <Link href={`/ipo/${ipo.slug}`}>{ipo.name}</Link>
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{ipo.exchange}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge status={ipo.status} />
                    <Badge category={ipo.category} />
                  </div>
                </div>

                {/* Metrics Table */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold">Price Band</span>
                    <strong className="text-slate-800 font-extrabold">
                      ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold">Min Lot Cost</span>
                    <strong className="text-slate-800 font-extrabold">
                      ₹{ipo.minInvestment.toLocaleString("en-IN")} ({ipo.lotSize} sh)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold">Issue Size</span>
                    <strong className="text-slate-800 font-extrabold">₹{ipo.issueSizeTotalCr} Cr</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-semibold">Live Subscription</span>
                    <strong className="text-blue-700 font-extrabold">{ipo.totalSubscription}x</strong>
                  </div>
                </div>

                {/* GMP card inside */}
                <GMPCard
                  gmp={ipo.gmp}
                  gmpPercent={ipo.gmpPercent}
                  expectedListingPrice={ipo.expectedListingPrice}
                  priceBandMax={ipo.priceBandMax}
                  updatedTime={ipo.gmpUpdatedTime}
                />

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-1">
                  <span>Bidding: <strong className="text-slate-650">{ipo.openDate} to {ipo.closeDate}</strong></span>
                  <span>Listing: <strong className="text-slate-650">{ipo.listingDate}</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3.5 border-t border-slate-100">
                <Link
                  href={`/ipo/${ipo.slug}`}
                  className="w-full py-2 px-3 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
                >
                  View Comprehensive Analysis
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_ARTICLES.slice(0, 3).map((article) => (
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
