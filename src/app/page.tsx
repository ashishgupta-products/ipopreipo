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
  ShieldCheck
} from "lucide-react";
import { MOCK_IPOS } from "@/data/mockIpos";
import { MOCK_PRE_IPOS } from "@/data/mockPreIpo";
import { MOCK_ANCHOR_LOCKINS } from "@/data/mockAnchorLockins";
import { Badge } from "@/components/common/Badge";
import { GMPCard } from "@/components/common/GMPCard";
import { Calculator } from "@/components/common/Calculator";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Sync filters from URL search params (e.g. from Mega Menu links)
  useEffect(() => {
    const handleUrlParams = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab");
        const categoryParam = params.get("category");
        if (tabParam) setSelectedTab(tabParam);
        if (categoryParam) setCategoryFilter(categoryParam);
      }
    };

    handleUrlParams();
    window.addEventListener("popstate", handleUrlParams);
    return () => window.removeEventListener("popstate", handleUrlParams);
  }, []);

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
    <div className="min-h-screen space-y-10 pb-16 bg-slate-50">
      {/* Clean Corporate Hero Section */}
      <section className="bg-white border-b border-slate-200 py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                Institutional-Grade IPO Intelligence Portal
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Indian IPO Bidding, <span className="text-blue-700">Live GMP</span> &amp; Pre-IPO Desk
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed">
                Real-time tracking for BSE &amp; NSE Mainboard IPOs, SME issues, grey market premiums, anchor lock-in expiry schedules, and unlisted equity allocations.
              </p>
            </div>

            {/* Quick Summary Stat Box */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="px-3 py-1 text-center">
                <span className="text-slate-500 block">Live Bidding</span>
                <strong className="text-base font-extrabold text-emerald-700">{liveCount} Open</strong>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-200">
                <span className="text-slate-500 block">Upcoming</span>
                <strong className="text-base font-extrabold text-slate-900">{upcomingCount} Filings</strong>
              </div>
              <div className="px-3 py-1 text-center">
                <span className="text-slate-500 block">Avg Listing Gain</span>
                <strong className="text-base font-extrabold text-blue-700">+{avgGmpGain}%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Left Segment Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-3 py-1.5 rounded ${
                  categoryFilter === "all" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Segments
              </button>
              <button
                onClick={() => setCategoryFilter("mainboard")}
                className={`px-3 py-1.5 rounded ${
                  categoryFilter === "mainboard" ? "bg-white text-blue-700 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mainboard
              </button>
              <button
                onClick={() => setCategoryFilter("sme")}
                className={`px-3 py-1.5 rounded ${
                  categoryFilter === "sme" ? "bg-white text-amber-700 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                SME IPOs
              </button>
            </div>

            {/* Status Filter */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200 overflow-x-auto">
              <button
                onClick={() => setSelectedTab("all")}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  selectedTab === "all" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All IPOs
              </button>
              <button
                onClick={() => setSelectedTab("live")}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  selectedTab === "live" ? "bg-emerald-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Live Bidding ({liveCount})
              </button>
              <button
                onClick={() => setSelectedTab("upcoming")}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  selectedTab === "upcoming" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setSelectedTab("high_gmp")}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  selectedTab === "high_gmp" ? "bg-emerald-50 text-emerald-800 font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                High GMP (&gt;15%)
              </button>
              <button
                onClick={() => setSelectedTab("listed")}
                className={`px-3 py-1.5 rounded whitespace-nowrap ${
                  selectedTab === "listed" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Recently Listed
              </button>
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1 rounded font-semibold ${viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 rounded font-semibold ${viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              Table View
            </button>
          </div>
        </div>

        {/* View Mode: Table View */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">IPO Company Name</th>
                  <th className="py-3 px-4">Segment</th>
                  <th className="py-3 px-4">Price Band</th>
                  <th className="py-3 px-4">Min Lot</th>
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Live GMP</th>
                  <th className="py-3 px-4">Bidding Dates</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredIpos.map((ipo) => (
                  <tr key={ipo.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <CompanyLogo name={ipo.name} logoUrl={ipo.logoUrl} size="sm" />
                        <div>
                          <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-700 block font-bold text-xs sm:text-sm leading-tight">
                            {ipo.name}
                          </Link>
                          <div className="mt-1 flex items-center gap-1">
                            <Badge status={ipo.status} />
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge category={ipo.category} />
                    </td>

                    <td className="py-3.5 px-4 font-semibold">
                      ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                    </td>

                    <td className="py-3.5 px-4">
                      ₹{ipo.minInvestment.toLocaleString("en-IN")}
                      <span className="text-[11px] text-slate-400 block">{ipo.lotSize} shares</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-blue-700">
                      {ipo.totalSubscription}x
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      +₹{ipo.gmp} (+{ipo.gmpPercent.toFixed(1)}%)
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {ipo.openDate} to {ipo.closeDate}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/ipo/${ipo.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-xs text-blue-700 hover:underline"
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
          /* View Mode: Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIpos.map((ipo) => (
              <div
                key={ipo.id}
                className="p-5 rounded-xl clean-card transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <CompanyLogo name={ipo.name} logoUrl={ipo.logoUrl} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-slate-900 hover:text-blue-700 transition-colors line-clamp-1">
                          <Link href={`/ipo/${ipo.slug}`}>{ipo.name}</Link>
                        </h3>
                        <span className="text-xs text-slate-500">{ipo.exchange}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge status={ipo.status} />
                      <Badge category={ipo.category} />
                    </div>
                  </div>

                  {/* Metrics Table */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">Price Band:</span>
                      <strong className="text-slate-900 font-bold">
                        ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Min Lot Cost:</span>
                      <strong className="text-slate-900 font-bold">
                        ₹{ipo.minInvestment.toLocaleString("en-IN")} ({ipo.lotSize} sh)
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Issue Size:</span>
                      <strong className="text-slate-900 font-bold">₹{ipo.issueSizeTotalCr} Cr</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Live Subscription:</span>
                      <strong className="text-blue-700 font-bold">{ipo.totalSubscription}x</strong>
                    </div>
                  </div>

                  {/* Minimal GMP Card */}
                  <GMPCard
                    gmp={ipo.gmp}
                    gmpPercent={ipo.gmpPercent}
                    expectedListingPrice={ipo.expectedListingPrice}
                    priceBandMax={ipo.priceBandMax}
                    updatedTime={ipo.gmpUpdatedTime}
                  />

                  {/* Dates Row */}
                  <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                    <span>Bidding: <strong className="text-slate-800">{ipo.openDate} to {ipo.closeDate}</strong></span>
                    <span>Listing: <strong className="text-slate-800">{ipo.listingDate}</strong></span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={`/ipo/${ipo.slug}`}
                    className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    View Comprehensive Analysis
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pre-IPO Teaser Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-amber-200 shadow-sm relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Percent className="w-3.5 h-3.5 text-amber-700" />
                UNLISTED &amp; PRE-IPO SHARES DESK
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Access Unlisted Pre-IPO Equities Before Public Filings
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                Inquire and trade pre-IPO shares in leading Indian conglomerates like Tata Capital, NSE India, Reliance Retail, and boAt Lifestyle. Safe demat-to-demat transfer.
              </p>
              <div className="pt-2">
                <Link
                  href="/pre-ipo"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-sm"
                >
                  Explore Unlisted Equities
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-2.5">
              {MOCK_PRE_IPOS.slice(0, 2).map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-slate-900 block">{item.companyName}</strong>
                    <span className="text-slate-500">{item.sector}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-700 text-sm block">₹{item.estimatedPrice}</span>
                    <span className="text-[10px] text-slate-400">Est. Price</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Anchor Lock-In & Calculator Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anchor Lock-In Teaser */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-indigo-700" />
              <span>Anchor Lock-In Expiry Schedule</span>
            </div>
            <Link href="/anchor-lockins" className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-xs text-slate-600">
            Monitor institutional anchor lock-in expiration dates (30-day &amp; 90-day) to evaluate post-lock-in share supply.
          </p>

          <div className="space-y-2 text-xs">
            {MOCK_ANCHOR_LOCKINS.slice(0, 2).map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 block">{item.ipoName}</strong>
                  <span className="text-slate-500">Listed: {item.listingDate}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-indigo-700 block">30-Day: {item.lockIn30DaysDate}</span>
                  <span className="text-[10px] text-amber-700 font-semibold">{item.lockIn30DaysStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Calculator */}
        <Calculator />
      </section>
    </div>
  );
}
