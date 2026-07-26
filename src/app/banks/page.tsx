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
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Banner & Filter Bar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80">
              <Building2 className="w-3.5 h-3.5" />
              INDIAN BANKING INSTITUTIONS DESK
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Best Commercial Banks in India
            </h1>
            <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
              Compare savings interest rates, min average balance (MAB), peak FD interest rates, and ASBA IPO application support.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col items-start md:items-end gap-1 shrink-0 w-full md:w-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Filter By Bank Type
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
                All Banks
              </button>
              <button
                onClick={() => setFilterType("Private Bank")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filterType === "Private Bank"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Private
              </button>
              <button
                onClick={() => setFilterType("Public Sector Bank")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filterType === "Public Sector Bank"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Public
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banks Cards Catalog */}
      <div className="space-y-4">
        {filteredBanks.map((bank) => {
          return (
            <div
              key={bank.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-5 relative"
            >
              {/* Left Column: Bank Logo */}
              <CompanyLogo name={bank.name} logoUrl={bank.logoUrl} size="lg" className="shadow-2xs shrink-0 rounded-lg" />

              {/* Center & Matrix Column */}
              <div className="flex-1 min-w-0 space-y-3.5 w-full">
                {/* Header Row: Name & Rating */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-slate-800 hover:text-blue-700 transition-colors">
                        <Link href={`/banks/${bank.slug}`}>{bank.name}</Link>
                      </h2>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(bank.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-amber-100 text-amber-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-slate-400 text-xs font-medium ml-1">({bank.rating})</span>
                      </div>
                    </div>

                    {/* Second Row: Blue Type Badge & Features Checklist */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5]">
                        {bank.type}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {bank.branchCount} • {bank.atmCount}
                      </span>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700 ml-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 stroke-[4.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                          <span className="text-slate-800 font-semibold">ASBA IPO</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 stroke-[4.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                          <span className="text-slate-800 font-semibold">NetBanking App</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dark Pill "Full Details" CTA Button (Far Right) */}
                  <div className="shrink-0 hidden sm:block">
                    <Link
                      href={`/banks/${bank.slug}`}
                      className="px-5 py-1.5 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      Full Details
                    </Link>
                  </div>
                </div>

                {/* 4-Column Rates Matrix - Seamless White Background, No borders! */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Savings Rate</span>
                    <strong className="text-emerald-600 font-bold text-sm sm:text-base block">
                      {bank.savingsInterestRate}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Min Balance (MAB)</span>
                    <strong className="text-slate-800 font-bold text-sm sm:text-base block">
                      {bank.minBalanceRequirement}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Peak FD Rate</span>
                    <strong className="text-slate-800 font-bold text-sm sm:text-base block">
                      {bank.fdInterestRatePeak}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs block mb-0.5 font-medium">Digital Banking</span>
                    <strong className="text-slate-850 font-bold text-sm sm:text-base block">
                      {bank.digitalBankingScore}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Mobile Full Details Button */}
              <div className="w-full pt-1.5 sm:hidden">
                <Link
                  href={`/banks/${bank.slug}`}
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
