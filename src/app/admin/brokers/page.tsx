"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Save, 
  CheckCircle2, 
  Star, 
  Search, 
  ArrowLeft,
  Trash2
} from "lucide-react";
import { MOCK_BROKERS } from "@/data/mockBrokers";
import { BrokerData } from "@/types/ipo";

export default function AdminBrokersPage() {
  const [brokers, setBrokers] = useState<BrokerData[]>(MOCK_BROKERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempDelivery, setTempDelivery] = useState<string>("");
  const [tempFnO, setTempFnO] = useState<string>("");
  const [toastMessage, setToastMessage] = useState("");

  const filteredBrokers = brokers.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (broker: BrokerData) => {
    setEditingId(broker.id);
    setTempDelivery(broker.equityDeliveryFee);
    setTempFnO(broker.fnOFee);
  };

  const handleSave = (id: string) => {
    setBrokers((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, equityDeliveryFee: tempDelivery, fnOFee: tempFnO }
          : b
      )
    );
    setEditingId(null);
    setToastMessage("Brokerage parameters updated and published live!");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDeleteBroker = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from Stock Brokers catalog?`)) {
      setBrokers((prev) => prev.filter((b) => b.id !== id));
      setToastMessage(`Stock Broker "${name}" deleted.`);
      setTimeout(() => setToastMessage(""), 3000);
    }
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock Brokers Control Desk</h1>
          <p className="text-xs text-slate-500">Manage stock broker rates, account opening waivers, F&amp;O brokerage fees, and active trader counts.</p>
        </div>

        <Link
          href="/admin/brokers/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Stock Broker
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search broker name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <span>Total Brokers: <strong className="text-slate-900 font-extrabold">{brokers.length}</strong></span>
          <span>•</span>
          <span>Discount Brokers: <strong className="text-blue-700 font-extrabold">{brokers.filter((b) => b.type.includes("Discount")).length}</strong></span>
        </div>
      </div>

      {/* Brokers Management Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200/80 rounded-xl overflow-hidden">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">Broker Name</th>
                <th className="py-3.5 px-4">Broker Type</th>
                <th className="py-3.5 px-4">Equity Delivery</th>
                <th className="py-3.5 px-4">F&amp;O Brokerage</th>
                <th className="py-3.5 px-4">Active Clients</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Control Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredBrokers.map((broker) => (
                <tr key={broker.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{broker.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {broker.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {editingId === broker.id ? (
                      <input
                        type="text"
                        value={tempDelivery}
                        onChange={(e) => setTempDelivery(e.target.value)}
                        className="w-28 px-2 py-1 rounded bg-slate-50 border border-blue-500 font-bold text-slate-900 focus:outline-hidden"
                      />
                    ) : (
                      <span className="font-extrabold text-slate-900">{broker.equityDeliveryFee}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {editingId === broker.id ? (
                      <input
                        type="text"
                        value={tempFnO}
                        onChange={(e) => setTempFnO(e.target.value)}
                        className="w-28 px-2 py-1 rounded bg-slate-50 border border-blue-500 font-bold text-slate-900 focus:outline-hidden"
                      />
                    ) : (
                      <span className="font-extrabold text-slate-900">{broker.fnOFee}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {broker.activeClientsNse}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{broker.rating} / 5.0</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {editingId === broker.id ? (
                        <button
                          onClick={() => handleSave(broker.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all inline-flex items-center gap-1 shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(broker)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-all border border-blue-200/80 inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-600" /> Edit Rates
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBroker(broker.id, broker.name)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 transition-all border border-slate-200"
                        title="Delete Broker"
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
