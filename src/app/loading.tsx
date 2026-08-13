import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-slate-900 text-white font-sans selection:bg-blue-600 selection:text-white">
      {/* Decorative background glow circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[4s]" />

      <div className="flex flex-col items-center space-y-6 relative z-10">
        {/* Animated Brand Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Ripple wave background animation */}
          <div className="absolute w-24 h-24 rounded-2xl bg-blue-500/10 animate-ping duration-[2s] pointer-events-none" />
          <div className="absolute w-28 h-28 rounded-2xl bg-emerald-500/5 animate-ping duration-[3.5s] pointer-events-none" />
          
          {/* Logo Frame */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-955 border border-slate-800 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all duration-300">
            <img src="/logo.svg" alt="IPO Preipo Logo" className="w-16 h-16 object-contain" />
          </div>
        </div>

        {/* Loading Information & Spinning Indicator */}
        <div className="text-center space-y-3">
          <h2 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">
            IPO PREIPO
          </h2>
          
          <div className="flex items-center justify-center gap-1.5 py-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce delay-100" />
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce delay-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce delay-300" />
          </div>
          
          <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">
            Fetching Live Grey Market Premiums...
          </p>
        </div>
      </div>
    </div>
  );
}
