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
  Layers, 
  HelpCircle, 
  FileText,
  Sparkles,
  Gift,
  Plane,
  Fuel,
  Award,
  ShoppingBag,
  DollarSign,
  Utensils,
  Shield,
  Percent
} from "lucide-react";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import UserReviewsSection from "@/components/common/UserReviewsSection";
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

  const allFeatureCategories = [
    { name: "Welcome Bonus", icon: Gift, desc: "Gift vouchers or cash bonus credited on card activation" },
    { name: "Travel", icon: Plane, desc: "Complimentary airport lounge access & flight discounts" },
    { name: "Fuel", icon: Fuel, desc: "1% fuel surcharge waiver across petrol stations in India" },
    { name: "Rewards", icon: Award, desc: "Accelerated reward points on merchant transactions" },
    { name: "Shopping", icon: ShoppingBag, desc: "5% direct cashback on e-commerce partner platforms" },
    { name: "Cashback", icon: DollarSign, desc: "Direct statement credit cashback without complex conversions" },
    { name: "Dining", icon: Utensils, desc: "Exclusive dining discounts & partner restaurant privileges" },
    { name: "Insurance", icon: Shield, desc: "Air accident, lost card liability & emergency travel cover" },
    { name: "Interest", icon: Percent, desc: "Up to 50 days interest-free credit period on card purchases" }
  ];

  const activeFeatures = card.featuresAndBenefits || ["Welcome Bonus", "Travel", "Fuel", "Rewards", "Shopping", "Cashback", "Dining", "Insurance", "Interest"];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Back Button */}
      <Link
        href="/credit-cards"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Credit Cards Catalog
      </Link>

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={card.name} logoUrl={card.logoUrl} size="xl" variant="credit_card" className="shadow-xs shrink-0" />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {card.issuer}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {card.rating} / 5.0 Rating
                </div>
                {card.isPopular && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-black bg-amber-500 text-white uppercase tracking-wider">
                    POPULAR CARD
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {card.name} Review
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl font-medium">
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              Apply for Card Online
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Joining Fee:</span>
            <strong className="text-base font-extrabold text-slate-900">
              {card.joiningFee === 0 ? "₹0 (Free)" : `₹${card.joiningFee}`}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">Annual Fee:</span>
            <strong className="text-base font-extrabold text-slate-900">
              {card.annualFee === 0 ? "₹0 (Free)" : `₹${card.annualFee} / yr`}
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

      {/* Features and Benefits Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Features and Benefits
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Aspects that make spending using this card lit as the sun!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {allFeatureCategories.map((feat) => {
            const IconComponent = feat.icon;
            const isIncluded = activeFeatures.includes(feat.name);

            return (
              <div
                key={feat.name}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                  isIncluded
                    ? "bg-slate-50/80 border-slate-200 text-slate-900 shadow-2xs"
                    : "bg-slate-50/40 border-slate-200/60 text-slate-400 opacity-50"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isIncluded ? "bg-amber-50 text-amber-600 border border-amber-200/80" : "bg-slate-200 text-slate-400"}`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-xs font-black text-slate-900">{feat.name}</strong>
                    {isIncluded ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                        Included ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600 shrink-0">
                        N/A
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col */}
        <div className="lg:col-span-8 space-y-6">
          {/* Privileges & Key Features */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
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
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  Fee Structure &amp; Complete Charges Breakdown
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">All charges subject to applicable GST (18%)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200/80 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Fee Parameter</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Charge Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {card.feeDetails.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          <div>{f.label}</div>
                          {f.description && (
                            <span className="text-[11px] text-slate-500 font-normal block">{f.description}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-medium">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              f.category === "Core & Renewal"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : f.category === "Transactions & Foreign Use"
                                ? "bg-purple-50 text-purple-800 border border-purple-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {f.category || "General Fee"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FAQs */}
          {card.faqs && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-700" />
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-3 text-xs">
                {card.faqs.map((faq, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
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
          {/* Pros & Cons */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Key Advantages:
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
