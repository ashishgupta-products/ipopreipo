"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  Filter,
  Flame,
  Globe,
  Tag,
  Clock,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { MOCK_ARTICLES } from "@/data/mockArticles";
import { ArticlePost, ArticleCategory, ArticleStatus } from "@/types/editor";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function ArticlesManagementPage() {
  const [articles, setArticles] = useState<ArticlePost[]>(MOCK_ARTICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeStatusTab, setActiveStatusTab] = useState<string>("All");
  const [successToast, setSuccessToast] = useState("");

  const categories = ["All", "IPO News", "Research Report", "Market Analysis", "Pre-IPO Insights", "Buying Guide", "Regulatory & SEBI"];
  const statusTabs = ["All", "Published", "Draft", "In Review"];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    const matchesStatus = activeStatusTab === "All" || art.status === activeStatusTab;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this article from database?")) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setSuccessToast("Article deleted successfully.");
      setTimeout(() => setSuccessToast(""), 3000);
    }
  };

  const handleStatusChange = (id: string, newStatus: ArticleStatus) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setSuccessToast(`Article status updated to ${newStatus}`);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
            CONTENT MANAGEMENT DESK
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Articles &amp; Market News ({articles.length})</h1>
          <p className="text-xs text-slate-400">Filter, edit, and organize all financial research reports and news feeds.</p>
        </div>

        <Link
          href="/editor"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Compose New Story
        </Link>
      </div>

      {/* Filters & Status Tabs */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {statusTabs.map((tab) => {
            const count = tab === "All" ? articles.length : articles.filter((a) => a.status === tab).length;
            const isActive = activeStatusTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, tag, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ARTICLES GRID / TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-extrabold border border-slate-700">
                    {art.category}
                  </span>
                  <select
                    value={art.status}
                    onChange={(e) => handleStatusChange(art.id, e.target.value as ArticleStatus)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 border cursor-pointer ${
                      art.status === "Published"
                        ? "text-emerald-400 border-emerald-500/40"
                        : "text-amber-400 border-amber-500/40"
                    }`}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                  </select>
                </div>

                <div className="flex items-start gap-3">
                  <CompanyLogo name={art.title} size="md" className="shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-extrabold text-white text-sm hover:text-emerald-400 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{art.excerpt}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span>By {art.author.name}</span>
                  <span>• {art.publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    {art.views.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
