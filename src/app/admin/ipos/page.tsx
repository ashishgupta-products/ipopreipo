"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Layers
} from "lucide-react";
import { IPOData } from "@/types/ipo";
import { Badge } from "@/components/common/Badge";

export default function AdminIposPage() {
  const [ipos, setIpos] = useState<IPOData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingIpo, setEditingIpo] = useState<IPOData | null>(null);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    async function loadIPOs() {
      try {
        const res = await fetch("/api/ipos");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setIpos(json.data);
        }
      } catch (err) {
        console.error("Failed to load admin ipos:", err);
      }
    }
    loadIPOs();
  }, []);

  // Form State for Create / Edit
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState<"mainboard" | "sme">("mainboard");
  const [formPriceMin, setFormPriceMin] = useState(400);
  const [formPriceMax, setFormPriceMax] = useState(425);
  const [formLotSize, setFormLotSize] = useState(35);
  const [formIssueSize, setFormIssueSize] = useState(1250);
  const [formGmp, setFormGmp] = useState(65);
  const [formStatus, setFormStatus] = useState<"live" | "upcoming" | "listed">("live");

  const filteredIpos = ipos.filter((ipo) => {
    if (categoryFilter !== "all" && ipo.category !== categoryFilter) return false;
    if (searchQuery.trim() && !ipo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingIpo(null);
    setFormName("");
    setFormSlug("");
    setFormCategory("mainboard");
    setFormPriceMin(350);
    setFormPriceMax(380);
    setFormLotSize(40);
    setFormIssueSize(850);
    setFormGmp(45);
    setFormStatus("live");
    setShowCreateModal(true);
  };

  const handleOpenEdit = (ipo: IPOData) => {
    setEditingIpo(ipo);
    setFormName(ipo.name);
    setFormSlug(ipo.slug);
    setFormCategory(ipo.category);
    setFormPriceMin(ipo.priceBandMin);
    setFormPriceMax(ipo.priceBandMax);
    setFormLotSize(ipo.lotSize);
    setFormIssueSize(ipo.issueSizeTotalCr || 850);
    setFormGmp(ipo.gmp);
    setFormStatus(ipo.status === "closed" || ipo.status === "allotment_out" ? "listed" : ipo.status);
    setShowCreateModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this IPO?")) {
      setIpos((prev) => prev.filter((i) => i.id !== id));
      setSuccessToast("IPO removed from portal.");
      setTimeout(() => setSuccessToast(""), 3000);
    }
  };

  const handleSaveIpo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const slug = formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const gmpPct = (formGmp / formPriceMax) * 100;

    if (editingIpo) {
      setIpos((prev) =>
        prev.map((i) =>
          i.id === editingIpo.id
            ? {
                ...i,
                name: formName,
                slug,
                category: formCategory,
                priceBandMin: formPriceMin,
                priceBandMax: formPriceMax,
                lotSize: formLotSize,
                issueSizeTotalCr: formIssueSize,
                gmp: formGmp,
                gmpPercent: gmpPct,
                status: formStatus
              }
            : i
        )
      );
      setSuccessToast("IPO updated successfully!");
    } else {
      const newIpo: IPOData = {
        id: "ipo-" + Date.now(),
        name: formName,
        companyName: formName + " Limited",
        slug,
        category: formCategory,
        issueSizeTotalCr: formIssueSize,
        freshIssueCr: formIssueSize,
        ofsCr: 0,
        faceValue: 10,
        priceBandMin: formPriceMin,
        priceBandMax: formPriceMax,
        lotSize: formLotSize,
        minInvestment: formPriceMax * formLotSize,
        gmp: formGmp,
        gmpPercent: gmpPct,
        gmpUpdatedTime: "Just now",
        expectedListingPrice: formPriceMax + formGmp,
        status: formStatus,
        exchange: formCategory === "sme" ? "NSE Emerge" : "BSE & NSE",
        openDate: "2026-07-28",
        closeDate: "2026-07-30",
        allotmentDate: "2026-07-31",
        refundDate: "2026-08-01",
        dematCreditDate: "2026-08-02",
        listingDate: "2026-08-03",
        retailSubscription: 14.5,
        niiSubscription: 32.8,
        qibSubscription: 88.2,
        totalSubscription: 45.2,
        highlights: ["Strong revenue growth", "High promoter holding"],
        risks: ["Client concentration risk"],
        recommendation: "Apply for Listing Gain",
        rating: 4.5,
        registrarName: "Link Intime India Private Ltd",
        registrarWebsite: "https://linkintime.co.in",
        registrarCheckUrl: "https://linkintime.co.in/initial_offer/public-issues.html",
        leadManagers: ["Kotak Mahindra Capital", "ICICI Securities"]
      };
      setIpos([newIpo, ...ipos]);
      setSuccessToast("New IPO created and published live!");
    }

    setShowCreateModal(false);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider block">
            IPO MANAGEMENT MODULE
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mainboard &amp; SME IPOs ({ipos.length})</h1>
          <p className="text-xs text-slate-500">Create, edit, change status, and configure allotment details for all IPO listings.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create New IPO
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-slate-500">Filter Category:</span>
          {["all", "mainboard", "sme"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-all uppercase text-[11px] font-bold ${
                categoryFilter === cat
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search IPO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 bg-slate-50"
          />
        </div>
      </div>

      {/* IPO Data Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">IPO Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Price Band</th>
                <th className="py-2.5 px-3">Issue Size</th>
                <th className="py-2.5 px-3">GMP (₹)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredIpos.map((ipo) => (
                <tr key={ipo.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 font-extrabold block">{ipo.name}</strong>
                    <span className="text-[10px] text-slate-400">{ipo.slug}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {ipo.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    ₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    ₹{ipo.issueSizeTotalCr || 850} Cr
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-emerald-700">+₹{ipo.gmp} ({ipo.gmpPercent.toFixed(1)}%)</span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge status={ipo.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(ipo)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100"
                        title="Edit IPO"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ipo.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                        title="Delete IPO"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingIpo ? `Edit ${editingIpo.name}` : "Create New IPO"}
                </h3>
                <p className="text-xs text-slate-500">Configure IPO details, pricing, lot size, and GMP status.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIpo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">IPO Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Limited IPO"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. acme-tech"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                  >
                    <option value="mainboard">Mainboard</option>
                    <option value="sme">SME Segment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                  >
                    <option value="live">Live Now</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="listed">Listed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Issue Size (₹ Cr)</label>
                  <input
                    type="number"
                    value={formIssueSize}
                    onChange={(e) => setFormIssueSize(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price Min (₹)</label>
                  <input
                    type="number"
                    value={formPriceMin}
                    onChange={(e) => setFormPriceMin(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price Max (₹)</label>
                  <input
                    type="number"
                    value={formPriceMax}
                    onChange={(e) => setFormPriceMax(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lot Size (Shares)</label>
                  <input
                    type="number"
                    value={formLotSize}
                    onChange={(e) => setFormLotSize(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Expected Grey Market Premium GMP (₹)</label>
                <input
                  type="number"
                  value={formGmp}
                  onChange={(e) => setFormGmp(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-800 shadow-xs"
                >
                  {editingIpo ? "Save Changes" : "Create & Publish IPO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
