import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Download, 
  HelpCircle,
  Layers,
  Smartphone,
  Gift,
  Briefcase,
  LayoutGrid
} from "lucide-react";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";
import UserReviewsSection from "@/components/common/UserReviewsSection";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import PaymentAppCompareWidget from "@/components/articles/PaymentAppCompareWidget";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PaymentAppDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const app = MOCK_PAYMENT_APPS.find((a) => a.slug === resolvedParams.slug);

  if (!app) {
    notFound();
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Back Button */}
      <Link
        href="/payment-apps"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0c1220] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Payment Apps List
      </Link>

      {/* Main Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={app.name} logoUrl={app.logoUrl} size="xl" className="shadow-2xs shrink-0 rounded-lg" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5] border border-blue-100">
                  {app.developer}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/80">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {app.playStoreRating} / 5.0 Rating ({app.downloadsTier})
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {app.name} Review
              </h1>

              <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
                {app.overview}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="w-full sm:w-auto shrink-0">
            <a
              href={app.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              Get App Online
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100/80 text-[11px] font-bold">
          {app.upiLiteSupport && (
            <span className="px-2.5 py-0.5 rounded bg-[#e8f7f0] text-[#10b981] border border-emerald-200/60">
              UPI Lite Enabled
            </span>
          )}
          {app.ruPayUpiSupport && (
            <span className="px-2.5 py-0.5 rounded bg-[#eef2ff] text-[#4f46e5] border border-blue-100">
              RuPay Credit Card Support
            </span>
          )}
          {app.creditScoreCheckFree && (
            <span className="px-2.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-100">
              Free Credit Score Report
            </span>
          )}
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col */}
        <div className="lg:col-span-8 space-y-5">
          {/* Key Features */}
          {/* App Products & Services */}
          {app.productBasket && app.productBasket.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-800" />
                Products &amp; Services
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                The full range of financial distribution products and utility features available directly inside the {app.name} application:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {app.productBasket.map((product, i) => (
                  <div 
                    key={i} 
                    className="p-3 bg-slate-50/60 border border-slate-200/50 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-350 hover:bg-white transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{product}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cashback, Rewards & Reality */}
          {app.cashbackRewardsReality && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Gift className="w-4.5 h-4.5 text-amber-500" />
                Cashback, Rewards &amp; Reality
              </h2>
              <ul className="space-y-2 text-xs">
                {app.cashbackRewardsReality.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 font-medium">
                    {point.type === "right" ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <span>{point.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fee & Charges */}
          {app.feeDetails && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-800" />
                Transaction Fee &amp; Platform Charges
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200/80 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/60 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Transaction Category</th>
                      <th className="py-2.5 px-3 text-right">Fee Charges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {app.feeDetails.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{f.label}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-850">{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Supported Ecosystem Features */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-800" />
              Supported Ecosystem Features
            </h2>
            <ul className="space-y-2 text-xs">
              {app.keyFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQs */}
          {app.faqs && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-800" />
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-3 text-xs">
                {app.faqs.map((faq, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                    <strong className="text-slate-800 block font-bold">Q: {faq.question}</strong>
                    <p className="text-slate-500 font-medium leading-relaxed">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col */}
        <div className="lg:col-span-4 space-y-5">
          {/* Pros & Cons */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Advantages
              </span>
              <ul className="space-y-2 text-slate-600 font-medium">
                {app.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="font-bold text-rose-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Cons &amp; Limitations
              </span>
              <ul className="space-y-2 text-slate-500 font-medium">
                {app.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* User Reviews Section */}
      <div className="mt-5">
        <UserReviewsSection
          entityId={app.id}
          entityName={app.name}
          entityType="payment_app"
          initialRating={app.playStoreRating}
          initialReviews={app.userReviews}
        />
      </div>
    </div>
  );
}
