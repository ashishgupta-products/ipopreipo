"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Flame, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Save, 
  Clock, 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { IPOData, IPOCategory, IPOStatus } from "@/types/ipo";

export default function AdminIposPage() {
  const [ipos, setIpos] = useState<IPOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Edit / Add Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalFormData, setModalFormData] = useState<Partial<IPOData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

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
    setModalFormData({
      category: "mainboard",
      status: "upcoming",
      exchange: "BSE & NSE",
      priceBandMin: 100,
      priceBandMax: 110,
      lotSize: 100,
      minInvestment: 11000,
      issueSizeTotalCr: 500,
      gmp: 20,
      gmpPercent: 18.18,
      rating: 3.5,
      recommendation: "May Apply",
      registrarName: "Link Intime India Pvt Ltd",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (ipo: IPOData) => {
    setIsEditing(true);
    setModalFormData({ ...ipo });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFormData.name || !modalFormData.slug) {
      alert("Name and Slug are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/ipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modalFormData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg(`✅ Successfully ${isEditing ? "updated" : "created"} ${modalFormData.name}`);
        setShowModal(false);
        loadIPOs();
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        alert(data.error || "Failed to save IPO");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIpo = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" (${slug})?`)) return;
    try {
      const res = await fetch(`/api/admin/ipos?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeedbackMsg(`Deleted ${name}`);
        loadIPOs();
        setTimeout(() => setFeedbackMsg(""), 3000);
      }
    } catch (err) {
      alert("Failed to delete IPO");
    }
  };

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
          <h1 className="text-2xl font-black tracking-tight text-white">IPO Database &amp; GMP Console</h1>
          <p className="text-xs text-slate-400 mt-1">Manage listings, adjust live Grey Market Premiums, and update dates.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadIPOs}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs border border-slate-800"
            title="Reload IPO list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create New IPO</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-mono">
          {feedbackMsg}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by company or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="MAINBOARD">Mainboard</option>
            <option value="SME">SME</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
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
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 text-[10px] uppercase font-mono">
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
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No IPOs match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ipo) => (
                  <tr key={ipo.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ipo/${ipo.slug}`}
                          target="_blank"
                          className="hover:text-blue-400 font-bold block"
                        >
                          {ipo.name}
                        </Link>
                        <span className="text-[10px] font-mono text-slate-500">({ipo.slug})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Issue Size: ₹{ipo.issueSizeTotalCr} Cr | Lot: {ipo.lotSize}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          ipo.category.toLowerCase() === "sme"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {ipo.category}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {ipo.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        defaultValue={ipo.gmp || 0}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== ipo.gmp) {
                            handleInlineGmpChange(ipo.slug, val, ipo.priceBandMax || 100);
                          }
                        }}
                        className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-right font-mono font-bold text-emerald-400 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      +{(ipo.gmpPercent || 0).toFixed(1)}%
                    </td>

                    <td className="py-3 px-3 text-[11px] text-slate-400">
                      {ipo.openDate || "--"} to {ipo.closeDate || "--"}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(ipo)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit IPO"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteIpo(ipo.slug, ipo.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete IPO"
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

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-sm text-white">
                {isEditing ? `Edit IPO: ${modalFormData.name}` : "Create New IPO Listing"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Company Name</label>
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
                        slug: isEditing ? prev.slug : slug,
                      }));
                    }}
                    placeholder="e.g. Acme Tech Solutions Ltd"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={modalFormData.slug || ""}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="acme-tech-ipo"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Category</label>
                  <select
                    value={modalFormData.category || "mainboard"}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, category: e.target.value as IPOCategory }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="mainboard">Mainboard</option>
                    <option value="sme">SME</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Status</label>
                  <select
                    value={modalFormData.status || "upcoming"}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, status: e.target.value as IPOStatus }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="live">Live</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="listed">Listed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Exchange</label>
                  <select
                    value={modalFormData.exchange || "BSE & NSE"}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, exchange: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="BSE & NSE">BSE &amp; NSE</option>
                    <option value="BSE">BSE</option>
                    <option value="NSE">NSE</option>
                    <option value="BSE SME">BSE SME</option>
                    <option value="NSE Emerge">NSE Emerge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Price Min (₹)</label>
                  <input
                    type="number"
                    value={modalFormData.priceBandMin || 0}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, priceBandMin: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Price Max (₹)</label>
                  <input
                    type="number"
                    value={modalFormData.priceBandMax || 0}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, priceBandMax: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Lot Size</label>
                  <input
                    type="number"
                    value={modalFormData.lotSize || 1}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, lotSize: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">GMP (₹)</label>
                  <input
                    type="number"
                    value={modalFormData.gmp || 0}
                    onChange={(e) => {
                      const gmp = Number(e.target.value);
                      const max = modalFormData.priceBandMax || 100;
                      setModalFormData((prev) => ({
                        ...prev,
                        gmp,
                        gmpPercent: max > 0 ? (gmp / max) * 100 : 0,
                      }));
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Issue Size Total (₹ Cr)</label>
                  <input
                    type="number"
                    value={modalFormData.issueSizeTotalCr || 0}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, issueSizeTotalCr: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Total Sub (x)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={modalFormData.totalSubscription || 0}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, totalSubscription: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Open Date</label>
                  <input
                    type="date"
                    value={modalFormData.openDate || ""}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, openDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Close Date</label>
                  <input
                    type="date"
                    value={modalFormData.closeDate || ""}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, closeDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Allotment Date</label>
                  <input
                    type="date"
                    value={modalFormData.allotmentDate || ""}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, allotmentDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Listing Date</label>
                  <input
                    type="date"
                    value={modalFormData.listingDate || ""}
                    onChange={(e) => setModalFormData((prev) => ({ ...prev, listingDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Registrar Name</label>
                <input
                  type="text"
                  value={modalFormData.registrarName || ""}
                  onChange={(e) => setModalFormData((prev) => ({ ...prev, registrarName: e.target.value }))}
                  placeholder="e.g. Link Intime India Pvt Ltd / KFin Technologies"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? "Saving..." : "Save IPO"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
