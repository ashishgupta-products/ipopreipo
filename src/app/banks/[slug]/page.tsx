import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  Layers, 
  HelpCircle
} from "lucide-react";
import { MOCK_BANKS } from "@/data/mockBanks";
import UserReviewsSection from "@/components/common/UserReviewsSection";
import { CompanyLogo } from "@/components/common/CompanyLogo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BankDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const bank = MOCK_BANKS.find((b) => b.slug === resolvedParams.slug);

  if (!bank) {
    notFound();
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Back Button */}
      <Link
        href="/banks"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0c1220] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Banks List
      </Link>

      {/* Main Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={bank.name} logoUrl={bank.logoUrl} size="xl" className="shadow-2xs shrink-0 rounded-lg" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5] border border-blue-100">
                  {bank.type}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/80">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {bank.rating} / 5.0 Rating
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {bank.name} Review
              </h1>

              <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
                {bank.overview}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="w-full sm:w-auto shrink-0">
            <a
              href={bank.openAccountUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              Open Account Online
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100/80">
          <div>
            <span className="text-slate-400 text-xs block mb-0.5 font-medium">Savings Interest</span>
            <strong className="text-emerald-600 font-bold text-sm sm:text-base block">{bank.savingsInterestRate}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-0.5 font-medium">Min Balance (MAB)</span>
            <strong className="text-slate-800 font-bold text-sm sm:text-base block">{bank.minBalanceRequirement}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-0.5 font-medium">Peak FD Rate</span>
            <strong className="text-slate-800 font-bold text-sm sm:text-base block">{bank.fdInterestRatePeak}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-0.5 font-medium">Network</span>
            <strong className="text-slate-800 font-bold text-sm sm:text-base block">{bank.branchCount}</strong>
          </div>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col */}
        <div className="lg:col-span-8 space-y-5">
          {/* Fee & Charges Matrix */}
          {bank.feeDetails && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-800" />
                Service Charges &amp; Minimum Balance Rules
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200/80 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/60 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Banking Service</th>
                      <th className="py-2.5 px-3 text-right">Fee / Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bank.feeDetails.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{f.label}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Eligibility Criteria */}
          {bank.eligibility && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-850" />
                Account Eligibility &amp; KYC
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {bank.eligibility.map((e, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <span className="text-slate-400 font-medium block mb-0.5">{e.label}</span>
                    <strong className="text-slate-800 font-bold">{e.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {bank.faqs && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-800" />
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-3 text-xs">
                {bank.faqs.map((faq, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                    <strong className="text-slate-800 block font-bold">Q: {faq.question}</strong>
                    <p className="text-slate-500 font-medium leading-relaxed">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Reviews Section */}
          <UserReviewsSection
            entityId={bank.id}
            entityName={bank.name}
            entityType="bank"
            initialRating={bank.rating}
            initialReviews={bank.userReviews}
          />
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
                {bank.pros.map((p, i) => (
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
                {bank.cons.map((c, i) => (
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
    </div>
  );
}
