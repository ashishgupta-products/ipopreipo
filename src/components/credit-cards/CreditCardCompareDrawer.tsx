"use client";

import React from "react";
import { X, ExternalLink, Star, Check, AlertCircle } from "lucide-react";
import { CreditCardData } from "@/types/finance";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import Link from "next/link";

interface Props {
  selectedCards: CreditCardData[];
  onRemoveCard: (cardId: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function CreditCardCompareDrawer({
  selectedCards,
  onRemoveCard,
  onClearAll,
  onClose,
}: Props) {
  if (selectedCards.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-slate-900 text-white border-t border-slate-700 shadow-2xl z-50 p-4 sm:p-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              SIDE-BY-SIDE COMPARISON
            </span>
            <span className="text-xs text-slate-300 font-medium">
              ({selectedCards.length} / 3 cards selected)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-white underline font-semibold transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Cards Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto max-h-[60vh] scrollbar-thin">
          {selectedCards.map((card) => (
            <div
              key={card.id}
              className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-3 relative flex flex-col justify-between text-xs"
            >
              <button
                onClick={() => onRemoveCard(card.id)}
                className="absolute top-3 right-3 p-1 rounded-full bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center gap-3 pr-6">
                  <CompanyLogo name={card.name} logoUrl={card.logoUrl} size="md" variant="credit_card" />
                  <div>
                    <h4 className="font-extrabold text-sm text-white hover:text-blue-300">
                      <Link href={`/credit-cards/${card.slug}`}>{card.name}</Link>
                    </h4>
                    <span className="text-xs text-blue-400 font-semibold">{card.issuer}</span>
                  </div>
                </div>

                {/* Rating & Reward */}
                <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-700/60">
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {card.rating} / 5.0
                  </span>
                  <span className="text-slate-300 font-bold">
                    {card.joiningFee === 0 ? "Lifetime Free" : `₹${card.annualFee}/yr`}
                  </span>
                </div>

                {/* Key Spec Rows */}
                <div className="space-y-2 divide-y divide-slate-700/60 text-slate-300">
                  <div className="pt-1 flex justify-between">
                    <span className="text-slate-400">Joining Fee:</span>
                    <strong className="text-white font-bold">
                      {card.joiningFee === 0 ? "₹0" : `₹${card.joiningFee}`}
                    </strong>
                  </div>
                  <div className="pt-1 flex justify-between">
                    <span className="text-slate-400">Fee Waiver:</span>
                    <strong className="text-white font-bold text-right truncate max-w-[150px]">
                      {card.annualFeeWaiverCondition}
                    </strong>
                  </div>
                  <div className="pt-1 flex justify-between">
                    <span className="text-slate-400">Min Monthly Income:</span>
                    <strong className="text-white font-bold">₹{(card.minIncomePerMonth / 1000).toFixed(0)}k</strong>
                  </div>
                  <div className="pt-1 space-y-1">
                    <span className="text-slate-400 block font-semibold">Reward Rate Highlights:</span>
                    <p className="text-emerald-400 font-bold leading-tight">{card.rewardRate}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-700/60">
                <Link
                  href={`/credit-cards/${card.slug}`}
                  className="flex-1 py-1.5 px-2 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold text-center text-xs transition-colors"
                >
                  Full Review
                </Link>
                <a
                  href={card.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1 text-xs transition-colors"
                >
                  Apply <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
