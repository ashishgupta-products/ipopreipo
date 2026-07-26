"use client";

import React, { useState } from "react";
import { Award, CheckCircle2, ArrowRight, Sparkles, ExternalLink, HelpCircle, Layers } from "lucide-react";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import Link from "next/link";

export default function ArticleCardComparisonWidget() {
  const [selectedGoal, setSelectedGoal] = useState<"multi_online" | "amazon_only" | "lounge_travel" | "utility_food">("multi_online");

  const cards = MOCK_CREDIT_CARDS.filter((c) =>
    ["sbi-cashback-credit-card", "hdfc-millennia", "amazon-pay-icici", "axis-airtel"].includes(c.slug)
  );

  const getRecommendedCardSlug = () => {
    switch (selectedGoal) {
      case "multi_online":
        return "sbi-cashback-credit-card";
      case "amazon_only":
        return "amazon-pay-icici";
      case "lounge_travel":
        return "hdfc-millennia";
      case "utility_food":
        return "axis-airtel";
      default:
        return "sbi-cashback-credit-card";
    }
  };

  const recommendedCard = cards.find((c) => c.slug === getRecommendedCardSlug());

  return (
    <div className="my-8 bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Widget Header */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
            INTERACTIVE DECISION ASSISTANT
          </span>
          <span className="text-xs text-slate-400 font-medium">Card Selector Quiz</span>
        </div>
        <h3 className="text-xl font-black tracking-tight text-white">
          Find Your Ideal Credit Card in 10 Seconds
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Select your primary spending goal below to see the highest-value card tailored for your habits.
        </p>
      </div>

      {/* Interactive Goal Switcher Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-bold">
        <button
          onClick={() => setSelectedGoal("multi_online")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedGoal === "multi_online"
              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black"
              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
          }`}
        >
          🛍️ Multi-Store Shopping
          <span className="block text-[10px] font-normal opacity-80 mt-0.5">Flipkart, Myntra, Swiggy, Nykaa</span>
        </button>

        <button
          onClick={() => setSelectedGoal("amazon_only")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedGoal === "amazon_only"
              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black"
              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
          }`}
        >
          📦 Amazon Shopping
          <span className="block text-[10px] font-normal opacity-80 mt-0.5">Prime user + Zero annual fee</span>
        </button>

        <button
          onClick={() => setSelectedGoal("lounge_travel")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedGoal === "lounge_travel"
              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black"
              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
          }`}
        >
          ✈️ Shopping + Lounge Access
          <span className="block text-[10px] font-normal opacity-80 mt-0.5">Domestic airport lounge visits</span>
        </button>

        <button
          onClick={() => setSelectedGoal("utility_food")}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedGoal === "utility_food"
              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black"
              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
          }`}
        >
          ⚡ Utility Bills &amp; Swiggy
          <span className="block text-[10px] font-normal opacity-80 mt-0.5">Recharges, wifi &amp; food orders</span>
        </button>
      </div>

      {/* Recommended Match Result Banner */}
      {recommendedCard && (
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <CompanyLogo name={recommendedCard.name} logoUrl={recommendedCard.logoUrl} size="lg" variant="credit_card" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase tracking-wide">
                  Top Recommended Card
                </span>
                <span className="text-xs text-amber-400 font-bold">★ {recommendedCard.rating} / 5.0</span>
              </div>
              <h4 className="font-extrabold text-lg text-white">{recommendedCard.name}</h4>
              <p className="text-xs text-slate-300 leading-normal">
                {recommendedCard.rewardRate}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
            <Link
              href={`/credit-cards/${recommendedCard.slug}`}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors text-center"
            >
              Read Detailed Review
            </Link>
            <a
              href={recommendedCard.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
            >
              Apply Online <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Quick Comparison Specs Matrix */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-400" />
          Side-by-Side Quick Comparison Specs
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-800 text-slate-300 font-bold border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Card Name</th>
                <th className="py-2.5 px-3">Annual Fee</th>
                <th className="py-2.5 px-3">Fee Waiver Limit</th>
                <th className="py-2.5 px-3 text-right">Primary Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {cards.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <CompanyLogo name={c.name} logoUrl={c.logoUrl} size="xs" variant="credit_card" />
                    <Link href={`/credit-cards/${c.slug}`} className="hover:text-emerald-400">
                      {c.name}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3">{c.joiningFee === 0 ? "₹0 (Free)" : `₹${c.annualFee}`}</td>
                  <td className="py-2.5 px-3 text-slate-400">{c.annualFeeWaiverCondition}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-400 max-w-[200px] truncate">
                    {c.rewardRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
