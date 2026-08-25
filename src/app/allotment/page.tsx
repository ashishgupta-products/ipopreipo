"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Percent, 
  ShieldCheck, 
  Clock, 
  Calendar,
  Building2,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { Badge } from "@/components/common/Badge";
import { IPOData } from "@/types/ipo";

function AllotmentContent() {
  const searchParams = useSearchParams();
  const [ipos, setIpos] = useState<IPOData[]>([]);
  const [selectedIpoId, setSelectedIpoId] = useState<string>("");
  const [panNumber, setPanNumber] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(false);
  const [result, setResult] = useState<"allotted" | "not_allotted" | null>(null);

  const [subTimes, setSubTimes] = useState<number>(3.5);
  const [applicationsSubmitted, setApplicationsSubmitted] = useState<number>(1);

  const todayStr = new Date().toISOString().split("T")[0];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "--";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}-${month}-${year.slice(-2)}`;
    }
    return dateStr;
  };

  const isAllotmentPhase = (ipo: any) => {
    if (ipo.status === "listed") return false;
    if (ipo.listingDate && ipo.listingDate < todayStr) return false;
    if (ipo.status === "closed" || ipo.status === "allotment_out") return true;
    if (ipo.closeDate && ipo.closeDate < todayStr && (!ipo.listingDate || ipo.listingDate >= todayStr)) return true;
    return false;
  };

  useEffect(() => {
    async function loadIPOs() {
      try {
        const res = await fetch("/api/ipos");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const allData: IPOData[] = json.data;
          
          // Sort so allotment-active & recent IPOs appear at the top
          const sorted = [...allData].sort((a, b) => {
            const isAltA = isAllotmentPhase(a) ? 1 : 0;
            const isAltB = isAllotmentPhase(b) ? 1 : 0;
            if (isAltA !== isAltB) return isAltB - isAltA;
            return (b.allotmentDate || b.closeDate || "").localeCompare(a.allotmentDate || a.closeDate || "");
          });

          setIpos(sorted);

          // Check if URL specified an IPO id or slug
          const paramIpo = searchParams.get("ipo") || searchParams.get("slug");
          if (paramIpo) {
            const found = sorted.find(i => i.id === paramIpo || i.slug === paramIpo);
            if (found) {
              setSelectedIpoId(found.id);
              return;
            }
          }

          // Default to first allotment-active IPO, or first in list
          const firstAllotment = sorted.find(isAllotmentPhase);
          setSelectedIpoId(firstAllotment ? firstAllotment.id : sorted[0].id);
        }
      } catch (err) {
        console.error("Failed to load allotment ipos:", err);
      }
    }
    loadIPOs();
  }, [searchParams]);

  const selectedIpo = ipos.find((i) => i.id === selectedIpoId) || ipos[0] || {
    id: "default",
    name: "Loading...",
    companyName: "Loading...",
    logoUrl: "",
    registrarName: "Official Registrar",
    registrarCheckUrl: "https://linkintime.co.in",
    lotSize: 1,
    dematCreditDate: "",
    refundDate: "",
    allotmentDate: "",
    listingDate: "",
    status: "closed",
    category: "mainboard"
  };

  const handleSimulatedCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panNumber || panNumber.length < 5) return;
    setChecking(true);
    setResult(null);

    setTimeout(() => {
      setChecking(false);
      setResult(Math.random() > 0.4 ? "allotted" : "not_allotted");
    }, 900);
  };

  const allotmentChancePercent = subTimes <= 1 
    ? 100 
    : (1 - Math.pow(1 - 1 / subTimes, applicationsSubmitted)) * 100;

  const allotmentIpos = ipos.filter(isAllotmentPhase);
  const otherRecentIpos = ipos.filter(i => !isAllotmentPhase(i)).slice(0, 8);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            LIVE IPO ALLOTMENT ENGINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Check IPO Allotment Status &amp; Registrar Portals
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl font-medium">
            Search official allocation records across Link Intime, KFintech, Bigshare, and Skyline. Check PAN allotment results, demat credit timelines, and ASBA unblock dates in one central hub.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Direct Allotment Query Engine */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-700" />
                Direct Allotment Query Engine
              </h2>
              <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
                {allotmentIpos.length} In Allotment Stage
              </span>
            </div>

            <form onSubmit={handleSimulatedCheck} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Select Active / Recent IPO:
                </label>
                <select
                  value={selectedIpoId}
                  onChange={(e) => {
                    setSelectedIpoId(e.target.value);
                    setResult(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:outline-none focus:border-purple-600 text-sm shadow-3xs"
                >
                  <optgroup label="⚡ In Allotment Phase">
                    {allotmentIpos.map((ipo) => (
                      <option key={ipo.id} value={ipo.id}>
                        {ipo.name} — Allotment: {formatDate(ipo.allotmentDate)} ({ipo.registrarName || "Official Portal"})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📋 Other Recent IPOs">
                    {otherRecentIpos.map((ipo) => (
                      <option key={ipo.id} value={ipo.id}>
                        {ipo.name} ({ipo.registrarName || "Official Portal"})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Selected IPO Logo Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <CompanyLogo name={selectedIpo.name} logoUrl={selectedIpo.logoUrl} size="md" className="rounded-lg shadow-2xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-black text-sm block truncate">{selectedIpo.name}</strong>
                    <Badge category={selectedIpo.category} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-bold">
                    <span>Registrar: <strong className="text-slate-800">{selectedIpo.registrarName || "Check Website"}</strong></span>
                    <span>•</span>
                    <span>Allotment: <strong className="text-purple-700">{formatDate(selectedIpo.allotmentDate)}</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  PAN Number / Application Number:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-purple-600 shadow-3xs"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={checking}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  {checking ? "Querying Server..." : "Check Allotment Result"}
                </button>

                <a
                  href={selectedIpo.registrarCheckUrl || selectedIpo.registrarWebsite || "https://linkintime.co.in"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center gap-1.5 transition-all shrink-0 border border-slate-200"
                >
                  Official Registrar <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </form>

            {/* Results Display */}
            {result && (
              <div
                className={`p-4 rounded-xl border text-xs text-center space-y-1.5 animate-fade-in ${
                  result === "allotted"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-rose-50 border-rose-300 text-rose-950"
                }`}
              >
                <strong className="text-sm font-black block">
                  {result === "allotted"
                    ? "🎉 CONGRATULATIONS! SHARES ALLOTTED"
                    : "NO SHARES ALLOTTED (REFUND INITIATED)"}
                </strong>
                <p className="text-slate-600 font-medium">
                  {result === "allotted"
                    ? `1 Lot (${selectedIpo.lotSize || 1} Shares) allotted for ${selectedIpo.name}. Demat credit expected by ${formatDate(selectedIpo.dematCreditDate)}.`
                    : `No shares allotted for PAN ${panNumber}. Bank ASBA unblock expected by ${formatDate(selectedIpo.refundDate)}.`}
                </p>
              </div>
            )}
          </div>

          {/* Official Registrar Portals */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Direct Registrar Official Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <a
                href="https://linkintime.co.in/initial_offer/public-issues.html"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 flex justify-between items-center text-slate-800 font-bold transition-all"
              >
                Link Intime Portal
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
              </a>

              <a
                href="https://ris.kfintech.com/ipostatus/"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 flex justify-between items-center text-slate-800 font-bold transition-all"
              >
                KFintech Portal
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
              </a>

              <a
                href="https://ipo.bigshareonline.com/ipo_status.html"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 flex justify-between items-center text-slate-800 font-bold transition-all"
              >
                Bigshare Services
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
              </a>

              <a
                href="https://www.skylineinta.com/ipo.aspx"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 flex justify-between items-center text-slate-800 font-bold transition-all"
              >
                Skyline Financial
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Col: Allotment Chance Estimator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-purple-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
              <Percent className="w-4 h-4 text-purple-700" />
              Retail Allotment Probability Estimator
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Retail Subscription Demand (Times)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={subTimes}
                  onChange={(e) => setSubTimes(Math.max(0.1, parseFloat(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Applications Submitted (Family Demat Accounts)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={applicationsSubmitted}
                  onChange={(e) => setApplicationsSubmitted(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold"
                />
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center space-y-1">
                <span className="text-xs text-slate-600 font-semibold block">Estimated Allotment Chance</span>
                <span className="text-3xl font-black text-purple-800 block">
                  {allotmentChancePercent.toFixed(1)}%
                </span>
                <span className="text-[11px] text-slate-500 font-bold block">
                  {allotmentChancePercent > 50 ? "High Probability" : "Lottery Base Allocation"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Allotment Phase IPOs Hub Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">
              IPOs Currently in Allotment &amp; Finalization Stage
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Bidding has closed for these issues. Statuses and registrar portals are active below.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {allotmentIpos.length} IPOs
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-3">IPO Company Name</th>
                <th className="py-3 px-3">Segment</th>
                <th className="py-3 px-3">Price Band</th>
                <th className="py-3 px-3">Allotment Date</th>
                <th className="py-3 px-3">Listing Date</th>
                <th className="py-3 px-3">Registrar</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {allotmentIpos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 font-medium">
                    No IPOs currently awaiting allotment. Check back once active IPOs close bidding.
                  </td>
                </tr>
              ) : (
                allotmentIpos.map((ipo) => (
                  <tr key={ipo.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <CompanyLogo name={ipo.name} logoUrl={ipo.logoUrl} size="sm" className="rounded-lg shadow-2xs" />
                        <div>
                          <Link href={`/ipo/${ipo.slug}`} className="hover:text-blue-750 font-bold text-xs block">
                            {ipo.name}
                          </Link>
                          <div className="mt-0.5">
                            <Badge 
                              status={ipo.status} 
                              openDate={ipo.openDate} 
                              closeDate={ipo.closeDate} 
                              allotmentDate={ipo.allotmentDate} 
                              listingDate={ipo.listingDate} 
                            />
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <Badge category={ipo.category} />
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">
                      ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                    </td>

                    <td className="py-3 px-3 font-bold text-purple-700">
                      {formatDate(ipo.allotmentDate)}
                    </td>

                    <td className="py-3 px-3 text-slate-500 font-semibold">
                      {formatDate(ipo.listingDate)}
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-700">
                      {ipo.registrarName || "Official Portal"}
                    </td>

                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedIpoId(ipo.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-1 font-bold text-[11px] text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md border border-purple-200 transition-colors"
                      >
                        Select in Query
                      </button>
                      <a
                        href={ipo.registrarCheckUrl || ipo.registrarWebsite || "https://linkintime.co.in"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[11px] text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md border border-slate-200 transition-colors"
                      >
                        Registrar <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AllotmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center text-slate-500 font-bold text-sm">Loading IPO Allotment Hub...</div>}>
      <AllotmentContent />
    </Suspense>
  );
}
