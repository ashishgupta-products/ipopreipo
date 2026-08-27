"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CreditCard, 
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
  DollarSign,
  ShieldCheck,
  Building2,
  Award,
  Zap,
  Layers,
  FileText,
  Percent,
  Check
} from "lucide-react";
import { CreditCardData, CardCategory } from "@/types/finance";

const ALL_CATEGORIES: { id: CardCategory; label: string }[] = [
  { id: "cashback", label: "Cashback" },
  { id: "rewards", label: "Rewards" },
  { id: "travel", label: "Travel & Lounge" },
  { id: "fuel", label: "Fuel" },
  { id: "lifetime_free", label: "Lifetime Free" },
];

export default function AdminCreditCardsPage() {
  const [cards, setCards] = useState<CreditCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalTab, setModalTab] = useState<"general" | "fees" | "rewards" | "review">("general");
  const [formData, setFormData] = useState<Partial<CreditCardData>>({});
  const [privilegesInput, setPrivilegesInput] = useState("");
  const [prosInput, setProsInput] = useState("");
  const [consInput, setConsInput] = useState("");

  const loadCards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/credit-cards");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCards(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load credit cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setModalTab("general");
    setFormData({
      issuer: "HDFC Bank",
      category: ["cashback", "rewards"],
      rating: 4.6,
      joiningFee: 500,
      annualFee: 500,
      annualFeeWaiverCondition: "Waived on spends of ₹1.0 Lakh/year",
      rewardRate: "5% Cashback on Top Merchants",
      minIncomePerMonth: 25000,
      recommendedCreditScore: 750,
      applyUrl: "https://bank.com",
      isPopular: false,
      overview: "",
    });
    setPrivilegesInput("5% Cashback on Amazon & Flipkart\n4 Airport Lounge visits per year\n1% Fuel Surcharge waiver across India");
    setProsInput("Highest cashback rate on popular apps.\nEasy annual fee waiver on spend thresholds.");
    setConsInput("Cashback is credited as points requiring manual redemption.");
    setShowModal(true);
  };

  const handleOpenEdit = (card: CreditCardData) => {
    setIsEditing(true);
    setModalTab("general");
    setFormData({ ...card });
    setPrivilegesInput((card.keyPrivileges || []).join("\n"));
    setProsInput((card.pros || []).join("\n"));
    setConsInput((card.cons || []).join("\n"));
    setShowModal(true);
  };

  const toggleCategory = (catId: CardCategory) => {
    const current = formData.category || [];
    if (current.includes(catId)) {
      setFormData((prev) => ({ ...prev, category: current.filter((c) => c !== catId) }));
    } else {
      setFormData((prev) => ({ ...prev, category: [...current, catId] }));
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("Card Name and Slug are required.");
      return;
    }

    const privileges = privilegesInput
      .split("\n")
      .map((p) => p.trim())
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
      keyPrivileges: privileges,
      pros,
      cons,
      category: formData.category && formData.category.length > 0 ? formData.category : ["rewards"],
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/credit-cards", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { slug: formData.slug, updates: payload } : payload),
      });

      if (res.ok) {
        setShowModal(false);
        setFeedbackMsg(isEditing ? `Updated ${formData.name}` : `Created ${formData.name}`);
        loadCards();
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Operation failed");
      }
    } catch (err) {
      alert("Network error occurred");
    }
  };

  const handleDeleteCard = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete credit card "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/credit-cards?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedbackMsg(`Deleted ${name}`);
        loadCards();
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        alert("Failed to delete credit card");
      }
    } catch (err) {
      alert("Network error while deleting");
    }
  };

  const filtered = cards.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" ||
      (categoryFilter === "FREE" && c.joiningFee === 0) ||
      c.category.some((cat) => cat.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const lifetimeFreeCount = cards.filter((c) => c.joiningFee === 0).length;
  const popularCount = cards.filter((c) => c.isPopular).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Credit Card Offers &amp; Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage credit cards, cashback reward tiers, joining fees, and application links.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCards}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs border border-slate-200 shadow-xs"
            title="Reload credit cards"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Credit Card</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold font-mono">
          {feedbackMsg}
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Credit Cards</span>
          <span className="text-xl font-black text-slate-900">{cards.length}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Lifetime Free (₹0 Fee)</span>
          <span className="text-xl font-black text-emerald-600">{lifetimeFreeCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Featured / Popular</span>
          <span className="text-xl font-black text-purple-600">{popularCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Top Rating</span>
          <span className="text-xl font-black text-amber-500">⭐ 4.8 / 5.0</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by card name, bank issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="ALL">All Categories</option>
          <option value="FREE">Lifetime Free Only (₹0 Fee)</option>
          <option value="cashback">Cashback Cards</option>
          <option value="rewards">Rewards Cards</option>
          <option value="travel">Travel &amp; Lounge Cards</option>
          <option value="fuel">Fuel Cards</option>
          <option value="shopping">Shopping Cards</option>
        </select>
      </div>

      {/* Credit Cards Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold">
                <th className="py-3 px-4">Card Name &amp; Issuer</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Joining Fee</th>
                <th className="py-3 px-3 text-right">Annual Fee</th>
                <th className="py-3 px-3">Reward Rate</th>
                <th className="py-3 px-3 text-center">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No credit cards match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <Link
                            href={`/credit-cards/${card.slug}`}
                            target="_blank"
                            className="hover:text-blue-600 font-bold block text-slate-900"
                          >
                            {card.name}
                          </Link>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {card.issuer} • <span className="font-mono text-slate-400">/{card.slug}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {card.category.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 capitalize"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      {card.joiningFee === 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Free
                        </span>
                      ) : (
                        <span className="text-slate-700">₹{card.joiningFee}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      {card.annualFee === 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Free
                        </span>
                      ) : (
                        <span className="text-slate-700">₹{card.annualFee}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium max-w-xs truncate">
                      {card.rewardRate}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-amber-600">
                      ⭐ {card.rating}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/credit-cards/${card.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(card)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit card"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.slug, card.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete card"
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
                  <CreditCard className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {isEditing ? `Edit Card: ${formData.name}` : "Add New Credit Card"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure fees, reward percentage, waiver rules, categories, and pros/cons.</p>
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
                { id: "general", label: "General & Issuer", icon: Building2 },
                { id: "fees", label: "Fees & Eligibility", icon: DollarSign },
                { id: "rewards", label: "Rewards & Perks", icon: Award },
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
              {/* TAB 1: GENERAL & ISSUER */}
              {modalTab === "general" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Card Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                          setFormData((prev) => ({ ...prev, name, slug: isEditing ? prev.slug : slug }));
                        }}
                        placeholder="e.g. HDFC Millennia Credit Card"
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
                      <label className="block font-bold text-slate-700 mb-1">Bank Issuer</label>
                      <input
                        type="text"
                        value={formData.issuer || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
                        placeholder="e.g. HDFC Bank / SBI Card / ICICI Bank"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Editorial Rating (1 to 5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={formData.rating || 4.5}
                        onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Application URL</label>
                      <input
                        type="url"
                        value={formData.applyUrl || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, applyUrl: e.target.value }))}
                        placeholder="https://hdfcbank.com/..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Card Categories (Select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_CATEGORIES.map((cat) => {
                        const isSelected = (formData.category || []).includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="checkbox"
                      id="popCardCheck"
                      checked={Boolean(formData.isPopular)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isPopular: e.target.checked }))}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                    />
                    <label htmlFor="popCardCheck" className="text-slate-800 font-bold cursor-pointer">
                      Feature in Popular Cards Grid
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: FEES & ELIGIBILITY */}
              {modalTab === "fees" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Joining Fee (₹) (0 for Lifetime Free)</label>
                      <input
                        type="number"
                        value={formData.joiningFee !== undefined ? formData.joiningFee : 500}
                        onChange={(e) => setFormData((prev) => ({ ...prev, joiningFee: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Annual / Renewal Fee (₹) (0 for Free)</label>
                      <input
                        type="number"
                        value={formData.annualFee !== undefined ? formData.annualFee : 500}
                        onChange={(e) => setFormData((prev) => ({ ...prev, annualFee: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Annual Fee Waiver Rule / Condition</label>
                    <input
                      type="text"
                      value={formData.annualFeeWaiverCondition || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, annualFeeWaiverCondition: e.target.value }))}
                      placeholder="e.g. Waived on spending ₹1,00,000 in previous anniversary year"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Min Monthly Income (₹)</label>
                      <input
                        type="number"
                        value={formData.minIncomePerMonth || 25000}
                        onChange={(e) => setFormData((prev) => ({ ...prev, minIncomePerMonth: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Recommended CIBIL / Credit Score</label>
                      <input
                        type="number"
                        value={formData.recommendedCreditScore || 750}
                        onChange={(e) => setFormData((prev) => ({ ...prev, recommendedCreditScore: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REWARDS & PERKS */}
              {modalTab === "rewards" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reward Rate Summary Header</label>
                    <input
                      type="text"
                      value={formData.rewardRate || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rewardRate: e.target.value }))}
                      placeholder="e.g. 5% Cashback on Amazon & Flipkart, 1% on all other spends"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Key Privileges &amp; Features (1 per line)</label>
                    <textarea
                      rows={6}
                      value={privilegesInput}
                      onChange={(e) => setPrivilegesInput(e.target.value)}
                      placeholder="5% Cashback on top partner merchants&#10;4 Complimentary domestic airport lounge visits&#10;1% Fuel surcharge waiver across all pumps in India"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEW & PROS/CONS */}
              {modalTab === "review" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Editorial Card Overview</label>
                    <textarea
                      rows={4}
                      value={formData.overview || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, overview: e.target.value }))}
                      placeholder="Detailed editorial review explaining who this card is ideal for and key benefits..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-emerald-700 mb-1">Pros (1 per line)</label>
                      <textarea
                        rows={5}
                        value={prosInput}
                        onChange={(e) => setProsInput(e.target.value)}
                        placeholder="Highest cashback on online platforms&#10;Complimentary lounge access&#10;Easy fee waiver"
                        className="w-full px-3 py-2 bg-emerald-50/40 border border-emerald-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-rose-700 mb-1">Cons (1 per line)</label>
                      <textarea
                        rows={5}
                        value={consInput}
                        onChange={(e) => setConsInput(e.target.value)}
                        placeholder="Points require manual redemption&#10;Monthly cashback cap on partner merchants"
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
                    <span>{isEditing ? "Save Card Changes" : "Create Card"}</span>
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
