"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Smartphone, 
  Plus, 
  Edit, 
  Save, 
  CheckCircle2, 
  Star, 
  Search, 
  ArrowLeft,
  Trash2
} from "lucide-react";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";
import { PaymentAppData } from "@/types/finance";

export default function AdminPaymentAppsPage() {
  const [apps, setApps] = useState<PaymentAppData[]>(MOCK_PAYMENT_APPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRating, setTempRating] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState("");

  const filteredApps = apps.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.developer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRupaySupport = (id: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ruPayUpiSupport: !a.ruPayUpiSupport } : a))
    );
    setToastMessage("RuPay Credit on UPI support status toggled!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const toggleUpiLite = (id: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, upiLiteSupport: !a.upiLiteSupport } : a))
    );
    setToastMessage("UPI Lite support status updated!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDeleteApp = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from Payment Apps catalog?`)) {
      setApps((prev) => prev.filter((a) => a.id !== id));
      setToastMessage(`Payment App "${name}" deleted.`);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleEdit = (app: PaymentAppData) => {
    setEditingId(app.id);
    setTempRating(app.playStoreRating);
  };

  const handleSave = (id: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, playStoreRating: tempRating } : a))
    );
    setEditingId(null);
    setToastMessage("Payment App rating updated and published live!");
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono font-bold uppercase">LIVE UPDATE BROADCASTED</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <Link href="/admin" className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Apps &amp; UPI Desk</h1>
          <p className="text-xs text-slate-500">Manage UPI payment apps, RuPay credit card linking, UPI Lite status, and cashback offers.</p>
        </div>

        <Link
          href="/admin/payment-apps/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Payment App
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payment app or developer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <span>Total Apps: <strong className="text-slate-900 font-extrabold">{apps.length}</strong></span>
          <span>•</span>
          <span>RuPay Enabled: <strong className="text-emerald-700 font-extrabold">{apps.filter((a) => a.ruPayUpiSupport).length}</strong></span>
        </div>
      </div>

      {/* Payment Apps Management Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200/80 rounded-xl overflow-hidden">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">Payment App</th>
                <th className="py-3.5 px-4">Developer</th>
                <th className="py-3.5 px-4">RuPay UPI Credit</th>
                <th className="py-3.5 px-4">UPI Lite Support</th>
                <th className="py-3.5 px-4">PlayStore Rating</th>
                <th className="py-3.5 px-4 text-right">Control Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{app.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{app.developer}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleRupaySupport(app.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                        app.ruPayUpiSupport
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {app.ruPayUpiSupport ? "ENABLED (RuPay Credit)" : "Disabled"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleUpiLite(app.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.upiLiteSupport ? "bg-blue-50 text-blue-800 border border-blue-200" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {app.upiLiteSupport ? "UPI Lite Active" : "No Lite"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">
                    {editingId === app.id ? (
                      <input
                        type="number"
                        step="0.1"
                        value={tempRating}
                        onChange={(e) => setTempRating(Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-slate-50 border border-blue-500 font-bold text-slate-900 focus:outline-hidden"
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{app.playStoreRating} / 5.0</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {editingId === app.id ? (
                        <button
                          onClick={() => handleSave(app.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all inline-flex items-center gap-1 shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(app)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-all border border-blue-200/80 inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-600" /> Edit Rating
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteApp(app.id, app.name)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 transition-all border border-slate-200"
                        title="Delete App"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
