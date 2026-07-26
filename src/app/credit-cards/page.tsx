"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Star, Calculator, SlidersHorizontal } from "lucide-react";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import { CardCategory } from "@/types/finance";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import CreditCardRewardCalculator from "@/components/credit-cards/CreditCardRewardCalculator";

export default function CreditCardsPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "calculator">("catalog");
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const cardFeaturesList = [
    { key: "Welcome Bonus", label: "Welcome Bonus" },
    { key: "Travel", label: "Travel" },
    { key: "Fuel", label: "Fuel" },
    { key: "Rewards", label: "Rewards" },
    { key: "Shopping", label: "Shopping" }
  ];

  const filteredCards = MOCK_CREDIT_CARDS.filter((card) => {
    if (selectedCategory !== "all" && !card.category.includes(selectedCategory)) {
      return false;
    }
    if (
      searchTerm &&
      !card.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !card.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80">
              <CreditCard className="w-3 h-3" />
              CREDIT CARD COMPARISON DESK
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              50+ Best Credit Cards in India
            </h1>
            <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
              Evaluate fees, capping, and reward multipliers.
            </p>
          </div>

          {/* Main View Mode Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shrink-0 text-xs font-bold w-full md:w-auto">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "catalog"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              Cards Catalog
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "calculator"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <Calculator className="w-3 h-3" />
              Cashback Estimator
            </button>
          </div>
        </div>
      </div>

      {/* Render Calculator view if tab is active */}
      {activeTab === "calculator" ? (
        <CreditCardRewardCalculator />
      ) : (
        <>
          {/* Filter & Search Control Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === "all" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Cards ({MOCK_CREDIT_CARDS.length})
              </button>
              <button
                onClick={() => setSelectedCategory("cashback")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === "cashback" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Cashback
              </button>
              <button
                onClick={() => setSelectedCategory("lifetime_free")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === "lifetime_free" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Lifetime Free
              </button>
              <button
                onClick={() => setSelectedCategory("travel")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === "travel" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Travel
              </button>
              <button
                onClick={() => setSelectedCategory("rewards")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === "rewards" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Rewards
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search card..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-60 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
            />
          </div>

          {/* Cards Catalog List - Ditto Copy-Paste of Finology Select Design */}
          <div className="space-y-4">
            {filteredCards.map((card) => {
              const activeFeatures = card.featuresAndBenefits || ["Welcome Bonus", "Travel", "Fuel", "Rewards", "Shopping"];
              const cardTier = card.annualFee >= 3000 ? "Premium" : "Regular";
              const bestFor = card.category.includes("cashback")
                ? "Cashback"
                : card.category.includes("travel")
                ? "Lifestyle"
                : "Rewards";

              return (
                <div
                  key={card.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-5 relative"
                >
                  {/* Left Column: Credit Card Logo */}
                  <CompanyLogo name={card.name} logoUrl={card.logoUrl} size="lg" variant="credit_card" className="shadow-2xs shrink-0 rounded-lg self-center sm:self-auto" />

                  {/* Right Column: Text Info & 4-Column Metrics Grid */}
                  <div className="flex-1 min-w-0 space-y-3.5 w-full">
                    {/* Header Row: Title, Rating, and CTA */}
                    <div className="flex justify-between items-start gap-4 w-full">
                      <div className="space-y-2 flex flex-col items-center sm:items-start w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap justify-center sm:justify-start">
                          <h2 className="text-base sm:text-lg font-bold text-slate-800 hover:text-blue-700 transition-colors text-center sm:text-left">
                            <Link href={`/credit-cards/${card.slug}`}>{card.name}</Link>
                          </h2>
                          <div className="flex items-center justify-center sm:justify-start gap-0.5 text-xs font-bold text-amber-500">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(card.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "fill-amber-100 text-amber-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-slate-400 text-xs font-medium ml-1">({card.rating})</span>
                          </div>
                        </div>
 
                        {/* Badges + Features Checklist */}
                        <div className="flex flex-wrap items-center gap-3 w-full justify-start">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#e8f7f0] text-[#10b981]">
                            {cardTier}
                          </span>
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5]">
                            Best For: {bestFor}
                          </span>

                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700 ml-1">
                            {cardFeaturesList.map((feat) => {
                              const isIncluded = activeFeatures.includes(feat.key);
                              return (
                                <span key={feat.key} className="flex items-center gap-1.5">
                                  {isIncluded ? (
                                    <span className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                                      <svg className="w-2.5 h-2.5 stroke-[4.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                    </span>
                                  ) : (
                                    <span className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center shrink-0">
                                      <svg className="w-2 h-2 stroke-[4.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </span>
                                  )}
                                  <span className={isIncluded ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                    {feat.label}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Dark Pill "Full Details" CTA Button (Far Right) */}
                      <div className="shrink-0 hidden sm:block">
                        <Link
                          href={`/credit-cards/${card.slug}`}
                          className="px-5 py-1.5 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
                        >
                          Full Details
                        </Link>
                      </div>
                    </div>

                    {/* 4-Column Rates Matrix - Seamless White Background, No borders! */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-slate-400 text-xs block mb-0.5 font-medium">Reward Rate</span>
                        <strong className="text-slate-800 font-bold text-sm sm:text-base block">
                          {card.rewardRate}
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 text-xs block mb-0.5 font-medium">Joining Fee</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-slate-800 font-bold text-sm sm:text-base">
                            {card.joiningFee === 0 ? "Free" : `₹${card.joiningFee}`}
                          </strong>
                          <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center">i</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 text-xs block mb-0.5 font-medium">Annual Fee</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-slate-800 font-bold text-sm sm:text-base">
                            {card.annualFee === 0 ? "Free" : `₹${card.annualFee}`}
                          </strong>
                          <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center">i</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 text-xs block mb-0.5 font-medium">Annual Percentage Rate</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-slate-800 font-bold text-sm sm:text-base">
                            42%
                          </strong>
                          <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center">i</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Full Details Button */}
                  <div className="w-full pt-1.5 sm:hidden">
                    <Link
                      href={`/credit-cards/${card.slug}`}
                      className="w-full px-5 py-2 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center transition-all"
                    >
                      Full Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SEO Content Section */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                How to Choose the Best Credit Card in India: The Ultimate Comparison Guide
              </h2>
              <p className="font-medium text-slate-500">
                Finding the right credit card can save you thousands of rupees annually in cashback, fuel surcharge waivers, and airport lounge access. Here is everything you need to know to compare and select the best card for your spending habits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">1. Identify Your Spending Profile</h3>
                <p>
                  Different cards offer maximum rewards on specific categories. If you do most of your shopping on e-commerce sites like Amazon, Flipkart, or Myntra, a co-branded <strong>Cashback Card</strong> is your best choice. If you travel frequently, look for cards offering complimentary domestic/international lounge access and air milestones.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">2. Compare Joining &amp; Annual Fees</h3>
                <p>
                  Many premium cards charge an upfront joining fee and a recurring annual maintenance charge. However, most issuers offer <strong>spend-based waivers</strong> (e.g., annual fee waived on spending ₹1 Lakh in a year). If you prefer absolute zero maintenance, filter for <strong>Lifetime Free (LTF) Credit Cards</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">3. Understand the Annual Percentage Rate (APR)</h3>
                <p>
                  If you pay your credit card bill in full before the due date, you incur 0% interest (up to 50 days interest-free period). However, if you roll over balance or pay only the minimum amount due, issuers charge high finance rates ranging from <strong>36% to 45% per annum</strong>. Always compare interest rates before choosing.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">4. Required Credit Score / CIBIL Score</h3>
                <p>
                  To secure instant online approval for premium credit cards, a strong credit profile is required. Issuers typically prefer applicants with a <strong>CIBIL score of 730 or higher</strong>, clean repayment history, and a stable monthly income.
                </p>
              </div>
            </div>

            {/* Structured FAQs for SEO schema */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Frequently Asked Questions (FAQs)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900">What is a Lifetime Free (LTF) Credit Card?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    An LTF credit card has zero joining fee and zero annual renewal fee for life, without any minimum spend conditions.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900">How do I waive off my card's annual fee?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Most credit cards have spend-based waiver milestones (e.g. ₹1 Lakh or ₹2 Lakhs spent in the anniversary year) which automatically waives the next year's fee.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900">What is the interest-free credit period?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    It is the period between your transaction date and the payment due date (usually 45 to 50 days) during which no interest is charged, provided the total bill is paid.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900">Does applying for multiple cards lower CIBIL score?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Yes. Each card application triggers a hard inquiry by the bank. Multiple hard inquiries in a short span can temporarily lower your CIBIL score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
