"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  Plus, 
  Edit, 
  CheckCircle2, 
  Star, 
  Search, 
  ArrowLeft,
  X,
  Building2,
  Sparkles,
  Award,
  Trash2
} from "lucide-react";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import { CreditCardData } from "@/types/finance";

export default function AdminCreditCardsPage() {
  const [cards, setCards] = useState<CreditCardData[]>(MOCK_CREDIT_CARDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: "Waived on spends of ₹2.0 Lakh/year",
    rewardRate: "5% Cashback on online spends",
    rating: 4.5,
    minIncomePerMonth: 25000,
    recommendedCreditScore: 750,
    keyPrivileges: "5% Cashback on online shopping, 1% Fuel Surcharge Waiver, Airport Lounge Access",
    pros: "High cashback rate, Wide acceptability across merchants",
    cons: "Annual fee applicable if spend threshold not met",
    isPopular: true
  });

  const filteredCards = cards.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePopularStatus = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPopular: !c.isPopular } : c))
    );
    setToastMessage("Card popularity status updated live!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDeleteCard = (id: string, cardName: string) => {
    if (confirm(`Are you sure you want to remove "${cardName}" from catalog?`)) {
      setCards((prev) => prev.filter((c) => c.id !== id));
      setToastMessage(`Card "${cardName}" deleted from catalog.`);
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.issuer.trim()) {
      alert("Please provide Card Name and Bank Issuer.");
      return;
    }

    const newSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newCard: CreditCardData = {
      id: `cc-${Date.now()}`,
      slug: newSlug || `card-${Date.now()}`,
      name: formData.name,
      issuer: formData.issuer,
      rating: Number(formData.rating),
      category: ["cashback"],
      joiningFee: Number(formData.joiningFee),
      annualFee: Number(formData.annualFee),
      annualFeeWaiverCondition: formData.annualFeeWaiverCondition,
      rewardRate: formData.rewardRate,
      keyPrivileges: formData.keyPrivileges.split(",").map((s) => s.trim()).filter(Boolean),
      minIncomePerMonth: Number(formData.minIncomePerMonth),
      recommendedCreditScore: Number(formData.recommendedCreditScore),
      pros: formData.pros.split(",").map((s) => s.trim()).filter(Boolean),
      cons: formData.cons.split(",").map((s) => s.trim()).filter(Boolean),
      applyUrl: "#",
      isPopular: formData.isPopular
    };

    setCards((prev) => [newCard, ...prev]);
    setIsModalOpen(false);
    setToastMessage(`Success! Credit Card "${formData.name}" added to live catalog!`);
    setTimeout(() => setToastMessage(""), 4500);

    // Reset Form
    setFormData({
      name: "",
      issuer: "",
      joiningFee: 0,
      annualFee: 0,
      annualFeeWaiverCondition: "Waived on spends of ₹2.0 Lakh/year",
      rewardRate: "5% Cashback on online spends",
      rating: 4.5,
      minIncomePerMonth: 25000,
      recommendedCreditScore: 750,
      keyPrivileges: "5% Cashback on online shopping, 1% Fuel Surcharge Waiver, Airport Lounge Access",
      pros: "High cashback rate, Wide acceptability across merchants",
      cons: "Annual fee applicable if spend threshold not met",
      isPopular: true
    });
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
          <span className="text-[10px] text-emerald-700 font-mono uppercase font-bold">LIVE UPDATE BROADCASTED</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <Link href="/admin" className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Credit Cards Control Desk</h1>
          <p className="text-xs text-slate-500">Manage credit card specifications, MCC category exclusions, fee schedules, and popular badges.</p>
        </div>

        <Link
          href="/admin/credit-cards/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Credit Card
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search card name or bank issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <span>Total Cards: <strong className="text-slate-900 font-extrabold">{cards.length}</strong></span>
          <span>•</span>
          <span>Popular Badged: <strong className="text-amber-700 font-extrabold">{cards.filter((c) => c.isPopular).length}</strong></span>
        </div>
      </div>

      {/* Credit Cards Management Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200/80 rounded-xl overflow-hidden">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">Credit Card Name</th>
                <th className="py-3.5 px-4">Bank Issuer</th>
                <th className="py-3.5 px-4">Joining Fee</th>
                <th className="py-3.5 px-4">Annual Fee</th>
                <th className="py-3.5 px-4">Overall Rating</th>
                <th className="py-3.5 px-4">MCC Exclusions</th>
                <th className="py-3.5 px-4">Popular Tag</th>
                <th className="py-3.5 px-4 text-right">Control Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                      <Link href={`/credit-cards/${card.slug}`} className="hover:text-blue-600 hover:underline">
                        {card.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{card.issuer}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    {card.joiningFee === 0 ? "₹0 (Free)" : `₹${card.joiningFee}`}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    {card.annualFee === 0 ? "₹0 (Lifetime)" : `₹${card.annualFee}`}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{card.rating} / 5.0</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      {card.mccExclusions ? `${card.mccExclusions.length} Categories Excluded` : "0 Exclusions"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => togglePopularStatus(card.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                        card.isPopular
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {card.isPopular ? "POPULAR (Active)" : "Standard"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/credit-cards/${card.slug}`}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-all border border-blue-200/80 inline-flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-600" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCard(card.id, card.name)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 transition-all border border-slate-200"
                        title="Delete Card"
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

      {/* Add New Credit Card Interactive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Add New Credit Card</h2>
                  <p className="text-xs text-slate-500">Publish a new card entry to the comparison portal</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Regalia Gold Credit Card"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bank Issuer <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Bank, ICICI Bank, Axis Bank"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Joining Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 for Lifetime Free"
                    value={formData.joiningFee}
                    onChange={(e) => setFormData({ ...formData, joiningFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Annual Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 for Lifetime Free"
                    value={formData.annualFee}
                    onChange={(e) => setFormData({ ...formData, annualFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 to 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Monthly Income (₹)</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={formData.minIncomePerMonth}
                    onChange={(e) => setFormData({ ...formData, minIncomePerMonth: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fee Waiver Condition</label>
                <input
                  type="text"
                  placeholder="e.g. Waived on spends of ₹2.0 Lakh/year"
                  value={formData.annualFeeWaiverCondition}
                  onChange={(e) => setFormData({ ...formData, annualFeeWaiverCondition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reward Rate &amp; Highlights</label>
                <input
                  type="text"
                  placeholder="e.g. 5% Cashback on Amazon, Flipkart & Myntra"
                  value={formData.rewardRate}
                  onChange={(e) => setFormData({ ...formData, rewardRate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Privileges (Comma separated)</label>
                <textarea
                  rows={2}
                  placeholder="5% Cashback, Airport Lounge Access, 1% Fuel Surcharge Waiver"
                  value={formData.keyPrivileges}
                  onChange={(e) => setFormData({ ...formData, keyPrivileges: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="isPopular" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Mark as Popular / Featured Card in Comparison Desk
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save &amp; Publish Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
