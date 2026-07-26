"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Smartphone, Star, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function PaymentAppsPage() {
  const [filterType, setFilterType] = useState<"All" | "RuPay Enabled" | "UPI Lite">("All");

  const appFeaturesList = [
    { key: "ruPayUpiSupport", label: "RuPay Credit Card" },
    { key: "upiLiteSupport", label: "UPI Lite" },
    { key: "creditScoreCheckFree", label: "Free Credit Score" },
    { key: "billPayments", label: "Bill Payments" },
    { key: "qrPayments", label: "Merchant QR" }
  ];

  const filteredApps = MOCK_PAYMENT_APPS.filter((app) => {
    if (filterType === "RuPay Enabled") return app.ruPayUpiSupport;
    if (filterType === "UPI Lite") return app.upiLiteSupport;
    return true;
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Banner & Filter Bar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <Smartphone className="w-3.5 h-3.5" />
              UPI &amp; PAYMENT APPS DESK
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Best UPI &amp; Payment Apps in India
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl font-medium">
              Evaluate Google Pay, PhonePe, Paytm, CRED, and top UPI apps by RuPay credit card linking, UPI Lite PIN-less payments, and cashback rewards.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 w-full md:w-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Filter By Features
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full md:w-auto">
              <button
                onClick={() => setFilterType("All")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  filterType === "All"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Apps
              </button>
              <button
                onClick={() => setFilterType("RuPay Enabled")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  filterType === "RuPay Enabled"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                RuPay Enabled
              </button>
              <button
                onClick={() => setFilterType("UPI Lite")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  filterType === "UPI Lite"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                UPI Lite Active
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Apps Cards Catalog - Exact Finology Select Design */}
      <div className="space-y-4">
        {filteredApps.map((app) => {
          return (
            <div
              key={app.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-5"
            >
              {/* Header Row: Logo + App Name & Rating + Single Dark Full Details Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <CompanyLogo name={app.name} logoUrl={app.logoUrl} size="xl" className="shadow-xs shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-extrabold text-slate-900 hover:text-emerald-700 transition-colors">
                        <Link href={`/payment-apps/${app.slug}`}>{app.name}</Link>
                      </h2>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>({app.playStoreRating})</span>
                      </div>
                    </div>

                    {/* Inline Developer Badge & Features Checklist */}
                    <div className="flex flex-wrap items-center gap-3 pt-0.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                        {app.developer}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
                        {app.downloadsTier}
                      </span>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-700">
                        <span className="flex items-center gap-1">
                          {app.ruPayUpiSupport ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                          <span className={app.ruPayUpiSupport ? "text-slate-800" : "text-slate-400 line-through"}>RuPay Credit</span>
                        </span>
                        <span className="flex items-center gap-1">
                          {app.upiLiteSupport ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                          <span className={app.upiLiteSupport ? "text-slate-800" : "text-slate-400 line-through"}>UPI Lite</span>
                        </span>
                        <span className="flex items-center gap-1">
                          {app.creditScoreCheckFree ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                          <span className={app.creditScoreCheckFree ? "text-slate-800" : "text-slate-400 line-through"}>Free Credit Score</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Dark Full Details Button */}
                <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <Link
                    href={`/payment-apps/${app.slug}`}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    Full Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 4-Column Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">P2P Bank Transfers</span>
                  <strong className="text-sm font-black text-emerald-700">₹0 (Free)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Merchant Payments</span>
                  <strong className="text-sm font-black text-emerald-700">₹0 (Free)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">UPI Lite Support</span>
                  <strong className="text-sm font-black text-slate-900">{app.upiLiteSupport ? "Active ✓" : "N/A"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">RuPay Credit on UPI</span>
                  <strong className="text-sm font-black text-blue-700">{app.ruPayUpiSupport ? "Enabled ✓" : "Disabled"}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
