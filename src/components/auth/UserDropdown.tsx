"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Bookmark, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";

export const UserDropdown: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, openAuthModal, watchlist, applications } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0" />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openAuthModal("login")}
          className="text-xs font-bold text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => openAuthModal("signup")}
          className="text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-blue-200" />
          <span>Register</span>
        </button>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "IP";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all bg-white shadow-2xs"
        aria-expanded={dropdownOpen}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shadow-inner">
            {initials}
          </div>
        )}
        <div className="hidden lg:block text-left text-xs leading-tight">
          <span className="font-bold text-slate-900 block max-w-[100px] truncate">
            {user.name.split(" ")[0]}
          </span>
          <span className="text-[10px] text-blue-700 font-semibold uppercase">
            {user.investorType || "Investor"}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100">
          {/* User Header */}
          <div className="p-3">
            <div className="flex items-center gap-2.5">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-inner">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {user.investorType}
                  </span>
                  {user.role === "admin" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="py-1 text-xs">
            <Link
              href="/profile?tab=watchlist"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-xl transition-colors font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>My Watchlist</span>
              </div>
              {watchlist.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                  {watchlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/profile?tab=applications"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-xl transition-colors font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-indigo-500" />
                <span>My IPO Bids / Tracker</span>
              </div>
              {applications.length > 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full">
                  {applications.length}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-xl transition-colors font-medium"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Investor Profile & Settings</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="pt-1">
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
