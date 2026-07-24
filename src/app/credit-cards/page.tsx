"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Star, CheckCircle2, XCircle, ExternalLink, ChevronRight } from "lucide-react";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import { CardCategory, CreditCardData } from "@/types/finance";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function CreditCardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <CreditCard className="w-3.5 h-3.5" />
          CREDIT CARD COMPARISON DESK
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Compare &amp; Apply for Best Credit Cards in India
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          Evaluate lifetime free credit cards, cashback cards, airport lounge benefits, reward multipliers, joining fees, and minimum income criteria across top Indian card issuers.
        </p>
      </div>

      {/* Filter & Search Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === "all" ? "bg-blue-900 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Cards ({MOCK_CREDIT_CARDS.length})
          </button>
          <button
            onClick={() => setSelectedCategory("lifetime_free")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === "lifetime_free" ? "bg-blue-900 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Lifetime Free
          </button>
          <button
            onClick={() => setSelectedCategory("cashback")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === "cashback" ? "bg-blue-900 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Cashback Cards
          </button>
          <button
            onClick={() => setSelectedCategory("travel")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === "travel" ? "bg-blue-900 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Travel &amp; Lounge
          </button>
          <button
            onClick={() => setSelectedCategory("rewards")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === "rewards" ? "bg-blue-900 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Shopping &amp; Rewards
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search card or issuer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-700"
        />
      </div>

      {/* Cards Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <CompanyLogo name={card.name} logoUrl={card.logoUrl} size="lg" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-lg text-slate-900 hover:text-blue-700">
                        <Link href={`/credit-cards/${card.slug}`}>{card.name}</Link>
                      </h3>
                      {card.isPopular && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-blue-700 font-semibold">{card.issuer}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {card.rating} / 5.0
                </div>
              </div>

              {/* Reward Rate Banner */}
              <div className="p-2.5 rounded bg-blue-50/70 border border-blue-100 text-xs text-blue-900 font-bold">
                {card.rewardRate}
              </div>

              {/* Fee & Income Table */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Joining Fee:</span>
                  <strong className="text-slate-900 font-bold">
                    {card.joiningFee === 0 ? "₹0 (Lifetime Free)" : `₹${card.joiningFee}`}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Annual Fee:</span>
                  <strong className="text-slate-900 font-bold">
                    {card.annualFee === 0 ? "₹0 (Free)" : `₹${card.annualFee}`}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Min Income:</span>
                  <strong className="text-slate-900 font-bold">
                    ₹{(card.minIncomePerMonth / 1000).toFixed(0)}k / month
                  </strong>
                </div>
              </div>

              {/* Key Privileges */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-800 block">Key Privileges &amp; Benefits:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {card.keyPrivileges.slice(0, 3).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Link
                href={`/credit-cards/${card.slug}`}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                Detailed Review <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={card.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                Apply Online <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
