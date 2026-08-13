"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Star } from "lucide-react";
import { MOCK_BROKERS } from "@/data/mockBrokers";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export default function BrokersPage() {
  const [filterType, setFilterType] = useState<"All" | "Discount Broker" | "Full-Service Broker">("All");

  const brokerFeaturesList = [
    { key: "Equity", label: "Equity" },
    { key: "Commodity", label: "Commodity" },
    { key: "Currency", label: "Currency" },
    { key: "Futures", label: "Futures" },
    { key: "Options", label: "Options" }
  ];

  const filteredBrokers = MOCK_BROKERS.filter((b) => {
    if (filterType === "All") return true;
    if (filterType === "Discount Broker") return b.type.includes("Discount");
    if (filterType === "Full-Service Broker") return b.type.includes("Full-Service");
    return true;
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "Brokers" }]} className="mb-2" />

      {/* Centered Simplified Title */}
      <div className="py-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Best Stock Brokers in India
        </h1>
      </div>

      {/* Simplified Filters Bar */}
      <div className="flex items-center justify-center gap-1.5 py-2">
        <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg text-xs font-bold shadow-3xs">
          <button
            onClick={() => setFilterType("All")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterType === "All"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Brokers
          </button>
          <button
            onClick={() => setFilterType("Discount Broker")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterType === "Discount Broker"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Discount
          </button>
          <button
            onClick={() => setFilterType("Full-Service Broker")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterType === "Full-Service Broker"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Full Service
          </button>
        </div>
      </div>

      {/* Broker Cards List - Compact Ditto Copy-Paste Design */}
      <div className="space-y-4">
        {filteredBrokers.map((broker) => {
          const activeOfferings = broker.productOfferings || ["Equity", "Commodity", "Currency", "Futures", "Options"];

          return (
            <div
              key={broker.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-5 relative"
            >
              {/* Left Column: Broker Logo */}
              <CompanyLogo name={broker.name} logoUrl={broker.logoUrl} size="lg" className="shadow-2xs shrink-0 rounded-lg self-center sm:self-auto" />

              {/* Center & Matrix Column */}
              <div className="flex-1 min-w-0 space-y-3.5 w-full">
                {/* Header Row: Name & Rating */}
                <div className="flex justify-between items-start gap-4 w-full">
                  <div className="space-y-2 flex flex-col items-center sm:items-start w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap justify-center sm:justify-start">
                      <h2 className="text-base sm:text-lg font-bold text-slate-800 hover:text-blue-700 transition-colors text-center sm:text-left">
                        <Link href={`/brokers/${broker.slug}`}>{broker.name}</Link>
                      </h2>
                      <div className="flex items-center justify-center sm:justify-start gap-0.5 text-xs font-bold text-amber-500">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(broker.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-amber-100 text-amber-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-slate-400 text-xs font-medium ml-1">({broker.rating})</span>
                      </div>
                    </div>
 
                    {/* Second Row: Purple Type Badge + Inline Features Checklist */}
                    <div className="flex flex-wrap items-center gap-3 w-full justify-start">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5]">
                        {broker.type}
                      </span>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700 ml-1">
                        {brokerFeaturesList.map((feat) => {
                          const isSupported = activeOfferings.includes(feat.key);
                          return (
                            <span key={feat.key} className="flex items-center gap-1.5">
                              {isSupported ? (
                                <span className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                                  <svg className="w-2.5 h-2.5 stroke-[4.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                </span>
                              ) : (
                                <span className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center shrink-0">
                                  <svg className="w-2 h-2 stroke-[4.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </span>
                              )}
                              <span className={isSupported ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                {feat.label}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Dark Pill "Full Details" CTA Button (Far Right) */}
                  <div className="shrink-0 hidden sm:block">
                    <Link
                      href={`/brokers/${broker.slug}`}
                      className="px-5 py-1.5 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      Full Details
                    </Link>
                  </div>
                </div>

                {/* 4-Column Rates Matrix - Seamless White Background, No borders! */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Account Opening</span>
                    <strong className="text-slate-800 font-bold text-sm sm:text-base block">
                      {broker.accountOpeningFee}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Account AMC</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-800 font-bold text-sm sm:text-base">
                        {broker.dematAnualFee}
                      </strong>
                      <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center">i</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Equity Delivery</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-800 font-bold text-sm sm:text-base">
                        {broker.equityDeliveryFee}
                      </strong>
                      <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center">i</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Equity Intraday</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-800 font-bold text-sm sm:text-base">
                        {broker.equityIntradayFee}
                      </strong>
                      <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center">i</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Full Details Button */}
              <div className="w-full pt-1.5 sm:hidden">
                <Link
                  href={`/brokers/${broker.slug}`}
                  className="w-full px-5 py-2 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center transition-all"
                >
                  Full Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
