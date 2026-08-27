"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Briefcase,
  ArrowRight,
  Zap
} from "lucide-react";
import { InvestorType } from "@/types/auth";

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    authModalView, 
    closeAuthModal, 
    openAuthModal, 
    login, 
    signup, 
    demoLogin 
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [investorType, setInvestorType] = useState<InvestorType>("Retail");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Reset form when modal opens or view changes
  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
    setShowPassword(false);
  }, [authModalOpen, authModalView]);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || "Invalid email or password");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
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
    }
  };

  const handleDemoClick = async (type: "retail" | "hni" | "admin") => {
    setErrorMessage("");
    setIsSubmitting(true);
    const res = await demoLogin(type);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || "Demo login failed");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    setErrorMessage("");
    setSuccessMessage(`Password reset link sent to ${email} (simulated).`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 pb-5">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-blue-500/30 rounded-lg border border-blue-400/30">
              <TrendingUp className="w-4 h-4 text-blue-200" />
            </span>
            <span className="text-xs font-bold tracking-wider text-blue-200 lowercase">ipo preipo.com investor hub</span>
          </div>

          <h2 className="text-xl font-black tracking-tight">
            {authModalView === "login" && "Welcome Back"}
            {authModalView === "signup" && "Create Free Account"}
            {authModalView === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-blue-100/90 mt-1">
            {authModalView === "login" && "Sign in to track your live GMP watchlist & IPO bids."}
            {authModalView === "signup" && "Join thousands of smart IPO & Pre-IPO equity investors."}
            {authModalView === "forgot" && "Enter your email to receive recovery instructions."}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authModalView === "login"
                ? "border-blue-700 text-blue-800 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authModalView === "signup"
                ? "border-blue-700 text-blue-800 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Register
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {authModalView === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => openAuthModal("forgot")}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Logins for Instant Evaluation */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 justify-center text-[11px] font-semibold text-slate-500 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant 1-Click Demo Accounts</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoClick("retail")}
                    className="p-2 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center"
                  >
                    <span className="block text-[11px] font-bold text-slate-900">Retail</span>
                    <span className="text-[10px] text-slate-500">Rahul S.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoClick("hni")}
                    className="p-2 border border-slate-200 rounded-lg hover:border-purple-500 hover:bg-purple-50/50 transition-all text-center"
                  >
                    <span className="block text-[11px] font-bold text-purple-900">sHNI</span>
                    <span className="text-[10px] text-slate-500">Priya P.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoClick("admin")}
                    className="p-2 border border-slate-200 rounded-lg hover:border-slate-500 hover:bg-slate-50/80 transition-all text-center"
                  >
                    <span className="block text-[11px] font-bold text-slate-900">Admin</span>
                    <span className="text-[10px] text-slate-500">Full Access</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {authModalView === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Investor Category</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "Retail", label: "Retail (<= ₹2 Lakh)" },
                    { id: "sHNI", label: "sHNI (₹2L - ₹10L)" },
                    { id: "bHNI", label: "bHNI (> ₹10 Lakh)" },
                    { id: "Employee", label: "Employee / General" }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setInvestorType(tier.id as InvestorType)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left text-xs font-medium transition-all ${
                        investorType === tier.id
                          ? "border-blue-600 bg-blue-50 text-blue-900 font-bold"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your data is encrypted. No broker credentials required.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {isSubmitting ? <span>Creating Account...</span> : <span>Create Free Account</span>}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {authModalView === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                Send Reset Link
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 text-center block"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
