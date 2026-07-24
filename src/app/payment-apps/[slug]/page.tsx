import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Smartphone, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  Download, 
  HelpCircle,
  Layers
} from "lucide-react";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";
import UserReviewsSection from "@/components/common/UserReviewsSection";
import { CompanyLogo } from "@/components/common/CompanyLogo";

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
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Link
        href="/payment-apps"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Payment Apps List
      </Link>

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={app.name} logoUrl={app.logoUrl} size="xl" className="shadow-md shrink-0" />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {app.developer}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {app.playStoreRating} / 5.0 Rating ({app.downloadsTier})
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {app.name} Review
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
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
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              Get App Online
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 text-xs font-semibold">
          {app.upiLiteSupport && (
            <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              UPI Lite Enabled
            </span>
          )}
          {app.ruPayUpiSupport && (
            <span className="px-3 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
              RuPay Credit Card Support
            </span>
          )}
          {app.creditScoreCheckFree && (
            <span className="px-3 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200">
              Free Credit Score Report
            </span>
          )}
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Features */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              Supported Ecosystem Features
            </h2>
            <ul className="space-y-2 text-xs text-slate-700">
              {app.keyFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fee & Charges */}
          {app.feeDetails && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                Transaction Fee &amp; Platform Charges
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Transaction Category</th>
                      <th className="py-2.5 px-3 text-right">Fee Charges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {app.feeDetails.map((f, i) => (
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

          {/* FAQs */}
          {app.faqs && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-700" />
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-3 text-xs">
                {app.faqs.map((faq, i) => (
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
            entityId={app.id}
            entityName={app.name}
            entityType="payment_app"
            initialRating={app.playStoreRating}
            initialReviews={app.userReviews}
          />
        </div>

        {/* Right Col */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pros & Cons */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Pros:
              </span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                {app.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="font-bold text-rose-700 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Cons:
              </span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                {app.cons.map((c, i) => (
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
