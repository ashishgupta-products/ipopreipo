"use client";

import React, { useState } from "react";
import { 
  Percent, 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function PreIPOPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16 font-sans flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-12 w-full flex-1 flex flex-col justify-center">
        
        {/* Breadcrumb & Back */}
        <div className="flex justify-between items-center text-xs w-full">
          <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <span className="text-slate-800">Pre-IPO Desk</span>
          </div>
        </div>

        {/* Coming Soon Hero Container */}
        <div className="max-w-4xl mx-auto w-full bg-white border border-slate-200/85 rounded-3xl shadow-xl p-8 sm:p-12 relative overflow-hidden text-center space-y-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-20 translate-y-20" />

          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-250/70 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              Pre-IPO Trading Desk — Coming Soon
            </span>
          </div>

          {/* Header Title */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-[#1e293b] tracking-tight leading-tight">
              Invest in India's Next Giants <span className="text-amber-600">Before</span> They Go Public
            </h1>
            <p className="text-[#64748b] text-xs sm:text-sm leading-relaxed font-semibold">
              We are building a secure, institutional-grade Pre-IPO unlisted equities desk. Soon, you will be able to trade unlisted shares of top Indian companies ( Tata Capital, NSE, Reliance Retail, and more) with guaranteed CDSL/NSDL demat delivery.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Percent className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Real-time Pricing</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Transparent price matching based on actual unlisted transaction books and GMP trends.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-750 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Secure Demat Delivery</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Seamless CDSL/NSDL transfers directly to your demat accounts with escrow backing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">DRHP Analytics</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Advanced comparison models, peer multiples, and financial analysis of unlisted giants.
              </p>
            </div>
          </div>

          {/* Email Subscription Form */}
          <div className="max-w-md mx-auto pt-4 space-y-4">
            {success ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                Thank you! We'll notify you when the desk goes live.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 p-1.5 rounded-full border border-slate-250 bg-slate-50 focus-within:border-blue-900 focus-within:bg-white transition-all">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to get early access..."
                  className="flex-1 bg-transparent px-4 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  Notify Me
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
            <span className="text-[10px] text-slate-400 block font-semibold">
              * Join 12,000+ investors waiting for early allocation announcements.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
