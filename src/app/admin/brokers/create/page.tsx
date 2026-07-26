"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Star, 
  Layers, 
  HelpCircle, 
  FileText, 
  DollarSign, 
  BarChart3,
  PieChart
} from "lucide-react";
import { BrokerData, BrokerFeeDetail, BrokerFAQ } from "@/types/ipo";
import { MOCK_BROKERS } from "@/data/mockBrokers";

export default function CreateBrokerPage() {
  const router = useRouter();
  const [successToast, setSuccessToast] = useState("");

  // Tabbed Navigation
  const [activeTab, setActiveTab] = useState<"basic" | "products" | "rates" | "feeTable" | "ipoMethod" | "faqs" | "evaluation">("basic");

  // 1. Basic Metadata
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"Discount Broker" | "Full-Service Broker">("Discount Broker");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80");
  const [rating, setRating] = useState(4.8);
  const [activeClientsNse, setActiveClientsNse] = useState("7.5 Million+ Active Traders");
  const [openAccountUrl, setOpenAccountUrl] = useState("https://zerodha.com/open-account");

  // 2. Product Offerings (Product Basket)
  const availableSegments = ["Equity", "Commodity", "Currency", "Futures", "Options", "Mutual Funds", "IPOs"];
  const [productOfferings, setProductOfferings] = useState<string[]>([
    "Equity", "Commodity", "Currency", "Futures", "Options", "Mutual Funds", "IPOs"
  ]);

  // 3. Core Brokerage Rates
  const [equityDeliveryFee, setEquityDeliveryFee] = useState("₹0 (Free Lifetime)");
  const [equityIntradayFee, setEquityIntradayFee] = useState("0.03% or ₹20/order whichever is lower");
  const [fnOFee, setFnOFee] = useState("Flat ₹20 per executed order");
  const [dematAnualFee, setDematAnualFee] = useState("₹300 / year (Waived for BSDA)");
  const [accountOpeningFee, setAccountOpeningFee] = useState("₹200 (Equity) + ₹100 (Commodity)");

  // 4. IPO Infrastructure Method
  const [ipoApplicationMethod, setIpoApplicationMethod] = useState("UPI 2.0 Auto-Mandate via Kite Mobile App & Web Portal");

  // 5. Brokerage Fee Table Manager
  const [feeDetails, setFeeDetails] = useState<BrokerFeeDetail[]>([
    { label: "Equity Delivery Brokerage", value: "₹0 (Free)" },
    { label: "Equity Intraday Brokerage", value: "0.03% or ₹20/order" },
    { label: "Futures & Options (F&O)", value: "Flat ₹20/order" },
    { label: "Demat Maintenance Charge (AMC)", value: "₹300 + GST / year" },
    { label: "Call & Trade Charge", value: "₹50 per executed order" },
    { label: "DP Charges on Sell Order", value: "₹13.5 + GST per scrip" }
  ]);
  const [newFeeLabel, setNewFeeLabel] = useState("");
  const [newFeeValue, setNewFeeValue] = useState("");

  // 6. FAQs List Manager
  const [faqs, setFaqs] = useState<BrokerFAQ[]>([
    { question: "Is equity delivery really free on this broker?", answer: "Yes, there is ₹0 brokerage charge for buying and holding shares in delivery." },
    { question: "How fast is the IPO application process via UPI?", answer: "IPO applications take under 60 seconds with instant UPI 2.0 mandate blocking." }
  ]);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  // 7. Evaluation & Overview
  const [overview, setOverview] = useState("India's leading discount stock broker offering ultra-low brokerage charges and advanced trading platforms.");
  const [pros, setPros] = useState<string[]>([
    "Pioneer of zero-brokerage equity delivery investing",
    "Ultra-fast trading app with advanced charts & indicators",
    "Free financial education & mutual fund platforms"
  ]);
  const [newPro, setNewPro] = useState("");

  const [cons, setCons] = useState<string[]>([
    "No relationship manager or tip calls provided",
    "Small initial account opening fee"
  ]);
  const [newCon, setNewCon] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const toggleProductOffering = (seg: string) => {
    if (productOfferings.includes(seg)) {
      setProductOfferings(productOfferings.filter((p) => p !== seg));
    } else {
      setProductOfferings([...productOfferings, seg]);
    }
  };

  const handleAddFeeDetail = () => {
    if (newFeeLabel.trim() && newFeeValue.trim()) {
      setFeeDetails([...feeDetails, { label: newFeeLabel.trim(), value: newFeeValue.trim() }]);
      setNewFeeLabel("");
      setNewFeeValue("");
    }
  };

  const handleRemoveFeeDetail = (idx: number) => {
    setFeeDetails(feeDetails.filter((_, i) => i !== idx));
  };

  const handleAddFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      setFaqs([...faqs, { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }]);
      setNewFaqQuestion("");
      setNewFaqAnswer("");
    }
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleAddPro = () => {
    if (newPro.trim()) {
      setPros([...pros, newPro.trim()]);
      setNewPro("");
    }
  };

  const handleRemovePro = (idx: number) => {
    setPros(pros.filter((_, i) => i !== idx));
  };

  const handleAddCon = () => {
    if (newCon.trim()) {
      setCons([...cons, newCon.trim()]);
      setNewCon("");
    }
  };

  const handleRemoveCon = (idx: number) => {
    setCons(cons.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Broker Name is required!");
      return;
    }

    const newBroker: BrokerData = {
      id: `brk-${Date.now()}`,
      slug: slug || `broker-${Date.now()}`,
      name,
      type,
      logoUrl,
      equityDeliveryFee,
      equityIntradayFee,
      fnOFee,
      dematAnualFee,
      accountOpeningFee,
      ipoApplicationMethod,
      rating: Number(rating),
      activeClientsNse,
      openAccountUrl,
      overview,
      productOfferings,
      feeDetails,
      faqs,
      pros,
      cons
    };

    MOCK_BROKERS.unshift(newBroker);

    setSuccessToast(`Stock Broker "${name}" published successfully! Redirecting...`);
    setTimeout(() => {
      router.push("/admin/brokers");
    }, 2000);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans pb-16">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono font-bold">STATUS: PUBLISHED LIVE</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <Link href="/admin/brokers" className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Stock Brokers Catalog
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Stock Broker Specification</h1>
          <p className="text-xs text-slate-500">Configure brokerage fees, product offerings, F&amp;O charges, IPO infrastructure, and review text.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/brokers"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs shadow-blue-600/20"
          >
            <Save className="w-4 h-4" /> Save &amp; Publish Stock Broker
          </button>
        </div>
      </div>

      {/* Tab Navigation Controls */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab("basic")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "basic" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> 1. Broker Basics
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "products" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <PieChart className="w-3.5 h-3.5" /> 2. Product Offerings
        </button>
        <button
          onClick={() => setActiveTab("rates")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "rates" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" /> 3. Core Rates
        </button>
        <button
          onClick={() => setActiveTab("feeTable")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "feeTable" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> 4. Fee Table
        </button>
        <button
          onClick={() => setActiveTab("ipoMethod")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "ipoMethod" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> 5. IPO Infrastructure
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "faqs" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" /> 6. FAQs List
        </button>
        <button
          onClick={() => setActiveTab("evaluation")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "evaluation" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> 7. Overview &amp; Pros/Cons
        </button>
      </div>

      {/* Main Form Work Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: BASIC METADATA */}
        {activeTab === "basic" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Broker Basics &amp; Rating</h2>
              <p className="text-xs text-slate-500">Broker identity, classification type, and NSE active client count</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Broker Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zerodha (Kite), Groww, Angel One, Upstox"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">SEO Permalink Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. zerodha"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Broker Classification Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "Discount Broker" | "Full-Service Broker")}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                >
                  <option value="Discount Broker">Discount Broker</option>
                  <option value="Full-Service Broker">Full-Service Broker</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Active NSE Clients Count</label>
                <input
                  type="text"
                  placeholder="e.g. 7.5 Million+ Active Traders"
                  value={activeClientsNse}
                  onChange={(e) => setActiveClientsNse(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Overall Rating (1 to 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Broker Logo URL</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1.5">Open Account Affiliate Link</label>
                <input
                  type="url"
                  value={openAccountUrl}
                  onChange={(e) => setOpenAccountUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT OFFERINGS (PRODUCT BASKET) */}
        {activeTab === "products" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Product Offerings (Product Basket)</h2>
              <p className="text-xs text-slate-500">
                Product Basket: Select the segments in which investors can trade (Equity, Commodity, Currency, Futures, Options)
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              {availableSegments.map((seg) => {
                const isSelected = productOfferings.includes(seg);
                return (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => toggleProductOffering(seg)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-500 font-medium hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-sm font-extrabold">{seg}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${
                      isSelected ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {isSelected ? "SUPPORTED ✓" : "DISABLED"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CORE BROKERAGE RATES */}
        {activeTab === "rates" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Core Brokerage Rates Summary</h2>
              <p className="text-xs text-slate-500">Headline rates shown in comparison cards and summary headers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Equity Delivery Brokerage</label>
                <input
                  type="text"
                  placeholder="e.g. ₹0 (Free Lifetime)"
                  value={equityDeliveryFee}
                  onChange={(e) => setEquityDeliveryFee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Equity Intraday Brokerage</label>
                <input
                  type="text"
                  placeholder="e.g. 0.03% or ₹20/order"
                  value={equityIntradayFee}
                  onChange={(e) => setEquityIntradayFee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Futures &amp; Options (F&amp;O) Brokerage</label>
                <input
                  type="text"
                  placeholder="e.g. Flat ₹20 per executed order"
                  value={fnOFee}
                  onChange={(e) => setFnOFee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Demat Annual Maintenance Charge (AMC)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹300 / year"
                  value={dematAnualFee}
                  onChange={(e) => setDematAnualFee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1.5">Account Opening Fee</label>
                <input
                  type="text"
                  placeholder="e.g. ₹200 (Equity) + ₹100 (Commodity)"
                  value={accountOpeningFee}
                  onChange={(e) => setAccountOpeningFee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BROKERAGE FEE BREAKDOWN TABLE */}
        {activeTab === "feeTable" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Brokerage Charges &amp; Demat Fees Table Manager</h2>
              <p className="text-xs text-slate-500">Configure comprehensive charge category lines displayed on the public review page</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Charge Category e.g. 'Call & Trade Charge'"
                  value={newFeeLabel}
                  onChange={(e) => setNewFeeLabel(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Rate e.g. '₹50 per executed order'"
                    value={newFeeValue}
                    onChange={(e) => setNewFeeValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddFeeDetail(); } }}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeeDetail}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs whitespace-nowrap"
                  >
                    Add Charge
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200/80 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Charge Category</th>
                      <th className="py-3 px-4">Brokerage Rate</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {feeDetails.map((f, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{f.label}</td>
                        <td className="py-3 px-4 font-extrabold text-blue-700">{f.value}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveFeeDetail(idx)}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: IPO INFRASTRUCTURE */}
        {activeTab === "ipoMethod" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">IPO Bidding &amp; Application Infrastructure</h2>
              <p className="text-xs text-slate-500">Configure UPI mandate auto-approval and ASBA bidding mechanisms</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">IPO Application Method Explanation</label>
                <textarea
                  rows={3}
                  value={ipoApplicationMethod}
                  onChange={(e) => setIpoApplicationMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FAQS MANAGER */}
        {activeTab === "faqs" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Frequently Asked Questions (FAQs) Manager</h2>
              <p className="text-xs text-slate-500">Add common investor questions and answers for the broker review page</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  placeholder="Question e.g. 'Is equity delivery really free on this broker?'"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                />
                <textarea
                  rows={2}
                  placeholder="Answer explanation..."
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  Add FAQ Item
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between items-start">
                      <strong className="text-slate-900 font-bold block text-xs">Q: {faq.question}</strong>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="text-rose-600 hover:text-rose-800 p-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-600 text-xs">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: OVERVIEW & PROS/CONS */}
        {activeTab === "evaluation" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Broker Overview &amp; Evaluation List</h2>
              <p className="text-xs text-slate-500">Full editorial review summary and pros/cons bullet points</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Broker Overview Summary</label>
                <textarea
                  rows={3}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              {/* Pros List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-emerald-800">Pros List (Broker Advantages)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type positive point e.g. 'Pioneer of zero brokerage delivery' and press Add"
                    value={newPro}
                    onChange={(e) => setNewPro(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddPro}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Add Pro
                  </button>
                </div>

                <div className="space-y-2">
                  {pros.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                      <span className="font-bold text-emerald-900 text-xs">✓ {p}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePro(idx)}
                        className="text-emerald-700 hover:text-emerald-900 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-rose-800">Cons List (Broker Limitations)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type limitation point e.g. 'No advisory call tips' and press Add"
                    value={newCon}
                    onChange={(e) => setNewCon(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddCon}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    Add Con
                  </button>
                </div>

                <div className="space-y-2">
                  {cons.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex justify-between items-center">
                      <span className="font-bold text-rose-900 text-xs">✗ {c}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCon(idx)}
                        className="text-rose-700 hover:text-rose-900 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex justify-between items-center text-xs">
          <Link
            href="/admin/brokers"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
          >
            Back to Catalog
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20"
          >
            <Save className="w-4 h-4" /> Save &amp; Publish Stock Broker
          </button>
        </div>
      </form>
    </div>
  );
}
