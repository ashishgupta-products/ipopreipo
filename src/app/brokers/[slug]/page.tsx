import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Briefcase, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ArrowLeft, 
  Layers, 
  HelpCircle,
  BarChart3,
  PieChart
} from "lucide-react";
import { MOCK_BROKERS } from "@/data/mockBrokers";
import UserReviewsSection from "@/components/common/UserReviewsSection";
import { CompanyLogo } from "@/components/common/CompanyLogo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BrokerDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const broker = MOCK_BROKERS.find((b) => b.slug === resolvedParams.slug);

  if (!broker) {
    notFound();
  }

  const allProductOfferings = [
    { name: "Equity", desc: "Cash, Delivery & Intraday Stocks" },
    { name: "Commodity", desc: "MCX Gold, Silver, Crude & Metals" },
    { name: "Currency", desc: "USD-INR & FX Derivatives" },
    { name: "Futures", desc: "Index & Stock Futures Contracts" },
    { name: "Options", desc: "Call & Put Options Trading" },
    { name: "Mutual Funds", desc: "Direct Mutual Funds & SIPs" },
    { name: "IPOs", desc: "Mainboard & SME IPO Bidding" }
  ];

  const activeOfferings = broker.productOfferings || ["Equity", "Commodity", "Currency", "Futures", "Options", "Mutual Funds", "IPOs"];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Link
        href="/brokers"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Stock Brokers List
      </Link>

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={broker.name} logoUrl={broker.logoUrl} size="xl" className="shadow-md shrink-0" />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  {broker.type}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {broker.rating} / 5.0 Rating ({broker.activeClientsNse} Active Clients)
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {broker.name} Review
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                {broker.overview}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="w-full sm:w-auto shrink-0">
            <a
              href={broker.openAccountUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              Open Demat Account Online
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Equity Delivery:</span>
            <strong className="text-base font-extrabold text-emerald-700">{broker.equityDeliveryFee}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Equity Intraday:</span>
            <strong className="text-base font-extrabold text-slate-900">{broker.equityIntradayFee}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Demat AMC Charge:</span>
            <strong className="text-base font-extrabold text-slate-900">{broker.dematAnualFee}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Account Opening:</span>
            <strong className="text-base font-extrabold text-slate-900">{broker.accountOpeningFee}</strong>
          </div>
        </div>
      </div>

      {/* Product Offerings (Product Basket) */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-700" />
            Product Offerings
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            <strong>Product Basket:</strong> The segments in which you can invest (includes Equity, Commodity, Currency, Futures and Options) through this broker.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {allProductOfferings.map((prod) => {
            const isSupported = activeOfferings.includes(prod.name);
            return (
              <div
                key={prod.name}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                  isSupported
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                    : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-extrabold text-slate-900">{prod.name}</strong>
                  {isSupported ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">{prod.desc}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${
                    isSupported ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isSupported ? "Available ✓" : "Not Offered"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fee & Charges Matrix */}
          {broker.feeDetails && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-700" />
                Brokerage Charges &amp; Demat Fees
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Charge Category</th>
                      <th className="py-2.5 px-3 text-right">Brokerage Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {broker.feeDetails.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-medium text-slate-700">{f.label}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* IPO Application Method */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              IPO Application Infrastructure
            </h2>
            <p className="text-xs text-slate-600">
              <strong>Application Method:</strong> {broker.ipoApplicationMethod}. Fast UPI 2.0 mandate auto-approval supported.
            </p>
          </div>

          {/* FAQs */}
          {broker.faqs && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-700" />
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-3 text-xs">
                {broker.faqs.map((faq, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-bold">Q: {faq.question}</strong>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Reviews Section */}
          <UserReviewsSection
            entityId={broker.id}
            entityName={broker.name}
            entityType="broker"
            initialRating={broker.rating}
            initialReviews={broker.userReviews}
          />
        </div>

        {/* Right Col */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pros & Cons */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Key Advantages:
              </span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                {broker.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="font-bold text-rose-700 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Cons &amp; Limitations:
              </span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                {broker.cons.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
