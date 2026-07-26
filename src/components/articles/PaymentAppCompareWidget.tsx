"use client";

import React, { useState } from "react";
import { Award, CheckCircle2, ArrowRight, Sparkles, Smartphone, ShieldCheck } from "lucide-react";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import Link from "next/link";

export default function PaymentAppCompareWidget() {
  const [selectedGoal, setSelectedGoal] = useState<"fast_upi" | "cashback_direct" | "card_bills" | "recharge_savings">("fast_upi");

  const getRecommendedAppSlug = () => {
    switch (selectedGoal) {
      case "fast_upi":
        return "phonepe";
      case "cashback_direct":
        return "google-pay";
      case "card_bills":
        return "cred";
      case "recharge_savings":
        return "google-pay";
      default:
        return "phonepe";
    }
  };

  const recommendedApp = MOCK_PAYMENT_APPS.find((a) => a.slug === getRecommendedAppSlug());

  return (
    <div className="my-8 bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Widget Header */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">
            UPI DECISION ASSISTANT
          </span>
          <span className="text-xs text-slate-400 font-medium">Payment Apps</span>
        </div>
        <h3 className="text-xl font-black tracking-tight text-white">
          Find Your Perfect UPI Payment App
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Select your primary transaction goal below to see the best-suited digital wallet &amp; UPI app for your usage.
        </p>
      </div>

      {/* Interactive Goal Switcher Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-bold">
        <button
          onClick={() => setSelectedGoal("fast_upi")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedGoal === "fast_upi"
              ? "bg-blue-600 text-white border-blue-500 shadow-md font-black"
              : "bg-slate-800/80 text-slate-350 border-slate-700 hover:bg-slate-800"
          }`}
        >
          ⚡ High Success Rate
          <span className="block text-[10px] font-normal opacity-85 mt-0.5">Reliable offline merchant payments</span>
        </button>

        <button
          onClick={() => setSelectedGoal("cashback_direct")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedGoal === "cashback_direct"
              ? "bg-blue-600 text-white border-blue-500 shadow-md font-black"
              : "bg-slate-800/80 text-slate-355 border-slate-700 hover:bg-slate-800"
          }`}
        >
          💰 Direct Bank Cashback
          <span className="block text-[10px] font-normal opacity-85 mt-0.5">Real cash deposited in linked accounts</span>
        </button>

        <button
          onClick={() => setSelectedGoal("card_bills")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedGoal === "card_bills"
              ? "bg-blue-600 text-white border-blue-500 shadow-md font-black"
              : "bg-slate-800/80 text-slate-355 border-slate-700 hover:bg-slate-800"
          }`}
        >
          💳 Credit Card Bill Payments
          <span className="block text-[10px] font-normal opacity-85 mt-0.5">Hidden fee tracker + luxury rewards</span>
        </button>

        <button
          onClick={() => setSelectedGoal("recharge_savings")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedGoal === "recharge_savings"
              ? "bg-blue-600 text-white border-blue-500 shadow-md font-black"
              : "bg-slate-800/80 text-slate-355 border-slate-700 hover:bg-slate-800"
          }`}
        >
          🚫 No Mobile Recharge Fees
          <span className="block text-[10px] font-normal opacity-85 mt-0.5">Save ₹1 to ₹3 platform fee per recharge</span>
        </button>
      </div>

      {/* Recommendation Results Card */}
      {recommendedApp && (
        <div className="bg-slate-850 border border-slate-800/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10 translate-x-10 -translate-y-10" />

          {/* Left: Product Info */}
          <div className="md:col-span-8 flex items-start gap-4">
            <CompanyLogo name={recommendedApp.name} logoUrl={recommendedApp.logoUrl} size="lg" className="rounded-lg shadow-md shrink-0 bg-slate-900 border border-slate-750" />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-extrabold text-[9px] border border-blue-500/25">
                  RECOMMENDED PRODUCT
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">• {recommendedApp.developer}</span>
              </div>
              <h4 className="text-lg font-black text-white leading-tight">
                {recommendedApp.name}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xl font-medium">
                {recommendedApp.overview}
              </p>

              {/* 4-Item Mini Spec Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-bold text-slate-350">
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                  <span className="text-slate-500 block mb-0.5 uppercase tracking-wider text-[8px]">Joining Bonus</span>
                  <span className="text-white font-extrabold">{recommendedApp.joiningBonus || "₹0"}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                  <span className="text-slate-500 block mb-0.5 uppercase tracking-wider text-[8px]">Referral</span>
                  <span className="text-white font-extrabold">{recommendedApp.referralBonus || "₹0"}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                  <span className="text-slate-500 block mb-0.5 uppercase tracking-wider text-[8px]">Mobile Recharge</span>
                  <span className="text-emerald-400 font-extrabold">{recommendedApp.mobileRechargeFee || "₹0"}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                  <span className="text-slate-500 block mb-0.5 uppercase tracking-wider text-[8px]">Success Rate</span>
                  <span className="text-emerald-400 font-extrabold">{recommendedApp.upiSuccessRate || "99.0%"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: CTA actions */}
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2 w-full justify-end">
            <Link
              href={`/payment-apps/${recommendedApp.slug}`}
              className="px-4 py-2 rounded-full border border-slate-700 hover:border-slate-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors w-full"
            >
              Read Full Review
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={recommendedApp.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors w-full"
            >
              Get App
              <Smartphone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
