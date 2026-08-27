"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Flame, 
  FileText, 
  Users, 
  PlusCircle, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight, 
  ShieldCheck,
  Award,
  Zap,
  CreditCard,
  Smartphone
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [ipos, setIpos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickGmpSlug, setQuickGmpSlug] = useState("");
  const [quickGmpVal, setQuickGmpVal] = useState<number>(0);
  const [gmpStatusMsg, setGmpStatusMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, iposRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/ipos"),
      ]);

      if (statsRes.ok) {
        const json = await statsRes.json();
        if (json.success) setStats(json.stats);
      }

      if (iposRes.ok) {
        const json = await iposRes.json();
        if (json.success && Array.isArray(json.data)) {
          setIpos(json.data);
          if (json.data.length > 0) {
            setQuickGmpSlug(json.data[0].slug);
            setQuickGmpVal(json.data[0].gmp || 0);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateQuickGmp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickGmpSlug) return;
    setGmpStatusMsg("Updating GMP...");

    const target = ipos.find((i) => i.slug === quickGmpSlug);

    try {
      const res = await fetch("/api/admin/ipos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: quickGmpSlug,
          updates: {
            gmp: Number(quickGmpVal),
            priceBandMax: target?.priceBandMax || 100,
          },
        }),
      });

      if (res.ok) {
        setGmpStatusMsg(`✅ Updated GMP for ${quickGmpSlug} to ₹${quickGmpVal}`);
        loadData();
        setTimeout(() => setGmpStatusMsg(""), 3000);
      } else {
        setGmpStatusMsg("❌ Failed to update GMP");
      }
    } catch (err) {
      setGmpStatusMsg("❌ Network error");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading executive intelligence...</p>
      </div>
    );
  }

  const liveIpos = ipos.filter((i) => i.status === "live" || (i.gmp || 0) > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Platform Executive Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status of IPO listings, live market GMPs, investor user growth, and research articles.
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Total IPOs</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalIpos || ipos.length}</span>
            <span className="text-xs text-slate-500 font-medium">
              ({stats?.mainboardCount || 0} Mainboard / {stats?.smeCount || 0} SME)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Active GMP Rates</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{stats?.positiveGmpCount || liveIpos.length}</span>
            <span className="text-xs text-slate-500 font-medium">with active premiums</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Registered Users</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalUsers || 3}</span>
            <span className="text-xs text-slate-500 font-medium">Retail &amp; HNI Investors</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase text-slate-500 font-bold tracking-wider">Articles Published</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalArticles || 5}</span>
            <span className="text-xs text-slate-500 font-medium">Live Research Posts</span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Quick GMP Adjuster & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick GMP Adjuster (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Fast GMP Rate Modifier</h3>
                <p className="text-xs text-slate-500">Instantly update Grey Market Premium for any live IPO.</p>
              </div>
            </div>
            <Link
              href="/admin/ipos"
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
            >
              <span>All IPOs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <form onSubmit={handleUpdateQuickGmp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Select IPO</label>
                <select
                  value={quickGmpSlug}
                  onChange={(e) => {
                    setQuickGmpSlug(e.target.value);
                    const found = ipos.find((i) => i.slug === e.target.value);
                    if (found) setQuickGmpVal(found.gmp || 0);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  {ipos.map((ipo) => (
                    <option key={ipo.id} value={ipo.slug}>
                      {ipo.name} (Current: ₹{ipo.gmp || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">New GMP (₹ per share)</label>
                <input
                  type="number"
                  value={quickGmpVal}
                  onChange={(e) => setQuickGmpVal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {gmpStatusMsg && (
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                {gmpStatusMsg}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 25, 50, 100, 150, 200].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setQuickGmpVal(quick)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[11px] font-mono font-bold text-slate-700 rounded-lg transition-colors"
                  >
                    ₹{quick}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs transition-all shadow-xs active:scale-98"
              >
                Apply GMP Change
              </button>
            </div>
          </form>
        </div>

        {/* Quick Operations Shortcuts (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Administrator Shortcuts</h3>
            <p className="text-xs text-slate-500">Fast paths to core CMS &amp; management modules.</p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/admin/ipos"
              className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <strong className="block font-bold text-slate-900">IPO Listing Database</strong>
                  <span className="text-[11px] text-slate-500">Add, edit, or modify IPOs &amp; GMPs</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </Link>

            <Link
              href="/admin/articles/new"
              className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <PlusCircle className="w-4 h-4" />
                </span>
                <div>
                  <strong className="block font-bold text-slate-900">Create Research Report</strong>
                  <span className="text-[11px] text-slate-500">Publish IPO review or market news</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </Link>

            <Link
              href="/admin/users"
              className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-200 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                </span>
                <div>
                  <strong className="block font-bold text-slate-900">Investor User Directory</strong>
                  <span className="text-[11px] text-slate-500">Manage users, portfolios, and roles</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </Link>

            <Link
              href="/admin/credit-cards"
              className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-200 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <CreditCard className="w-4 h-4" />
                </span>
                <div>
                  <strong className="block font-bold text-slate-900">Credit Card Offers &amp; Rewards</strong>
                  <span className="text-[11px] text-slate-500">Manage cards, fees, and reward rates</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </Link>

            <Link
              href="/admin/payment-apps"
              className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Smartphone className="w-4 h-4" />
                </span>
                <div>
                  <strong className="block font-bold text-slate-900">UPI &amp; Payment Apps</strong>
                  <span className="text-[11px] text-slate-500">Manage UPI Lite, RuPay &amp; Cashback</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Live IPOs Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">Live Market High-GMP Movers</h3>
          </div>
          <Link href="/admin/ipos" className="text-xs text-blue-600 hover:text-blue-700 font-bold">
            View All ({ipos.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-[11px] uppercase font-bold bg-slate-50/60">
                <th className="py-3 px-3">IPO Name</th>
                <th className="py-3 px-3">Segment</th>
                <th className="py-3 px-3 text-right">Price Band</th>
                <th className="py-3 px-3 text-right">GMP (₹)</th>
                <th className="py-3 px-3 text-right">Gain %</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ipos.slice(0, 6).map((ipo) => (
                <tr key={ipo.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <Link href={`/ipo/${ipo.slug}`} target="_blank" className="hover:text-blue-600">
                      {ipo.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {ipo.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">
                    ₹{ipo.priceBandMax || ipo.issuePrice || 0}
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-emerald-600">
                    +₹{ipo.gmp || 0}
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-emerald-600">
                    +{(ipo.gmpPercent || 0).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                      {ipo.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/admin/ipos`}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-[11px] font-bold transition-all shadow-xs"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
