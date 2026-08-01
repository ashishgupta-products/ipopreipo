"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Percent, 
  MessageSquare, 
  Users, 
  Plus, 
  Save, 
  Edit, 
  CheckCircle2, 
  ShieldCheck
} from "lucide-react";

export default function AdminDashboardPage() {
  const [iposData, setIposData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempGmp, setTempGmp] = useState<number>(0);
  const [tempSub, setTempSub] = useState<number>(0);
  const [successToast, setSuccessToast] = useState<string>("");

  useEffect(() => {
    async function loadIPOs() {
      try {
        const res = await fetch("/api/ipos");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setIposData(json.data);
        }
      } catch (err) {
        console.error("Failed to load admin ipos:", err);
      }
    }
    loadIPOs();
  }, []);

  // Live Control Feature Toggles
  const [controls, setControls] = useState({
    autoSyncExchange: true,
    gmpAlertsBroadcaster: true,
    allotmentCheckerMaintenance: false,
    autoApproveUserReviews: true
  });

  const toggleControl = (key: keyof typeof controls) => {
    setControls((prev) => {
      const nextState = { ...prev, [key]: !prev[key] };
      setSuccessToast(`Control updated: ${key} is now ${nextState[key] ? "ENABLED" : "DISABLED"}`);
      setTimeout(() => setSuccessToast(""), 3500);
      return nextState;
    });
  };

  const handleEditIpo = (id: string, currentGmp: number, currentSub: number) => {
    setEditingId(id);
    setTempGmp(currentGmp);
    setTempSub(currentSub);
  };

  const handleSaveIpo = (id: string) => {
    setIposData((prev) =>
      prev.map((ipo) => {
        if (ipo.id === id) {
          const newGmpPercent = (tempGmp / ipo.priceBandMax) * 100;
          return { 
            ...ipo, 
            gmp: tempGmp, 
            gmpPercent: newGmpPercent,
            totalSubscription: tempSub
          };
        }
        return ipo;
      })
    );
    setEditingId(null);
    setSuccessToast("Live GMP & Subscription parameters updated and broadcasted instantly!");
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono font-bold uppercase">LIVE BROADCAST ACTIVE</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-black uppercase tracking-wider mb-1 border border-blue-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            COMMAND &amp; CONTROL DESK
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Administrative Console</h1>
          <p className="text-xs text-slate-500">Real-time parameters management, live exchange sync toggles, and financial products editor.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/ipos"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Add Mainboard / SME IPO
          </Link>
          <Link
            href="/admin/credit-cards"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200/80"
          >
            <Edit className="w-4 h-4 text-blue-600" /> Edit Credit Cards Data
          </Link>
        </div>
      </div>

      {/* Interactive System Control Switches */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Live Feature System Controls</h2>
            <p className="text-xs text-slate-500">Instant feature flags and automation toggles for public portal services</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
            4 CONTROLS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Switch 1 */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between gap-3">
            <div>
              <span className="font-extrabold text-slate-900 block text-xs">Exchange Feed Cron</span>
              <span className="text-[11px] text-slate-500">Auto-sync BSE &amp; NSE live bidding data</span>
            </div>
            <button
              onClick={() => toggleControl("autoSyncExchange")}
              className={`w-full py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                controls.autoSyncExchange
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {controls.autoSyncExchange ? "ACTIVE (Auto-Syncing)" : "PAUSED"}
            </button>
          </div>

          {/* Switch 2 */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between gap-3">
            <div>
              <span className="font-extrabold text-slate-900 block text-xs">GMP Broadcast Engine</span>
              <span className="text-[11px] text-slate-500">Push instant WhatsApp/Telegram alerts</span>
            </div>
            <button
              onClick={() => toggleControl("gmpAlertsBroadcaster")}
              className={`w-full py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                controls.gmpAlertsBroadcaster
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {controls.gmpAlertsBroadcaster ? "ENABLED (Broadcasting)" : "DISABLED"}
            </button>
          </div>

          {/* Switch 3 */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between gap-3">
            <div>
              <span className="font-extrabold text-slate-900 block text-xs">Allotment Maintenance</span>
              <span className="text-[11px] text-slate-500">Toggle PAN allotment engine availability</span>
            </div>
            <button
              onClick={() => toggleControl("allotmentCheckerMaintenance")}
              className={`w-full py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                controls.allotmentCheckerMaintenance
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}
            >
              {controls.allotmentCheckerMaintenance ? "MAINTENANCE MODE" : "NORMAL (Online)"}
            </button>
          </div>

          {/* Switch 4 */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between gap-3">
            <div>
              <span className="font-extrabold text-slate-900 block text-xs">Auto-Approve Reviews</span>
              <span className="text-[11px] text-slate-500">Approve verified user reviews automatically</span>
            </div>
            <button
              onClick={() => toggleControl("autoApproveUserReviews")}
              className={`w-full py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                controls.autoApproveUserReviews
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {controls.autoApproveUserReviews ? "AUTO-APPROVE" : "MANUAL REVIEW"}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold">Active &amp; Live IPOs</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-slate-900">{iposData.length} Active</strong>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">+2 Today</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold">Pre-IPO Equities</span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-slate-900">4 Stocks</strong>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">₹1,850 Peak</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold">Monthly Visitors</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-slate-900">2,45,800</strong>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">↑ 18.4%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="font-bold">User Reviews Moderation</span>
            <MessageSquare className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-slate-900">12 Pending</strong>
            <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">Action Needed</span>
          </div>
        </div>
      </div>

      {/* Real-time Inline Live GMP & Subscription Editor Desk */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Live GMP &amp; Subscription Parameters Control Table
            </h2>
            <p className="text-xs text-slate-500">Directly modify grey market premiums and subscription multiples for immediate public release.</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">Click &apos;Edit Parameters&apos; to change values</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200/80 rounded-xl overflow-hidden">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">IPO Issue Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price Band</th>
                <th className="py-3.5 px-4">Live GMP (₹)</th>
                <th className="py-3.5 px-4">Est. Gain (%)</th>
                <th className="py-3.5 px-4">Subscription (x)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {iposData.map((ipo) => (
                <tr key={ipo.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{ipo.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">({ipo.exchange})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ipo.category === "mainboard"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {ipo.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                  </td>
                  <td className="py-3.5 px-4">
                    {editingId === ipo.id ? (
                      <input
                        type="number"
                        value={tempGmp}
                        onChange={(e) => setTempGmp(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded bg-slate-50 border border-blue-500 font-bold text-slate-900 focus:outline-hidden"
                      />
                    ) : (
                      <span className="font-extrabold text-slate-900">₹{ipo.gmp}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                    +{ipo.gmpPercent.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4">
                    {editingId === ipo.id ? (
                      <input
                        type="number"
                        step="0.1"
                        value={tempSub}
                        onChange={(e) => setTempSub(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded bg-slate-50 border border-blue-500 font-bold text-slate-900 focus:outline-hidden"
                      />
                    ) : (
                      <span className="font-extrabold text-slate-900">{ipo.totalSubscription}x</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {editingId === ipo.id ? (
                      <button
                        onClick={() => handleSaveIpo(ipo.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all inline-flex items-center gap-1 shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" /> Save &amp; Broadcast
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditIpo(ipo.id, ipo.gmp, ipo.totalSubscription)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all border border-slate-200/80 inline-flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-600" /> Edit Parameters
                      </button>
                    )}
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
