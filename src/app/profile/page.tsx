"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Bookmark, 
  Award, 
  Settings, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  ChevronRight,
  Flame,
  Star,
  LogOut,
  Save,
  X
} from "lucide-react";
import { InvestorType, ApplicationStatus } from "@/types/auth";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";

  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    logout, 
    updateProfile, 
    watchlist, 
    toggleWatchlist, 
    refreshWatchlist,
    applications, 
    addApplication, 
    removeApplication, 
    refreshApplications,
    openAuthModal 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profilePan, setProfilePan] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileTier, setProfileTier] = useState<InvestorType>("Retail");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileStatusMsg, setProfileStatusMsg] = useState("");

  // Add Application Modal state
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [appIpoName, setAppIpoName] = useState("");
  const [appIpoSlug, setAppIpoSlug] = useState("");
  const [appCategory, setAppCategory] = useState<"Retail" | "sHNI" | "bHNI" | "Employee">("Retail");
  const [appLots, setAppLots] = useState(1);
  const [appLotSize, setAppLotSize] = useState(1);
  const [appBidPrice, setAppBidPrice] = useState(0);
  const [appTotalAmount, setAppTotalAmount] = useState(0);
  const [appNumber, setAppNumber] = useState("");
  const [appStatus, setAppStatus] = useState<ApplicationStatus>("Applied");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Available IPOs for dropdown
  const [availableIpos, setAvailableIpos] = useState<any[]>([]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "");
      setProfilePan(user.panMasked || "");
      setProfileBio(user.bio || "");
      setProfileTier(user.investorType || "Retail");
      setProfileAvatar(user.avatarUrl || "");
    }
  }, [user]);

  useEffect(() => {
    async function loadIPOs() {
      try {
        const res = await fetch("/api/ipos");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setAvailableIpos(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load available IPOs:", err);
      }
    }
    loadIPOs();
    refreshWatchlist();
    refreshApplications();
  }, [refreshWatchlist, refreshApplications]);

  // Recalculate application total when lots/price changes
  useEffect(() => {
    setAppTotalAmount(appLots * appLotSize * appBidPrice);
  }, [appLots, appLotSize, appBidPrice]);

  const handleSelectIpoForApp = (slug: string) => {
    setAppIpoSlug(slug);
    const found = availableIpos.find((i) => i.slug === slug);
    if (found) {
      setAppIpoName(found.name);
      setAppLotSize(found.lotSize || 1);
      setAppBidPrice(found.priceBandMax || found.issuePrice || 100);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatusMsg("");
    const res = await updateProfile({
      name: profileName,
      phone: profilePhone,
      panMasked: profilePan,
      bio: profileBio,
      investorType: profileTier,
      avatarUrl: profileAvatar,
    });
    if (res.success) {
      setProfileStatusMsg("Profile updated successfully!");
      setIsEditingProfile(false);
      setTimeout(() => setProfileStatusMsg(""), 3000);
    } else {
      setProfileStatusMsg(res.error || "Failed to update profile");
    }
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appIpoName) {
      alert("Please select or enter an IPO name");
      return;
    }
    setIsSubmittingApp(true);
    const res = await addApplication({
      ipoId: appIpoSlug || appIpoName.toLowerCase().replace(/\s+/g, "-"),
      ipoSlug: appIpoSlug || appIpoName.toLowerCase().replace(/\s+/g, "-"),
      ipoName: appIpoName,
      category: appCategory,
      lotsApplied: Number(appLots),
      lotSize: Number(appLotSize),
      bidPrice: Number(appBidPrice),
      totalAmount: Number(appTotalAmount),
      applicationNumber: appNumber || undefined,
      status: appStatus,
    });
    setIsSubmittingApp(false);
    if (res.success) {
      setShowAddAppModal(false);
      setAppIpoName("");
      setAppIpoSlug("");
      setAppNumber("");
    } else {
      alert(res.error || "Failed to save application");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600">Loading your investor profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Investor Profile Login</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Please sign in to access your personalized IPO Watchlist, GMP tracking alerts, and Demat Application portfolio.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal("login")}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-sm text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal("signup")}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Application Summary Stats
  const totalAppliedAmount = applications.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalLots = applications.reduce((acc, curr) => acc + (curr.lotsApplied || 0), 0);
  const activeBidsCount = applications.filter((a) => a.status === "Applied").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg border border-white/20">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {user.investorType}
                </span>
                {user.role === "admin" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200/80 mt-1">{user.email}</p>
              {user.bio && <p className="text-xs text-slate-300 mt-1 max-w-lg">{user.bio}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-xl text-xs font-bold transition-all border border-rose-400/20 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-blue-200/70 font-semibold block">Watchlisted IPOs</span>
            <span className="text-lg font-black text-white">{watchlist.length}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-blue-200/70 font-semibold block">Total Applications</span>
            <span className="text-lg font-black text-white">{applications.length}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-blue-200/70 font-semibold block">Total Bidded Capital</span>
            <span className="text-lg font-black text-white">₹{totalAppliedAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-blue-200/70 font-semibold block">Active Bids</span>
            <span className="text-lg font-black text-emerald-400">{activeBidsCount}</span>
          </div>
        </div>
      </div>

      {profileStatusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{profileStatusMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs gap-1">
        {[
          { id: "overview", label: "Overview & Profile", icon: User },
          { id: "watchlist", label: `My Watchlist (${watchlist.length})`, icon: Bookmark },
          { id: "applications", label: `IPO Bids & Tracker (${applications.length})`, icon: Award },
          { id: "settings", label: "Preferences & Security", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & PROFILE EDIT */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Investor Personal Details</h3>
                <p className="text-xs text-slate-500">Manage your verified investor tier and contact information.</p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PAN Number (Masked)</label>
                    <input
                      type="text"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={profilePan}
                      onChange={(e) => setProfilePan(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs uppercase border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Investor Category</label>
                    <select
                      value={profileTier}
                      onChange={(e) => setProfileTier(e.target.value as InvestorType)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                    >
                      <option value="Retail">Retail (up to ₹2 Lakh)</option>
                      <option value="sHNI">sHNI (₹2 Lakh - ₹10 Lakh)</option>
                      <option value="bHNI">bHNI (Above ₹10 Lakh)</option>
                      <option value="Employee">Employee / General</option>
                      <option value="DII">Institutional / DII</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Investor Bio</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Retail investor active in SME IPOs and listing gain opportunities."
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold mb-1">Full Name</span>
                  <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold mb-1">Email Address</span>
                  <span className="font-bold text-slate-900 text-sm">{user.email}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold mb-1">Investor Category</span>
                  <span className="font-bold text-blue-700 text-sm">{user.investorType}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-semibold mb-1">PAN (Masked)</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{user.panMasked || "Not linked"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Quick Links Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900">Investor Shortcuts</h3>
              
              <div className="space-y-2">
                <Link
                  href="/allotment"
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Check IPO Allotment Status</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/calendar"
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>IPO Calendar & Timetable</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/pre-ipo"
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition-all flex items-center justify-between text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Pre-IPO Unlisted Equities</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-md space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-200" />
                <h4 className="text-xs font-black tracking-wide">Data Security Guarantee</h4>
              </div>
              <p className="text-[11px] text-blue-100 leading-relaxed">
                Your portfolio tracking data and PAN lookups are encrypted and stored safely. We never sell your data or request broker PINs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WATCHLIST */}
      {activeTab === "watchlist" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Tracked IPO Watchlist</h3>
              <p className="text-xs text-slate-500">Real-time Grey Market Premium (GMP) & status updates for your bookmarked IPOs.</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Browse More IPOs</span>
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Your Watchlist is Empty</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the star or bookmark icon on any IPO card across the portal to monitor live GMP changes right here.
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-sm mt-2"
              >
                Explore Current IPOs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.map((item) => {
                const details = item.ipoDetails;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {details?.category || "IPO"}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 mt-1 line-clamp-1">
                            {details?.name || item.ipoSlug}
                          </h4>
                        </div>
                        <button
                          onClick={() => toggleWatchlist(item.ipoSlug, item.ipoId)}
                          className="p-1.5 text-amber-500 hover:text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                          title="Remove from Watchlist"
                        >
                          <Star className="w-4 h-4 fill-amber-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold">Live GMP</span>
                          <span className={`font-black text-sm ${(details?.gmp || 0) > 0 ? "text-emerald-700" : "text-slate-700"}`}>
                            {(details?.gmp || 0) > 0 ? `+₹${details?.gmp}` : "₹0 / Flat"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold">Expected Gain</span>
                          <span className={`font-black text-sm ${(details?.gmpPercent || 0) > 0 ? "text-emerald-700" : "text-slate-700"}`}>
                            {(details?.gmpPercent || 0) > 0 ? `+${details?.gmpPercent}%` : "0%"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">
                        Price: ₹{details?.priceBandMax || "-"}
                      </span>
                      <Link
                        href={`/ipo/${item.ipoSlug}`}
                        className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: APPLICATIONS & BIDS TRACKER */}
      {activeTab === "applications" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">IPO Demat Bids & Allotment Tracker</h3>
              <p className="text-xs text-slate-500">Track your applied IPO lots, blocked ASBA capital, and allotment statuses.</p>
            </div>
            <button
              onClick={() => setShowAddAppModal(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Application</span>
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No IPO Applications Recorded</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Keep track of your retail/HNI applications across brokers and calculate potential listing returns automatically.
              </p>
              <button
                onClick={() => setShowAddAppModal(true)}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-sm mt-2"
              >
                Record Your First IPO Bid
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-3">IPO Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-right">Lots / Qty</th>
                    <th className="py-3 px-3 text-right">Bid Price</th>
                    <th className="py-3 px-3 text-right">Total Capital</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        <Link href={`/ipo/${app.ipoSlug}`} className="hover:text-blue-700 hover:underline">
                          {app.ipoName}
                        </Link>
                        {app.applicationNumber && (
                          <span className="block text-[10px] font-normal text-slate-400 font-mono">
                            App #: {app.applicationNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {app.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold">
                        {app.lotsApplied} Lot ({app.lotsApplied * app.lotSize} shares)
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold">
                        ₹{app.bidPrice.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                        ₹{app.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            app.status === "Allotted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : app.status === "Not Allotted"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => removeApplication(app.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PREFERENCES & SECURITY */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Account Preferences & Notifications</h3>
            <p className="text-xs text-slate-500">Configure alert notifications and security options.</p>
          </div>

          <div className="space-y-4 max-w-xl text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="block text-slate-900 font-bold">Daily GMP Summary Alerts</strong>
                <span className="text-slate-500 text-[11px]">Receive morning update on grey market premium movements</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 accent-blue-600" />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="block text-slate-900 font-bold">IPO Allotment Out Alerts</strong>
                <span className="text-slate-500 text-[11px]">Instant notifications when registrar activates allotment link</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 accent-blue-600" />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="block text-slate-900 font-bold">Pre-IPO Deal Notifications</strong>
                <span className="text-slate-500 text-[11px]">Updates when new unlisted shares become available</span>
              </div>
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 accent-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD APPLICATION */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-base">Record IPO Application / Bid</h3>
              </div>
              <button
                onClick={() => setShowAddAppModal(false)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select IPO or Type Name</label>
                <select
                  value={appIpoSlug}
                  onChange={(e) => handleSelectIpoForApp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs"
                >
                  <option value="">-- Select from Active/Upcoming IPOs --</option>
                  {availableIpos.map((ipo) => (
                    <option key={ipo.id} value={ipo.slug}>
                      {ipo.name} ({ipo.category}) - Max ₹{ipo.priceBandMax}
                    </option>
                  ))}
                </select>
                {!appIpoSlug && (
                  <input
                    type="text"
                    placeholder="Or manually type IPO name..."
                    value={appIpoName}
                    onChange={(e) => setAppIpoName(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={appCategory}
                    onChange={(e) => setAppCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs"
                  >
                    <option value="Retail">Retail</option>
                    <option value="sHNI">sHNI (₹2L - ₹10L)</option>
                    <option value="bHNI">bHNI (&gt; ₹10L)</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs"
                  >
                    <option value="Applied">Applied (Pending)</option>
                    <option value="Allotted">Allotted</option>
                    <option value="Not Allotted">Not Allotted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lots Applied</label>
                  <input
                    type="number"
                    min={1}
                    value={appLots}
                    onChange={(e) => setAppLots(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lot Size</label>
                  <input
                    type="number"
                    min={1}
                    value={appLotSize}
                    onChange={(e) => setAppLotSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bid Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={appBidPrice}
                    onChange={(e) => setAppBidPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-blue-900">Total Bidded Investment:</span>
                <span className="text-base font-black text-blue-900">₹{appTotalAmount.toLocaleString("en-IN")}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Application / Reference Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 1029384756"
                  value={appNumber}
                  onChange={(e) => setAppNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingApp}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-sm text-xs transition-all disabled:opacity-60"
              >
                {isSubmittingApp ? "Saving..." : "Save IPO Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
