"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck,
  Star,
  FileText,
  DollarSign,
  Award,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { CreditCardData, CardCategory } from "@/types/finance";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";

export default function CreateCreditCardPage() {
  const router = useRouter();
  const [successToast, setSuccessToast] = useState("");

  // Tabbed Navigation in Form
  const [activeTab, setActiveTab] = useState<"basic" | "features" | "fees" | "rewards" | "eligibility" | "review">("basic");

  // 1. Basic Metadata State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [issuer, setIssuer] = useState("HDFC Bank");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80");
  const [selectedCategories, setSelectedCategories] = useState<CardCategory[]>(["cashback"]);
  const [isPopular, setIsPopular] = useState(true);

  // 2. Features and Benefits State
  const availableFeatureCategories = [
    "Welcome Bonus", "Travel", "Fuel", "Rewards", "Shopping", "Cashback", "Dining", "Insurance", "Interest"
  ];
  const [featuresAndBenefits, setFeaturesAndBenefits] = useState<string[]>([
    "Welcome Bonus", "Travel", "Fuel", "Rewards", "Shopping", "Cashback", "Dining", "Insurance", "Interest"
  ]);

  // 3. Fees & Charges State
  const [joiningFee, setJoiningFee] = useState(1000);
  const [annualFee, setAnnualFee] = useState(1000);
  const [annualFeeWaiverCondition, setAnnualFeeWaiverCondition] = useState("Waived on annual spends of ₹1,00,000");
  const [applyUrl, setApplyUrl] = useState("https://www.hdfcbank.com/credit-cards");

  // 4. Rewards & Privileges
  const [rewardRate, setRewardRate] = useState("5% Cashback on Amazon, Flipkart & Myntra");
  const [keyPrivileges, setKeyPrivileges] = useState<string[]>([
    "5% Cashback on major online merchants",
    "1% Unlimited Cashback on all other online & offline spends",
    "1% Fuel Surcharge Waiver up to ₹250/mo",
    "4 Complimentary Airport Lounge Access Visits per year"
  ]);
  const [newPrivilege, setNewPrivilege] = useState("");

  // 5. Eligibility & Target Audience
  const [minIncomePerMonth, setMinIncomePerMonth] = useState(25000);
  const [recommendedCreditScore, setRecommendedCreditScore] = useState(750);
  const [rating, setRating] = useState(4.8);

  // 6. Review Text
  const [overview, setOverview] = useState("Premium cashback credit card offering high reward rates on e-commerce, dining, and utility spending.");
  const [pros, setPros] = useState<string[]>(["High cashback rate", "Easy fee waiver", "Lounge access"]);
  const [newPro, setNewPro] = useState("");
  const [cons, setCons] = useState<string[]>(["Monthly cashback capping", "Higher finance charges"]);
  const [newCon, setNewCon] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const toggleFeatureCategory = (cat: string) => {
    if (featuresAndBenefits.includes(cat)) {
      setFeaturesAndBenefits(featuresAndBenefits.filter((f) => f !== cat));
    } else {
      setFeaturesAndBenefits([...featuresAndBenefits, cat]);
    }
  };

  const handleAddPrivilege = () => {
    if (newPrivilege.trim()) {
      setKeyPrivileges([...keyPrivileges, newPrivilege.trim()]);
      setNewPrivilege("");
    }
  };

  const handleRemovePrivilege = (idx: number) => {
    setKeyPrivileges(keyPrivileges.filter((_, i) => i !== idx));
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

    if (!name.trim() || !issuer.trim()) {
      alert("Card Name and Issuer Bank are required!");
      return;
    }

    const newCard: CreditCardData = {
      id: `card-${Date.now()}`,
      slug: slug || `card-${Date.now()}`,
      name,
      issuer,
      logoUrl,
      category: selectedCategories,
      rating: Number(rating),
      joiningFee: Number(joiningFee),
      annualFee: Number(annualFee),
      annualFeeWaiverCondition,
      rewardRate,
      keyPrivileges,
      minIncomePerMonth: Number(minIncomePerMonth),
      recommendedCreditScore: Number(recommendedCreditScore),
      pros,
      cons,
      applyUrl,
      isPopular,
      overview,
      featuresAndBenefits
    };

    MOCK_CREDIT_CARDS.unshift(newCard);

    setSuccessToast(`Credit Card "${name}" published live! Redirecting...`);
    setTimeout(() => {
      router.push("/admin/credit-cards");
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
          <Link href="/admin/credit-cards" className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Credit Cards Catalog
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Credit Card Specification</h1>
          <p className="text-xs text-slate-500">Configure card features &amp; benefits, fees, capping, lounge access, and review text.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/credit-cards"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs shadow-blue-600/20"
          >
            <Save className="w-4 h-4" /> Save &amp; Publish Credit Card
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
          <CreditCard className="w-3.5 h-3.5" /> 1. Basic Metadata
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "features" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> 2. Features &amp; Benefits
        </button>
        <button
          onClick={() => setActiveTab("fees")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "fees" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" /> 3. Fees &amp; Waiver
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "rewards" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Award className="w-3.5 h-3.5" /> 4. Rewards &amp; Privileges
        </button>
        <button
          onClick={() => setActiveTab("eligibility")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "eligibility" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> 5. Eligibility Specs
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "review" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
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
              <h2 className="text-base font-extrabold text-slate-900">Card Basics &amp; Rating</h2>
              <p className="text-xs text-slate-500">Issuer bank, card name, logo URL, and category tags</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Credit Card Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBI Cashback Credit Card, HDFC Millennia"
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
                  placeholder="e.g. sbi-cashback"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Issuer Bank <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBI Card, HDFC Bank, ICICI Bank, Axis Bank"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
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

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1.5">Card Image / Logo URL</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1.5">Online Application Affiliate URL</label>
                <input
                  type="url"
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEATURES & BENEFITS */}
        {activeTab === "features" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Features and Benefits</h2>
              <p className="text-xs text-slate-500">
                Aspects that make spending using this card lit as the sun! Toggle available categories:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              {availableFeatureCategories.map((cat) => {
                const isSelected = featuresAndBenefits.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleFeatureCategory(cat)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                      isSelected
                        ? "bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-500 font-medium hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-sm font-extrabold">{cat}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${
                      isSelected ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {isSelected ? "INCLUDED ✓" : "DISABLED"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FEES & WAIVER */}
        {activeTab === "fees" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Fees &amp; Waiver Conditions</h2>
              <p className="text-xs text-slate-500">Joining fee, annual renewal fee, and spend waiver conditions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Joining Fee (in ₹ - 0 for Lifetime Free)</label>
                <input
                  type="number"
                  value={joiningFee}
                  onChange={(e) => setJoiningFee(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Annual Renewal Fee (in ₹)</label>
                <input
                  type="number"
                  value={annualFee}
                  onChange={(e) => setAnnualFee(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1.5">Annual Fee Waiver Condition</label>
                <input
                  type="text"
                  placeholder="e.g. Waived on spends of ₹1,00,000 in previous year"
                  value={annualFeeWaiverCondition}
                  onChange={(e) => setAnnualFeeWaiverCondition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REWARDS & PRIVILEGES */}
        {activeTab === "rewards" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Rewards &amp; Key Privileges List</h2>
              <p className="text-xs text-slate-500">Headline reward rate string and bullet privileges list</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Headline Reward Rate Summary</label>
                <input
                  type="text"
                  placeholder="e.g. 5% Cashback on Amazon, Flipkart & Swiggy"
                  value={rewardRate}
                  onChange={(e) => setRewardRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              {/* Key Privileges List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800">Key Privileges &amp; Benefits List</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type privilege e.g. '4 Complimentary lounge visits' and press Add"
                    value={newPrivilege}
                    onChange={(e) => setNewPrivilege(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrivilege}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Add Privilege
                  </button>
                </div>

                <div className="space-y-2">
                  {keyPrivileges.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePrivilege(idx)}
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

        {/* TAB 5: ELIGIBILITY SPECS */}
        {activeTab === "eligibility" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Eligibility Specifications</h2>
              <p className="text-xs text-slate-500">Minimum monthly income and recommended credit score</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Minimum Monthly Income (in ₹)</label>
                <input
                  type="number"
                  value={minIncomePerMonth}
                  onChange={(e) => setMinIncomePerMonth(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Recommended Credit Score</label>
                <input
                  type="number"
                  value={recommendedCreditScore}
                  onChange={(e) => setRecommendedCreditScore(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEW TEXT */}
        {activeTab === "review" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Card Overview &amp; Evaluation List</h2>
              <p className="text-xs text-slate-500">Full editorial review summary and pros/cons bullet points</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Card Overview Summary</label>
                <textarea
                  rows={3}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                />
              </div>

              {/* Pros List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-emerald-800">Pros List (Card Advantages)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type positive point and press Add"
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
                <label className="block font-bold text-rose-800">Cons List (Card Limitations)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type limitation point and press Add"
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
            href="/admin/credit-cards"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
          >
            Back to Catalog
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20"
          >
            <Save className="w-4 h-4" /> Save &amp; Publish Credit Card Entry
          </button>
        </div>
      </form>
    </div>
  );
}
