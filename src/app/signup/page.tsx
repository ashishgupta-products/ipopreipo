"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { InvestorType } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const { user, isAuthenticated, signup } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [investorType, setInvestorType] = useState<InvestorType>("Retail");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/profile");
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    setIsSubmitting(true);
    const res = await signup({ name, email, password, investorType });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || "Failed to create account");
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-10 bg-slate-50">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Features */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-300">
                <TrendingUp className="w-5 h-5" />
              </span>
              <span className="font-black text-lg tracking-tight">IPOPreIPO.com</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight leading-snug">
              Unlock Smart IPO Investing Intelligence
            </h1>
            <p className="text-xs text-blue-200/80 mt-2 leading-relaxed">
              Create your free investor profile in 30 seconds and never miss a lucrative IPO or Pre-IPO listing opportunity again.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { title: "Real-time Live GMP", desc: "Track market grey premiums with accurate time-stamps." },
                { title: "Smart Watchlists", desc: "Bookmark IPOs across Mainboard & SME segments." },
                { title: "Allotment Portfolio", desc: "Record applied lots, PAN, and calculate estimated gains." },
                { title: "Anchor Expiry Alerts", desc: "Monitor institutional lock-in periods before market supply hits." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold">{item.title}</strong>
                    <span className="text-blue-200/70 text-[11px]">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-[11px] text-blue-200/70">
              100% Free. No broker sync or credit card needed.
            </p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Free Account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-700 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Investor Category</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "Retail", label: "Retail", desc: "Up to ₹2,00,000" },
                  { id: "sHNI", label: "sHNI", desc: "₹2 Lakh - ₹10 Lakh" },
                  { id: "bHNI", label: "bHNI", desc: "Above ₹10 Lakh" },
                  { id: "Employee", label: "General", desc: "Market Enthusiast" }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setInvestorType(tier.id as InvestorType)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      investorType === tier.id
                        ? "border-blue-600 bg-blue-50/80 shadow-xs"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-900">{tier.label}</span>
                    <span className="text-[10px] text-slate-500">{tier.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {isSubmitting ? <span>Creating Account...</span> : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
