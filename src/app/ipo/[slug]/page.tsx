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
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Percent
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { GMPCard } from "@/components/common/GMPCard";
import { SubscriptionTable } from "@/components/common/SubscriptionTable";
import { Calculator } from "@/components/common/Calculator";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

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
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-slate-500 font-semibold animate-pulse text-sm">Loading IPO details...</div>
      </div>
    );
  }

  if (!ipo) {
    notFound();
  }

  const computedLotSizes = ipo.lotSizes && ipo.lotSizes.length > 0 
    ? ipo.lotSizes 
    : calculateLotSizes(ipo.lotSize, ipo.priceBandMax);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "IPOs", href: "/" }, { label: ipo.name }]} className="mb-2" />

      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Main Corporate Header */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={ipo.name} logoUrl={ipo.logoUrl} size="xl" className="shadow-md shrink-0" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge status={ipo.status} />
                <Badge category={ipo.category} />
                <span className="text-xs text-slate-600 font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {ipo.exchange}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {ipo.name}
              </h1>
              <p className="text-xs text-slate-500">
                Lead Managers: {ipo.leadManagers.join(", ")} | Registrar: {ipo.registrarName}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <a
              href={ipo.registrarCheckUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Check Allotment Status
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Price Band:</span>
            <strong className="text-base font-extrabold text-slate-900">₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Lot Size:</span>
            <strong className="text-base font-extrabold text-slate-900">{ipo.lotSize} Shares (₹{ipo.minInvestment.toLocaleString("en-IN")})</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Issue Size:</span>
            <strong className="text-base font-extrabold text-slate-900">₹{ipo.issueSizeTotalCr} Cr</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Subscription:</span>
            <strong className="text-base font-extrabold text-blue-700">{ipo.totalSubscription}x Total</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Review Score:</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-black text-emerald-700">{ipo.reviewScore || Math.round(((ipo.rating || 3.5) / 5) * 100)}/100</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${
                ipo.recommendation === "Apply for Long Term" || ipo.recommendation === "Apply for Listing Gain"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : ipo.recommendation === "Avoid"
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}>
                {ipo.recommendation || "May Apply"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile-only Tab Switcher */}
        <div className="lg:hidden w-full bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1 text-xs">
          <button
            onClick={() => setActiveMobileTab("overview")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeMobileTab === "overview"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Overview
          </button>
          <button
            onClick={() => setActiveMobileTab("gmp_sub")}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeMobileTab === "gmp_sub"
                ? "bg-white text-blue-700 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            GMP &amp; Subscription ({ipo.totalSubscription.toFixed(2)}x)
          </button>
        </div>

        {/* Left Col */}
        <div className={`lg:col-span-8 space-y-6 ${activeMobileTab === "overview" ? "block" : "hidden lg:block"}`}>

          {/* Key Dates Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
              <Calendar className="w-4 h-4 text-blue-700" />
              IPO Timetable &amp; Key Dates
            </h3>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Bidding Opens</span>
                  <strong className="text-slate-900 font-bold">{ipo.openDate}</strong>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Bidding Closes</span>
                  <strong className="text-slate-900 font-bold">{ipo.closeDate}</strong>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Allotment Date</span>
                  <strong className="text-purple-700 font-bold">{ipo.allotmentDate}</strong>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Refund Initiation</span>
                  <strong className="text-slate-900 font-bold">{ipo.refundDate}</strong>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Demat Credit</span>
                  <strong className="text-slate-900 font-bold">{ipo.dematCreditDate}</strong>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Exchange Listing</span>
                  <strong className="text-emerald-700 font-bold">{ipo.listingDate}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* IPO Details & Pricing Structure */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
              <Building2 className="w-4 h-4 text-blue-700" />
              {ipo.name} Details
            </h3>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">IPO Price Band:</span>
                  <strong className="text-slate-900 font-bold">₹{ipo.priceBandMin} - ₹{ipo.priceBandMax} per share</strong>
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
                  <span className="text-slate-500 font-medium">Fresh Issue Size:</span>
                  <strong className="text-emerald-700 font-bold">₹{ipo.freshIssueCr} Cr</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Offer for Sale (OFS):</span>
                  <strong className="text-rose-700 font-bold">₹{ipo.ofsCr} Cr</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">IPO Issue Type:</span>
                  <strong className="text-slate-900 font-bold">Book Built Issue IPO</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Listing Exchange(s):</span>
                  <strong className="text-slate-900 font-bold">{ipo.exchange}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Market Lot Size:</span>
                  <strong className="text-slate-900 font-bold">{ipo.lotSize} Shares</strong>
                </div>
              </div>
              {(ipo.prospectusUrl || ipo.drhpUrl) && (
                <div className="flex gap-4 pt-4 text-xs border-t border-slate-100 mt-3">
                  {ipo.prospectusUrl && (
                    <a href={ipo.prospectusUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline">
                      Download Prospectus <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {ipo.drhpUrl && (
                    <a href={ipo.drhpUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-slate-600 hover:underline">
                      Download DRHP <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Lot Size Table */}
          {computedLotSizes && computedLotSizes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
                <Layers className="w-4 h-4 text-blue-700" />
                Lot Size &amp; Application Limits
              </h3>
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
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
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{item.applicationCategory}</td>
                          <td className="py-2.5 px-3 font-semibold">{item.lots === 0 ? "No Upper Limit" : item.lots}</td>
                          <td className="py-2.5 px-3">{item.shares === 0 ? "No Upper Limit" : item.shares.toLocaleString("en-IN")}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {item.amount === 0 ? "No Upper Limit" : `₹${item.amount.toLocaleString("en-IN")}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analyst Review & Recommendation Scorecard */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Overall Expert Assessment
                </span>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  IPO Review Score &amp; Rating
                </h3>
              </div>

              {/* Big Score Badge & Stars */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Review Score</span>
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {ipo.reviewScore || Math.round(((ipo.rating || 3.5) / 5) * 100)}
                    <span className="text-xs text-slate-400 font-semibold">/100</span>
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-200" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Analyst Rating</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => {
                        const r = ipo.rating || 3.5;
                        const isFilled = i < Math.floor(r);
                        const isHalf = !isFilled && i < r;
                        return (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              isFilled
                                ? "text-amber-400 fill-amber-400"
                                : isHalf
                                ? "text-amber-400 fill-amber-400/50"
                                : "text-slate-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="font-extrabold text-slate-800 text-xs ml-1">
                      {(ipo.rating || 3.5).toFixed(1)}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Consensus Banner */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              ipo.recommendation === "Apply for Long Term" || ipo.recommendation === "Apply for Listing Gain"
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                : ipo.recommendation === "Avoid"
                ? "bg-rose-50/70 border-rose-200 text-rose-900"
                : "bg-amber-50/70 border-amber-200 text-amber-900"
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🎯</span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                    Consensus Recommendation
                  </span>
                  <strong className="text-sm font-black tracking-tight block">
                    {ipo.recommendation || "May Apply"}
                  </strong>
                </div>
              </div>
              <span className={`text-[11px] font-extrabold px-3 py-1 rounded-lg border self-start sm:self-auto ${
                ipo.recommendation === "Apply for Long Term" || ipo.recommendation === "Apply for Listing Gain"
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : ipo.recommendation === "Avoid"
                  ? "bg-rose-600 text-white border-rose-700"
                  : "bg-amber-600 text-white border-amber-700"
              }`}>
                {ipo.recommendation === "Apply for Long Term"
                  ? "High Conviction Growth"
                  : ipo.recommendation === "Apply for Listing Gain"
                  ? "Listing Pop Opportunity"
                  : ipo.recommendation === "Avoid"
                  ? "High Risk / Caution"
                  : "Neutral / Moderate Risk"}
              </span>
            </div>

            {/* Broker Sentiment Breakdown (if available) */}
            {ipo.brokerReviews && (ipo.brokerReviews.subscribe + ipo.brokerReviews.mayApply + ipo.brokerReviews.neutral + ipo.brokerReviews.avoid) > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Broker Sentiment Breakdown</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {(ipo.brokerReviews.subscribe + ipo.brokerReviews.mayApply + ipo.brokerReviews.neutral + ipo.brokerReviews.avoid)} Broker Calls
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold block">Subscribe</span>
                    <strong className="text-sm font-black text-emerald-900">{ipo.brokerReviews.subscribe}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-teal-50 border border-teal-200">
                    <span className="text-[10px] text-teal-800 font-bold block">May Apply</span>
                    <strong className="text-sm font-black text-teal-900">{ipo.brokerReviews.mayApply}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-[10px] text-slate-700 font-bold block">Neutral</span>
                    <strong className="text-sm font-black text-slate-800">{ipo.brokerReviews.neutral}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="text-[10px] text-rose-800 font-bold block">Avoid</span>
                    <strong className="text-sm font-black text-rose-900">{ipo.brokerReviews.avoid}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Key Strengths */}
            {ipo.highlights && ipo.highlights.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="font-extrabold text-slate-900 text-xs block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Key Strengths &amp; Growth Drivers:
                </span>
                <ul className="space-y-1.5 text-slate-600 pl-1">
                  {ipo.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Risks */}
            {ipo.risks && ipo.risks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-rose-700 text-xs block flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  Key Investment Risks:
                </span>
                <ul className="space-y-1.5 text-slate-600 pl-1">
                  {ipo.risks.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>



          {/* IPO Reservations & Category Quota Distribution */}
          {ipo.reservations && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-700" />
                  IPO Reservations &amp; Category Quota Distribution
                </h3>
                <span className="text-[11px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  Total Issue: ₹{ipo.issueSizeTotalCr} Cr
                </span>
              </div>

              {/* Visual Category Distribution Stack */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>Category Quota Breakdown (%)</span>
                  <span>100% Total Issue Size</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                  {ipo.reservations.map((res: any, idx: number) => {
                    const colors = [
                      "bg-blue-600",
                      "bg-purple-600",
                      "bg-emerald-600",
                      "bg-amber-500",
                      "bg-indigo-500"
                    ];
                    return (
                      <div
                        key={idx}
                        className={`${colors[idx % colors.length]} transition-all duration-300`}
                        style={{ width: res.percentage }}
                        title={`${res.category}: ${res.percentage}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Investor Category</th>
                      <th className="py-2.5 px-3">Shares Offered</th>
                      <th className="py-2.5 px-3 text-center">Quota Allocation (%)</th>
                      <th className="py-2.5 px-3 text-right">Reservation Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {ipo.reservations.map((res: any, idx: number) => {
                      const badgeColors = [
                        "bg-blue-50 text-blue-800 border-blue-200",
                        "bg-purple-50 text-purple-800 border-purple-200",
                        "bg-emerald-50 text-emerald-800 border-emerald-200",
                        "bg-amber-50 text-amber-800 border-amber-200",
                        "bg-indigo-50 text-indigo-800 border-indigo-200"
                      ];
                      const dotColors = [
                        "bg-blue-600",
                        "bg-purple-600",
                        "bg-emerald-600",
                        "bg-amber-500",
                        "bg-indigo-500"
                      ];
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]} shrink-0`} />
                            {res.category}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{res.sharesOffered}</td>
                          <td className="py-2.5 px-3 text-center font-bold">
                            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-black ${badgeColors[idx % badgeColors.length]}`}>
                              {res.percentage}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">
                            {res.amountCr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Key Performance Indicators (KPIs) & Valuation Multiples */}
          {ipo.kpis && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  Key Performance Indicators (KPI) &amp; Valuation Metrics
                </h3>
                <div className="flex items-center gap-2">
                  {ipo.kpis.marketCapUpperBand && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      M-Cap: {ipo.kpis.marketCapUpperBand}
                    </span>
                  )}
                  {ipo.kpis.asOfDate && (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                      Values as of {ipo.kpis.asOfDate}
                    </span>
                  )}
                </div>
              </div>

              {/* KPI Summary Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {ipo.kpis.roe && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/90">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">ROE (Return on Equity)</span>
                    <strong className="text-lg font-black text-emerald-950 block mt-0.5">{ipo.kpis.roe}</strong>
                  </div>
                )}
                {ipo.kpis.roce && (
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/90">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">ROCE (Capital Employed)</span>
                    <strong className="text-lg font-black text-teal-950 block mt-0.5">{ipo.kpis.roce}</strong>
                  </div>
                )}
                {ipo.kpis.ronw && (
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/90">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">RoNW (Return on Net Worth)</span>
                    <strong className="text-lg font-black text-blue-950 block mt-0.5">{ipo.kpis.ronw}</strong>
                  </div>
                )}
                {ipo.kpis.patMargin && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/90">
                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">PAT Profit Margin</span>
                    <strong className="text-lg font-black text-indigo-950 block mt-0.5">{ipo.kpis.patMargin}</strong>
                  </div>
                )}
                {ipo.kpis.ebitdaMargin && (
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/90">
                    <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">EBITDA Margin</span>
                    <strong className="text-lg font-black text-purple-950 block mt-0.5">{ipo.kpis.ebitdaMargin}</strong>
                  </div>
                )}
                {ipo.kpis.debtEquity && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Debt / Equity Ratio</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <strong className="text-lg font-black text-slate-900">{ipo.kpis.debtEquity}</strong>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${parseFloat(ipo.kpis.debtEquity) < 1.0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {parseFloat(ipo.kpis.debtEquity) < 1.0 ? 'Low Leverage' : 'Moderate Debt'}
                      </span>
                    </div>
                  </div>
                )}
                {ipo.kpis.priceToBookValue && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/90">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Price to Book (P/BV)</span>
                    <strong className="text-lg font-black text-amber-950 block mt-0.5">{ipo.kpis.priceToBookValue}x</strong>
                  </div>
                )}
                {ipo.kpis.nav && (
                  <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/90">
                    <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">NAV Per Share</span>
                    <strong className="text-lg font-black text-sky-950 block mt-0.5">₹{ipo.kpis.nav}</strong>
                  </div>
                )}
              </div>

              {/* Valuation Pre-IPO vs Post-IPO Comparison Table */}
              {(ipo.kpis.preIpoEps || ipo.kpis.preIpoPe || ipo.kpis.marketCapUpperBand) && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Valuation Multiples (Pre-IPO vs Post-IPO)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Valuation Metric</th>
                          <th className="py-2.5 px-3 text-center">Pre-IPO</th>
                          <th className="py-2.5 px-3 text-right">Post-IPO / Issue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
                        {ipo.kpis.preIpoEps && (
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Earnings Per Share (EPS)</td>
                            <td className="py-2.5 px-3 text-center font-extrabold text-slate-900">₹{ipo.kpis.preIpoEps}</td>
                            <td className="py-2.5 px-3 text-right font-extrabold text-blue-700">₹{ipo.kpis.postIpoEps || ipo.kpis.preIpoEps}</td>
                          </tr>
                        )}
                        {(ipo.kpis.preIpoPe || ipo.kpis.postIpoPe) && (
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Price to Earnings Multiple (P/E x)</td>
                            <td className="py-2.5 px-3 text-center font-extrabold text-slate-900">{ipo.kpis.preIpoPe ? `${ipo.kpis.preIpoPe}x` : "-"}</td>
                            <td className="py-2.5 px-3 text-right font-extrabold text-blue-700">{ipo.kpis.postIpoPe ? `${ipo.kpis.postIpoPe}x` : (ipo.kpis.preIpoPe ? `${ipo.kpis.preIpoPe}x` : "-")}</td>
                          </tr>
                        )}
                        {ipo.kpis.marketCapUpperBand && (
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Market Cap at Upper Band</td>
                            <td className="py-2.5 px-3 text-center font-medium text-slate-500">-</td>
                            <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">{ipo.kpis.marketCapUpperBand}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Financials Table */}
          {ipo.financials && ipo.financials.length > 0 && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    Financial Performance Trends
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Restated consolidated financial figures in ₹ Crores from official filing.
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Multi-Year Financial Audit
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
                      {ipo.financials.some((f: any) => f.assets !== null && f.assets !== undefined) && (
                        <th className="py-2.5 px-3">Total Assets</th>
                      )}
                      {ipo.financials.some((f: any) => f.reserves !== null && f.reserves !== undefined) && (
                        <th className="py-2.5 px-3">Reserves &amp; Surplus</th>
                      )}
                      {ipo.financials.some((f: any) => f.borrowing !== null && f.borrowing !== undefined) && (
                        <th className="py-2.5 px-3">Borrowings / Debt</th>
                      )}
                      <th className="py-2.5 px-3 text-right">RoNW (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {ipo.financials.map((fin: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">{fin.year}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-bold text-slate-900">₹{fin.revenue.toLocaleString("en-IN")} Cr</div>
                          {fin.revenueGrowthYoY !== null && fin.revenueGrowthYoY !== undefined && (
                            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                              fin.revenueGrowthYoY >= 0 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                            }`}>
                              {fin.revenueGrowthYoY >= 0 ? "+" : ""}{fin.revenueGrowthYoY}% YoY
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className={`font-bold ${fin.pat >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                            ₹{fin.pat.toLocaleString("en-IN")} Cr
                          </div>
                          {fin.patGrowthYoY !== null && fin.patGrowthYoY !== undefined && (
                            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                              fin.patGrowthYoY >= 0 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                            }`}>
                              {fin.patGrowthYoY >= 0 ? "+" : ""}{fin.patGrowthYoY}% YoY
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-medium whitespace-nowrap">₹{fin.netWorth.toLocaleString("en-IN")} Cr</td>
                        {ipo.financials.some((f: any) => f.assets !== null && f.assets !== undefined) && (
                          <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                            {fin.assets ? `₹${fin.assets.toLocaleString("en-IN")} Cr` : "-"}
                          </td>
                        )}
                        {ipo.financials.some((f: any) => f.reserves !== null && f.reserves !== undefined) && (
                          <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                            {fin.reserves ? `₹${fin.reserves.toLocaleString("en-IN")} Cr` : "-"}
                          </td>
                        )}
                        {ipo.financials.some((f: any) => f.borrowing !== null && f.borrowing !== undefined) && (
                          <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                            {fin.borrowing ? `₹${fin.borrowing.toLocaleString("en-IN")} Cr` : "-"}
                          </td>
                        )}
                        <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                          {fin.ronw !== null && fin.ronw !== undefined ? `${fin.ronw}%` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Objects of the Issue (Fund Utilization) */}
          {ipo.objectsOfIssue && ipo.objectsOfIssue.length > 0 && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-700" />
                  Objects of the Issue (Fund Utilization)
                </h3>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  {ipo.objectsOfIssue.length} Strategic Objectives
                </span>
              </div>
              <div className="space-y-2.5 pt-1">
                {ipo.objectsOfIssue.map((obj: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5 text-xs text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="font-medium leading-relaxed">{obj.purpose}</p>
                    </div>
                    {obj.amountCr && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap">
                        ₹{obj.amountCr} Cr
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Peer Comparison Table */}
          {ipo.peerComparison && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-700" />
                Industry Peer Valuation Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">S. No.</th>
                      <th className="py-2.5 px-3">Company Name</th>
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
                        <td className="py-2.5 px-3 text-right font-bold text-blue-700">{peer.peRatio.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Company Contact Information & Registrar & Lead Managers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company Contact Info */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Building2 className="w-4 h-4 text-blue-700" />
                Company Contact Information
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                <strong className="text-slate-900 block text-sm font-bold">{ipo.companyName}</strong>
                {ipo.companyAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{ipo.companyAddress}</span>
                  </div>
                )}
                {ipo.companyPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900">{ipo.companyPhone}</span>
                  </div>
                )}
                {ipo.companyEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${ipo.companyEmail}`} className="text-blue-700 hover:underline">{ipo.companyEmail}</a>
                  </div>
                )}
                {ipo.companyWebsite && (
                  <div className="flex items-center gap-2 pt-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={ipo.companyWebsite} target="_blank" rel="noreferrer" className="text-blue-700 font-bold hover:underline flex items-center gap-1">
                      Official Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Registrar & Lead Managers Info */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              {/* Registrar */}
              <div className="space-y-2 text-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  IPO Registrar
                </h3>
                <strong className="text-slate-900 block text-sm font-bold">{ipo.registrarName}</strong>
                {ipo.registrarPhone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ipo.registrarPhone}</span>
                  </div>
                )}
                {ipo.registrarEmail && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${ipo.registrarEmail}`} className="text-blue-700 hover:underline">{ipo.registrarEmail}</a>
                  </div>
                )}
                <div className="flex gap-3 pt-1">
                  <a
                    href={ipo.registrarCheckUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                  >
                    Check Allotment <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={ipo.registrarWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
                  >
                    Registrar Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Lead Managers */}
              <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-700" />
                  Lead Manager(s)
                </h3>
                <ul className="space-y-1 text-slate-700 list-disc list-inside font-medium">
                  {ipo.leadManagers.map((lm: any, idx: number) => (
                    <li key={idx}>{lm}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions (FAQs) */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <HelpCircle className="w-4 h-4 text-blue-700" />
              {ipo.name} FAQs
            </h3>
            
            <div className="space-y-4 divide-y divide-slate-100 text-xs">
              <div className="pt-2 first:pt-0 space-y-1.5">
                <h4 className="font-bold text-slate-900">1. What is the {ipo.name} IPO?</h4>
                <p className="text-slate-655 leading-relaxed">
                  {ipo.name} is a <strong>{ipo.category === "mainboard" ? "Mainboard" : "SME"} IPO</strong> to raise <strong>₹{ipo.issueSizeTotalCr} Cr</strong>. The issue is priced between <strong>₹{ipo.priceBandMin} - ₹{ipo.priceBandMax} per share</strong> with a face value of <strong>₹{ipo.faceValue}</strong>.
                </p>
              </div>

              <div className="pt-3 space-y-1.5">
                <h4 className="font-bold text-slate-900">2. How to apply in {ipo.name} IPO through Zerodha?</h4>
                <p className="text-slate-655 leading-relaxed">
                  To apply through Zerodha: Log in to Zerodha Console or Kite app, navigate to the <strong>IPO</strong> tab, select <strong>{ipo.name}</strong>, enter your UPI ID, bidding quantity (multiples of <strong>{ipo.lotSize} shares</strong>), and cut-off price. Submit and approve the mandate request in your UPI App to block <strong>₹{ipo.minInvestment.toLocaleString("en-IN")}</strong>.
                </p>
              </div>

              <div className="pt-3 space-y-1.5">
                <h4 className="font-bold text-slate-900">3. When {ipo.name} IPO will open?</h4>
                <p className="text-slate-655 leading-relaxed">
                  The {ipo.name} IPO opens on <strong>{ipo.openDate}</strong> and closes on <strong>{ipo.closeDate}</strong>.
                </p>
              </div>

              <div className="pt-3 space-y-1.5">
                <h4 className="font-bold text-slate-900">4. How to apply for {ipo.name} IPO?</h4>
                <p className="text-slate-655 leading-relaxed">
                  You can apply online via <strong>ASBA</strong> through your Net Banking portal, or using <strong>UPI</strong> through popular brokers like Zerodha, Groww, Angel One, and Upstox by blocking the bidding amount before the close date.
                </p>
              </div>

              <div className="pt-3 space-y-1.5">
                <h4 className="font-bold text-slate-900">5. When is {ipo.name} IPO allotment?</h4>
                <p className="text-slate-655 leading-relaxed">
                  The allotment for {ipo.name} IPO is scheduled to be finalized on <strong>{ipo.allotmentDate}</strong>. You can check the allotment status online on the registrar website ({ipo.registrarName}) at <a href={ipo.registrarCheckUrl} target="_blank" rel="noreferrer" className="text-blue-750 font-semibold hover:underline">Registrar Allotment Link</a>.
                </p>
              </div>

              <div className="pt-3 space-y-1.5">
                <h4 className="font-bold text-slate-900">6. When is {ipo.name} IPO listing date?</h4>
                <p className="text-slate-655 leading-relaxed">
                  The listing date for {ipo.name} IPO is scheduled for <strong>{ipo.listingDate}</strong> on the stock exchanges (<strong>{ipo.exchange}</strong>).
                </p>
              </div>

              <div className="pt-3 space-y-1.5">
                <h4 className="font-bold text-slate-900">7. What is {ipo.name} IPO GMP (Grey Market Premium)?</h4>
                <p className="text-slate-655 leading-relaxed">
                  The current Grey Market Premium (GMP) for {ipo.name} is <strong>₹{ipo.gmp}</strong>. With a price band of ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}, the expected listing price is <strong>₹{ipo.expectedListingPrice}</strong>, reflecting an estimated listing gain of <strong>{ipo.gmpPercent.toFixed(2)}%</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className={`lg:col-span-4 space-y-6 ${activeMobileTab === "gmp_sub" ? "block" : "hidden lg:block"}`}>
          <GMPCard
            gmp={ipo.gmp}
            gmpPercent={ipo.gmpPercent}
            expectedListingPrice={ipo.expectedListingPrice}
            priceBandMax={ipo.priceBandMax}
            updatedTime={ipo.gmpUpdatedTime}
            lotSize={ipo.lotSize}
            gmpTrends={ipo.gmpTrends}
          />

          {/* Est. Profit per Application (as per GMP) */}
          {ipo.gmp > 0 && computedLotSizes && computedLotSizes.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                Est. Profit per Application (as per GMP)
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Lots / Shares</th>
                      <th className="py-2.5 px-3 text-right">Est. Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {computedLotSizes
                      .filter((item: any) => item.shares > 0 && item.lots > 0)
                      .map((item: any, idx: number) => {
                        const estProfit = item.shares * ipo.gmp;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/60 font-medium">
                            <td className="py-2 px-3 text-slate-800 font-semibold">
                              {item.applicationCategory}
                            </td>
                            <td className="py-2 px-3 text-center text-slate-500 font-medium">
                              {item.lots} Lot{item.lots > 1 ? "s" : ""} ({item.shares} sh)
                            </td>
                            <td className="py-2 px-3 text-right font-extrabold text-emerald-700 text-xs sm:text-sm">
                              ₹{estProfit.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Everyday GMP Trends */}
          {ipo.gmpTrends && ipo.gmpTrends.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                Everyday GMP Trend
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
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
                      const isNegative = trend.gmp?.includes('-') || trend.gain?.includes('-') || trend.gain?.toLowerCase().includes('dis') || trend.gmp?.toLowerCase().includes('dis');
                      return (
                        <tr key={idx} className="hover:bg-slate-50/60 font-medium">
                          <td className="py-2.5 px-3 text-slate-600">
                            {trend.date}
                          </td>
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

          {/* Live Subscription, Application Breakup and Demand */}
          <div className="space-y-6">
            {/* Live Subscription */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                Subscription Detail (No of Shares)
              </h3>
              <SubscriptionTable
                totalSubscription={ipo.totalSubscription}
                qibSubscription={ipo.qibSubscription}
                niiSubscription={ipo.niiSubscription}
                sNiiSubscription={ipo.sNiiSubscription}
                bNiiSubscription={ipo.bNiiSubscription}
                retailSubscription={ipo.retailSubscription}
                employeeSubscription={ipo.employeeSubscription}
                shareholderSubscription={ipo.shareholderSubscription}
              />
            </div>
            </div>

        </div>
      </div>

      {/* Raw Data Inspector Section */}
      <div className="mt-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Raw API &amp; Database Inspector</h3>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-200">
            Developer &amp; Product View
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          This panel shows the exact raw fields returned from the Python Scraper &amp; Neon Database / JSON cache. Use this to inspect all available financials, valuation ratios, schedules, and subscription metrics in real time.
        </p>
        <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800 text-[11px] font-mono text-emerald-400 max-h-[500px] shadow-inner leading-relaxed w-full">
          <pre>{JSON.stringify(ipo, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
