"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Search,
  Bell
} from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/common/Badge";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export interface CalendarEvent {
  id: string;
  ipoSlug: string;
  companyName: string;
  logoUrl?: string;
  category: "mainboard" | "sme";
  eventType: "open" | "close" | "allotment" | "refund" | "listing";
  eventTitle: string;
  dateStr: string; // YYYY-MM-DD
  formattedDate: string; // e.g. Jul 28, 2026
  dayOfWeek: string;
  gmp: number;
  gmpPercent: number;
  priceBand: string;
  lotSize: number;
}

export default function IPOCalendarPage() {
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewFormat, setViewFormat] = useState<"list" | "grid">("list");
  const [ipos, setIpos] = useState<any[]>([]);

  useEffect(() => {
    async function loadIPOs() {
      try {
        const res = await fetch("/api/ipos");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setIpos(json.data);
        }
      } catch (err) {
        console.error("Failed to load calendar ipos:", err);
      }
    }
    loadIPOs();
  }, []);

  // Extract and flatten all IPO events from ipos state
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    ipos.forEach((ipo) => {
      const priceBandStr = ipo.priceBandMin === ipo.priceBandMax 
        ? `₹${ipo.priceBandMax}` 
        : `₹${ipo.priceBandMin} - ₹${ipo.priceBandMax}`;

      const formatDateHelper = (dateIsoStr: string) => {
        try {
          const d = new Date(dateIsoStr);
          if (isNaN(d.getTime())) return { formatted: dateIsoStr, day: "" };
          const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          const day = d.toLocaleDateString("en-US", { weekday: "short" });
          return { formatted, day };
        } catch {
          return { formatted: dateIsoStr, day: "" };
        }
      };

      // 1. Open Date
      if (ipo.openDate) {
        const { formatted, day } = formatDateHelper(ipo.openDate);
        events.push({
          id: `${ipo.id}-open`,
          ipoSlug: ipo.slug,
          companyName: ipo.name,
          logoUrl: ipo.logoUrl,
          category: ipo.category,
          eventType: "open",
          eventTitle: "Bidding Opens",
          dateStr: ipo.openDate,
          formattedDate: formatted,
          dayOfWeek: day,
          gmp: ipo.gmp,
          gmpPercent: ipo.gmpPercent,
          priceBand: priceBandStr,
          lotSize: ipo.lotSize
        });
      }

      // 2. Close Date
      if (ipo.closeDate) {
        const { formatted, day } = formatDateHelper(ipo.closeDate);
        events.push({
          id: `${ipo.id}-close`,
          ipoSlug: ipo.slug,
          companyName: ipo.name,
          logoUrl: ipo.logoUrl,
          category: ipo.category,
          eventType: "close",
          eventTitle: "Bidding Closes",
          dateStr: ipo.closeDate,
          formattedDate: formatted,
          dayOfWeek: day,
          gmp: ipo.gmp,
          gmpPercent: ipo.gmpPercent,
          priceBand: priceBandStr,
          lotSize: ipo.lotSize
        });
      }

      // 3. Allotment Date
      if (ipo.allotmentDate) {
        const { formatted, day } = formatDateHelper(ipo.allotmentDate);
        events.push({
          id: `${ipo.id}-allotment`,
          ipoSlug: ipo.slug,
          companyName: ipo.name,
          logoUrl: ipo.logoUrl,
          category: ipo.category,
          eventType: "allotment",
          eventTitle: "Allotment Declaration",
          dateStr: ipo.allotmentDate,
          formattedDate: formatted,
          dayOfWeek: day,
          gmp: ipo.gmp,
          gmpPercent: ipo.gmpPercent,
          priceBand: priceBandStr,
          lotSize: ipo.lotSize
        });
      }

      // 4. Listing Date
      if (ipo.listingDate) {
        const { formatted, day } = formatDateHelper(ipo.listingDate);
        events.push({
          id: `${ipo.id}-listing`,
          ipoSlug: ipo.slug,
          companyName: ipo.name,
          logoUrl: ipo.logoUrl,
          category: ipo.category,
          eventType: "listing",
          eventTitle: "Exchange Listing Day",
          dateStr: ipo.listingDate,
          formattedDate: formatted,
          dayOfWeek: day,
          gmp: ipo.gmp,
          gmpPercent: ipo.gmpPercent,
          priceBand: priceBandStr,
          lotSize: ipo.lotSize
        });
      }
    });

    // Sort events by date ascending
    return events.sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  }, [ipos]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (selectedEventType !== "all" && ev.eventType !== selectedEventType) return false;
      if (selectedCategory !== "all" && ev.category !== selectedCategory) return false;
      if (searchQuery.trim() && !ev.companyName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [allEvents, selectedEventType, selectedCategory, searchQuery]);

  // Group events by dateStr for list view
  const groupedEvents = useMemo(() => {
    const groups: { [date: string]: CalendarEvent[] } = {};
    filteredEvents.forEach((ev) => {
      if (!groups[ev.dateStr]) {
        groups[ev.dateStr] = [];
      }
      groups[ev.dateStr].push(ev);
    });
    return groups;
  }, [filteredEvents]);

  const getEventBadgeClass = (type: CalendarEvent["eventType"]) => {
    switch (type) {
      case "open":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "close":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "allotment":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "listing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getEventIcon = (type: CalendarEvent["eventType"]) => {
    switch (type) {
      case "open":
        return <Zap className="w-3.5 h-3.5 text-emerald-600" />;
      case "close":
        return <Clock className="w-3.5 h-3.5 text-rose-600" />;
      case "allotment":
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case "listing":
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <CalendarIcon className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 space-y-8">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-700" />
            Live Market Schedule 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            IPO Calendar &amp; Important Dates
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            Track key market dates for all Mainboard &amp; SME IPOs — Bidding Openings, Closing Deadlines, Allotment Declarations, and Exchange Listing Days in real-time.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Controls & Filters */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Left: Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
            </span>

            {/* Event Type Filter */}
            <button
              onClick={() => setSelectedEventType("all")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedEventType === "all"
                  ? "bg-blue-900 text-white border-blue-900 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setSelectedEventType("open")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedEventType === "open"
                  ? "bg-emerald-700 text-white border-emerald-700 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              ⚡ Opens
            </button>
            <button
              onClick={() => setSelectedEventType("close")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedEventType === "close"
                  ? "bg-rose-700 text-white border-rose-700 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              🔒 Closes
            </button>
            <button
              onClick={() => setSelectedEventType("allotment")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedEventType === "allotment"
                  ? "bg-purple-700 text-white border-purple-700 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              🎯 Allotments
            </button>
            <button
              onClick={() => setSelectedEventType("listing")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedEventType === "listing"
                  ? "bg-blue-700 text-white border-blue-700 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              📈 Listings
            </button>

            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-700"
            >
              <option value="all">All Segments</option>
              <option value="mainboard">Mainboard IPOs</option>
              <option value="sme">SME IPOs</option>
            </select>
          </div>

          {/* Right: Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 bg-slate-50"
            />
          </div>
        </div>

        {/* Legend Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Bidding Opens</span>
              <span className="text-[11px] text-emerald-800">Fresh issue bidding starts</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Bidding Closes</span>
              <span className="text-[11px] text-rose-800">UPI Mandate cutoff (5:00 PM)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Allotment Out</span>
              <span className="text-[11px] text-purple-800">Registrar status published</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Exchange Listing</span>
              <span className="text-[11px] text-blue-800">BSE &amp; NSE trading begins</span>
            </div>
          </div>
        </div>

        {/* Calendar Event Groups */}
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No events found</h3>
            <p className="text-xs text-slate-500">Try adjusting your filters or search query.</p>
            <button
              onClick={() => {
                setSelectedEventType("all");
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([dateStr, events]) => {
              const firstEv = events[0];
              return (
                <div key={dateStr} className="space-y-3">
                  {/* Date Header Strip */}
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>{firstEv.formattedDate}</span>
                      {firstEv.dayOfWeek && (
                        <span className="text-blue-300 font-normal">({firstEv.dayOfWeek})</span>
                      )}
                    </div>
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-xs font-bold text-slate-400">
                      {events.length} {events.length === 1 ? "Event" : "Events"}
                    </span>
                  </div>

                  {/* Event Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          {/* Top Badge & Segment */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getEventBadgeClass(
                                ev.eventType
                              )}`}
                            >
                              {getEventIcon(ev.eventType)}
                              {ev.eventTitle}
                            </span>

                            <Badge category={ev.category} />
                          </div>

                          {/* Company Name */}
                          <div className="flex items-center gap-2.5">
                            <CompanyLogo name={ev.companyName} logoUrl={ev.logoUrl} size="sm" />
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/ipo/${ev.ipoSlug}`}
                                className="font-bold text-sm text-slate-900 hover:text-blue-700 transition-colors line-clamp-1 block"
                              >
                                {ev.companyName}
                              </Link>
                              <span className="text-xs text-slate-500">
                                Price: <strong className="text-slate-800">{ev.priceBand}</strong>
                              </span>
                            </div>
                          </div>

                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                            <div>
                              <span className="text-[11px] text-slate-400 block">Grey Market Premium</span>
                              <strong className={ev.gmp > 0 ? "text-emerald-700 font-bold" : "text-slate-600"}>
                                {ev.gmp > 0 ? `+₹${ev.gmp} (+${ev.gmpPercent}%)` : "₹0 (At Par)"}
                              </strong>
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400 block">Lot Size</span>
                              <strong className="text-slate-900 font-semibold">{ev.lotSize} Shares</strong>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          {ev.eventType === "allotment" ? (
                            <Link
                              href="/allotment"
                              className="font-bold text-purple-700 hover:underline flex items-center gap-1"
                            >
                              Check Allotment <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <Link
                              href={`/ipo/${ev.ipoSlug}`}
                              className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                            >
                              View IPO Details <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                          <span className="text-[11px] text-slate-400 font-mono">
                            {ev.dateStr}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
