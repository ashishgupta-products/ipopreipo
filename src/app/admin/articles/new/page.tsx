"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Image as ImageIcon, 
  User, 
  Tag, 
  Globe 
} from "lucide-react";
import { ArticleCategory, ArticleStatus } from "@/types/editor";

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("IPO News");
  const [status, setStatus] = useState<ArticleStatus>("Published");
  const [authorName, setAuthorName] = useState("Market Research Desk");
  const [authorRole, setAuthorRole] = useState("Senior IPO Analyst");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tagsInput, setTagsInput] = useState("IPO, GMP, Mainboard, Investment");
  const [isFeatured, setIsFeatured] = useState(false);
  const [readingTimeMins, setReadingTimeMins] = useState(5);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [submitting, setSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generatedSlug);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert("Please provide Title, Slug, and Article Content.");
      return;
    }

    setSubmitting(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id: `art_${Date.now()}`,
      slug,
      title,
      excerpt: excerpt || title,
      content,
      category,
      status,
      author: {
        name: authorName,
        role: authorRole,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      tags,
      featuredImage: featuredImage || undefined,
      publishDate: new Date().toISOString().split("T")[0],
      views: 0,
      readingTimeMins: Number(readingTimeMins),
      isFeatured,
    };

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Article published successfully!");
        router.push("/admin/articles");
      } else {
        alert(data.error || "Failed to publish article");
      }
    } catch (err: any) {
      alert(err.message || "Network error while saving article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Create New Research Article</h1>
            <p className="text-xs text-slate-500">Publish in-depth IPO analysis, SEBI updates, or pre-IPO reports.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit / Preview Toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "edit" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "preview" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <button
            onClick={handlePublish}
            disabled={submitting}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-60 active:scale-98"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? "Publishing..." : "Publish Article"}</span>
          </button>
        </div>
      </div>

      {activeTab === "edit" ? (
        <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Editor (Left 8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Article Headline / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Acme Solar IPO: Live GMP Surge of +45% & Listing Day Analysis"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">/articles/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Excerpt / Meta Summary</label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief 1-2 sentence executive summary for search engines and card previews..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Article Body (Markdown Supported)
              </label>
              <textarea
                rows={16}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your in-depth analysis here using Markdown headers (##), bold text, bullet points, and tables..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 leading-relaxed transition-all"
              />
            </div>
          </div>

          {/* Publishing Settings (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs text-xs">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Publishing Details
              </h3>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="IPO News">IPO News</option>
                  <option value="Research Report">Research Report</option>
                  <option value="Market Analysis">Market Analysis</option>
                  <option value="Pre-IPO Insights">Pre-IPO Insights</option>
                  <option value="Buying Guide">Buying Guide</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Publish Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="Published">Published (Public)</option>
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="In Review">In Review</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Author Name &amp; Role</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 mb-2 focus:bg-white focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Featured Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="featCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="featCheck" className="text-slate-800 font-bold cursor-pointer">
                  Feature in Top Highlights
                </label>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Preview Mode */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 max-w-4xl mx-auto space-y-6 shadow-xs">
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{title || "Untitled Article"}</h1>
            <p className="text-xs text-slate-500">{excerpt}</p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <span>By <strong className="text-slate-800">{authorName}</strong> ({authorRole})</span>
              <span>•</span>
              <span>{readingTimeMins} min read</span>
            </div>
          </div>

          <div className="prose max-w-none text-xs leading-relaxed space-y-4 font-sans text-slate-700 whitespace-pre-line">
            {content || "No content written yet. Switch back to Write mode to compose."}
          </div>
        </div>
      )}
    </div>
  );
}
