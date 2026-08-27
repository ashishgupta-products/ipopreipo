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
  DollarSign,
  Layers,
  FileText,
  TrendingUp,
  Award,
  Check
} from "lucide-react";
import { MOCK_PRE_IPOS } from "@/data/mockPreIpo";
import { PreIPOData } from "@/types/ipo";

export default function AdminPreIposPage() {
  const [preIpos, setPreIpos] = useState<PreIPOData[]>(MOCK_PRE_IPOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTab, setModalTab] = useState<"general" | "valuation" | "financials" | "about">("general");
  const [formData, setFormData] = useState<Partial<PreIPOData>>({});
  const [investorsInput, setInvestorsInput] = useState("");

  const handleOpenAdd = () => {
    setIsEditing(false);
    setModalTab("general");
    setFormData({
      sector: "Fintech / Technology",
      estimatedPrice: 500,
      faceValue: 10,
      minSharesToBuy: 50,
      minInvestmentAmount: 25000,
      valuationCr: 10000,
      fundingRaisedCr: 1500,
      revenueLastFyCr: 1200,
      patLastFyCr: 180,
      peRatio: 45.2,
      fiftyTwoWeekHigh: 620,
      fiftyTwoWeekLow: 380,
      status: "Available",
      expectedIpoTimeline: "2026-2027 (DRHP Filed)",
      description: "",
      isinNumber: "INE000000000",
      cinNumber: "U72200DL2015PTC000000",
      depository: "NSDL & CDSL",
      rta: "Link Intime India Pvt Ltd",
    });
    setInvestorsInput("Peak XV Partners, Tiger Global, SoftBank Vision Fund");
    setShowModal(true);
  };

  const handleOpenEdit = (item: PreIPOData) => {
    setIsEditing(true);
    setModalTab("general");
    setFormData({ ...item });
    setInvestorsInput((item.keyInvestors || []).join(", "));
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.slug) {
      alert("Company Name and Slug are required.");
      return;
    }

    const investors = investorsInput
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const priceVal = Number(formData.estimatedPrice || 100);
    const minSharesVal = Number(formData.minSharesToBuy || 10);
    const calculatedMinInv = priceVal * minSharesVal;

    const payload: PreIPOData = {
      id: formData.id || `pre_${Date.now()}`,
      slug: formData.slug!,
      companyName: formData.companyName!,
      sector: formData.sector || "Technology",
      description: formData.description || "",
      estimatedPrice: priceVal,
      faceValue: Number(formData.faceValue || 10),
      minSharesToBuy: minSharesVal,
      minInvestmentAmount: formData.minInvestmentAmount || calculatedMinInv,
      valuationCr: Number(formData.valuationCr || 1000),
      fundingRaisedCr: Number(formData.fundingRaisedCr || 500),
      keyInvestors: investors,
      revenueLastFyCr: Number(formData.revenueLastFyCr || 0),
      patLastFyCr: Number(formData.patLastFyCr || 0),
      peRatio: Number(formData.peRatio || 0),
      fiftyTwoWeekHigh: Number(formData.fiftyTwoWeekHigh || priceVal * 1.2),
      fiftyTwoWeekLow: Number(formData.fiftyTwoWeekLow || priceVal * 0.8),
      expectedIpoTimeline: formData.expectedIpoTimeline || "Q4 2026",
      status: (formData.status as any) || "Available",
      isinNumber: formData.isinNumber,
      cinNumber: formData.cinNumber,
      depository: formData.depository,
      rta: formData.rta,
    };

    if (isEditing) {
      setPreIpos((prev) =>
        prev.map((p) => (p.slug === formData.slug ? payload : p))
      );
    } else {
      setPreIpos((prev) => [payload, ...prev]);
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
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Pre-IPO Unlisted Shares Manager</h1>
          <p className="text-xs text-slate-500 mt-1">Manage catalog of unlisted equities, share price ranges, and DRHP timelines.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pre-IPO Stock</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search unlisted stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          {filtered.length} Equities
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold">
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-right">Unlisted Price</th>
                <th className="py-3 px-3 text-right">Min Lot / Investment</th>
                <th className="py-3 px-3 text-right">Valuation (Cr)</th>
                <th className="py-3 px-3">IPO Target</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <Link href={`/pre-ipo/${item.slug}`} target="_blank" className="hover:text-blue-600">
                      {item.companyName}
                    </Link>
                    <span className="text-[10px] font-mono text-slate-400 block font-normal mt-0.5">/{item.slug}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {item.sector}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600">
                    ₹{item.estimatedPrice.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-slate-700 font-medium">
                    {item.minSharesToBuy} shares (₹{item.minInvestmentAmount.toLocaleString("en-IN")})
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-slate-700 font-medium">
                    ₹{item.valuationCr.toLocaleString("en-IN")} Cr
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 text-xs">
                    {item.expectedIpoTimeline}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/pre-ipo/${item.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View public page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Pre-IPO stock"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.slug, item.companyName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* COMPREHENSIVE TABBED EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {isEditing ? `Edit Pre-IPO: ${formData.companyName}` : "Add Unlisted Pre-IPO Stock"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure unlisted share price, valuation, financials, and DRHP timeline.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 bg-white overflow-x-auto text-xs font-bold">
              {[
                { id: "general", label: "Company & Sector", icon: Building2 },
                { id: "valuation", label: "Valuation & Share Price", icon: DollarSign },
                { id: "financials", label: "Financials & Investors", icon: TrendingUp },
                { id: "about", label: "About & Identifiers", icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? "border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* TAB 1: COMPANY & SECTOR */}
              {modalTab === "general" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.companyName || ""}
                        onChange={(e) => {
                          const companyName = e.target.value;
                          const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                          setFormData((prev) => ({ ...prev, companyName, slug: isEditing ? prev.slug : slug }));
                        }}
                        placeholder="e.g. Swiggy Limited / NSE India"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Slug (URL Path) *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Industry Sector</label>
                      <input
                        type="text"
                        value={formData.sector || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sector: e.target.value }))}
                        placeholder="e.g. FoodTech / Fintech / Exchanges"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Allocation Status</label>
                      <select
                        value={formData.status || "Available"}
                        onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="Available">Available (Ready to Transact)</option>
                        <option value="High Demand">High Demand / Low Float</option>
                        <option value="Limited Allocation">Limited Allocation</option>
                        <option value="DRHP Filed">DRHP Filed (Imminent IPO)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Expected IPO Timeline</label>
                      <input
                        type="text"
                        placeholder="e.g. Q4 2026 (DRHP Filed)"
                        value={formData.expectedIpoTimeline || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, expectedIpoTimeline: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VALUATION & PRICE */}
              {modalTab === "valuation" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Unlisted Share Price (₹)</label>
                      <input
                        type="number"
                        value={formData.estimatedPrice || 0}
                        onChange={(e) => setFormData((prev) => ({ ...prev, estimatedPrice: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 font-mono font-bold text-sm focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Face Value (₹)</label>
                      <input
                        type="number"
                        value={formData.faceValue || 10}
                        onChange={(e) => setFormData((prev) => ({ ...prev, faceValue: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Min Shares to Buy</label>
                      <input
                        type="number"
                        value={formData.minSharesToBuy || 10}
                        onChange={(e) => setFormData((prev) => ({ ...prev, minSharesToBuy: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Current Company Valuation (₹ Cr)</label>
                      <input
                        type="number"
                        value={formData.valuationCr || 0}
                        onChange={(e) => setFormData((prev) => ({ ...prev, valuationCr: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Total Funding Raised (₹ Cr)</label>
                      <input
                        type="number"
                        value={formData.fundingRaisedCr || 0}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fundingRaisedCr: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCIALS & INVESTORS */}
              {modalTab === "financials" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Revenue Last FY (₹ Cr)</label>
                      <input
                        type="number"
                        value={formData.revenueLastFyCr || 0}
                        onChange={(e) => setFormData((prev) => ({ ...prev, revenueLastFyCr: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">PAT / Profit Last FY (₹ Cr)</label>
                      <input
                        type="number"
                        value={formData.patLastFyCr || 0}
                        onChange={(e) => setFormData((prev) => ({ ...prev, patLastFyCr: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">P/E Multiple</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.peRatio || 0}
                        onChange={(e) => setFormData((prev) => ({ ...prev, peRatio: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">52-Week High (₹)</label>
                      <input
                        type="number"
                        value={formData.fiftyTwoWeekHigh || 0}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fiftyTwoWeekHigh: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">52-Week Low (₹)</label>
                      <input
                        type="number"
                        value={formData.fiftyTwoWeekLow || 0}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fiftyTwoWeekLow: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Key Institutional Investors (Comma-separated)</label>
                    <input
                      type="text"
                      value={investorsInput}
                      onChange={(e) => setInvestorsInput(e.target.value)}
                      placeholder="e.g. SoftBank, Peak XV Partners, Tiger Global, Temasek"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ABOUT & IDENTIFIERS */}
              {modalTab === "about" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business Description &amp; Highlights</label>
                    <textarea
                      rows={4}
                      value={formData.description || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Executive summary of company operations, market share, and revenue channels..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ISIN Number</label>
                      <input
                        type="text"
                        value={formData.isinNumber || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isinNumber: e.target.value }))}
                        placeholder="INE000000000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CIN Number</label>
                      <input
                        type="text"
                        value={formData.cinNumber || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cinNumber: e.target.value }))}
                        placeholder="U72200DL2015PTC000000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Depository</label>
                      <input
                        type="text"
                        value={formData.depository || "NSDL & CDSL"}
                        onChange={(e) => setFormData((prev) => ({ ...prev, depository: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Registrar &amp; Transfer Agent (RTA)</label>
                      <input
                        type="text"
                        value={formData.rta || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, rta: e.target.value }))}
                        placeholder="e.g. Link Intime India / KFin Tech"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Editing: <strong className="text-slate-700">{formData.slug || "new"}</strong>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 active:scale-98"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Stock</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
