"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Flame, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  Save, 
  Sliders, 
  DollarSign, 
  Calendar, 
  Building2,
  Sparkles,
  Layers,
  FileText,
  Percent,
  TrendingUp,
  Link2,
  Check
} from "lucide-react";
import { IPOData, IPOCategory, IPOStatus } from "@/types/ipo";

export default function AdminIPOsPage() {
  const [ipos, setIpos] = useState<IPOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Edit / Add Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTab, setModalTab] = useState<"general" | "gmp" | "dates" | "registrar" | "subscription" | "about">("general");
  const [modalFormData, setModalFormData] = useState<Partial<IPOData>>({});
  const [prosInput, setProsInput] = useState("");
  const [consInput, setConsInput] = useState("");

  const loadIPOs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ipos");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setIpos(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load IPOs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIPOs();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setModalTab("general");
    setModalFormData({
      category: "mainboard",
      status: "upcoming",
      exchange: "BSE & NSE",
      priceBandMin: 100,
      priceBandMax: 110,
      lotSize: 100,
      minInvestment: 11000,
      faceValue: 10,
      issueSizeTotalCr: 500,
      freshIssueCr: 350,
      ofsCr: 150,
      gmp: 20,
      gmpPercent: 18.18,
      rating: 3.5,
      recommendation: "May Apply",
      registrarName: "Link Intime India Pvt Ltd",
      registrarWebsite: "https://linkintime.co.in",
      registrarCheckUrl: "https://linkintime.co.in/initial_offer/public-issues.html",
      totalSubscription: 2.5,
      qibSubscription: 3.2,
      niiSubscription: 2.1,
      retailSubscription: 1.8,
      companyWebsite: "https://company.com",
      companyAddress: "Corporate Office, Mumbai, Maharashtra",
    });
    setProsInput("");
    setConsInput("");
    setShowModal(true);
  };

  const handleOpenEditModal = (ipo: IPOData) => {
    setIsEditing(true);
    setModalTab("general");
    setModalFormData({ ...ipo });
    setProsInput((ipo.highlights || []).join("\n"));
    setConsInput((ipo.risks || []).join("\n"));
    setShowModal(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFormData.slug || !modalFormData.name) {
      alert("Name and Slug are required.");
      return;
    }

    const highlights = prosInput
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const risks = consInput
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const priceMax = Number(modalFormData.priceBandMax || 0);
    const gmpVal = Number(modalFormData.gmp || 0);
    const calculatedGmpPercent = priceMax > 0 ? (gmpVal / priceMax) * 100 : 0;
    const lotSizeVal = Number(modalFormData.lotSize || 1);
    const minInv = priceMax * lotSizeVal;

    const payloadData = {
      ...modalFormData,
      highlights,
      risks,
      minInvestment: modalFormData.minInvestment || minInv,
      gmpPercent: Number(calculatedGmpPercent.toFixed(2)),
      expectedListingPrice: priceMax + gmpVal,
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const payload = isEditing
        ? { slug: modalFormData.slug, updates: payloadData }
        : payloadData;

      const res = await fetch("/api/admin/ipos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setFeedbackMsg(isEditing ? `Updated ${modalFormData.name}` : `Created ${modalFormData.name}`);
        loadIPOs();
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Operation failed");
      }
    } catch (err) {
      alert("Network error occurred");
    }
  };

  const handleDeleteIPO = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete IPO listing "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/ipos?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedbackMsg(`Deleted ${name}`);
        loadIPOs();
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        alert("Failed to delete IPO");
      }
    } catch (err) {
      alert("Network error while deleting");
    }
  };

  // Inline Fast GMP Updater
  const handleInlineGmpChange = async (slug: string, newGmp: number, priceMax: number) => {
    try {
      await fetch("/api/admin/ipos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          updates: { gmp: newGmp, priceBandMax: priceMax },
        }),
      });
      setIpos((prev) =>
        prev.map((i) =>
          i.slug === slug
            ? {
                ...i,
                gmp: newGmp,
                gmpPercent: priceMax > 0 ? (newGmp / priceMax) * 100 : 0,
              }
            : i
        )
      );
    } catch (err) {
      console.error("Inline GMP update failed:", err);
    }
  };

  // Filter IPOs
  const filtered = ipos.filter((ipo) => {
    const matchesSearch =
      ipo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || ipo.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "ALL" || ipo.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">IPO Database &amp; GMP Console</h1>
          <p className="text-xs text-slate-500 mt-1">Manage listings, adjust live Grey Market Premiums, and update dates.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadIPOs}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs border border-slate-200 shadow-xs"
            title="Reload IPO list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create New IPO</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold font-mono">
          {feedbackMsg}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by company or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Categories</option>
            <option value="MAINBOARD">Mainboard</option>
            <option value="SME">SME</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="LIVE">Live</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="LISTED">Listed</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* IPOs Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold">
                <th className="py-3 px-4">IPO Details</th>
                <th className="py-3 px-3">Segment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Price Band</th>
                <th className="py-3 px-3 text-right">Live GMP (₹)</th>
                <th className="py-3 px-3 text-right">Gain %</th>
                <th className="py-3 px-3">Bidding Dates</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No IPOs match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ipo) => (
                  <tr key={ipo.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          target="_blank"
                          className="hover:text-blue-600 font-bold block text-slate-900"
                        >
                          {ipo.name}
                        </Link>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">({ipo.slug})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block font-normal mt-0.5">
                        {ipo.openDate && ipo.closeDate ? `Dates: ${ipo.openDate} to ${ipo.closeDate}` : (ipo.openDate || "Dates TBA")} | Issue: ₹{ipo.issueSizeTotalCr} Cr
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ipo.category.toLowerCase() === "sme"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {ipo.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {ipo.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-700 font-semibold">
                      ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <input
                        type="number"
                        defaultValue={ipo.gmp || 0}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== ipo.gmp) {
                            handleInlineGmpChange(ipo.slug, val, ipo.priceBandMax || 100);
                          }
                        }}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-right font-mono font-bold text-emerald-600 text-xs focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                      />
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600">
                      +{(ipo.gmpPercent || 0).toFixed(1)}%
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {ipo.openDate || "--"} to {ipo.closeDate || "--"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(ipo)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit full IPO record"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteIPO(ipo.slug, ipo.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete IPO record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE TABBED EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                  {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {isEditing ? `Edit IPO: ${modalFormData.name}` : "Create New IPO Listing"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Edit core parameters, pricing, GMP, bidding timeline, registrars, and subscriptions.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 bg-white overflow-x-auto text-xs font-bold">
              {[
                { id: "general", label: "General & Pricing", icon: Building2 },
                { id: "gmp", label: "Issue Size & GMP", icon: TrendingUp },
                { id: "dates", label: "Important Dates", icon: Calendar },
                { id: "registrar", label: "Registrar & Links", icon: Link2 },
                { id: "subscription", label: "Subscription & Stats", icon: Layers },
                { id: "about", label: "About & Pros/Cons", icon: FileText },
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

            {/* Modal Form Body */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* TAB 1: GENERAL & PRICING */}
              {modalTab === "general" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Issue / Listing Name *</label>
                      <input
                        type="text"
                        required
                        value={modalFormData.name || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                          setModalFormData((prev) => ({
                            ...prev,
                            name,
                            companyName: prev.companyName || name,
                            slug: isEditing ? prev.slug : slug,
                          }));
                        }}
                        placeholder="e.g. Acme Solar Holdings IPO"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Company Legal Name</label>
                      <input
                        type="text"
                        value={modalFormData.companyName || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                        placeholder="e.g. Acme Solar Holdings Limited"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Slug (URL Path) *</label>
                      <input
                        type="text"
                        required
                        value={modalFormData.slug || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category Segment</label>
                      <select
                        value={modalFormData.category || "mainboard"}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, category: e.target.value as IPOCategory }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="mainboard">Mainboard</option>
                        <option value="sme">SME</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status</label>
                      <select
                        value={modalFormData.status || "upcoming"}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, status: e.target.value as IPOStatus }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="live">Live (Bidding Open)</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="listed">Listed</option>
                        <option value="closed">Closed / Allotment Out</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Exchange</label>
                      <select
                        value={modalFormData.exchange || "BSE & NSE"}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, exchange: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="BSE & NSE">BSE &amp; NSE</option>
                        <option value="BSE">BSE Only</option>
                        <option value="NSE">NSE Only</option>
                        <option value="BSE SME">BSE SME</option>
                        <option value="NSE Emerge">NSE Emerge</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price Band Min (₹)</label>
                      <input
                        type="number"
                        value={modalFormData.priceBandMin || 0}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, priceBandMin: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price Band Max (₹)</label>
                      <input
                        type="number"
                        value={modalFormData.priceBandMax || 0}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, priceBandMax: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Face Value (₹)</label>
                      <input
                        type="number"
                        value={modalFormData.faceValue || 10}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, faceValue: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Lot Size (Shares per lot)</label>
                      <input
                        type="number"
                        value={modalFormData.lotSize || 100}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, lotSize: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Min Retail Investment (₹)</label>
                      <input
                        type="number"
                        value={modalFormData.minInvestment || (modalFormData.priceBandMax || 100) * (modalFormData.lotSize || 100)}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, minInvestment: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ISSUE SIZE & GMP */}
              {modalTab === "gmp" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Total Issue Size (₹ Cr)</label>
                      <input
                        type="number"
                        value={modalFormData.issueSizeTotalCr || 0}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, issueSizeTotalCr: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Fresh Issue (₹ Cr)</label>
                      <input
                        type="number"
                        value={modalFormData.freshIssueCr || 0}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, freshIssueCr: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Offer For Sale (OFS) (₹ Cr)</label>
                      <input
                        type="number"
                        value={modalFormData.ofsCr || 0}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, ofsCr: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-4">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Live Grey Market Premium (GMP) Modifiers</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Live GMP (₹ / share)</label>
                        <input
                          type="number"
                          value={modalFormData.gmp !== undefined ? modalFormData.gmp : 0}
                          onChange={(e) => setModalFormData((prev) => ({ ...prev, gmp: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-emerald-700 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Expected Listing Gain (%)</label>
                        <input
                          type="text"
                          readOnly
                          value={`+${(
                            ((modalFormData.gmp || 0) / (modalFormData.priceBandMax || 100)) *
                            100
                          ).toFixed(1)}%`}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-mono font-bold text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Est. Listing Price (₹)</label>
                        <input
                          type="text"
                          readOnly
                          value={`₹${(modalFormData.priceBandMax || 0) + (modalFormData.gmp || 0)}`}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-mono font-bold text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Analyst Recommendation</label>
                      <select
                        value={modalFormData.recommendation || "May Apply"}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, recommendation: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="Apply">Apply (Strong Fundamentals &amp; High GMP)</option>
                        <option value="May Apply">May Apply (High Risk Investors)</option>
                        <option value="Avoid">Avoid</option>
                        <option value="Neutral">Neutral</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Analyst Rating (1.0 to 5.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={modalFormData.rating || 3.5}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: IMPORTANT DATES */}
              {modalTab === "dates" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">IPO Open Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-09-10"
                        value={modalFormData.openDate || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, openDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">IPO Close Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-09-12"
                        value={modalFormData.closeDate || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, closeDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Allotment Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-09-15"
                        value={modalFormData.allotmentDate || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, allotmentDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Initiation of Refunds</label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-09-16"
                        value={modalFormData.refundDate || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, refundDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Credit of Shares to Demat</label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-09-16"
                        value={modalFormData.dematCreditDate || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, dematCreditDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">IPO Listing Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-09-17"
                        value={modalFormData.listingDate || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, listingDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REGISTRAR & LINKS */}
              {modalTab === "registrar" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Registrar Name</label>
                      <input
                        type="text"
                        value={modalFormData.registrarName || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, registrarName: e.target.value }))}
                        placeholder="e.g. Link Intime India Pvt Ltd / KFin Technologies"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Registrar Website URL</label>
                      <input
                        type="url"
                        value={modalFormData.registrarWebsite || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, registrarWebsite: e.target.value }))}
                        placeholder="https://linkintime.co.in"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Direct Allotment Status Check URL</label>
                    <input
                      type="url"
                      value={modalFormData.registrarCheckUrl || ""}
                      onChange={(e) => setModalFormData((prev) => ({ ...prev, registrarCheckUrl: e.target.value }))}
                      placeholder="https://linkintime.co.in/initial_offer/public-issues.html"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">DRHP Prospectus Document URL</label>
                      <input
                        type="url"
                        value={modalFormData.drhpUrl || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, drhpUrl: e.target.value }))}
                        placeholder="https://sebi.gov.in/..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">RHP Prospectus Document URL</label>
                      <input
                        type="url"
                        value={modalFormData.prospectusUrl || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, prospectusUrl: e.target.value }))}
                        placeholder="https://bseindia.com/..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SUBSCRIPTION & STATS */}
              {modalTab === "subscription" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs">Live Subscription Demand Tiers (Times x)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Total Subscribed (x)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={modalFormData.totalSubscription || 0}
                          onChange={(e) => setModalFormData((prev) => ({ ...prev, totalSubscription: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">QIB Demand (x)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={modalFormData.qibSubscription || 0}
                          onChange={(e) => setModalFormData((prev) => ({ ...prev, qibSubscription: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">NII / HNI Demand (x)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={modalFormData.niiSubscription || 0}
                          onChange={(e) => setModalFormData((prev) => ({ ...prev, niiSubscription: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Retail Demand (x)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={modalFormData.retailSubscription || 0}
                          onChange={(e) => setModalFormData((prev) => ({ ...prev, retailSubscription: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ABOUT & PROS/CONS */}
              {modalTab === "about" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Company Website URL</label>
                      <input
                        type="url"
                        value={modalFormData.companyWebsite || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, companyWebsite: e.target.value }))}
                        placeholder="https://company.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Registered Corporate Address</label>
                      <input
                        type="text"
                        value={modalFormData.companyAddress || ""}
                        onChange={(e) => setModalFormData((prev) => ({ ...prev, companyAddress: e.target.value }))}
                        placeholder="Corporate Office Address, Mumbai, India"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-emerald-700 mb-1">Strengths / Pros (1 per line)</label>
                      <textarea
                        rows={5}
                        value={prosInput}
                        onChange={(e) => setProsInput(e.target.value)}
                        placeholder="High revenue growth rate&#10;Market leader in clean energy&#10;Low debt-to-equity ratio"
                        className="w-full px-3 py-2 bg-emerald-50/40 border border-emerald-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-rose-700 mb-1">Risks / Cons (1 per line)</label>
                      <textarea
                        rows={5}
                        value={consInput}
                        onChange={(e) => setConsInput(e.target.value)}
                        placeholder="High customer concentration risk&#10;Valuation is on higher side&#10;Regulatory changes in tariff subsidies"
                        className="w-full px-3 py-2 bg-rose-50/40 border border-rose-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-rose-600 leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Editing mode: <strong className="text-slate-700">{modalFormData.slug || "new"}</strong>
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
                    <span>{isEditing ? "Save IPO Changes" : "Create IPO Listing"}</span>
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
