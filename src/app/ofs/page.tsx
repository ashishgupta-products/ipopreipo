"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Percent,
  Calendar,
  Clock,
  Zap,
  Info,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calculator,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Briefcase,
  RefreshCw
} from "lucide-react";
import { MOCK_OFS } from "@/data/mockOFS";
import { OFSData, OFSStatus } from "@/types/ipo";

export default function OFSPage() {
  const [ofsList, setOfsList] = useState<OFSData[]>(MOCK_OFS);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>("ofs-1");

  // Calculator State
  const [calcSelectedId, setCalcSelectedId] = useState<string>("ofs-1");
  const [calcShares, setCalcShares] = useState<number>(200);

  useEffect(() => {
    async function loadLiveData() {
      try {
        setLoading(true);
        const res = await fetch("/api/ofs");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setOfsList(json.data);
            setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch live OFS data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);

  const filteredOFS = useMemo(() => {
    return ofsList.filter((item) => {
      // Filter by status
      if (selectedFilter === "retail-live" && item.status !== "Live (Retail Day)") return false;
      if (selectedFilter === "non-retail-live" && item.status !== "Live (Non-Retail)") return false;
      if (selectedFilter === "upcoming" && item.status !== "Upcoming") return false;
      if (selectedFilter === "closed" && item.status !== "Closed") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.companyName.toLowerCase().includes(q);
        const matchSymbol = item.symbol.toLowerCase().includes(q);
        const matchSeller = item.sellerName.toLowerCase().includes(q);
        const matchSector = item.sector?.toLowerCase().includes(q);
        return matchName || matchSymbol || matchSeller || matchSector;
      }

      return true;
    });
  }, [ofsList, selectedFilter, searchQuery]);

  // Selected item for calculator
  const calcItem = useMemo(() => {
    return ofsList.find((i) => i.id === calcSelectedId) || ofsList[0] || MOCK_OFS[0];
  }, [ofsList, calcSelectedId]);

  // Calculator computations
  const effectiveRetailPrice = useMemo(() => {
    if (!calcItem) return 0;
    const retailDisc = calcItem.retailDiscountPercent || 0;
    return calcItem.floorPrice * (1 - retailDisc / 100);
  }, [calcItem]);

  const totalInvestment = useMemo(() => {
    return effectiveRetailPrice * (calcShares || 0);
  }, [effectiveRetailPrice, calcShares]);

  const marketValueAtCMP = useMemo(() => {
    if (!calcItem) return 0;
    return calcItem.currentMarketPrice * (calcShares || 0);
  }, [calcItem, calcShares]);

  const totalSavings = useMemo(() => {
    return marketValueAtCMP - totalInvestment;
  }, [marketValueAtCMP, totalInvestment]);

  const totalDiscountPercent = useMemo(() => {
    if (marketValueAtCMP === 0) return 0;
    return ((totalSavings / marketValueAtCMP) * 100).toFixed(2);
  }, [totalSavings, marketValueAtCMP]);

  const isExceedingRetailLimit = totalInvestment > 200000;

  // Key stats
  const activeCount = ofsList.filter((i) => i.status === "Live (Retail Day)" || i.status === "Live (Non-Retail)").length;
  const upcomingCount = ofsList.filter((i) => i.status === "Upcoming").length;
  const totalVolumeCr = ofsList.reduce((sum, item) => sum + item.issueSizeCr, 0);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            OFFER FOR SALE (OFS) HUB
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Listed Companies Offer for Sale (OFS) Tracker
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Track secondary market promoter &amp; PSU disinvestments on BSE &amp; NSE. Monitor floor prices, CMP discounts, T/T+1 bidding timelines, institutional demand, and retail quotas.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block">Active OFS Bidding</span>
              <span className="text-xl font-black text-emerald-400">{activeCount} Issues Live</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block">Upcoming Pipeline</span>
              <span className="text-xl font-black text-sky-400">{upcomingCount} Announced</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block">Avg. Floor Discount</span>
              <span className="text-xl font-black text-amber-400">6% - 12% to CMP</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block">Total OFS Tracked</span>
              <span className="text-xl font-black text-purple-300">₹{(totalVolumeCr / 1000).toFixed(1)}k Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mechanism Alert */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-blue-900">
            How Listed OFS Works (T &amp; T+1 Bidding):
          </p>
          <p className="text-slate-700 leading-relaxed">
            <strong>Day 1 (T-Day):</strong> Open exclusively for Non-Retail (Institutional &amp; HNI) investors. Indicative clearing price is discovered.
            <br />
            <strong>Day 2 (T+1 Day):</strong> Open for <strong>Retail Investors</strong> (&lt; ₹2 Lakhs application). Retail investors can place bids at the Floor Price or at Cut-Off with guaranteed 10% retail reservation.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All OFS Issues" },
            { id: "retail-live", label: "🟢 Retail Live (T+1)" },
            { id: "non-retail-live", label: "🟡 Non-Retail (T-Day)" },
            { id: "upcoming", label: "Upcoming" },
            { id: "closed", label: "Closed" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, ticker, seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </div>

      {/* OFS List / Table View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Offer for Sale Issues ({filteredOFS.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Click row for full breakdown &amp; stats</span>
        </div>

        {filteredOFS.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold">No OFS issues found matching your filter.</p>
            <p className="text-slate-400 text-xs mt-1">Try changing the search query or active filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOFS.map((item) => {
              const isExpanded = expandedId === item.id;
              const isRetailLive = item.status === "Live (Retail Day)";
              const isNonRetailLive = item.status === "Live (Non-Retail)";

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition-all overflow-hidden ${
                    isRetailLive
                      ? "border-emerald-300 ring-2 ring-emerald-100 shadow-md"
                      : "border-slate-200 shadow-xs hover:border-slate-300"
                  }`}
                >
                  {/* Main Card Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-4 sm:p-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none hover:bg-slate-50/50"
                  >
                    {/* Left: Company & Seller */}
                    <div className="flex items-start gap-3.5 min-w-[280px]">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                          isRetailLive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {item.symbol.substring(0, 4)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-slate-900 hover:text-blue-600 transition-colors">
                            {item.companyName}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {item.exchange}
                          </span>
                          {item.sector && (
                            <span className="text-[11px] text-slate-500 font-medium">
                              • {item.sector}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">Seller:</span> {item.sellerName}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Pricing & Discount */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 py-2 lg:py-0 border-t lg:border-t-0 border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-500 block font-medium">Floor Price</span>
                        <div className="font-extrabold text-sm sm:text-base text-slate-900">
                          ₹{item.floorPrice.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-slate-400 block">CMP: ₹{item.currentMarketPrice.toFixed(2)}</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 block font-medium">Floor Discount</span>
                        <div className="font-extrabold text-sm sm:text-base text-emerald-600 flex items-center gap-0.5">
                          {item.discountPercent}% OFF
                        </div>
                        {item.retailDiscountPercent ? (
                          <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mt-0.5">
                            +{item.retailDiscountPercent}% Retail Disc.
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Standard Pricing</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 block font-medium">Issue Size</span>
                        <div className="font-extrabold text-sm sm:text-base text-slate-900">
                          ₹{item.issueSizeCr.toLocaleString()} Cr
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {(item.sharesOffered / 10000000).toFixed(2)} Cr Shares
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 block font-medium">Retail Bidding (T+1)</span>
                        <div className="font-extrabold text-sm text-blue-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {item.retailDate}
                        </div>
                        <span className="text-[10px] text-slate-400">T-Day: {item.nonRetailDate}</span>
                      </div>
                    </div>

                    {/* Right: Status & Action */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                          isRetailLive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse"
                            : isNonRetailLive
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : item.status === "Upcoming"
                            ? "bg-sky-50 text-sky-700 border border-sky-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCalcSelectedId(item.id);
                          const calcEl = document.getElementById("ofs-calculator");
                          if (calcEl) calcEl.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        Calculate
                      </button>

                      <div className="p-1 rounded text-slate-400 hover:text-slate-600">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4 text-xs animate-in fade-in duration-200">
                      {item.overview && (
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                          <strong>OFS Context &amp; Purpose:</strong> {item.overview}
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-medium">Promoter Holding</span>
                          <div className="text-slate-900 font-extrabold mt-0.5">
                            {item.promoterPreHoldingPercent}% → {item.promoterPostHoldingPercent}%
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Dilution: {(item.promoterPreHoldingPercent - item.promoterPostHoldingPercent).toFixed(2)}%
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-medium">Retail Quota Reserved</span>
                          <div className="text-blue-700 font-extrabold mt-0.5">
                            {item.retailQuotaPercent}% of Total Issue
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Max ₹2 Lakh per Retail Bidder
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-medium">Non-Retail Demand (T-Day)</span>
                          <div className="text-emerald-700 font-extrabold mt-0.5">
                            {item.nonRetailSubscriptionTimes ? `${item.nonRetailSubscriptionTimes}x Subscribed` : "Awaiting T-Day"}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {item.indicativeClearingPrice ? `Clearing: ₹${item.indicativeClearingPrice}` : "Discovered after Day 1"}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-medium">Settlement &amp; Demat Credit</span>
                          <div className="text-slate-900 font-extrabold mt-0.5">
                            {item.settlementDate || "T+2 Trading Days"}
                          </div>
                          <span className="text-[10px] text-slate-400">Direct credit to Demat</span>
                        </div>
                      </div>

                      {/* Retail Action Bar */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2 text-slate-600">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Eligible for all retail investors with Demat accounts. Place bid through broker OFS tab.
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCalcSelectedId(item.id);
                              const calcEl = document.getElementById("ofs-calculator");
                              if (calcEl) calcEl.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-3.5 py-1.5 rounded-lg font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                          >
                            Estimate Retail Profit &amp; Savings
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Retail Arbitrage & Profit Calculator */}
      <div id="ofs-calculator" className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
              <Calculator className="w-3.5 h-3.5" />
              RETAIL ARBITRAGE CALCULATOR
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              OFS Retail Savings &amp; Profit Estimator
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Calculate instant discounts and margin of safety against Current Market Price (CMP).
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Max Retail Application:</span>
            <span className="font-extrabold text-sm text-slate-900 block">₹2,00,000 (SEBI Limit)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select OFS Company
              </label>
              <select
                value={calcSelectedId}
                onChange={(e) => setCalcSelectedId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ofsList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.companyName} ({item.symbol}) - Floor: ₹{item.floorPrice}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Number of Shares to Bid
                </label>
                <span className="text-xs font-extrabold text-blue-700">{calcShares} Shares</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={calcShares}
                onChange={(e) => setCalcShares(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex gap-2 mt-2">
                {[50, 100, 200, 400, 500].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setCalcShares(qty)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                      calcShares === qty
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {qty} qty
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Floor Price per Share:</span>
                <span className="font-bold text-slate-900">₹{calcItem.floorPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Retail Discount:</span>
                <span className="font-bold text-emerald-600">
                  {calcItem.retailDiscountPercent ? `${calcItem.retailDiscountPercent}% OFF` : "Nil"}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Effective Retail Price:</span>
                <span className="font-extrabold text-blue-700">₹{effectiveRetailPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Current Market Price (CMP):</span>
                <span className="font-bold text-slate-900">₹{calcItem.currentMarketPrice.toFixed(2)}</span>
              </div>
            </div>

            {isExceedingRetailLimit && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Application Exceeds ₹2 Lakhs:</strong> Your total bid is ₹{totalInvestment.toLocaleString()}. Bids above ₹2,00,000 are categorized under Non-Retail (HNI) and are not eligible for retail discount or retail quota.
                </span>
              </div>
            )}
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 to-blue-950 rounded-xl p-6 text-white space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-wider uppercase text-blue-300">
                Estimated Returns &amp; Discount
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-xs text-slate-300 block">Total Outlay / Bid Cost</span>
                  <div className="text-2xl font-black text-white mt-1">
                    ₹{totalInvestment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[10px] text-slate-400">At ₹{effectiveRetailPrice.toFixed(2)} / share</span>
                </div>

                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-xs text-slate-300 block">Value at Market (CMP)</span>
                  <div className="text-2xl font-black text-slate-100 mt-1">
                    ₹{marketValueAtCMP.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[10px] text-slate-400">At ₹{calcItem.currentMarketPrice.toFixed(2)} / share</span>
                </div>
              </div>

              {/* Profit / Discount Metric */}
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-emerald-300 block">
                    Instant Arbitrage / Margin of Safety
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                    +₹{totalSavings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 inline-block">
                    {totalDiscountPercent}% Savings
                  </span>
                  <span className="text-[10px] text-emerald-200/80 block mt-1">vs. Buying on Open Market</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-white/10 pt-3">
              * Note: OFS bids require 100% upfront cash margin with your broker. Allotment is finalized on T+1 day post retail closure, and shares are credited to your Demat by T+2.
            </p>
          </div>
        </div>
      </div>

      {/* Guide: How to Apply for OFS through Brokers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Briefcase className="w-3.5 h-3.5" />
            RETAIL INVESTOR GUIDE
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            How to Apply for Listed OFS on Top Brokers
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Step-by-step bidding workflow for Zerodha, Groww, Angel One, and Upstox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Navigate to Broker OFS Portal</h3>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li><strong>Zerodha:</strong> Console &gt; Portfolio &gt; Corporate Actions &gt; OFS</li>
              <li><strong>Groww:</strong> Stocks &gt; Explore &gt; OFS / IPO Tab</li>
              <li><strong>Angel One:</strong> Orders &gt; OFS / Corporate Actions</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Choose Bid Price &amp; Quantity</h3>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Bid on <strong>T+1 Day</strong> (9:15 AM to 3:30 PM).</li>
              <li>Retail can check <strong>Cut-Off Price</strong> or bid above Floor Price.</li>
              <li>Total investment must remain below <strong>₹2,00,000</strong>.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Upfront Margin &amp; Allotment</h3>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Maintain <strong>100% cash margin</strong> in your trading balance.</li>
              <li>Allotment status is determined at clearing price.</li>
              <li>Shares credited to Demat on <strong>T+2 days</strong>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Frequently Asked Questions (FAQs)
        </h2>

        <div className="space-y-3 text-xs sm:text-sm">
          <details className="group border border-slate-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="font-extrabold text-slate-900 cursor-pointer flex justify-between items-center">
              <span>What is the difference between an OFS and an IPO?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-slate-600 mt-2 leading-relaxed">
              An <strong>IPO</strong> is for unlisted companies getting listed on stock exchanges for the first time. An <strong>OFS (Offer for Sale)</strong> is a transparent bidding mechanism exclusively for <strong>already listed companies</strong> where existing promoters or institutional investors sell a portion of their holdings.
            </p>
          </details>

          <details className="group border border-slate-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="font-extrabold text-slate-900 cursor-pointer flex justify-between items-center">
              <span>Why do promoters sell shares via OFS instead of open market?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Selling huge quantities (like 5%-10% stake) in the normal open market would crash the stock price due to lack of immediate liquidity. OFS provides an organized 2-day bidding window to discover price without disrupting regular market trading. It also allows promoters to meet SEBI&apos;s 25% Minimum Public Shareholding (MPS) mandate.
            </p>
          </details>

          <details className="group border border-slate-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="font-extrabold text-slate-900 cursor-pointer flex justify-between items-center">
              <span>Can retail investors bid at &apos;Cut-Off&apos; price in OFS?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-slate-600 mt-2 leading-relaxed">
              Yes! Retail investors (bids &lt; ₹2 Lakhs) have the privilege to bid at &apos;Cut-Off&apos;, ensuring they get allotment at the final clearing price discovered during institutional bidding on T-Day.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
