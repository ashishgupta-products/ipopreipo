"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Bookmark, 
  LogOut, 
  Edit, 
  Save, 
  Briefcase, 
  Star, 
  ArrowRight,
  TrendingUp,
  Layers,
  Award
} from "lucide-react";
import { useAuth, UserProfile } from "@/context/AuthContext";
import { Badge } from "@/components/common/Badge";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile, savedWatchlist, toggleWatchlist } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.name || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [panNumber, setPanNumber] = useState<string>(user?.panNumber || "ABCDE1234F");
  const [dematDpId, setDematDpId] = useState<string>(user?.dematDpId || "1208160012345678");
  const [category, setCategory] = useState<UserProfile["investorCategory"]>(user?.investorCategory || "Retail");
  const [ipos, setIpos] = useState<any[]>([]);

  useEffect(() => {
    async function loadIPOs() {
      try {
        const res = await fetch("/api/ipos");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setIpos(json.data);
        }
      } catch (err) {
        console.error("Failed to load profile watchlist ipos:", err);
      }
    }
    loadIPOs();
  }, []);

  if (!user && !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <User className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-black text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600">Please sign in to view your investor profile and saved IPO watchlist.</p>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 rounded-xl bg-blue-900 text-white font-extrabold text-xs hover:bg-blue-800 transition-all inline-block shadow-sm"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      panNumber,
      dematDpId,
      investorCategory: category
    });
    setIsEditing(false);
  };

  const watchlistedIpos = ipos.filter((ipo) => savedWatchlist.includes(ipo.slug));

  return (
    <div className="min-h-screen bg-slate-50 pb-16 space-y-8">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
            <User className="w-3.5 h-3.5 text-blue-700" />
            Investor Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            My Account &amp; Watchlist
          </h1>
          <p className="text-sm text-slate-600">
            Manage your personal profile, demat account info, and track saved IPOs.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Account Details (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Profile Avatar Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white text-xl font-black flex items-center justify-center border-2 border-blue-200 shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || "I"}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{user?.name}</h3>
                <span className="text-xs text-slate-500 block">{user?.email}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 inline-block mt-1">
                  {user?.investorCategory} Category
                </span>
              </div>
            </div>

            {/* Edit / View Info Form */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Demat DP ID (CDSL/NSDL)</label>
                  <input
                    type="text"
                    value={dematDpId}
                    onChange={(e) => setDematDpId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Investor Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    <option value="Retail">Retail (Up to ₹2 Lakhs)</option>
                    <option value="S-HNI">S-HNI (₹2 Lakhs - ₹10 Lakhs)</option>
                    <option value="B-HNI">B-HNI (Above ₹10 Lakhs)</option>
                    <option value="QIB">QIB Institutional</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-1/2 py-2 rounded-lg border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-800"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Investor Category:</span>
                  <strong className="text-slate-900 font-bold">{user?.investorCategory}</strong>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <strong className="text-slate-900 font-bold">{user?.phone || "Not set"}</strong>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">PAN Card:</span>
                  <strong className="text-slate-900 font-bold">{user?.panNumber || "ABCDE1234F"}</strong>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Demat DP ID:</span>
                  <strong className="text-slate-900 font-bold">{user?.dematDpId || "1208160012345678"}</strong>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 rounded-xl border border-blue-900 text-blue-900 font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Profile Details
                  </button>
                </div>
              </div>
            )}

            {/* Logout */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4 text-rose-700" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Watchlist & Saved Items (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-blue-700 fill-blue-700" />
                  Saved IPO Watchlist
                </h2>
                <p className="text-xs text-slate-500">Track real-time GMP, subscription status, and key milestone dates.</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {watchlistedIpos.length} Saved
              </span>
            </div>

            {watchlistedIpos.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Your Watchlist is Empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the bookmark icon on any IPO card to save it here for quick tracking and allotment updates.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-all shadow-sm"
                >
                  Browse Live IPOs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchlistedIpos.map((ipo) => (
                  <div key={ipo.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">{ipo.category}</span>
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1">{ipo.name}</h4>
                      </div>
                      <button
                        onClick={() => toggleWatchlist(ipo.slug)}
                        className="text-amber-500 hover:text-slate-400"
                      >
                        <Bookmark className="w-4 h-4 fill-amber-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Price Band</span>
                        <strong className="text-slate-900 font-bold">₹{ipo.priceBandMin} - ₹{ipo.priceBandMax}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Estimated GMP</span>
                        <strong className="text-emerald-700 font-black">+₹{ipo.gmp} ({ipo.gmpPercent}%)</strong>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <Badge status={ipo.status} />
                      <Link
                        href={`/ipo/${ipo.slug}`}
                        className="text-xs font-extrabold text-blue-900 hover:underline flex items-center gap-1"
                      >
                        View Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
