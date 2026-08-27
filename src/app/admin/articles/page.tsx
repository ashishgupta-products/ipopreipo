"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Sparkles
} from "lucide-react";
import { ArticlePost } from "@/types/editor";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticlePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/articles?all=true");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDeleteArticle = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete article "${title}"?`)) return;
    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeedbackMsg(`Deleted "${title}"`);
        loadArticles();
        setTimeout(() => setFeedbackMsg(""), 3000);
      }
    } catch (err) {
      alert("Failed to delete article");
    }
  };

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      categoryFilter === "ALL" || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const publishedCount = articles.filter((a) => a.status === "Published").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Articles &amp; Research CMS</h1>
          <p className="text-xs text-slate-400 mt-1">Publish market reports, IPO review notes, and educational guides.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadArticles}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs border border-slate-800"
            title="Reload articles"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-mono">
          {feedbackMsg}
        </div>
      )}

      {/* KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Articles</span>
          <span className="text-xl font-black text-white">{articles.length}</span>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Published Live</span>
          <span className="text-xl font-black text-emerald-400">{publishedCount}</span>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Drafts</span>
          <span className="text-xl font-black text-amber-400">{articles.length - publishedCount}</span>
        </div>
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Reader Views</span>
          <span className="text-xl font-black text-blue-400">{totalViews.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Categories</option>
          <option value="IPO News">IPO News</option>
          <option value="Research Report">Research Report</option>
          <option value="Market Analysis">Market Analysis</option>
          <option value="Pre-IPO Insights">Pre-IPO Insights</option>
          <option value="Buying Guide">Buying Guide</option>
        </select>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 text-[10px] uppercase font-mono">
                <th className="py-3 px-4">Article Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Views</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No articles found. Click &quot;Write New Article&quot; to publish your first post.
                  </td>
                </tr>
              ) : (
                filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white max-w-sm">
                      <Link
                        href={`/articles/${art.slug}`}
                        target="_blank"
                        className="hover:text-blue-400 line-clamp-1 flex items-center gap-1.5"
                      >
                        <span>{art.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                      </Link>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        /{art.slug}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {art.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300 text-xs">
                      {art.author?.name || "Editor Desk"}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          art.status === "Published"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                      {art.views || 0}
                    </td>

                    <td className="py-3.5 px-3 text-[11px] text-slate-400">
                      {art.publishDate || "Recent"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/articles/${art.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="View on public site"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(art.slug, art.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
