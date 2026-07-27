import React from "react";
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
  TrendingUp
} from "lucide-react";
import { MOCK_IPOS } from "@/data/mockIpos";
import { Badge } from "@/components/common/Badge";
import { GMPCard } from "@/components/common/GMPCard";
import { SubscriptionTable } from "@/components/common/SubscriptionTable";
import { Calculator } from "@/components/common/Calculator";
import { CompanyLogo } from "@/components/common/CompanyLogo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function IPODetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const ipo = MOCK_IPOS.find((i) => i.slug === resolvedParams.slug);

  if (!ipo) {
    notFound();
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
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
        </div>
      </div>

      {/* Grid: Details & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile GMP Card */}
        <div className="lg:hidden">
          <GMPCard
            gmp={ipo.gmp}
            gmpPercent={ipo.gmpPercent}
            expectedListingPrice={ipo.expectedListingPrice}
            priceBandMax={ipo.priceBandMax}
            updatedTime={ipo.gmpUpdatedTime}
          />
        </div>

        {/* Left Col */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Dates Table */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" />
              IPO Timetable &amp; Key Dates
            </h3>

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

          {/* IPO Details & Pricing Structure */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Building2 className="w-4 h-4 text-blue-700" />
              {ipo.name} Details
            </h3>
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
              <div className="flex gap-4 pt-1.5 text-xs">
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

          {/* Lot Size Table */}
          {ipo.lotSizes && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-700" />
                Lot Size &amp; Application Limits
              </h3>
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
                    {ipo.lotSizes.map((item, idx) => (
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
          )}


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
                  {ipo.reservations.map((res, idx) => {
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
                    {ipo.reservations.map((res, idx) => {
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
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  Key Performance Indicators (KPI) &amp; Valuation Metrics
                </h3>
                {ipo.kpis.asOfDate && (
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                    Values as of {ipo.kpis.asOfDate}
                  </span>
                )}
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {ipo.kpis.roe && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">ROE (Return on Equity)</span>
                    <strong className="text-lg font-black text-emerald-900 block mt-0.5">{ipo.kpis.roe}</strong>
                  </div>
                )}
                {ipo.kpis.ronw && (
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">RoNW (Return on Net Worth)</span>
                    <strong className="text-lg font-black text-blue-900 block mt-0.5">{ipo.kpis.ronw}</strong>
                  </div>
                )}
                {ipo.kpis.ebitdaMargin && (
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80">
                    <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">EBITDA Margin</span>
                    <strong className="text-lg font-black text-purple-900 block mt-0.5">{ipo.kpis.ebitdaMargin}</strong>
                  </div>
                )}
                {ipo.kpis.priceToBookValue && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Price to Book (P/B Value)</span>
                    <strong className="text-lg font-black text-amber-900 block mt-0.5">{ipo.kpis.priceToBookValue}</strong>
                  </div>
                )}
              </div>

              {/* Valuation Pre-IPO vs Post-IPO Comparison Table */}
              {(ipo.kpis.preIpoEps || ipo.kpis.preIpoPe) && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Valuation Multiples (Pre-IPO vs Post-IPO)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Valuation Metric</th>
                          <th className="py-2.5 px-3 text-center">Pre-IPO</th>
                          <th className="py-2.5 px-3 text-right">Post-IPO</th>
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
                        {ipo.kpis.preIpoPe && (
                          <tr className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Price to Earnings Multiple (P/E x)</td>
                            <td className="py-2.5 px-3 text-center font-extrabold text-slate-900">{ipo.kpis.preIpoPe}x</td>
                            <td className="py-2.5 px-3 text-right font-extrabold text-blue-700">{ipo.kpis.postIpoPe || ipo.kpis.preIpoPe}x</td>
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
          {ipo.financials && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Financial Performance Trends
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Financial Year</th>
                      <th className="py-2.5 px-3">Revenue (₹ Cr)</th>
                      <th className="py-2.5 px-3">Profit After Tax (₹ Cr)</th>
                      <th className="py-2.5 px-3">Net Worth (₹ Cr)</th>
                      <th className="py-2.5 px-3 text-right">RONW (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {ipo.financials.map((fin, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{fin.year}</td>
                        <td className="py-2.5 px-3">₹{fin.revenue} Cr</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">₹{fin.pat} Cr</td>
                        <td className="py-2.5 px-3">₹{fin.netWorth} Cr</td>
                        <td className="py-2.5 px-3 text-right font-semibold">{fin.ronw}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    {ipo.peerComparison.map((peer, idx) => (
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
                  {ipo.leadManagers.map((lm, idx) => (
                    <li key={idx}>{lm}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="lg:col-span-4 space-y-6">
          <div className="hidden lg:block">
            <GMPCard
              gmp={ipo.gmp}
              gmpPercent={ipo.gmpPercent}
              expectedListingPrice={ipo.expectedListingPrice}
              priceBandMax={ipo.priceBandMax}
              updatedTime={ipo.gmpUpdatedTime}
            />
          </div>

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

          {/* Analyst Scorecard */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-600" />
                ANALYST RECOMMENDATION
              </span>
              <span className="font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                {ipo.rating} / 5.0
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-center font-extrabold text-emerald-700">
              {ipo.recommendation}
            </div>

            <div className="space-y-1 pt-1">
              <span className="font-bold text-slate-800 block">Key Strengths:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                {ipo.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            {ipo.risks && ipo.risks.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="font-bold text-rose-700 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Key Risks:
                </span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {ipo.risks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
