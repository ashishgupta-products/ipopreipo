"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Smartphone, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck,
  Star,
  Zap,
  Download,
  Layers,
  HelpCircle,
  FileText,
  DollarSign
} from "lucide-react";
import { PaymentAppData, ReviewFeeDetail, ReviewEligibilityDetail, ReviewFAQ } from "@/types/finance";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";

export default function CreatePaymentAppPage() {
  const router = useRouter();
  const [successToast, setSuccessToast] = useState("");

  // Tabbed Navigation
  const [activeTab, setActiveTab] = useState<"basic" | "features" | "fees" | "eligibility" | "faqs" | "evaluation">("basic");

  // 1. Basic Metadata
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [developer, setDeveloper] = useState("Google LLC");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80");
  const [downloadsTier, setDownloadsTier] = useState("500M+ Downloads");
  const [playStoreRating, setPlayStoreRating] = useState(4.6);
  const [appStoreRating, setAppStoreRating] = useState(4.7);
  const [downloadUrl, setDownloadUrl] = useState("https://play.google.com/store");

  // 2. UPI Feature Flags
  const [upiLiteSupport, setUpiLiteSupport] = useState(true);
  const [ruPayUpiSupport, setRuPayUpiSupport] = useState(true);
  const [creditScoreCheckFree, setCreditScoreCheckFree] = useState(true);
  const [cashbackPolicy, setCashbackPolicy] = useState("Direct bank scratch cards & merchant voucher rewards");

  // 3. Supported Features
  const [keyFeatures, setKeyFeatures] = useState<string[]>([
    "Instant UPI transfers via Mobile Number & QR Code",
    "RuPay Credit Card linking for merchant payments",
    "UPI Lite PIN-less payments under ₹500",
    "Free CIBIL Credit Score check & monitoring"
  ]);
  const [newFeature, setNewFeature] = useState("");

  // 4. Transaction Fee Details Table
  const [feeDetails, setFeeDetails] = useState<ReviewFeeDetail[]>([
    { label: "P2P Bank Transfers", value: "₹0 (Free)" },
    { label: "Merchant QR Payments", value: "₹0 (Free)" },
    { label: "Credit Card Bill Payments", value: "₹0 Convenience Fee" },
    { label: "Mobile Recharge Platform Fee", value: "₹1 - ₹3 per transaction" }
  ]);
  const [newFeeLabel, setNewFeeLabel] = useState("");
  const [newFeeValue, setNewFeeValue] = useState("");

  // 5. System Requirements & Eligibility
  const [eligibility, setEligibility] = useState<ReviewEligibilityDetail[]>([
    { label: "Supported Operating Systems", value: "Android 8.0+ / iOS 14.0+" },
    { label: "Required Documents", value: "Aadhaar / PAN linked Indian Bank Account & Mobile Number" },
    { label: "Age Requirement", value: "18+ years (Indian Resident)" }
  ]);
  const [newEligibilityLabel, setNewEligibilityLabel] = useState("");
  const [newEligibilityValue, setNewEligibilityValue] = useState("");

  // 6. FAQs List
  const [faqs, setFaqs] = useState<ReviewFAQ[]>([
    { question: "Is RuPay Credit Card payment free on this UPI app?", answer: "Yes, merchant UPI transactions using RuPay credit cards carry ₹0 MDR for transactions under ₹2,000." },
    { question: "What is the daily transaction limit for UPI Lite?", answer: "UPI Lite allows up to ₹500 per transaction without entering a UPI PIN, with a maximum wallet balance of ₹2,000." }
  ]);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  // 7. Evaluation & Overview
  const [overview, setOverview] = useState("Leading UPI payment app in India with seamless bank transfers, bill payments, and RuPay credit card linking.");
  const [pros, setPros] = useState<string[]>([
    "High transaction success rate on NPCI network",
    "Clean UI with fast biometric authentication",
    "Zero hidden fees on standard UPI transfers"
  ]);
  const [newPro, setNewPro] = useState("");

  const [cons, setCons] = useState<string[]>([
    "Occasional server downtime during peak bank hours",
    "Rewards now lean towards merchant discount vouchers"
  ]);
  const [newCon, setNewCon] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setKeyFeatures([...keyFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== idx));
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

  const handleAddEligibility = () => {
    if (newEligibilityLabel.trim() && newEligibilityValue.trim()) {
      setEligibility([...eligibility, { label: newEligibilityLabel.trim(), value: newEligibilityValue.trim() }]);
      setNewEligibilityLabel("");
      setNewEligibilityValue("");
    }
  };

  const handleRemoveEligibility = (idx: number) => {
    setEligibility(eligibility.filter((_, i) => i !== idx));
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

    if (!name.trim() || !developer.trim()) {
      alert("Payment App Name and Developer Name are required!");
      return;
    }

    const newApp: PaymentAppData = {
      id: `pay-${Date.now()}`,
      slug: slug || `app-${Date.now()}`,
      name,
      developer,
      logoUrl,
      downloadsTier,
      playStoreRating: Number(playStoreRating),
      appStoreRating: Number(appStoreRating),
      upiLiteSupport,
      ruPayUpiSupport,
      creditScoreCheckFree,
      cashbackPolicy,
      keyFeatures,
      feeDetails,
      eligibility,
      faqs,
      pros,
      cons,
      downloadUrl,
      overview
    };

    MOCK_PAYMENT_APPS.unshift(newApp);

    setSuccessToast(`Payment App "${name}" published successfully! Redirecting...`);
    setTimeout(() => {
      router.push("/admin/payment-apps");
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
          <Link href="/admin/payment-apps" className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Payment Apps Catalog
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Payment App Specification</h1>
          <p className="text-xs text-slate-500">Configure complete product specs, transaction fee tables, FAQs, system eligibility, and pros/cons.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/payment-apps"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs shadow-blue-600/20"
          >
            <Save className="w-4 h-4" /> Save &amp; Publish Payment App
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
          <Smartphone className="w-3.5 h-3.5" /> 1. App Identity
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "features" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> 2. UPI Features &amp; Flags
        </button>
        <button
          onClick={() => setActiveTab("fees")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "fees" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> 3. Fee &amp; Platform Charges Table
        </button>
        <button
          onClick={() => setActiveTab("eligibility")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "eligibility" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> 4. Requirements &amp; Eligibility
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "faqs" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" /> 5. FAQs List
        </button>
        <button
          onClick={() => setActiveTab("evaluation")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "evaluation" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> 6. Overview &amp; Pros/Cons
        </button>
      </div>

      {/* Main Form Work Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: BASIC METADATA */}
        {activeTab === "basic" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">App Basics &amp; Store Ratings</h2>
              <p className="text-xs text-slate-500">App identity, developer metadata, and store downloads</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Payment App Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Pay, PhonePe, Paytm, CRED"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">SEO Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. google-pay"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Developer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google LLC, PhonePe India Ltd, One97 Communications"
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Downloads Tier</label>
                <input
                  type="text"
                  placeholder="e.g. 500M+ Downloads"
                  value={downloadsTier}
                  onChange={(e) => setDownloadsTier(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Google PlayStore Rating (1 to 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={playStoreRating}
                  onChange={(e) => setPlayStoreRating(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Apple AppStore Rating (1 to 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={appStoreRating}
                  onChange={(e) => setAppStoreRating(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1.5">App Logo URL</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1.5">Official Download Page Link</label>
                <input
                  type="url"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEATURES & FLAGS */}
        {activeTab === "features" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">UPI Capabilities &amp; Feature Flags</h2>
              <p className="text-xs text-slate-500">Toggle RuPay credit card linking, UPI Lite, and free credit score check support</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-900 block">RuPay Credit Card on UPI</span>
                <p className="text-[11px] text-slate-500">Allows linking RuPay credit cards to pay QR merchants</p>
                <button
                  type="button"
                  onClick={() => setRuPayUpiSupport(!ruPayUpiSupport)}
                  className={`w-full py-2 rounded-lg font-bold transition-all ${
                    ruPayUpiSupport ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {ruPayUpiSupport ? "SUPPORTED ✓" : "NOT SUPPORTED"}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-900 block">UPI Lite Support</span>
                <p className="text-[11px] text-slate-500">Pin-less instant small payments under ₹500</p>
                <button
                  type="button"
                  onClick={() => setUpiLiteSupport(!upiLiteSupport)}
                  className={`w-full py-2 rounded-lg font-bold transition-all ${
                    upiLiteSupport ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {upiLiteSupport ? "ACTIVE ✓" : "DISABLED"}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-900 block">Free Credit Score Check</span>
                <p className="text-[11px] text-slate-500">Provides monthly free CIBIL / Experian score report</p>
                <button
                  type="button"
                  onClick={() => setCreditScoreCheckFree(!creditScoreCheckFree)}
                  className={`w-full py-2 rounded-lg font-bold transition-all ${
                    creditScoreCheckFree ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {creditScoreCheckFree ? "FREE SCORE INCLUDED ✓" : "NO SCORE CHECK"}
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Cashback &amp; Reward Policy Overview</label>
                <input
                  type="text"
                  placeholder="e.g. Scratch cards with direct bank cashback & merchant vouchers"
                  value={cashbackPolicy}
                  onChange={(e) => setCashbackPolicy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              {/* Supported Features List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800">Supported Ecosystem Features List</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type feature e.g. 'Split Bills with friends' and press Add"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddFeature(); } }}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="space-y-2">
                  {keyFeatures.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-rose-600 hover:text-rose-800 p-1"
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

        {/* TAB 3: FEE & PLATFORM CHARGES TABLE MANAGER */}
        {activeTab === "fees" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Transaction Fee &amp; Platform Charges Table</h2>
              <p className="text-xs text-slate-500">Configure transaction categories and corresponding fee charges displayed on the blog page</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Category Name e.g. 'P2P Bank Transfers'"
                  value={newFeeLabel}
                  onChange={(e) => setNewFeeLabel(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Fee Charge e.g. '₹0 (Free)' or '1.5%'"
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
                      <th className="py-3 px-4">Transaction Category</th>
                      <th className="py-3 px-4">Fee Charge</th>
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

        {/* TAB 4: SYSTEM REQUIREMENTS & ELIGIBILITY */}
        {activeTab === "eligibility" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">System Requirements &amp; Eligibility</h2>
              <p className="text-xs text-slate-500">Define OS support, required verification documents, and age limits</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Requirement Label e.g. 'Supported OS'"
                  value={newEligibilityLabel}
                  onChange={(e) => setNewEligibilityLabel(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Specification Value e.g. 'Android 8.0+ / iOS 14.0+'"
                    value={newEligibilityValue}
                    onChange={(e) => setNewEligibilityValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddEligibility(); } }}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddEligibility}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs whitespace-nowrap"
                  >
                    Add Spec
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {eligibility.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <strong className="text-slate-900 block font-bold">{item.label}</strong>
                      <span className="text-slate-600">{item.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEligibility(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FAQS MANAGER */}
        {activeTab === "faqs" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Frequently Asked Questions (FAQs) Manager</h2>
              <p className="text-xs text-slate-500">Add common user questions and answers for the blog review page</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  placeholder="Question e.g. 'Is RuPay Credit Card payment free on this UPI app?'"
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

        {/* TAB 6: OVERVIEW & PROS/CONS */}
        {activeTab === "evaluation" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">App Overview &amp; Evaluation List</h2>
              <p className="text-xs text-slate-500">Full editorial analysis and pros/cons bullet points</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">App Overview Summary</label>
                <textarea
                  rows={3}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              {/* Pros List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-emerald-800">Pros List (App Advantages)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type positive point e.g. 'High transaction success rate' and press Add"
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
                <label className="block font-bold text-rose-800">Cons List (App Limitations)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type limitation point e.g. 'Peak hour server delay' and press Add"
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
            href="/admin/payment-apps"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
          >
            Back to Catalog
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20"
          >
            <Save className="w-4 h-4" /> Save &amp; Publish Payment App Entry
          </button>
        </div>
      </form>
    </div>
  );
}
