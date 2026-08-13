"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Star,
  Calculator,
  SlidersHorizontal,
  Search,
  X,
  Check,
  RotateCcw,
  ChevronDown,
  Info
} from "lucide-react";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import { CardCategory } from "@/types/finance";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import CreditCardRewardCalculator from "@/components/credit-cards/CreditCardRewardCalculator";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

const FEE_TIERS = [
  { id: "free", label: "Lifetime Free (₹0)", check: (card: any) => card.annualFee === 0 },
  { id: "low", label: "Low Fee (< ₹1,000)", check: (card: any) => card.annualFee > 0 && card.annualFee < 1000 },
  { id: "mid", label: "Mid Range (₹1,000 - ₹3,000)", check: (card: any) => card.annualFee >= 1000 && card.annualFee < 3000 },
  { id: "premium", label: "Premium (₹3,000+)", check: (card: any) => card.annualFee >= 3000 },
];

export default function CreditCardsPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "calculator">("catalog");
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectedFeeTiers, setSelectedFeeTiers] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const cardFeaturesList = [
    { key: "Welcome Bonus", label: "Welcome Bonus" },
    { key: "Travel", label: "Travel" },
    { key: "Fuel", label: "Fuel" },
    { key: "Rewards", label: "Rewards" },
    { key: "Shopping", label: "Shopping" },
    { key: "Cashback", label: "Cashback" },
    { key: "Dining", label: "Dining" },
    { key: "Insurance", label: "Insurance" }
  ];

  // Dynamically extract unique banks/issuers from mock cards
  const uniqueBanks = Array.from(
    new Set(MOCK_CREDIT_CARDS.map((card) => card.issuer))
  ).sort();

  const handleBankToggle = (bank: string) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank]
    );
  };

  const handleFeeTierToggle = (tierId: string) => {
    setSelectedFeeTiers((prev) =>
      prev.includes(tierId) ? prev.filter((t) => t !== tierId) : [...prev, tierId]
    );
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleResetFilters = () => {
    setSelectedBanks([]);
    setSelectedFeeTiers([]);
    setSelectedFeatures([]);
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("popular");
  };

  const activeFiltersCount =
    selectedBanks.length +
    selectedFeeTiers.length +
    selectedFeatures.length +
    (selectedCategory !== "all" ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const filteredCards = MOCK_CREDIT_CARDS.filter((card) => {
    // Category pill filter
    if (selectedCategory !== "all" && !card.category.includes(selectedCategory)) {
      return false;
    }
    // Search query
    if (
      searchTerm &&
      !card.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !card.issuer.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(card.overview && card.overview.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    // Bank filter
    if (selectedBanks.length > 0 && !selectedBanks.includes(card.issuer)) {
      return false;
    }
    // Fee tier filter
    if (selectedFeeTiers.length > 0) {
      const matchesAnyTier = selectedFeeTiers.some((tierId) => {
        const tier = FEE_TIERS.find((t) => t.id === tierId);
        return tier ? tier.check(card) : false;
      });
      if (!matchesAnyTier) return false;
    }
    // Features filter
    if (selectedFeatures.length > 0) {
      const cardFeatures = card.featuresAndBenefits || [];
      const hasAllFeatures = selectedFeatures.every((feat) =>
        cardFeatures.includes(feat)
      );
      if (!hasAllFeatures) return false;
    }
    return true;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === "popular") {
      const aPop = a.isPopular ? 1 : 0;
      const bPop = b.isPopular ? 1 : 0;
      if (aPop !== bPop) return bPop - aPop;
      return b.rating - a.rating;
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "annual_fee_asc") {
      return a.annualFee - b.annualFee;
    }
    if (sortBy === "joining_fee_asc") {
      return a.joiningFee - b.joiningFee;
    }
    return 0;
  });

  const filterSidebarContent = (
    <div className="space-y-6">
      {/* Active filters header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-[10px] text-red-650 hover:text-red-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Reset All
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Search</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search card, bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:border-slate-950 focus:bg-white transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Issuer / Bank Checklist */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Bank / Issuer</label>
        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 p-2 rounded-lg bg-slate-50/50">
          {uniqueBanks.map((bank) => (
            <label key={bank} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBanks.includes(bank)}
                onChange={() => handleBankToggle(bank)}
                className="w-3.5 h-3.5 accent-slate-900 rounded-sm border-slate-350"
              />
              <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                {bank}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fee Tiers */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Annual Charges</label>
        <div className="space-y-1.5">
          {FEE_TIERS.map((tier) => (
            <label key={tier.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFeeTiers.includes(tier.id)}
                onChange={() => handleFeeTierToggle(tier.id)}
                className="w-3.5 h-3.5 accent-slate-900 rounded-sm border-slate-350"
              />
              <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                {tier.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Card Features / Benefits Checklist */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Features &amp; Benefits</label>
        <div className="space-y-1.5">
          {cardFeaturesList.map((feat) => (
            <label key={feat.key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feat.key)}
                onChange={() => handleFeatureToggle(feat.key)}
                className="w-3.5 h-3.5 accent-slate-900 rounded-sm border-slate-350"
              />
              <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                {feat.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "Credit Cards" }]} className="mb-2" />

      {/* Header Banner */}
      <div className="py-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Best Credit Cards in India
        </h1>
      </div>

      {/* Render Calculator view if tab is active */}
      {activeTab === "calculator" ? (
        <CreditCardRewardCalculator />
      ) : (
        <>

          {/* Main Catalog - Top Filters Row */}
          {showAdvancedFilters && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Search Filter */}
                <div className="space-y-1.5 col-span-1 md:col-span-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search card, bank..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-semibold focus:outline-hidden focus:border-slate-950 focus:bg-white transition-all"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Bank / Issuer Dropdown Selector */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Bank / Issuer</label>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          if (!selectedBanks.includes(val)) {
                            setSelectedBanks([...selectedBanks, val]);
                          }
                        }
                      }}
                      value=""
                      className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-950 text-xs font-semibold focus:outline-hidden focus:border-slate-950 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Banks...</option>
                      {uniqueBanks.map((bank) => (
                        <option key={bank} value={bank} disabled={selectedBanks.includes(bank)}>
                          {bank} {selectedBanks.includes(bank) ? "✓" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Annual Charges Dropdown Selector */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Annual Charges</label>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          if (!selectedFeeTiers.includes(val)) {
                            setSelectedFeeTiers([...selectedFeeTiers, val]);
                          }
                        }
                      }}
                      value=""
                      className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-950 text-xs font-semibold focus:outline-hidden focus:border-slate-950 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Fees...</option>
                      {FEE_TIERS.map((tier) => (
                        <option key={tier.id} value={tier.id} disabled={selectedFeeTiers.includes(tier.id)}>
                          {tier.label} {selectedFeeTiers.includes(tier.id) ? "✓" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Benefits Selector */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Benefits</label>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          if (!selectedFeatures.includes(val)) {
                            setSelectedFeatures([...selectedFeatures, val]);
                          }
                        }
                      }}
                      value=""
                      className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-950 text-xs font-semibold focus:outline-hidden focus:border-slate-950 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Features...</option>
                      {cardFeaturesList.map((feat) => (
                        <option key={feat.key} value={feat.key} disabled={selectedFeatures.includes(feat.key)}>
                          {feat.label} {selectedFeatures.includes(feat.key) ? "✓" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Quick reset active tags indicator inside filter bar */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-3 text-xs">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Active Filters ({activeFiltersCount})</div>
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] text-red-650 hover:text-red-750 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Main Catalog Single-Column List */}
          <div className="w-full">
            {/* Simple Filters Toggle Button Bar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 mb-6">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-805 font-extrabold text-xs shadow-3xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

              {/* Active Filter Tags */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      Search: {searchTerm}
                      <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-500" onClick={() => setSearchTerm("")} />
                    </span>
                  )}
                  {selectedBanks.map((bank) => (
                    <span key={bank} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {bank}
                      <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-500" onClick={() => handleBankToggle(bank)} />
                    </span>
                  ))}
                  {selectedFeeTiers.map((tierId) => {
                    const label = FEE_TIERS.find((t) => t.id === tierId)?.label || tierId;
                    return (
                      <span key={tierId} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {label}
                        <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-500" onClick={() => handleFeeTierToggle(tierId)} />
                      </span>
                    );
                  })}
                  {selectedFeatures.map((feat) => (
                    <span key={feat} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {feat}
                      <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-500" onClick={() => handleFeatureToggle(feat)} />
                    </span>
                  ))}
                </div>
              )}

              {/* Cards Catalog List */}
              <div className="space-y-4">
                {sortedCards.length > 0 ? (
                  sortedCards.map((card) => {
                    const activeFeatures = card.featuresAndBenefits || ["Welcome Bonus", "Travel", "Fuel", "Rewards", "Shopping"];
                    const cardTier = card.annualFee >= 3000 ? "Premium" : "Regular";
                    const bestFor = card.category.includes("cashback")
                      ? "Cashback"
                      : card.category.includes("travel")
                      ? "Lifestyle"
                      : "Rewards";

                    return (
                      <div
                        key={card.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-5 relative"
                      >
                        {/* Left Column: Credit Card Logo */}
                        <CompanyLogo
                          name={card.name}
                          logoUrl={card.logoUrl}
                          size="lg"
                          variant="credit_card"
                          className="shadow-2xs shrink-0 rounded-lg self-center sm:self-auto"
                        />

                        {/* Right Column: Text Info & 4-Column Metrics Grid */}
                        <div className="flex-1 min-w-0 space-y-3.5 w-full">
                          {/* Header Row: Title, Rating, and CTA */}
                          <div className="flex justify-between items-start gap-4 w-full">
                            <div className="space-y-2 flex flex-col items-center sm:items-start w-full sm:w-auto">
                              <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap justify-center sm:justify-start">
                                <h2 className="text-base sm:text-lg font-bold text-slate-800 hover:text-blue-700 transition-colors text-center sm:text-left">
                                  <Link href={`/credit-cards/${card.slug}`}>{card.name}</Link>
                                </h2>
                                <div className="flex items-center justify-center sm:justify-start gap-0.5 text-xs font-bold text-amber-500">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                          i < Math.floor(card.rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-amber-100 text-amber-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-slate-400 text-xs font-medium ml-1">({card.rating})</span>
                                </div>
                              </div>

                              {/* Badges + Features Checklist */}
                              <div className="flex flex-wrap items-center gap-3 w-full justify-start">
                                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#e8f7f0] text-[#10b981]">
                                  {cardTier}
                                </span>
                                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5]">
                                  Best For: {bestFor}
                                </span>

                                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700 ml-1">
                                  {cardFeaturesList.map((feat) => {
                                    const isIncluded = activeFeatures.includes(feat.key);
                                    return (
                                      <span key={feat.key} className="flex items-center gap-1.5">
                                        {isIncluded ? (
                                          <span className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                                            <svg className="w-2.5 h-2.5 stroke-[4.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                          </span>
                                        ) : (
                                          <span className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center shrink-0">
                                            <svg className="w-2 h-2 stroke-[4.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </span>
                                        )}
                                        <span className={isIncluded ? "text-slate-800 font-semibold" : "text-slate-400"}>
                                          {feat.label}
                                        </span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Dark Pill "Full Details" CTA Button (Far Right) */}
                            <div className="shrink-0 hidden sm:block">
                              <Link
                                href={`/credit-cards/${card.slug}`}
                                className="px-5 py-1.5 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
                              >
                                Full Details
                              </Link>
                            </div>
                          </div>

                          {/* 4-Column Rates Matrix - Seamless White Background, No borders! */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            <div>
                              <span className="text-slate-400 text-xs block mb-0.5 font-medium">Reward Rate</span>
                              <strong className="text-slate-800 font-bold text-sm sm:text-base block">
                                {card.rewardRate}
                              </strong>
                            </div>

                            <div>
                              <span className="text-slate-400 text-xs block mb-0.5 font-medium">Joining Fee</span>
                              <div className="flex items-center gap-1">
                                <strong className="text-slate-800 font-bold text-sm sm:text-base">
                                  {card.joiningFee === 0 ? "Free" : `₹${card.joiningFee}`}
                                </strong>
                                <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center" title={card.annualFeeWaiverCondition}>i</span>
                              </div>
                            </div>

                            <div>
                              <span className="text-slate-400 text-xs block mb-0.5 font-medium">Annual Fee</span>
                              <div className="flex items-center gap-1">
                                <strong className="text-slate-800 font-bold text-sm sm:text-base">
                                  {card.annualFee === 0 ? "Free" : `₹${card.annualFee}`}
                                </strong>
                                <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center" title={card.annualFeeWaiverCondition}>i</span>
                              </div>
                            </div>

                            <div>
                              <span className="text-slate-400 text-xs block mb-0.5 font-medium">Annual Percentage Rate</span>
                              <div className="flex items-center gap-1">
                                <strong className="text-slate-800 font-bold text-sm sm:text-base">
                                  42%
                                </strong>
                                <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs font-bold bg-slate-100 w-3.5 h-3.5 rounded-full flex items-center justify-center">i</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Full Details Button */}
                        <div className="w-full pt-1.5 sm:hidden">
                          <Link
                            href={`/credit-cards/${card.slug}`}
                            className="w-full px-5 py-2 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center transition-all"
                          >
                            Full Details
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <p className="text-slate-500 text-sm font-medium">No credit cards match your filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

          {/* Mobile Filter Slide-over Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileFilterOpen(false)}
              />

              {/* Drawer panel */}
              <div className="relative ml-0 mr-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="text-sm font-black text-slate-955 uppercase tracking-wider">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="py-4">
                  {filterSidebarContent}
                </div>
                <div className="mt-auto border-t border-slate-100 pt-4 flex gap-3">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        handleResetFilters();
                        setIsMobileFilterOpen(false);
                      }}
                      className="flex-1 py-2 text-center text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                How to Choose the Best Credit Card in India: The Ultimate Comparison Guide
              </h2>
              <p className="font-medium text-slate-500">
                Finding the right credit card can save you thousands of rupees annually in cashback, fuel surcharge waivers, and airport lounge access. Here is everything you need to know to compare and select the best card for your spending habits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">1. Identify Your Spending Profile</h3>
                <p>
                  Different cards offer maximum rewards on specific categories. If you do most of your shopping on e-commerce sites like Amazon, Flipkart, or Myntra, a co-branded <strong>Cashback Card</strong> is your best choice. If you travel frequently, look for cards offering complimentary domestic/international lounge access and air milestones.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">2. Compare Joining &amp; Annual Fees</h3>
                <p>
                  Many premium cards charge an upfront joining fee and a recurring annual maintenance charge. However, most issuers offer <strong>spend-based waivers</strong> (e.g., annual fee waived on spending ₹1 Lakh in a year). If you prefer absolute zero maintenance, filter for <strong>Lifetime Free (LTF) Credit Cards</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">3. Understand the Annual Percentage Rate (APR)</h3>
                <p>
                  If you pay your credit card bill in full before the due date, you incur 0% interest (up to 50 days interest-free period). However, if you roll over balance or pay only the minimum amount due, issuers charge high finance rates ranging from <strong>36% to 45% per annum</strong>. Always compare interest rates before choosing.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">4. Required Credit Score / CIBIL Score</h3>
                <p>
                  To secure instant online approval for premium credit cards, a strong credit profile is required. Issuers typically prefer applicants with a <strong>CIBIL score of 730 or higher</strong>, clean repayment history, and a stable monthly income.
                </p>
              </div>
            </div>

            {/* Structured FAQs for SEO schema */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Frequently Asked Questions (FAQs)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900">What is a Lifetime Free (LTF) Credit Card?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    An LTF credit card has zero joining fee and zero annual renewal fee for life, without any minimum spend conditions.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900">How do I waive off my card's annual fee?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Most credit cards have spend-based waiver milestones (e.g. ₹1 Lakh or ₹2 Lakhs spent in the anniversary year) which automatically waives the next year's fee.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900">What is the interest-free credit period?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    It is the period between your transaction date and the payment due date (usually 45 to 50 days) during which no interest is charged, provided the total bill is paid.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <h4 className="font-bold text-slate-900">Does applying for multiple cards lower CIBIL score?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Yes. Each card application triggers a hard inquiry by the bank. Multiple hard inquiries in a short span can temporarily lower your CIBIL score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
