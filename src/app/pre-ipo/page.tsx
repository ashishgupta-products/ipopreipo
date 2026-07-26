"use client";

import React, { useState } from "react";
import { 
  Percent, 
  Search, 
  Send, 
  CheckCircle2, 
  X
} from "lucide-react";
import { MOCK_PRE_IPOS } from "@/data/mockPreIpo";
import { PreIPOData } from "@/types/ipo";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function PreIPOPage() {
  const [selectedCompany, setSelectedCompany] = useState<PreIPOData | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCompanies = MOCK_PRE_IPOS.filter((item) =>
    item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setSelectedCompany(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc] pb-16">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80">
          <Percent className="w-3.5 h-3.5" />
          UNLISTED EQUITY &amp; PRE-IPO DESK
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Pre-IPO Unlisted Share Allocations
        </h1>
        <p className="text-slate-650 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
          Inquire and trade unlisted equity in Indian market leaders prior to DRHP filing. Off-market transfers processed securely via CDSL / NSDL demat accounts.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
          <input
            type="text"
            placeholder="Search pre-IPO company or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
          />
        </div>
        <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">
          Showing {filteredCompanies.length} Pre-IPO Opportunities
        </span>
      </div>

      {/* Pre-IPO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3.5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <CompanyLogo name={company.companyName} logoUrl={company.logoUrl} size="lg" className="rounded-lg shadow-2xs" />
                  <div>
                    <h3 className="font-bold text-base text-slate-800 leading-tight">
                      {company.companyName}
                    </h3>
                    <span className="text-xs text-amber-800 font-bold mt-0.5 block">{company.sector}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 shrink-0">
                  {company.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {company.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Est. Price</span>
                  <strong className="text-base font-extrabold text-amber-800">₹{company.estimatedPrice}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Min Qty</span>
                  <strong className="text-slate-800 font-bold">{company.minSharesToBuy} sh</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Min Order</span>
                  <strong className="text-slate-800 font-bold">₹{company.minInvestmentAmount.toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Valuation</span>
                  <strong className="text-slate-800 font-bold">₹{(company.valuationCr / 1000).toFixed(1)}k Cr</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
                <span>Revenue: <strong className="text-slate-700">₹{company.revenueLastFyCr} Cr</strong></span>
                <span>PAT: <strong className="text-emerald-600">₹{company.patLastFyCr} Cr</strong></span>
                <span>Timeline: <strong className="text-blue-700">{company.expectedIpoTimeline}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCompany(company)}
              className="w-full py-1.5 px-4 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              Inquire / Request Allocation
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Inquiry Modal Popup */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-4 right-4 p-1 rounded text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {inquirySuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Request Submitted</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Our unlisted equity desk will contact you regarding availability and share transfer steps shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">Allocation Request</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCompany.companyName}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Share Price: ₹{selectedCompany.estimatedPrice} | Min Order: {selectedCompany.minSharesToBuy} shares
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs font-bold text-slate-700">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Contact Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Quantity Requested</label>
                    <input
                      type="number"
                      min={selectedCompany.minSharesToBuy}
                      defaultValue={selectedCompany.minSharesToBuy}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs"
                  >
                    Submit Allocation Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
