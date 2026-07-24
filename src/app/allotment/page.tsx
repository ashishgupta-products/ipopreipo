"use client";

import React, { useState } from "react";
import { CheckCircle2, ExternalLink, Search, Percent, ShieldCheck } from "lucide-react";
import { MOCK_IPOS } from "@/data/mockIpos";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function AllotmentPage() {
  const [selectedIpoId, setSelectedIpoId] = useState<string>(MOCK_IPOS[0].id);
  const [panNumber, setPanNumber] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(false);
  const [result, setResult] = useState<"allotted" | "not_allotted" | null>(null);

  const [subTimes, setSubTimes] = useState<number>(3.5);
  const [applicationsSubmitted, setApplicationsSubmitted] = useState<number>(1);

  const selectedIpo = MOCK_IPOS.find((i) => i.id === selectedIpoId) || MOCK_IPOS[0];

  const handleSimulatedCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panNumber || panNumber.length < 5) return;
    setChecking(true);
    setResult(null);

    setTimeout(() => {
      setChecking(false);
      setResult(Math.random() > 0.4 ? "allotted" : "not_allotted");
    }, 1000);
  };

  const allotmentChancePercent = subTimes <= 1 
    ? 100 
    : (1 - Math.pow(1 - 1 / subTimes, applicationsSubmitted)) * 100;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          ALLOTMENT STATUS SEARCH HUB
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Check IPO Allotment Status &amp; Registrar Portals
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          Search allotment records across Link Intime, KFintech, Bigshare, and Skyline using your PAN or Application Number.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Instant Search Portal */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-700" />
              Direct Allotment Query Engine
            </h2>

            <form onSubmit={handleSimulatedCheck} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Select Active / Recent IPO:
                </label>
                <select
                  value={selectedIpoId}
                  onChange={(e) => {
                    setSelectedIpoId(e.target.value);
                    setResult(null);
                  }}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:border-purple-600 text-sm"
                >
                  {MOCK_IPOS.map((ipo) => (
                    <option key={ipo.id} value={ipo.id}>
                      {ipo.name} ({ipo.registrarName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected IPO Logo Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CompanyLogo name={selectedIpo.name} logoUrl={selectedIpo.logoUrl} size="md" />
                <div className="flex-1 min-w-0">
                  <strong className="text-slate-900 font-extrabold text-xs sm:text-sm block truncate">{selectedIpo.name}</strong>
                  <span className="text-[11px] text-slate-500 block truncate">Registrar: {selectedIpo.registrarName}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  PAN Number / Application Number:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-slate-900 font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={checking}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {checking ? "Querying Server..." : "Check Allotment Result"}
                </button>

                <a
                  href={selectedIpo.registrarCheckUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition-all shrink-0"
                >
                  Official Link <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </form>

            {/* Results Display */}
            {result && (
              <div
                className={`p-4 rounded-lg border text-xs text-center space-y-1 ${
                  result === "allotted"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <strong className="text-sm font-bold block">
                  {result === "allotted"
                    ? "SHARES ALLOTTED"
                    : "NO SHARES ALLOTTED (REFUND PENDING)"}
                </strong>
                <p className="text-slate-600">
                  {result === "allotted"
                    ? `1 Lot (${selectedIpo.lotSize} Shares) allotted for ${selectedIpo.name}. Demat credit by ${selectedIpo.dematCreditDate}.`
                    : `No shares allotted for PAN ${panNumber}. Bank ASBA unblock expected by ${selectedIpo.refundDate}.`}
                </p>
              </div>
            )}
          </div>

          {/* Registrar Links */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Indian Registrar Portals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="https://linkintime.co.in/initial_offer/public-issues.html"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded bg-slate-50 border border-slate-200 hover:border-purple-300 flex justify-between items-center text-slate-800 font-semibold"
              >
                Link Intime Portal
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="https://ris.kfintech.com/ipostatus/"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded bg-slate-50 border border-slate-200 hover:border-purple-300 flex justify-between items-center text-slate-800 font-semibold"
              >
                KFintech Portal
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="https://ipo.bigshareonline.com/ipo_status.html"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded bg-slate-50 border border-slate-200 hover:border-purple-300 flex justify-between items-center text-slate-800 font-semibold"
              >
                Bigshare Services
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="https://www.skylineinta.com/ipo.aspx"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded bg-slate-50 border border-slate-200 hover:border-purple-300 flex justify-between items-center text-slate-800 font-semibold"
              >
                Skyline Financial Services
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Col: Allotment Chance Estimator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-purple-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Percent className="w-4 h-4 text-purple-700" />
              Retail Allotment Probability Estimator
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Retail Subscription Demand (Times)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={subTimes}
                  onChange={(e) => setSubTimes(Math.max(0.1, parseFloat(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Applications Submitted (Family Demat Accounts)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={applicationsSubmitted}
                  onChange={(e) => setApplicationsSubmitted(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-900 font-bold"
                />
              </div>

              <div className="p-3.5 rounded bg-purple-50 border border-purple-200 text-center space-y-0.5">
                <span className="text-xs text-slate-600 block">Estimated Allotment Chance</span>
                <span className="text-2xl font-black text-purple-800">
                  {allotmentChancePercent.toFixed(1)}%
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {allotmentChancePercent > 50 ? "High Probability" : "Lottery Base Allocation"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
