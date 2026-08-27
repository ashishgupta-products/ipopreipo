"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Flame,
  Star
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";
  
  const { user, isAuthenticated, login, demoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || "Invalid email or password");
    } else {
      router.push(redirectUrl);
    }
  };

  const handleDemo = async (type: "retail" | "hni" | "admin") => {
    setErrorMessage("");
    setIsSubmitting(true);
    const res = await demoLogin(type);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || "Demo login failed");
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-10 bg-slate-50">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Market Value Prop */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-300">
                <TrendingUp className="w-5 h-5" />
              </span>
              <span className="font-black text-lg tracking-tight lowercase">ipo preipo.com</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight leading-snug">
              India's Premier IPO & Pre-IPO Intelligence Portal
            </h1>
            <p className="text-xs text-blue-200/80 mt-2 leading-relaxed">
              Real-time Grey Market Premiums (GMP), allotment status checks, anchor lock-in tracking, and unlisted shares analytics.
            </p>

            <div className="mt-6 space-y-3">
              {[
                { icon: Flame, text: "Live real-time GMP price updates" },
                { icon: Star, text: "Personalized IPO watchlist & alerts" },
                { icon: CheckCircle2, text: "Bids & Allotment portfolio tracker" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-[11px] text-blue-200/70">
              Bank-grade 256-bit encryption. Zero Demat credentials required.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-700 font-bold hover:underline">
                Create one for free
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <Link href="#" onClick={(e) => { e.preventDefault(); alert("Please use the demo accounts or contact support."); }} className="text-xs text-blue-700 font-medium hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {isSubmitting ? <span>Signing In...</span> : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Grid */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 justify-center text-xs font-bold text-slate-600 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Or Sign In with 1-Click Demo Profile</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo("retail")}
                className="p-2.5 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/60 transition-all text-center group"
              >
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-700">Retail</span>
                <span className="text-[11px] text-slate-500">Rahul S.</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo("hni")}
                className="p-2.5 border border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50/60 transition-all text-center group"
              >
                <span className="block text-xs font-bold text-purple-950 group-hover:text-purple-700">sHNI</span>
                <span className="text-[11px] text-slate-500">Priya P.</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo("admin")}
                className="p-2.5 border border-slate-200 rounded-xl hover:border-slate-500 hover:bg-slate-50 transition-all text-center group"
              >
                <span className="block text-xs font-bold text-slate-900">Admin</span>
                <span className="text-[11px] text-slate-500">Full Privileges</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
