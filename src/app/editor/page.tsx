"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Flame,
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  Send,
  X,
  Share2,
  Globe,
  Tag,
  Bold,
  Italic,
  List,
  Quote,
  AlertCircle
} from "lucide-react";
import { ArticlePost, ArticleCategory } from "@/types/editor";

export default function EditorDashboardPage() {
  const [articles, setArticles] = useState<ArticlePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles?all=true");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data);
        }
      } catch (err) {
        console.error("Failed to load admin dashboard articles:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  // Form State for Quick Article
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("IPO News");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("Mainboard IPO, Valuation");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = articles.filter((a) => a.status === "Published").length;
  const draftCount = articles.filter((a) => a.status === "Draft").length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  const handleOpenComposer = () => {
    setTitle("");
    setExcerpt("");
    setCategory("IPO News");
    setContent("");
    setSeoTitle("");
    setSeoDescription("");
    setIsBreaking(false);
    setShowComposer(true);
  };

  const handleQuickPublish = (e: React.FormEvent, publishImmediately: boolean) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newArticle: ArticlePost = {
      id: "art-" + Date.now(),
      slug,
      title,
      excerpt: excerpt || title,
      content: content || title,
      category,
      status: publishImmediately ? "Published" : "Draft",
      author: {
        name: "Editorial Desk",
        role: "Senior Financial Analyst"
      },
      tags: tagsInput.split(",").map((t) => t.trim()),
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || title,
      publishDate: new Date().toISOString().split("T")[0],
      views: publishImmediately ? 120 : 0,
      readingTimeMins: Math.max(3, Math.ceil(content.length / 500)),
      isBreaking
    };

    // Save to database
    try {
      fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      });
    } catch (e) {
      console.error("Failed to save new article to database:", e);
    }

    setArticles([newArticle, ...articles]);
    setShowComposer(false);
    setSuccessToast(
      publishImmediately
        ? "Article published live to ipopreipo.com!"
        : "Article saved as draft in Editorial Queue."
    );
    setTimeout(() => setSuccessToast(""), 4000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to archive/delete this article?")) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setSuccessToast("Article deleted from editorial desk.");
      setTimeout(() => setSuccessToast(""), 3000);
    }
  };

  const toggleBreaking = async (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (!article) return;
    const updated = { ...article, isBreaking: !article.isBreaking };

    setArticles((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    );

    try {
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Failed to update breaking status:", e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast("")} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              EDITORIAL COMMAND CENTER
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">Publishing Workspace</h1>
          <p className="text-xs text-slate-400">Write financial news, IPO valuation reports, and push breaking allotment updates.</p>
        </div>

        <button
          onClick={handleOpenComposer}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/25 scale-100 hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create &amp; Write Article
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold">Published Articles</span>
            <p className="text-2xl font-black text-white">{publishedCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold">Drafts in Queue</span>
            <p className="text-2xl font-black text-white">{draftCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold">Total Article Reads</span>
            <p className="text-2xl font-black text-white">{totalViews.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold">Breaking Alerts</span>
            <p className="text-2xl font-black text-white">
              {articles.filter((a) => a.isBreaking).length} Live
            </p>
          </div>
        </div>
      </div>

      {/* EDITORIAL ARTICLES QUEUE */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Editorial Article Desk</h2>
            <p className="text-xs text-slate-400">Manage published market stories, drafts, and breaking news banners.</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Title &amp; Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Publish Date</th>
                <th className="py-3 px-3">Views</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredArticles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      {art.isBreaking && (
                        <span className="px-1.5 py-0.5 rounded-xs bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          BREAKING
                        </span>
                      )}
                      <strong className="text-slate-100 font-extrabold text-xs block hover:text-emerald-400 cursor-pointer">
                        {art.title}
                      </strong>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-semibold">
                        {art.category}
                      </span>
                      <span>• {art.readingTimeMins} min read</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        art.status === "Published"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {art.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-300">{art.author.name}</td>
                  <td className="py-3.5 px-3 text-slate-400">{art.publishDate}</td>
                  <td className="py-3.5 px-3 font-bold text-cyan-400">
                    {art.views > 0 ? art.views.toLocaleString("en-IN") : "-"}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => toggleBreaking(art.id)}
                        title="Toggle Breaking News Badge"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          art.isBreaking
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RICH ARTICLE COMPOSER MODAL */}
      {showComposer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-3xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                  NEW ARTICLE EDITOR
                </span>
                <h3 className="text-lg font-black text-white">Compose Article &amp; Financial Analysis</h3>
              </div>
              <button
                onClick={() => setShowComposer(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4 text-xs">
              {/* Title Input */}
              <div>
                <label className="block text-slate-300 font-extrabold mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy IPO DRHP Analysis: Valuation, Financials & Market Outlook"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!seoTitle) setSeoTitle(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              {/* Category & Breaking Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="IPO News">IPO News</option>
                    <option value="Research Report">Research Report</option>
                    <option value="Market Analysis">Market Analysis</option>
                    <option value="Pre-IPO Insights">Pre-IPO Insights</option>
                    <option value="Buying Guide">Buying Guide</option>
                    <option value="Regulatory & SEBI">Regulatory &amp; SEBI</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-bold">
                    <input
                      type="checkbox"
                      checked={isBreaking}
                      onChange={(e) => setIsBreaking(e.target.checked)}
                      className="w-4 h-4 rounded-xs border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Mark as Breaking News Banner</span>
                  </label>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Short Summary / Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="2-3 sentences summarizing the key takeaway for readers..."
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    if (!seoDescription) setSeoDescription(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Content Body Editor */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-bold">Article Body &amp; Markdown Content</label>
                  <div className="flex gap-1">
                    <span className="p-1 rounded-md bg-slate-800 text-slate-400 cursor-not-allowed">
                      <Bold className="w-3.5 h-3.5" />
                    </span>
                    <span className="p-1 rounded-md bg-slate-800 text-slate-400 cursor-not-allowed">
                      <Italic className="w-3.5 h-3.5" />
                    </span>
                    <span className="p-1 rounded-md bg-slate-800 text-slate-400 cursor-not-allowed">
                      <List className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
                <textarea
                  rows={6}
                  placeholder="Write complete financial report or news article using Markdown format..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed"
                />
              </div>

              {/* SEO PREVIEW BOX */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
                    Google Search SEO Preview
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-500 truncate">
                    https://ipopreipo.com &gt; article &gt; {title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "article-slug"}
                  </p>
                  <p className="text-sm font-bold text-blue-400 hover:underline cursor-pointer truncate">
                    {seoTitle || title || "Article Title Preview"}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {seoDescription || excerpt || "Article snippet description preview formatted for search engines..."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 font-bold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleQuickPublish(e, false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleQuickPublish(e, true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                >
                  Publish Live 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
