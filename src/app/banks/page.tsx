"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, Star, ChevronRight, CheckCircle2 } from "lucide-react";
import { MOCK_BANKS } from "@/data/mockBanks";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function BanksPage() {
  const [filterType, setFilterType] = useState<"All" | "Private Bank" | "Public Sector Bank">("All");

  const filteredBanks = MOCK_BANKS.filter((bank) => {
    if (filterType === "Private Bank") return bank.type.includes("Private");
    if (filterType === "Public Sector Bank") return bank.type.includes("Public");
    return true;
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Banner & Filter Bar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80">
              <Building2 className="w-3.5 h-3.5" />
              INDIAN BANKING INSTITUTIONS DESK
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Best Commercial Banks in India
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl font-medium">
              Compare HDFC Bank, ICICI Bank, State Bank of India, Axis Bank by savings interest rates, min average balance (MAB), peak FD interest rates, and ASBA IPO application support.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 w-full md:w-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Filter By Bank Type
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full md:w-auto">
              <button
                onClick={() => setFilterType("All")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  filterType === "All"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Banks
              </button>
              <button
                onClick={() => setFilterType("Private Bank")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  filterType === "Private Bank"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Private Banks
              </button>
              <button
                onClick={() => setFilterType("Public Sector Bank")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  filterType === "Public Sector Bank"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Public Sector Banks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banks Cards Catalog - Exact Finology Select Design */}
      <div className="space-y-4">
        {filteredBanks.map((bank) => {
          return (
            <div
              key={bank.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-5"
            >
              {/* Header Row: Logo + Bank Name & Rating + Single Dark Full Details Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <CompanyLogo name={bank.name} logoUrl={bank.logoUrl} size="xl" className="shadow-xs shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-extrabold text-slate-900 hover:text-blue-700 transition-colors">
                        <Link href={`/banks/${bank.slug}`}>{bank.name}</Link>
                      </h2>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>({bank.rating})</span>
                      </div>
                    </div>

                    {/* Inline Type Badge & Features Checklist */}
                    <div className="flex flex-wrap items-center gap-3 pt-0.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
                        {bank.type}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {bank.branchCount} • {bank.atmCount}
                      </span>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-700">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>ASBA IPO Bidding</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>NetBanking App</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Instant FD</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Dark Full Details Button */}
                <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <Link
                    href={`/banks/${bank.slug}`}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    Full Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 4-Column Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Savings Interest Rate</span>
                  <strong className="text-sm font-black text-emerald-700">{bank.savingsInterestRate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Min Balance (MAB)</span>
                  <strong className="text-sm font-black text-slate-900">{bank.minBalanceRequirement}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Peak FD Interest Rate</span>
                  <strong className="text-sm font-black text-slate-900">{bank.fdInterestRatePeak}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Digital Banking Rating</span>
                  <strong className="text-sm font-black text-blue-700">{bank.digitalBankingScore}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
