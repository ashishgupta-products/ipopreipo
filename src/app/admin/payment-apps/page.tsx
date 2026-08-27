"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Smartphone, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  Save, 
  Sparkles,
  Star,
  ShieldCheck,
  Zap,
  Award,
  Check,
  Percent,
  Layers,
  FileText,
  DollarSign,
  Building2
} from "lucide-react";
import { PaymentAppData } from "@/types/finance";

export default function AdminPaymentAppsPage() {
  const [apps, setApps] = useState<PaymentAppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [featureFilter, setFeatureFilter] = useState("ALL");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTab, setModalTab] = useState<"general" | "ratings" | "financials" | "review">("general");
  const [formData, setFormData] = useState<Partial<PaymentAppData>>({});
  const [keyFeaturesInput, setKeyFeaturesInput] = useState("");
  const [prosInput, setProsInput] = useState("");
  const [consInput, setConsInput] = useState("");

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment-apps");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setApps(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load payment apps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setModalTab("general");
    setFormData({
      developer: "Fintech India Pvt. Ltd.",
      downloadsTier: "100M+ Downloads",
      playStoreRating: 4.6,
      appStoreRating: 4.7,
      upiLiteSupport: true,
      ruPayUpiSupport: true,
      creditScoreCheckFree: true,
      cashbackPolicy: "Scratch cards, discount vouchers, and merchant cashbacks.",
      joiningBonus: "₹0",
      referralBonus: "₹100 / invite",
      mobileRechargeFee: "₹1 to ₹3 fee",
      upiSuccessRate: "99.6%",
      downloadUrl: "https://play.google.com",
      overview: "",
    });
    setKeyFeaturesInput("UPI payments & instant transfers\nRuPay Credit Card linking\nUPI Lite micro-payments up to ₹500\nFASTag & utility bill recharges");
    setProsInput("Highest UPI transaction success rate in India.\nExtensive merchant acceptance.\nClean, responsive user interface.");
    setConsInput("Direct wallet cashbacks replaced largely by merchant vouchers.\nSmall platform convenience fees on mobile recharges.");
    setShowModal(true);
  };

  const handleOpenEdit = (app: PaymentAppData) => {
    setIsEditing(true);
    setModalTab("general");
    setFormData({ ...app });
    setKeyFeaturesInput((app.keyFeatures || []).join("\n"));
    setProsInput((app.pros || []).join("\n"));
    setConsInput((app.cons || []).join("\n"));
    setShowModal(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("App Name and Slug are required.");
      return;
    }

    const features = keyFeaturesInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    const pros = prosInput
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const cons = consInput
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      keyFeatures: features,
      pros,
      cons,
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/payment-apps", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { slug: formData.slug, updates: payload } : payload),
      });

      if (res.ok) {
        setShowModal(false);
        setFeedbackMsg(isEditing ? `Updated ${formData.name}` : `Created ${formData.name}`);
        loadApps();
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Operation failed");
      }
    } catch (err) {
      alert("Network error occurred");
    }
  };

  const handleDeleteApp = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete payment app "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/payment-apps?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedbackMsg(`Deleted ${name}`);
        loadApps();
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        alert("Failed to delete payment app");
      }
    } catch (err) {
      alert("Network error while deleting");
    }
  };

  const filtered = apps.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFeature = true;
    if (featureFilter === "UPI_LITE") matchesFeature = a.upiLiteSupport;
    if (featureFilter === "RUPAY") matchesFeature = a.ruPayUpiSupport;
    if (featureFilter === "CREDIT_SCORE") matchesFeature = a.creditScoreCheckFree;

    return matchesSearch && matchesFeature;
  });

  const upiLiteCount = apps.filter((a) => a.upiLiteSupport).length;
  const ruPayCount = apps.filter((a) => a.ruPayUpiSupport).length;
  const scoreCount = apps.filter((a) => a.creditScoreCheckFree).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">UPI &amp; Payment Apps Manager</h1>
          <p className="text-xs text-slate-500 mt-1">Manage payment apps, UPI Lite support, RuPay on UPI integration, and cashback policies.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadApps}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs border border-slate-200 shadow-xs"
            title="Reload payment apps"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Payment App</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold font-mono">
          {feedbackMsg}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Payment Apps</span>
          <span className="text-xl font-black text-slate-900">{apps.length}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">UPI Lite Enabled</span>
          <span className="text-xl font-black text-blue-600">{upiLiteCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">RuPay on UPI Supported</span>
          <span className="text-xl font-black text-emerald-600">{ruPayCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Free Credit Score Check</span>
          <span className="text-xl font-black text-purple-600">{scoreCount}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by app name or developer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <select
          value={featureFilter}
          onChange={(e) => setFeatureFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="ALL">All Features</option>
          <option value="UPI_LITE">UPI Lite Supported</option>
          <option value="RUPAY">RuPay Credit on UPI</option>
          <option value="CREDIT_SCORE">Free Credit Score Check</option>
        </select>
      </div>

      {/* Payment Apps Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold">
                <th className="py-3 px-4">App &amp; Developer</th>
                <th className="py-3 px-3">Downloads Tier</th>
                <th className="py-3 px-3">Play / App Rating</th>
                <th className="py-3 px-3">UPI Lite</th>
                <th className="py-3 px-3">RuPay on UPI</th>
                <th className="py-3 px-3">Referral Bonus</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No payment apps match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <Link
                            href={`/payment-apps/${app.slug}`}
                            target="_blank"
                            className="hover:text-blue-600 font-bold block text-slate-900"
                          >
                            {app.name}
                          </Link>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {app.developer} • <span className="font-mono text-slate-400">/{app.slug}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {app.downloadsTier}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      ⭐ {app.playStoreRating} / {app.appStoreRating}
                    </td>

                    <td className="py-3.5 px-3">
                      {app.upiLiteSupport ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {app.ruPayUpiSupport ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                      {app.referralBonus || "--"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/payment-apps/${app.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit app"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteApp(app.slug, app.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete app"
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
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                  <Smartphone className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {isEditing ? `Edit App: ${formData.name}` : "Add New Payment App"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure UPI features, app store ratings, cashback policy, fees, and pros/cons.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 bg-white overflow-x-auto text-xs font-bold">
              {[
                { id: "general", label: "App & Developer", icon: Building2 },
                { id: "ratings", label: "Ratings & Features", icon: Star },
                { id: "financials", label: "Rewards & Fees", icon: DollarSign },
                { id: "review", label: "Review & Pros/Cons", icon: FileText },
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

            {/* Form */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* TAB 1: APP & DEVELOPER */}
              {modalTab === "general" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">App Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                          setFormData((prev) => ({ ...prev, name, slug: isEditing ? prev.slug : slug }));
                        }}
                        placeholder="e.g. PhonePe UPI & Payments"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Developer / Organization Name</label>
                      <input
                        type="text"
                        value={formData.developer || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, developer: e.target.value }))}
                        placeholder="e.g. PhonePe India Pvt. Ltd. / Google India"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Downloads Tier</label>
                      <input
                        type="text"
                        value={formData.downloadsTier || "100M+ Downloads"}
                        onChange={(e) => setFormData((prev) => ({ ...prev, downloadsTier: e.target.value }))}
                        placeholder="e.g. 500M+ Downloads"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Download / Web URL</label>
                    <input
                      type="url"
                      value={formData.downloadUrl || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, downloadUrl: e.target.value }))}
                      placeholder="https://phonepe.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: RATINGS & FEATURES */}
              {modalTab === "ratings" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Google Play Store Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={formData.playStoreRating || 4.6}
                        onChange={(e) => setFormData((prev) => ({ ...prev, playStoreRating: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Apple App Store Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={formData.appStoreRating || 4.7}
                        onChange={(e) => setFormData((prev) => ({ ...prev, appStoreRating: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">UPI Success Rate</label>
                      <input
                        type="text"
                        value={formData.upiSuccessRate || "99.6%"}
                        onChange={(e) => setFormData((prev) => ({ ...prev, upiSuccessRate: e.target.value }))}
                        placeholder="e.g. 99.7% (Highest)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs">Supported UPI Capabilities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.upiLiteSupport)}
                          onChange={(e) => setFormData((prev) => ({ ...prev, upiLiteSupport: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <div>
                          <strong className="block text-slate-900 font-bold">UPI Lite Support</strong>
                          <span className="text-[10px] text-slate-500">PIN-less micro payments</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.ruPayUpiSupport)}
                          onChange={(e) => setFormData((prev) => ({ ...prev, ruPayUpiSupport: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <div>
                          <strong className="block text-slate-900 font-bold">RuPay Credit Card</strong>
                          <span className="text-[10px] text-slate-500">Link credit card on UPI</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.creditScoreCheckFree)}
                          onChange={(e) => setFormData((prev) => ({ ...prev, creditScoreCheckFree: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <div>
                          <strong className="block text-slate-900 font-bold">Free Credit Score</strong>
                          <span className="text-[10px] text-slate-500">CIBIL / Experian tracker</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCIALS & REWARDS */}
              {modalTab === "financials" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cashback &amp; Rewards Policy Summary</label>
                    <input
                      type="text"
                      value={formData.cashbackPolicy || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cashbackPolicy: e.target.value }))}
                      placeholder="e.g. Scratch cards, merchant discount vouchers, and direct wallet cashbacks."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Joining / Welcome Bonus</label>
                      <input
                        type="text"
                        value={formData.joiningBonus || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, joiningBonus: e.target.value }))}
                        placeholder="e.g. ₹0 or ₹50 on 1st UPI transfer"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Referral Bonus</label>
                      <input
                        type="text"
                        value={formData.referralBonus || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, referralBonus: e.target.value }))}
                        placeholder="e.g. ₹100 / invite"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Recharge Fee</label>
                      <input
                        type="text"
                        value={formData.mobileRechargeFee || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, mobileRechargeFee: e.target.value }))}
                        placeholder="e.g. ₹1 to ₹3 convenience fee"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEW & PROS/CONS */}
              {modalTab === "review" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">App Editorial Overview</label>
                    <textarea
                      rows={4}
                      value={formData.overview || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, overview: e.target.value }))}
                      placeholder="Comprehensive overview of app ecosystem, UPI processing scale, security, and merchant services..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Key Features (1 per line)</label>
                    <textarea
                      rows={4}
                      value={keyFeaturesInput}
                      onChange={(e) => setKeyFeaturesInput(e.target.value)}
                      placeholder="Instant UPI money transfers&#10;RuPay Credit card integration&#10;Utility & FASTag bills payment&#10;Mutual Fund & Insurance marketplace"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 leading-relaxed font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-emerald-700 mb-1">Pros (1 per line)</label>
                      <textarea
                        rows={4}
                        value={prosInput}
                        onChange={(e) => setProsInput(e.target.value)}
                        placeholder="Highest UPI transaction success rate&#10;Extensive offline merchant QR acceptance&#10;Clean, responsive UI"
                        className="w-full px-3 py-2 bg-emerald-50/40 border border-emerald-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-rose-700 mb-1">Cons (1 per line)</label>
                      <textarea
                        rows={4}
                        value={consInput}
                        onChange={(e) => setConsInput(e.target.value)}
                        placeholder="Direct cashbacks replaced largely by vouchers&#10;Platform fees on recharges"
                        className="w-full px-3 py-2 bg-rose-50/40 border border-rose-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-rose-600 leading-relaxed font-sans"
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
                    <span>{isEditing ? "Save App Changes" : "Create App"}</span>
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
