"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  UserCheck, 
  KeyRound,
  Mail,
  Phone
} from "lucide-react";
import { User, UserRole } from "@/types/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusMsg, setStatusMsg] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.users)) {
          setUsers(json.users);
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole, userName: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setStatusMsg(`✅ Changed role of ${userName} to "${newRole}"`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (err) {
      alert("Failed to update user role");
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesRole = roleFilter === "ALL" || u.role.toUpperCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminsCount = users.filter((u) => u.role === "admin").length;
  const retailCount = users.filter((u) => u.investorType === "Retail").length;
  const hniCount = users.filter((u) => u.investorType === "sHNI" || u.investorType === "bHNI").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Registered Investors &amp; Users</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of registered investors, portfolio accounts, and privilege roles.</p>
        </div>

        <button
          onClick={loadUsers}
          className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Directory</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold font-mono">
          {statusMsg}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Investors</span>
          <span className="text-xl font-black text-slate-900">{users.length}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Retail Investors</span>
          <span className="text-xl font-black text-blue-600">{retailCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">HNI Investors</span>
          <span className="text-xl font-black text-purple-600">{hniCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Platform Admins</span>
          <span className="text-xl font-black text-emerald-600">{adminsCount}</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
        >
          <option value="ALL">All Roles</option>
          <option value="USER">Standard User</option>
          <option value="ADMIN">Admin</option>
          <option value="ANALYST">Analyst</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold">
                <th className="py-3 px-4">Investor User</th>
                <th className="py-3 px-3">Investor Tier</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">PAN (Masked)</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Joined Date</th>
                <th className="py-3 px-4 text-right">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No users match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {u.name ? u.name[0] : "U"}
                        </div>
                        <div>
                          <strong className="block text-slate-900 leading-tight">{u.name}</strong>
                          <span className="text-[11px] text-slate-500 font-normal">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {u.investorType || "Retail"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 text-xs font-medium">
                      {u.phone || "--"}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-700 font-semibold">
                      {u.panMasked || "--"}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {u.createdAt ? u.createdAt.split("T")[0] : "Recent"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole, u.name)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="user">User</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
