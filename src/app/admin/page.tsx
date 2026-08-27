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
  Zap
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
      <div className="py-16 text-center space-y-3">
        <div className="inline-block w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-400">LOADING PLATFORM INTELLIGENCE...</p>
      </div>
    );
  }

  const liveIpos = ipos.filter((i) => i.status === "live" || i.gmp > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Platform Executive Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time status of IPO listings, live market GMPs, investor user growth, and research articles.</p>
        </div>

        <button
          onClick={loadData}
          className="self-start sm:self-auto px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-mono border border-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Total IPOs</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats?.totalIpos || ipos.length}</span>
            <span className="text-xs text-slate-400 font-mono">
              ({stats?.mainboardCount || 0} Mainboard / {stats?.smeCount || 0} SME)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Active GMP Rates</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{stats?.positiveGmpCount || liveIpos.length}</span>
            <span className="text-xs text-emerald-500/80 font-mono">with active premiums</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Registered Users</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats?.totalUsers || 3}</span>
            <span className="text-xs text-slate-400 font-mono">Retail &amp; HNI</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Articles Published</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats?.totalArticles || 5}</span>
            <span className="text-xs text-amber-400/80 font-mono">Live SEO Posts</span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Quick GMP Adjuster & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick GMP Adjuster (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Fast GMP Rate Modifier</h3>
                <p className="text-[11px] text-slate-400">Instantly update Grey Market Premium for any IPO.</p>
              </div>
            </div>
            <Link
              href="/admin/ipos"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>Manage All IPOs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <form onSubmit={handleUpdateQuickGmp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Select IPO</label>
                <select
                  value={quickGmpSlug}
                  onChange={(e) => {
                    setQuickGmpSlug(e.target.value);
                    const found = ipos.find((i) => i.slug === e.target.value);
                    if (found) setQuickGmpVal(found.gmp || 0);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {ipos.map((ipo) => (
                    <option key={ipo.id} value={ipo.slug}>
                      {ipo.name} (Current: ₹{ipo.gmp || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">New GMP (₹ per share)</label>
                <input
                  type="number"
                  value={quickGmpVal}
                  onChange={(e) => setQuickGmpVal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {gmpStatusMsg && (
              <p className="text-xs font-mono text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                {gmpStatusMsg}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {[0, 25, 50, 100, 150, 200].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setQuickGmpVal(quick)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 rounded-md border border-slate-700"
                  >
                    ₹{quick}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-98"
              >
                Apply GMP Change
              </button>
            </div>
          </form>
        </div>

        {/* Quick Operations Shortcuts (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Administrator Shortcuts</h3>
            <p className="text-[11px] text-slate-400">Fast paths to core CMS & management modules.</p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/admin/ipos"
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between text-xs text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <strong className="block font-bold text-white">IPO Listing Database</strong>
                  <span className="text-[10px] text-slate-400">Add, edit, or archive IPOs</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/admin/articles/new"
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between text-xs text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <PlusCircle className="w-4 h-4" />
                </span>
                <div>
                  <strong className="block font-bold text-white">Create Research Report</strong>
                  <span className="text-[10px] text-slate-400">Publish IPO review or news</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/admin/users"
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between text-xs text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Users className="w-4 h-4" />
                </span>
                <div>
                  <strong className="block font-bold text-white">Investor Directory</strong>
                  <span className="text-[10px] text-slate-400">Manage users and roles</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Live IPOs Table Snippet */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white">Live Market High-GMP Movers</h3>
          </div>
          <Link href="/admin/ipos" className="text-xs text-blue-400 hover:underline">
            View All ({ipos.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                <th className="py-2.5 px-3">IPO Name</th>
                <th className="py-2.5 px-3">Segment</th>
                <th className="py-2.5 px-3 text-right">Price Band</th>
                <th className="py-2.5 px-3 text-right">GMP (₹)</th>
                <th className="py-2.5 px-3 text-right">Gain %</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ipos.slice(0, 6).map((ipo) => (
                <tr key={ipo.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">
                    <Link href={`/ipo/${ipo.slug}`} target="_blank" className="hover:text-blue-400">
                      {ipo.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {ipo.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    ₹{ipo.priceBandMax || ipo.issuePrice || 0}
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-emerald-400">
                    +₹{ipo.gmp || 0}
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-emerald-400">
                    +{(ipo.gmpPercent || 0).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                      {ipo.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/admin/ipos`}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition-colors"
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
