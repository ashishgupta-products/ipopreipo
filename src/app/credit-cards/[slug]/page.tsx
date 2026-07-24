import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CreditCard, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  Coins, 
  HelpCircle,
  Award,
  Layers
} from "lucide-react";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import { UserReviewsSection } from "@/components/common/UserReviewsSection";
import { CompanyLogo } from "@/components/common/CompanyLogo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CreditCardDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const card = MOCK_CREDIT_CARDS.find((c) => c.slug === resolvedParams.slug);

  if (!card) {
    notFound();
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Link
        href="/credit-cards"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Credit Cards List
      </Link>

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={card.name} logoUrl={card.logoUrl} size="xl" className="shadow-md shrink-0" />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {card.issuer}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {card.rating} / 5.0 Rating
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.name} Review
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                {card.overview}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="w-full sm:w-auto shrink-0">
            <a
              href={card.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              Apply Online Now
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Joining Fee:</span>
            <strong className="text-base font-extrabold text-slate-900">
              {card.joiningFee === 0 ? "₹0 (Lifetime Free)" : `₹${card.joiningFee}`}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">Annual Fee:</span>
            <strong className="text-base font-extrabold text-slate-900">
              {card.annualFee === 0 ? "₹0 (Free)" : `₹${card.annualFee}`}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">Min Income Needed:</span>
            <strong className="text-base font-extrabold text-slate-900">
              ₹{(card.minIncomePerMonth / 1000).toFixed(0)}k / month
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">Reward Value:</span>
            <strong className="text-base font-extrabold text-emerald-700">{card.rewardRate}</strong>
          </div>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col */}
        <div className="lg:col-span-8 space-y-6">
          {/* Privileges & Key Features */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-700" />
              Key Privileges &amp; Rewards Breakdown
            </h2>
            <ul className="space-y-2 text-xs text-slate-700">
              {card.keyPrivileges.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fee & Charges Matrix */}
          {card.feeDetails && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-700" />
                Fee Structure &amp; Charges
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Fee Parameter</th>
                      <th className="py-2.5 px-3 text-right">Charge Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {card.feeDetails.map((f, i) => (
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

          {/* Eligibility Criteria */}
          {card.eligibility && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Eligibility Criteria &amp; Documentation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {card.eligibility.map((e, i) => (
                  <div key={i} className="p-3 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">{e.label}</span>
                    <strong className="text-slate-900 font-bold">{e.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {card.faqs && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-700" />
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-3 text-xs">
                {card.faqs.map((faq, i) => (
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
            entityId={card.id}
            entityName={card.name}
            entityType="credit_card"
            initialRating={card.rating}
            initialReviews={card.userReviews}
          />
        </div>

        {/* Right Col */}
        <div className="lg:col-span-4 space-y-6">
          {/* Rating Breakdown */}
          {card.ratingBreakdown && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Score Breakdown
              </h3>
              <div className="space-y-2.5">
                {card.ratingBreakdown.map((r, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span>{r.category}</span>
                      <span className="font-bold text-amber-700">{r.score} / 5.0</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(r.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Pros &amp; Advantages:
              </span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                {card.pros.map((p, i) => (
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
                {card.cons.map((c, i) => (
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
