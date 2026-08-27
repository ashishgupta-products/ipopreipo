"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  User,
  KeyRound
} from "lucide-react";

export const AdminGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, demoLogin, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-900">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-500 tracking-wider">Verifying Administrator Privileges...</span>
      </div>
    );
  }

  const isAdmin = isAuthenticated && user && (user.role === "admin" || user.email === "admin@ipopreipo.com");

  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 text-slate-900 font-sans">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-150">
          <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/80">
              Access Restricted
            </span>
            <h2 className="text-xl font-black tracking-tight text-slate-900 pt-1">
              Administrator Console
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              This area is restricted to authorized platform administrators and market editors of <strong>ipo preipo.com</strong>.
            </p>
          </div>

          {user ? (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Session:</span>
              <p className="font-bold text-slate-900 truncate">{user.name} ({user.email})</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Role: {user.role} (Standard Investor)
              </span>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              You are currently not signed in.
            </div>
          )}

          <div className="space-y-2.5">
            <button
              onClick={() => demoLogin("admin")}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/10 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login as Admin (Demo Privileges)</span>
            </button>

            <button
              onClick={() => openAuthModal("login")}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold rounded-xl text-xs border border-slate-200 shadow-xs transition-colors"
            >
              Sign In with Custom Admin Account
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
