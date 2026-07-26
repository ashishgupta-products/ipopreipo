"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Plus, 
  Edit, 
  Save, 
  CheckCircle2, 
  Search, 
  ArrowLeft
} from "lucide-react";
import { MOCK_BANKS } from "@/data/mockBanks";
import { BankData } from "@/types/finance";

export default function AdminBanksPage() {
  const [banks, setBanks] = useState<BankData[]>(MOCK_BANKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<string>("");
  const [toastMessage, setToastMessage] = useState("");

  const filteredBanks = banks.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (bank: BankData) => {
    setEditingId(bank.id);
    setTempRate(bank.savingsInterestRate);
  };

  const handleSave = (id: string) => {
    setBanks((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, savingsInterestRate: tempRate }
          : b
      )
    );
    setEditingId(null);
    setToastMessage("Bank Savings Interest Rate specs updated!");
    setTimeout(() => setToastMessage(""), 3500);
  };

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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Banks &amp; Savings Accounts Control Desk</h1>
          <p className="text-xs text-slate-500">Manage bank ASBA blocking speeds, savings interest rates, zero-balance criteria, and branch networks.</p>
        </div>

        <button
          onClick={() => {
            setToastMessage("New bank entity draft created!");
            setTimeout(() => setToastMessage(""), 3500);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Bank Partner
        </button>
      </div>

      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bank name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <span>Total Banks: <strong>{banks.length}</strong></span>
          <span>•</span>
          <span>Public Sector: <strong>{banks.filter((b) => b.type.includes("Public")).length} Banks</strong></span>
        </div>
      </div>

      {/* Banks Management Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Bank Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Savings Interest Rate</th>
                <th className="py-3 px-4">Min Balance Req.</th>
                <th className="py-3 px-4">Peak FD Rate</th>
                <th className="py-3 px-4 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredBanks.map((bank) => (
                <tr key={bank.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>{bank.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize font-medium">{bank.type}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {editingId === bank.id ? (
                      <input
                        type="text"
                        value={tempRate}
                        onChange={(e) => setTempRate(e.target.value)}
                        className="w-32 px-2 py-1 rounded bg-slate-50 border border-blue-400 font-bold text-slate-900 focus:outline-hidden"
                      />
                    ) : (
                      <span className="text-emerald-700 font-extrabold">{bank.savingsInterestRate}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700">
                    {bank.minBalanceRequirement}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {bank.fdInterestRatePeak}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {editingId === bank.id ? (
                      <button
                        onClick={() => handleSave(bank.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all inline-flex items-center gap-1 shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(bank)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all inline-flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-700" /> Edit Specs
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
