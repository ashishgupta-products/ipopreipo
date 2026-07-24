"use client";

import React, { useState } from "react";
import { 
  Percent, 
  Search, 
  Send, 
  CheckCircle2, 
  X,
  ShieldCheck
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
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Percent className="w-3.5 h-3.5" />
          UNLISTED EQUITY &amp; PRE-IPO DESK
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pre-IPO Unlisted Share Allocations
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          Inquire and trade unlisted equity in Indian market leaders prior to DRHP filing. Off-market transfers processed via CDSL / NSDL demat accounts.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-3 border-b border-slate-200">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search pre-IPO company or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-700"
          />
        </div>
        <span className="text-xs text-slate-500">
          Showing {filteredCompanies.length} Pre-IPO Opportunities
        </span>
      </div>

      {/* Pre-IPO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <CompanyLogo name={company.companyName} logoUrl={company.logoUrl} size="lg" />
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                      {company.companyName}
                    </h3>
                    <span className="text-xs text-amber-800 font-semibold">{company.sector}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  {company.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {company.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Est. Price:</span>
                  <strong className="text-base font-extrabold text-amber-800">₹{company.estimatedPrice}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Min Qty:</span>
                  <strong className="text-slate-900 font-bold">{company.minSharesToBuy} Shares</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Min Investment:</span>
                  <strong className="text-slate-900 font-bold">₹{company.minInvestmentAmount.toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Valuation:</span>
                  <strong className="text-slate-900 font-bold">₹{(company.valuationCr / 1000).toFixed(1)}k Cr</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                <span>Revenue: <strong className="text-slate-900">₹{company.revenueLastFyCr} Cr</strong></span>
                <span>PAT: <strong className="text-emerald-700">₹{company.patLastFyCr} Cr</strong></span>
                <span>Timeline: <strong className="text-blue-700">{company.expectedIpoTimeline}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCompany(company)}
              className="w-full py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl relative space-y-4">
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-4 right-4 p-1 rounded text-slate-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            {inquirySuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Request Submitted</h3>
                <p className="text-xs text-slate-600">
                  Our unlisted equity desk will contact you regarding availability and share transfer steps.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-xs text-amber-800 font-bold uppercase tracking-wider block">Allocation Request</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCompany.companyName}</h3>
                  <p className="text-xs text-slate-500">
                    Share Price: ₹{selectedCompany.estimatedPrice} | Min Order: {selectedCompany.minSharesToBuy} shares
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Contact Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Quantity Requested</label>
                    <input
                      type="number"
                      min={selectedCompany.minSharesToBuy}
                      defaultValue={selectedCompany.minSharesToBuy}
                      className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all"
                  >
                    Submit Inquiry
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
