import React from "react";
import Link from "next/link";
import { Building2, Star, CheckCircle2, ExternalLink, ChevronRight } from "lucide-react";
import { MOCK_BANKS } from "@/data/mockBanks";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function BanksPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <Building2 className="w-3.5 h-3.5" />
          INDIAN BANKING INSTITUTIONS DESK
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Compare Top Savings &amp; Commercial Banks in India
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          Evaluate savings account interest rates, minimum average monthly balance (MAB) requirements, peak Fixed Deposit (FD) rates, NetBanking &amp; mobile app ratings, and ASBA IPO support.
        </p>
      </div>

      {/* Banks Comparison Matrix */}
      <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Bank Name &amp; Category</th>
              <th className="py-3 px-4">Savings Interest Rate</th>
              <th className="py-3 px-4">Min Balance (MAB)</th>
              <th className="py-3 px-4">Peak FD Interest Rate</th>
              <th className="py-3 px-4">Digital Banking Rating</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {MOCK_BANKS.map((bank) => (
              <tr key={bank.id} className="hover:bg-slate-50">
                <td className="py-4 px-4 font-bold text-slate-900">
                  <div className="flex items-center gap-3">
                    <CompanyLogo name={bank.name} logoUrl={bank.logoUrl} size="md" />
                    <div>
                      <div className="text-base font-extrabold hover:text-blue-700">
                        <Link href={`/banks/${bank.slug}`}>{bank.name}</Link>
                      </div>
                      <span className="text-xs text-blue-700 font-medium">{bank.type}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{bank.branchCount} | {bank.atmCount}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 font-bold text-emerald-700">
                  {bank.savingsInterestRate}
                </td>

                <td className="py-4 px-4 font-medium text-slate-700">
                  {bank.minBalanceRequirement}
                </td>

                <td className="py-4 px-4 font-bold text-slate-900">
                  {bank.fdInterestRatePeak}
                </td>

                <td className="py-4 px-4 text-slate-700">
                  <div className="font-bold">{bank.digitalBankingScore}</div>
                  <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-[11px] font-bold">{bank.rating} / 5.0</span>
                  </div>
                </td>

                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/banks/${bank.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
                    >
                      Review <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={bank.openAccountUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Open <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
