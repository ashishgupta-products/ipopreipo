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
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-mono text-slate-400 tracking-wider">VERIFYING ADMIN PRIVILEGES...</span>
      </div>
    );
  }

  const isAdmin = isAuthenticated && user && (user.role === "admin" || user.email === "admin@ipopreipo.com");

  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
              Access Restricted
            </span>
            <h2 className="text-xl font-black tracking-tight text-white">
              Administrator Console
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This area is restricted to authorized platform administrators and market editors.
            </p>
          </div>

          {user ? (
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-left text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Session:</span>
              <p className="font-bold text-white truncate">{user.name} ({user.email})</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Role: {user.role} (Standard Investor)
              </span>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-400">
              You are currently not logged in.
            </div>
          )}

          <div className="space-y-2.5">
            <button
              onClick={() => demoLogin("admin")}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login as Admin (Demo Privileges)</span>
            </button>

            <button
              onClick={() => openAuthModal("login")}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
            >
              Sign In with Custom Admin Account
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
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
