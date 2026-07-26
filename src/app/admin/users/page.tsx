"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  TrendingUp, 
  ArrowLeft, 
  ShieldCheck, 
  Globe, 
  BarChart3, 
  Eye, 
  Clock, 
  Download,
  CheckCircle2
} from "lucide-react";

export default function AdminUsersPage() {
  const [toastMessage, setToastMessage] = useState("");

  const userActivityLogs = [
    { id: "1", user: "Vikram Mehta", action: "Queried Allotment Status for Hyundai IPO", time: "2 mins ago", ip: "49.36.182.11", location: "Mumbai, MH" },
    { id: "2", user: "Ananya Roy", action: "Compared SBI Cashback vs HDFC Millennia Card", time: "5 mins ago", ip: "103.21.124.9", location: "Bengaluru, KA" },
    { id: "3", user: "Karan Patel", action: "Calculated Net Cashback for ₹45,000/mo spend", time: "12 mins ago", ip: "157.33.201.4", location: "Ahmedabad, GJ" },
    { id: "4", user: "Pooja Sharma", action: "Checked Anchor Lock-In Expiry Schedule", time: "18 mins ago", ip: "182.71.240.2", location: "New Delhi, DL" },
    { id: "5", user: "Rohan Verma", action: "Submitted User Review for Swiggy IPO", time: "25 mins ago", ip: "115.242.10.8", location: "Hyderabad, TS" }
  ];

  const topPages = [
    { path: "/credit-cards/sbi-cashback-credit-card", views: "84,500", bounceRate: "24.2%" },
    { path: "/allotment", views: "62,100", bounceRate: "18.5%" },
    { path: "/calendar", views: "41,300", bounceRate: "21.0%" },
    { path: "/anchor-lockins", views: "28,900", bounceRate: "29.4%" },
    { path: "/articles/sbi-cashback-vs-hdfc-millennia-vs-amazon-pay-icici-comparison-2026", views: "24,800", bounceRate: "19.8%" }
  ];

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <Link href="/admin" className="text-xs text-blue-700 font-bold hover:underline inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Analytics &amp; Traffic Desk</h1>
          <p className="text-xs text-slate-500">Real-time visitor logs, page views breakdown, user activity stream, and regional telemetry.</p>
        </div>

        <button
          onClick={() => {
            setToastMessage("User telemetry & traffic CSV report exported!");
            setTimeout(() => setToastMessage(""), 3500);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-all shadow-md"
        >
          <Download className="w-4 h-4" /> Export Traffic CSV
        </button>
      </div>

      {/* 4 Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold">Active Live Concurrents</span>
            <Globe className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-slate-900">1,420 Users</strong>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">Right Now</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold">Monthly Pageviews</span>
            <Eye className="w-4 h-4 text-blue-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-slate-900">2,45,800</strong>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">↑ 18.4% YoY</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold">Avg Session Duration</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-slate-900">4m 18s</strong>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">High Intent</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold">Platform Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-slate-900">8.42%</strong>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">Card &amp; IPO Apply</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Most Popular Pages */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-700" />
              Most Visited Public Pages
            </h2>
            <span className="text-[10px] font-bold text-slate-500">Last 30 Days</span>
          </div>

          <div className="space-y-2">
            {topPages.map((page, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div className="overflow-hidden pr-2">
                  <strong className="text-slate-900 font-bold block truncate">{page.path}</strong>
                  <span className="text-[10px] text-slate-500">Bounce Rate: {page.bounceRate}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-blue-700 text-sm block">{page.views}</span>
                  <span className="text-[10px] text-slate-400">Views</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time User Activity Stream */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Real-time User Activity Telemetry Stream
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live
            </span>
          </div>

          <div className="space-y-2">
            {userActivityLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <strong className="text-slate-900 font-bold">{log.user}</strong>
                  <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{log.action}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>Location: {log.location}</span>
                  <span className="font-mono">IP: {log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
