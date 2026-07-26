"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Smartphone, Star, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function PaymentAppsPage() {
  const [filterType, setFilterType] = useState<"All" | "RuPay Enabled" | "UPI Lite">("All");

  const filteredApps = MOCK_PAYMENT_APPS.filter((app) => {
    if (filterType === "RuPay Enabled") return app.ruPayUpiSupport;
    if (filterType === "UPI Lite") return app.upiLiteSupport;
    return true;
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Banner & Filter Bar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80">
              <Smartphone className="w-3.5 h-3.5" />
              UPI &amp; PAYMENT APPS DESK
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Best UPI &amp; Payment Apps in India
            </h1>
            <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
              Compare top UPI apps by RuPay credit card linking, UPI Lite PIN-less payments, and cashback rewards.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col items-start md:items-end gap-1 shrink-0 w-full md:w-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Filter By Features
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg text-xs font-bold w-full md:w-auto">
              <button
                onClick={() => setFilterType("All")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filterType === "All"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Apps
              </button>
              <button
                onClick={() => setFilterType("RuPay Enabled")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filterType === "RuPay Enabled"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                RuPay Enabled
              </button>
              <button
                onClick={() => setFilterType("UPI Lite")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filterType === "UPI Lite"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                UPI Lite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Apps Cards Catalog */}
      <div className="space-y-4">
        {filteredApps.map((app) => {
          return (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-5 relative"
            >
              {/* Left Column: App Logo */}
              <CompanyLogo name={app.name} logoUrl={app.logoUrl} size="lg" className="shadow-2xs shrink-0 rounded-lg" />

              {/* Center & Matrix Column */}
              <div className="flex-1 min-w-0 space-y-3.5 w-full">
                {/* Header Row: Name & Rating */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-slate-800 hover:text-emerald-700 transition-colors">
                        <Link href={`/payment-apps/${app.slug}`}>{app.name}</Link>
                      </h2>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(app.playStoreRating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-amber-100 text-amber-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-slate-400 text-xs font-medium ml-1">({app.playStoreRating})</span>
                      </div>
                    </div>

                    {/* Second Row: Indigo Developer Badge & Features Checklist */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5]">
                        {app.developer}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200/40">
                        {app.downloadsTier}
                      </span>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700 ml-1">
                        <span className="flex items-center gap-1.5">
                          {app.ruPayUpiSupport ? (
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
                          <span className={app.ruPayUpiSupport ? "text-slate-800 font-semibold" : "text-slate-400 line-through"}>RuPay Credit</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          {app.upiLiteSupport ? (
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
                          <span className={app.upiLiteSupport ? "text-slate-800 font-semibold" : "text-slate-400 line-through"}>UPI Lite</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dark Pill "Full Details" CTA Button (Far Right) */}
                  <div className="shrink-0 hidden sm:block">
                    <Link
                      href={`/payment-apps/${app.slug}`}
                      className="px-5 py-1.5 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      Full Details
                    </Link>
                  </div>
                </div>

                {/* 4-Column Rates Matrix - Seamless White Background, No borders! */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">P2P Bank Transfers</span>
                    <strong className="text-emerald-600 font-bold text-sm sm:text-base block">Free</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Merchant Payments</span>
                    <strong className="text-emerald-600 font-bold text-sm sm:text-base block">Free</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">UPI Lite Support</span>
                    <strong className="text-slate-800 font-bold text-sm sm:text-base block">
                      {app.upiLiteSupport ? "Active ✓" : "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">RuPay Credit on UPI</span>
                    <strong className="text-slate-800 font-bold text-sm sm:text-base block">
                      {app.ruPayUpiSupport ? "Enabled ✓" : "Disabled"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Mobile Full Details Button */}
              <div className="w-full pt-1.5 sm:hidden">
                <Link
                  href={`/payment-apps/${app.slug}`}
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
