import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ArrowLeft, 
  Coins, 
  Layers, 
  HelpCircle, 
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
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

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

  const breadcrumbsItems = [
    { label: "Credit Cards", href: "/credit-cards" },
    { label: card.name }
  ];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={breadcrumbsItems} className="mb-2" />


      {/* Main Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={card.name} logoUrl={card.logoUrl} size="xl" variant="credit_card" className="shadow-2xs shrink-0 rounded-lg" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5] border border-blue-100">
                  {card.issuer}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/80">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {card.rating} / 5.0 Rating
                </div>
                {card.isPopular && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow-2xs">
                    Popular Card
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {card.name} Review
              </h1>

              <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
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
              className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              Apply for Card Online
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100/80">
          <div>
            <span className="text-slate-400 text-xs block mb-0.5 font-medium">Joining Fee</span>
            <strong className="text-slate-800 font-bold text-sm sm:text-base block">
              {card.joiningFee === 0 ? "Free" : `₹${card.joiningFee}`}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-0.5 font-medium">Annual Fee</span>
            <strong className="text-slate-800 font-bold text-sm sm:text-base block">
              {card.annualFee === 0 ? "Free" : `₹${card.annualFee} / yr`}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-0.5 font-medium">Min Income Needed</span>
            <strong className="text-slate-800 font-bold text-sm sm:text-base block">
              ₹{(card.minIncomePerMonth / 1000).toFixed(0)}k / month
            </strong>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-0.5 font-medium">Reward Rate</span>
            <strong className="text-emerald-600 font-bold text-sm sm:text-base block">
              {card.rewardRate}
            </strong>
          </div>
        </div>
      </div>

      {/* Features and Benefits Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            Features &amp; Benefits
          </h2>
          <p className="text-slate-500 text-[11px] font-medium">
            Aspects that make spending using this card rewarding and convenient.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {allFeatureCategories.map((feat) => {
            const IconComponent = feat.icon;
            const isIncluded = activeFeatures.includes(feat.name);

            return (
              <div
                key={feat.name}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all bg-white border-slate-200/60 shadow-2xs hover:shadow-xs ${
                  isIncluded
                    ? "text-slate-900"
                    : "opacity-50 text-slate-400"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 border ${
                  isIncluded 
                    ? "bg-[#e8f7f0] text-[#10b981] border-emerald-200/60" 
                    : "bg-slate-50 text-slate-400 border-slate-200/40"
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-xs font-bold text-slate-800">{feat.name}</strong>
                    {isIncluded ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f7f0] text-[#10b981] shrink-0">
                        Included ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 shrink-0">
                        N/A
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-snug">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col */}
        <div className="lg:col-span-8 space-y-5">
          {/* Privileges & Key Features */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-slate-800" />
              Key Privileges &amp; Rewards Breakdown
            </h2>
            <ul className="space-y-2 text-xs">
              {card.keyPrivileges.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fee & Charges Matrix */}
          {card.feeDetails && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-800" />
                  Fee Structure &amp; Complete Charges Breakdown
                </h2>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200/40">Subject to GST (18%)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200/80 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/60 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Fee Parameter</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Charge Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {card.feeDetails.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          <div>{f.label}</div>
                          {f.description && (
                            <span className="text-[10px] text-slate-400 font-normal block mt-0.5">{f.description}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-medium">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              f.category === "Core & Renewal"
                                ? "bg-[#eef2ff] text-[#4f46e5] border-blue-100"
                                : f.category === "Transactions & Foreign Use"
                                ? "bg-purple-50 text-purple-800 border-purple-100"
                                : "bg-rose-50 text-rose-800 border-rose-100"
                            }`}
                          >
                            {f.category || "General Fee"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">{f.value}</td>
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
                <HelpCircle className="w-4 h-4 text-slate-800" />
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-3 text-xs">
                {card.faqs.map((faq, i) => (
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
            entityId={card.id}
            entityName={card.name}
            entityType="credit_card"
            initialRating={card.rating}
            initialReviews={card.userReviews}
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
                {card.pros.map((p, i) => (
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
                {card.cons.map((c, i) => (
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
