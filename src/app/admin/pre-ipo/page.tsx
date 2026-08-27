"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  X, 
  Save, 
  Building2,
  DollarSign
} from "lucide-react";
import { MOCK_PRE_IPOS } from "@/data/mockPreIpo";
import { PreIPOData } from "@/types/ipo";

export default function AdminPreIposPage() {
  const [preIpos, setPreIpos] = useState<PreIPOData[]>(MOCK_PRE_IPOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PreIPOData>>({});

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      sector: "Fintech / Technology",
      estimatedPrice: 500,
      minSharesToBuy: 50,
      minInvestmentAmount: 25000,
      valuationCr: 10000,
      status: "Available",
      expectedIpoTimeline: "2026-2027",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: PreIPOData) => {
    setIsEditing(true);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.slug) {
      alert("Company Name and Slug are required.");
      return;
    }

    if (isEditing) {
      setPreIpos((prev) =>
        prev.map((p) => (p.slug === formData.slug ? ({ ...p, ...formData } as PreIPOData) : p))
      );
    } else {
      const newItem: PreIPOData = {
        id: `pre_${Date.now()}`,
        slug: formData.slug!,
        companyName: formData.companyName!,
        sector: formData.sector || "Tech",
        description: formData.description || "",
        estimatedPrice: Number(formData.estimatedPrice || 100),
        faceValue: 10,
        minSharesToBuy: Number(formData.minSharesToBuy || 10),
        minInvestmentAmount: Number((formData.estimatedPrice || 100) * (formData.minSharesToBuy || 10)),
        valuationCr: Number(formData.valuationCr || 1000),
        fundingRaisedCr: 500,
        keyInvestors: ["Venture Capitalists"],
        revenueLastFyCr: 1000,
        patLastFyCr: 100,
        expectedIpoTimeline: formData.expectedIpoTimeline || "Q4 2026",
        status: (formData.status as any) || "Available",
      };
      setPreIpos((prev) => [newItem, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (slug: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    setPreIpos((prev) => prev.filter((p) => p.slug !== slug));
  };

  const filtered = preIpos.filter(
    (p) =>
      p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Pre-IPO Unlisted Shares Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage catalog of unlisted equities, share price ranges, and DRHP timelines.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pre-IPO Stock</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search unlisted stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          {filtered.length} Equities
        </span>
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 text-[10px] uppercase font-mono">
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-right">Unlisted Price</th>
                <th className="py-3 px-3 text-right">Min Lot / Investment</th>
                <th className="py-3 px-3 text-right">Valuation (Cr)</th>
                <th className="py-3 px-3">IPO Target</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <Link href={`/pre-ipo/${item.slug}`} target="_blank" className="hover:text-blue-400">
                      {item.companyName}
                    </Link>
                    <span className="text-[10px] font-mono text-slate-500 block">/{item.slug}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-semibold">
                      {item.sector}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                    ₹{item.estimatedPrice.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                    {item.minSharesToBuy} shares (₹{item.minInvestmentAmount.toLocaleString("en-IN")})
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                    ₹{item.valuationCr.toLocaleString("en-IN")} Cr
                  </td>

                  <td className="py-3.5 px-3 text-slate-400 text-xs">
                    {item.expectedIpoTimeline}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Pre-IPO stock"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.slug, item.companyName)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Pre-IPO stock"
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">
                {isEditing ? `Edit ${formData.companyName}` : "Add Unlisted Pre-IPO Equity"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName || ""}
                  onChange={(e) => {
                    const companyName = e.target.value;
                    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    setFormData((prev) => ({ ...prev, companyName, slug: isEditing ? prev.slug : slug }));
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Sector</label>
                  <input
                    type="text"
                    value={formData.sector || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sector: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Estimated Share Price (₹)</label>
                  <input
                    type="number"
                    value={formData.estimatedPrice || 0}
                    onChange={(e) => setFormData((prev) => ({ ...prev, estimatedPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Min Shares to Buy</label>
                  <input
                    type="number"
                    value={formData.minSharesToBuy || 10}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minSharesToBuy: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Valuation (₹ Cr)</label>
                  <input
                    type="number"
                    value={formData.valuationCr || 0}
                    onChange={(e) => setFormData((prev) => ({ ...prev, valuationCr: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Expected IPO Timeline</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 2026 (DRHP Filed)"
                  value={formData.expectedIpoTimeline || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expectedIpoTimeline: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
