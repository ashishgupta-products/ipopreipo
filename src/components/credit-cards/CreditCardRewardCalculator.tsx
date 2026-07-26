"use client";

import React, { useState } from "react";
import { Calculator, Award, ArrowRight, Zap, CheckCircle, ExternalLink, HelpCircle } from "lucide-react";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import Link from "next/link";

interface SpendProfile {
  onlineShopping: number; // monthly
  foodAndGrocery: number; // monthly
  utilityBills: number;   // monthly
  fuelSpends: number;     // monthly
  offlineShopping: number; // monthly
}

export default function CreditCardRewardCalculator() {
  const [spends, setSpends] = useState<SpendProfile>({
    onlineShopping: 15000,
    foodAndGrocery: 8000,
    utilityBills: 4000,
    fuelSpends: 3000,
    offlineShopping: 5000,
  });

  const totalMonthlySpend =
    spends.onlineShopping +
    spends.foodAndGrocery +
    spends.utilityBills +
    spends.fuelSpends +
    spends.offlineShopping;

  const totalAnnualSpend = totalMonthlySpend * 12;

  // Calculate annual net returns for each card
  const calculatedCards = MOCK_CREDIT_CARDS.map((card) => {
    let monthlyCashback = 0;

    if (card.slug === "sbi-cashback-credit-card") {
      // 5% on online (capped at ₹5,000/month), 1% on food/utility/offline
      const onlineCb = Math.min(spends.onlineShopping * 0.05, 5000);
      const otherCb = (spends.foodAndGrocery + spends.utilityBills + spends.offlineShopping) * 0.01;
      monthlyCashback = onlineCb + otherCb;
    } else if (card.slug === "hdfc-millennia") {
      // 5% on partner apps (cap ₹1000/mo), 1% on other spends
      const onlineCb = Math.min(spends.onlineShopping * 0.05, 1000);
      const otherCb = (spends.foodAndGrocery + spends.utilityBills + spends.offlineShopping) * 0.01;
      monthlyCashback = onlineCb + otherCb;
    } else if (card.slug === "amazon-pay-icici") {
      // 5% online Amazon, 2% utilities/bills, 1% offline
      const onlineCb = spends.onlineShopping * 0.05;
      const utilityCb = spends.utilityBills * 0.02;
      const offlineCb = (spends.foodAndGrocery + spends.offlineShopping) * 0.01;
      monthlyCashback = onlineCb + utilityCb + offlineCb;
    } else if (card.slug === "axis-airtel") {
      // 25% airtel (capped 300), 10% swiggy/zomato/bigbasket (capped 500), 10% utility (capped 300), 1% rest
      const utilityCb = Math.min(spends.utilityBills * 0.10, 300);
      const foodCb = Math.min(spends.foodAndGrocery * 0.10, 500);
      const otherCb = (spends.onlineShopping + spends.offlineShopping) * 0.01;
      monthlyCashback = utilityCb + foodCb + otherCb;
    } else {
      // Generic estimate: 1.5% average rewards
      monthlyCashback = (spends.onlineShopping + spends.foodAndGrocery + spends.utilityBills + spends.offlineShopping) * 0.015;
    }

    const annualGrossCashback = Math.round(monthlyCashback * 12);
    
    // Fee Waiver logic
    let effectiveAnnualFee = card.annualFee;
    if (card.slug === "sbi-cashback-credit-card" && totalAnnualSpend >= 200000) {
      effectiveAnnualFee = 0;
    } else if (card.slug === "hdfc-millennia" && totalAnnualSpend >= 100000) {
      effectiveAnnualFee = 0;
    } else if (card.annualFee === 0) {
      effectiveAnnualFee = 0;
    }

    const netAnnualSavings = annualGrossCashback - effectiveAnnualFee;

    return {
      ...card,
      annualGrossCashback,
      effectiveAnnualFee,
      netAnnualSavings,
      isFeeWaived: effectiveAnnualFee === 0 && card.annualFee > 0,
    };
  });

  // Sort cards by net annual savings descending
  calculatedCards.sort((a, b) => b.netAnnualSavings - a.netAnnualSavings);
  const bestCard = calculatedCards[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Calculator className="w-3.5 h-3.5" />
            REWARD &amp; CASHBACK ESTIMATOR
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Total Monthly Spend: <strong className="text-amber-400 text-sm">₹{totalMonthlySpend.toLocaleString("en-IN")}</strong> / mo
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Calculate Your Annual Net Savings Across Credit Cards
        </h2>
        <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
          Adjust your monthly spending profile below to see exact cashback earnings after fee waivers and caps for top Indian credit cards.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-5 space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
            Your Monthly Spending Breakdown
          </h3>

          {/* Slider 1: Online Shopping */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Online Shopping (Amazon, Flipkart, etc.)</span>
              <span className="font-extrabold text-blue-900">₹{spends.onlineShopping.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={spends.onlineShopping}
              onChange={(e) => setSpends({ ...spends, onlineShopping: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            />
          </div>

          {/* Slider 2: Food & Grocery */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Food &amp; Grocery (Swiggy, Zomato, Instamart)</span>
              <span className="font-extrabold text-blue-900">₹{spends.foodAndGrocery.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={spends.foodAndGrocery}
              onChange={(e) => setSpends({ ...spends, foodAndGrocery: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            />
          </div>

          {/* Slider 3: Utility Bills */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Electricity, Wifi, Mobile Recharges</span>
              <span className="font-extrabold text-blue-900">₹{spends.utilityBills.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="30000"
              step="500"
              value={spends.utilityBills}
              onChange={(e) => setSpends({ ...spends, utilityBills: Number(e.target.value)} )}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            />
          </div>

          {/* Slider 4: Fuel */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Fuel Spends (Petrol / Diesel)</span>
              <span className="font-extrabold text-blue-900">₹{spends.fuelSpends.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={spends.fuelSpends}
              onChange={(e) => setSpends({ ...spends, fuelSpends: Number(e.target.value)} )}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            />
          </div>

          {/* Slider 5: Offline Spends */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Offline Malls, Retail Stores &amp; Outlets</span>
              <span className="font-extrabold text-blue-900">₹{spends.offlineShopping.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={spends.offlineShopping}
              onChange={(e) => setSpends({ ...spends, offlineShopping: Number(e.target.value)} )}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            />
          </div>

          {/* Annual Spend Summary Box */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 flex justify-between items-center">
            <span>Projected Annual Total Spend:</span>
            <strong className="text-sm font-extrabold">₹{totalAnnualSpend.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Output Ranking Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Cards Ranked by Estimated Net Savings
            </h3>
            <span className="text-xs text-slate-500 font-medium">After Annual Fees</span>
          </div>

          {/* Best Match Banner */}
          {bestCard && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-200 text-emerald-900 uppercase tracking-wide">
                    Top Recommended Card for Your Profile
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base">{bestCard.name}</h4>
                  <p className="text-xs text-slate-600">
                    Expected Net Savings: <strong className="text-emerald-700 font-extrabold text-sm">₹{bestCard.netAnnualSavings.toLocaleString("en-IN")} / year</strong>
                  </p>
                </div>
              </div>

              <Link
                href={`/credit-cards/${bestCard.slug}`}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition-colors"
              >
                Apply / Review <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Comparison Cards List */}
          <div className="space-y-3">
            {calculatedCards.map((card, idx) => (
              <div
                key={card.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <CompanyLogo name={card.name} logoUrl={card.logoUrl} size="md" variant="credit_card" />
                  <div>
                    <h5 className="font-bold text-slate-900 hover:text-blue-700">
                      <Link href={`/credit-cards/${card.slug}`}>{card.name}</Link>
                    </h5>
                    <span className="text-slate-500 font-medium">{card.issuer}</span>
                    {card.isFeeWaived && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Fee Waived (Spend &gt; ₹{(totalAnnualSpend >= 200000 ? "2.0L" : "1.0L")})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className="text-slate-500 block">Gross Cashback:</span>
                    <span className="font-bold text-slate-800">₹{card.annualGrossCashback.toLocaleString("en-IN")}/yr</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Effective Fee:</span>
                    <span className="font-bold text-slate-800">₹{card.effectiveAnnualFee}</span>
                  </div>
                  <div className="text-right pl-2 border-l border-slate-200">
                    <span className="text-slate-500 block">Net Savings:</span>
                    <strong className="text-sm font-extrabold text-emerald-700">
                      ₹{card.netAnnualSavings.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
