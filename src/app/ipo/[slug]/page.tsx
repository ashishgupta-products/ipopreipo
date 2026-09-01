"use client";
import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Calendar, 
  Layers, 
  Building2, 
  Award,
  ExternalLink,
  Users,
  ShieldAlert,
  BarChart3,
  Phone,
  Mail,
  Globe,
  MapPin,
  UserCheck,
  Briefcase,
  TrendingUp,
  HelpCircle,
  Star,
  Target,
  FileText,
  Calculator as CalcIcon,
  Clock,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { GMPCard } from "@/components/common/GMPCard";
import { SubscriptionTable } from "@/components/common/SubscriptionTable";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { WatchlistButton } from "@/components/auth/WatchlistButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function calculateLotSizes(lotSize: number, priceMax: number) {
  if (!lotSize || !priceMax) return [];
  const singleLotCost = lotSize * priceMax;
  if (singleLotCost <= 0) return [];

  const retailMaxLots = Math.floor(200000 / singleLotCost);
  const shniMinLots = retailMaxLots + 1;
  const shniMaxLots = Math.floor(1000000 / singleLotCost);
  const bhniMinLots = shniMaxLots + 1;

  const list = [
    {
      applicationCategory: "Retail (Min)",
      lots: 1,
      shares: lotSize,
      amount: singleLotCost
    }
  ];

  if (retailMaxLots > 1) {
    list.push({
      applicationCategory: "Retail (Max)",
      lots: retailMaxLots,
      shares: retailMaxLots * lotSize,
      amount: retailMaxLots * singleLotCost
    });
  }

  list.push({
    applicationCategory: "Small HNI (Min)",
    lots: shniMinLots,
    shares: shniMinLots * lotSize,
    amount: shniMinLots * singleLotCost
  });

  if (shniMaxLots > shniMinLots) {
    list.push({
      applicationCategory: "Small HNI (Max)",
      lots: shniMaxLots,
      shares: shniMaxLots * lotSize,
      amount: shniMaxLots * singleLotCost
    });
  }

  list.push({
    applicationCategory: "Big HNI (Min)",
    lots: bhniMinLots,
    shares: bhniMinLots * lotSize,
    amount: bhniMinLots * singleLotCost
  });

  return list;
}

export default function IPODetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [activeMobileTab, setActiveMobileTab] = useState<"overview" | "gmp_sub">("overview");
  const [selectedLots, setSelectedLots] = useState<number>(1);
  const [ipo, setIpo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadIPO() {
      try {
        const res = await fetch("/api/ipos");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              const found = json.data.find((i: any) => i.slug === resolvedParams.slug);
              if (found) {
                setIpo(found);
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load live IPO detail.", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadIPO();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-600 font-semibold text-sm">Loading verified IPO intelligence...</div>
      </div>
    );
  }

  if (!ipo) {
    notFound();
  }

  const computedLotSizes = ipo.lotSizes && ipo.lotSizes.length > 0 
    ? ipo.lotSizes 
    : calculateLotSizes(ipo.lotSize, ipo.priceBandMax || ipo.priceBandMin);

  const singleLotPrice = (ipo.priceBandMax || ipo.priceBandMin || 0) * (ipo.lotSize || 1);
  const calcInvestment = singleLotPrice * selectedLots;
  const calcProfit = (ipo.gmp || 0) * (ipo.lotSize || 1) * selectedLots;
  const calcTotalValue = calcInvestment + calcProfit;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "IPOs", href: "/" }, { label: ipo.name }]} className="mb-2" />

      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All IPOs
      </Link>

      {/* Hero Corporate Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <CompanyLogo name={ipo.name} logoUrl={ipo.logoUrl} size="xl" className="shadow-md shrink-0 ring-2 ring-slate-100" />
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge status={ipo.status} />
                <Badge category={ipo.category} />
                <span className="text-xs text-slate-700 font-bold px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                  {ipo.exchange}
                </span>
                {ipo.prospectusUrl && (
                  <a
                    href={ipo.prospectusUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    SEBI Prospectus (PDF)
                  </a>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {ipo.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bidding: <strong className="text-slate-900">{ipo.openDate || "TBA"} – {ipo.closeDate || "TBA"}</strong></span>
                </div>
                {ipo.listingDate && (
                  <div className="flex items-center gap-1.5 font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Listing on: <strong>{ipo.listingDate}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <WatchlistButton
              ipoSlug={ipo.slug}
              ipoId={ipo.id}
              ipoName={ipo.name}
              variant="button"
            />
            {ipo.registrarCheckUrl && (
              <a
                href={ipo.registrarCheckUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Check Allotment Status</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Key Summary Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-5 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-medium block">Price Band</span>
            <strong className="text-sm sm:text-base font-extrabold text-slate-900 block mt-0.5">
              {ipo.priceBandMin > 0 ? `₹${ipo.priceBandMin} – ₹${ipo.priceBandMax}` : "To be announced"}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-medium block">Lot Size (Min Inv)</span>
            <strong className="text-sm sm:text-base font-extrabold text-slate-900 block mt-0.5">
              {ipo.lotSize} sh ({ipo.minInvestment > 0 ? `₹${ipo.minInvestment.toLocaleString("en-IN")}` : "TBA"})
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 font-medium block">Total Issue Size</span>
            <strong className="text-sm sm:text-base font-extrabold text-slate-900 block mt-0.5">
              {ipo.issueSizeTotalCr > 0 ? `₹${ipo.issueSizeTotalCr} Cr` : "TBA"}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
            <span className="text-blue-700 font-medium block">Live Subscription</span>
            <strong className="text-sm sm:text-base font-extrabold text-blue-900 block mt-0.5">
              {ipo.totalSubscription && Number(ipo.totalSubscription) > 0 ? `${Number(ipo.totalSubscription).toFixed(2)}x` : "Open / TBA"}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-emerald-800 font-medium block">Current GMP</span>
            <strong className="text-sm sm:text-base font-extrabold text-emerald-900 block mt-0.5">
              {ipo.gmp > 0 ? `+₹${ipo.gmp} (${(Number(ipo.gmpPercent) || 0).toFixed(1)}%)` : "TBA / ₹0"}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile Tab Switcher */}
        <div className="lg:hidden w-full bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1 text-xs">
          <button
            onClick={() => setActiveMobileTab("overview")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all ${
              activeMobileTab === "overview"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            Overview &amp; Details
          </button>
          <button
            onClick={() => setActiveMobileTab("gmp_sub")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all ${
              activeMobileTab === "gmp_sub"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
            GMP &amp; Subscription ({ipo.totalSubscription && Number(ipo.totalSubscription) > 0 ? `${Number(ipo.totalSubscription).toFixed(2)}x` : "Open"})
          </button>
        </div>

        {/* Left Column — Detailed Intelligence */}
        <div className={`lg:col-span-8 space-y-6 ${activeMobileTab === "overview" ? "block" : "hidden lg:block"}`}>

          {/* 1. Timetable & Key Dates */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-blue-700" />
              IPO Timetable &amp; Key Event Dates
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Issue Opens</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">{ipo.openDate || "To be announced"}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Issue Closes</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">{ipo.closeDate || "To be announced"}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200/80">
                <span className="text-purple-700 font-medium block">Allotment Finalization</span>
                <strong className="text-purple-950 font-bold text-sm block mt-0.5">{ipo.allotmentDate || "To be announced"}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Refund Initiation</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">{ipo.refundDate || "To be announced"}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Demat Share Credit</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">{ipo.dematCreditDate || "To be announced"}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
                <span className="text-emerald-700 font-medium block">Exchange Listing</span>
                <strong className="text-emerald-950 font-bold text-sm block mt-0.5">{ipo.listingDate || "To be announced"}</strong>
              </div>
            </div>
          </div>

          {/* 2. Interactive Investment & Profit Calculator */}
          {ipo.priceBandMax > 0 && ipo.lotSize > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CalcIcon className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">Investment &amp; Listing Gain Calculator</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                  1 Lot = {ipo.lotSize} Shares
                </span>
              </div>

              {/* Lot selector buttons */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Select Application Lots:</span>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 5, 10, 14, 50].map((lots) => (
                    <button
                      key={lots}
                      onClick={() => setSelectedLots(lots)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedLots === lots
                          ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700"
                      }`}
                    >
                      {lots} {lots === 1 ? "Lot" : "Lots"} ({lots * ipo.lotSize} sh)
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 font-medium block">Total Investment Required</span>
                  <strong className="text-base sm:text-lg font-black text-white block mt-0.5">
                    ₹{calcInvestment.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                  <span className="text-[11px] text-emerald-300 font-medium block">Estimated Gain (at current GMP)</span>
                  <strong className="text-base sm:text-lg font-black text-emerald-400 block mt-0.5">
                    {ipo.gmp > 0 ? `+₹${calcProfit.toLocaleString("en-IN")} (${(Number(ipo.gmpPercent) || 0).toFixed(1)}%)` : "₹0 (GMP Pending)"}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 font-medium block">Expected Portfolio Value</span>
                  <strong className="text-base sm:text-lg font-black text-white block mt-0.5">
                    ₹{calcTotalValue.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* 3. Issue Structure & Pricing Details */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-blue-700" />
              {ipo.name} Issue Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Price Band:</span>
                <strong className="text-slate-900 font-bold">₹{ipo.priceBandMin} – ₹{ipo.priceBandMax} per share</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Face Value:</span>
                <strong className="text-slate-900 font-bold">₹{ipo.faceValue} per share</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Total Issue Size:</span>
                <strong className="text-slate-900 font-bold">₹{ipo.issueSizeTotalCr} Cr</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Fresh Issue:</span>
                <strong className="text-emerald-700 font-bold">₹{ipo.freshIssueCr} Cr</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Offer for Sale (OFS):</span>
                <strong className="text-rose-700 font-bold">₹{ipo.ofsCr} Cr</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Market Lot Size:</span>
                <strong className="text-slate-900 font-bold">{ipo.lotSize} Shares</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Listing Exchanges:</span>
                <strong className="text-slate-900 font-bold">{ipo.exchange}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Issue Structure:</span>
                <strong className="text-slate-900 font-bold">100% Book Built Issue</strong>
              </div>
            </div>
          </div>

          {/* 4. Lot Size & Application Limits Table */}
          {computedLotSizes && computedLotSizes.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  Lot Size &amp; Application Limits
                </h3>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Retail &amp; HNI Limits
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Application Category</th>
                      <th className="py-2.5 px-3">Lots</th>
                      <th className="py-2.5 px-3">Shares</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {computedLotSizes.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{item.applicationCategory}</td>
                        <td className="py-2.5 px-3 font-medium">{item.lots === 0 ? "No Upper Limit" : item.lots}</td>
                        <td className="py-2.5 px-3">{item.shares === 0 ? "No Upper Limit" : item.shares.toLocaleString("en-IN")}</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                          {item.amount === 0 ? "No Upper Limit" : `₹${item.amount.toLocaleString("en-IN")}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Key Strengths & Risks */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-amber-500" />
              Strategic Highlights, Strengths &amp; Risk Analysis
            </h3>

            {/* Strengths */}
            {ipo.highlights && ipo.highlights.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Key Business Strengths &amp; Growth Drivers:
                </span>
                <ul className="space-y-2 text-slate-700 pl-1 text-xs leading-relaxed">
                  {ipo.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risks */}
            {ipo.risks && ipo.risks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-rose-800 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  Key Investment &amp; Operational Risks:
                </span>
                <ul className="space-y-2 text-slate-700 pl-1 text-xs leading-relaxed">
                  {ipo.risks.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 bg-rose-50/40 p-2.5 rounded-lg border border-rose-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 6. Multi-Year Financial Balance Sheet */}
          {ipo.financials && ipo.financials.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    Financial Performance &amp; Balance Sheet Trends
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Restated consolidated financial figures in ₹ Crores.
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Audited Filing
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Period Ended</th>
                      <th className="py-2.5 px-3">Total Revenue</th>
                      <th className="py-2.5 px-3">Profit After Tax (PAT)</th>
                      <th className="py-2.5 px-3">Net Worth</th>
                      {ipo.financials.some((f: any) => f.assets > 0) && <th className="py-2.5 px-3">Total Assets</th>}
                      {ipo.financials.some((f: any) => f.ebitda > 0) && <th className="py-2.5 px-3 text-right">EBITDA</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {ipo.financials.map((fin: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">{fin.year}</td>
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">₹{fin.revenue.toLocaleString("en-IN")} Cr</td>
                        <td className={`py-3 px-3 font-bold whitespace-nowrap ${fin.pat >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                          ₹{fin.pat.toLocaleString("en-IN")} Cr
                        </td>
                        <td className="py-3 px-3 font-medium whitespace-nowrap">₹{fin.netWorth.toLocaleString("en-IN")} Cr</td>
                        {ipo.financials.some((f: any) => f.assets > 0) && (
                          <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                            {fin.assets ? `₹${fin.assets.toLocaleString("en-IN")} Cr` : "-"}
                          </td>
                        )}
                        {ipo.financials.some((f: any) => f.ebitda > 0) && (
                          <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                            {fin.ebitda ? `₹${fin.ebitda.toLocaleString("en-IN")} Cr` : "-"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. Key Performance Indicators (KPIs) */}
          {ipo.kpis && (ipo.kpis.postIpoPe || ipo.kpis.postIpoEps || ipo.kpis.roce || ipo.kpis.ronw || ipo.kpis.patMargin) && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                Key Performance Indicators (KPIs) &amp; Valuations
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {ipo.kpis.postIpoPe && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">P/E Ratio (Post-IPO)</span>
                    <strong className="text-base font-black text-slate-900 block mt-0.5">{ipo.kpis.postIpoPe}x</strong>
                  </div>
                )}
                {ipo.kpis.postIpoEps && (
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/90">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">EPS (Earnings Per Share)</span>
                    <strong className="text-base font-black text-blue-950 block mt-0.5">₹{ipo.kpis.postIpoEps}</strong>
                  </div>
                )}
                {ipo.kpis.roce && (
                  <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/90">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">ROCE (Capital Employed)</span>
                    <strong className="text-base font-black text-teal-950 block mt-0.5">{ipo.kpis.roce}</strong>
                  </div>
                )}
                {ipo.kpis.ronw && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/90">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">RoNW (Net Worth Return)</span>
                    <strong className="text-base font-black text-emerald-950 block mt-0.5">{ipo.kpis.ronw}</strong>
                  </div>
                )}
                {ipo.kpis.patMargin && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/90">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">PAT Profit Margin</span>
                    <strong className="text-base font-black text-indigo-950 block mt-0.5">{ipo.kpis.patMargin}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. Objects of the Issue (Fund Utilization) */}
          {ipo.objectsOfIssue && ipo.objectsOfIssue.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-700" />
                  Objects of the Issue (Proceeds Utilization)
                </h3>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {ipo.objectsOfIssue.length} Objectives
                </span>
              </div>
              <div className="space-y-2.5">
                {ipo.objectsOfIssue.map((obj: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
                    <div className="flex items-start gap-3 text-xs text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="font-semibold leading-relaxed">{obj.purpose}</p>
                    </div>
                    {obj.amountCr && (
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md shrink-0">
                        ₹{obj.amountCr} Cr
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. Industry Peer Valuation Comparison */}
          {ipo.peerComparison && ipo.peerComparison.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <BarChart3 className="w-4 h-4 text-blue-700" />
                Industry Listed Peer Valuation Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">S. No.</th>
                      <th className="py-2.5 px-3">Listed Peer Company</th>
                      <th className="py-2.5 px-3 text-center">Face Value (₹)</th>
                      <th className="py-2.5 px-3 text-right">P/E Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {ipo.peerComparison.map((peer: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{peer.companyName}</td>
                        <td className="py-2.5 px-3 text-center font-medium">₹{peer.faceValue}</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-blue-700">{peer.peRatio ? `${peer.peRatio.toFixed(2)}x` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. Registrar & Lead Managers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Registrar Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                IPO Registrar Details
              </h3>
              <div className="space-y-2 text-xs">
                <strong className="text-slate-900 block text-sm font-extrabold">{ipo.registrarName || "Check Website"}</strong>
                {ipo.registrarPhone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ipo.registrarPhone}</span>
                  </div>
                )}
                {ipo.registrarEmail && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${ipo.registrarEmail}`} className="text-blue-700 hover:underline">{ipo.registrarEmail}</a>
                  </div>
                )}
                <div className="flex flex-wrap gap-3 pt-2">
                  {ipo.registrarCheckUrl && (
                    <a
                      href={ipo.registrarCheckUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Check Allotment Online <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {ipo.registrarWebsite && (
                    <a
                      href={ipo.registrarWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-xs text-slate-600 hover:text-slate-900 px-2 py-1.5"
                    >
                      Registrar Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Managers Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Briefcase className="w-4 h-4 text-indigo-700" />
                Book Running Lead Managers
              </h3>
              <div className="space-y-2 text-xs">
                {ipo.leadManagers && ipo.leadManagers.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {ipo.leadManagers.map((lm: string, idx: number) => (
                      <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-lg text-xs">
                        {lm}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 font-medium">Lead managers disclosed in prospectus filings.</p>
                )}
                {ipo.companyWebsite && (
                  <div className="pt-3 border-t border-slate-100">
                    <a
                      href={ipo.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Visit {ipo.name} Official Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 11. Frequently Asked Questions (FAQs) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <HelpCircle className="w-4 h-4 text-blue-700" />
              Frequently Asked Questions (FAQ)
            </h3>
            
            <div className="space-y-3.5 divide-y divide-slate-100 text-xs">
              <div className="pt-2 first:pt-0 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">1. What is the {ipo.name} IPO issue size?</h4>
                <p className="text-slate-600 leading-relaxed">
                  {ipo.name} is raising <strong>₹{ipo.issueSizeTotalCr || "TBA"} Crores</strong> ({ipo.category === "mainboard" ? "Mainboard" : "SME"} issue) with a fresh issue component of <strong>₹{ipo.freshIssueCr} Cr</strong> and OFS of <strong>₹{ipo.ofsCr} Cr</strong>.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">2. What are the bidding dates for {ipo.name} IPO?</h4>
                <p className="text-slate-600 leading-relaxed">
                  The IPO bidding opens on <strong>{ipo.openDate || "To be announced"}</strong> and closes on <strong>{ipo.closeDate || "To be announced"}</strong>.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">3. What is the price band and minimum investment?</h4>
                <p className="text-slate-600 leading-relaxed">
                  The issue is priced at <strong>₹{ipo.priceBandMin} – ₹{ipo.priceBandMax} per share</strong> with a lot size of <strong>{ipo.lotSize} shares</strong>, requiring a minimum retail investment of <strong>₹{ipo.minInvestment?.toLocaleString("en-IN") || "TBA"}</strong>.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">4. When is the allotment and listing date?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Allotment is expected to be finalized on <strong>{ipo.allotmentDate || "TBA"}</strong> and the stock will list on stock exchanges (<strong>{ipo.exchange}</strong>) on <strong>{ipo.listingDate || "TBA"}</strong>.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">5. How to check {ipo.name} IPO allotment status?</h4>
                <p className="text-slate-600 leading-relaxed">
                  You can check your allotment status online via the official registrar portal (<strong>{ipo.registrarName}</strong>) using your PAN number or Application number.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Sidebar (GMP, Subscription & Trends) */}
        <div className={`lg:col-span-4 space-y-6 ${activeMobileTab === "gmp_sub" ? "block" : "hidden lg:block"}`}>
          {/* GMP Card */}
          <GMPCard
            gmp={ipo.gmp}
            gmpPercent={ipo.gmpPercent}
            expectedListingPrice={ipo.expectedListingPrice}
            priceBandMax={ipo.priceBandMax || ipo.priceBandMin}
            updatedTime={ipo.gmpUpdatedTime}
            lotSize={ipo.lotSize}
            gmpTrends={ipo.gmpTrends}
          />

          {/* Daily Historical GMP Trends Table */}
          {ipo.gmpTrends && ipo.gmpTrends.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                Daily GMP Trend Log
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-center">GMP</th>
                      <th className="py-2.5 px-3 text-right">Est. Gain (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {ipo.gmpTrends.map((trend: any, idx: number) => {
                      const isNegative = trend.gmp?.includes('-') || trend.gain?.includes('-');
                      return (
                        <tr key={idx} className="hover:bg-slate-50/60 font-medium">
                          <td className="py-2.5 px-3 text-slate-600">{trend.date}</td>
                          <td className={`py-2.5 px-3 text-center font-bold ${isNegative ? 'text-rose-600' : 'text-slate-900'}`}>
                            {trend.gmp}
                          </td>
                          <td className={`py-2.5 px-3 text-right font-extrabold ${isNegative ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {trend.gain}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Live Subscription Multiplier */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              Live Bidding Subscription
            </h3>
            <SubscriptionTable
              totalSubscription={ipo.totalSubscription || 0}
              qibSubscription={ipo.qibSubscription || 0}
              niiSubscription={ipo.niiSubscription || 0}
              retailSubscription={ipo.retailSubscription || 0}
              subscriptionBreakdown={ipo.subscriptionBreakdown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
