"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Clock, Eye, ChevronRight } from "lucide-react";
import { MOCK_ARTICLES } from "@/data/mockArticles";

export default function PublicArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Credit Cards Guide",
    "IPO News",
    "Research Report",
    "Pre-IPO Insights",
    "Regulatory & SEBI",
  ];

  const publishedArticles = MOCK_ARTICLES.filter((a) => a.status === "Published");

  const filteredArticles = publishedArticles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArticle = publishedArticles.find((a) => a.isFeatured) || publishedArticles[0];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80">
              <BookOpen className="w-3 h-3" />
              FINANCIAL GUIDES &amp; COMPARISON DESK
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Financial Research, Credit Card Guides &amp; Market Insights
            </h1>
            <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
              In-depth decision guides, side-by-side credit card comparisons, DRHP teardowns, pre-IPO valuations, and regulatory SEBI analysis written by financial analysts.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Hero Article */}
      {featuredArticle && selectedCategory === "All" && !searchQuery && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {featuredArticle.featuredImage && (
            <div className="lg:col-span-5 relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-xs border border-slate-100/80">
              <img
                src={featuredArticle.featuredImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
                FEATURED STORY
              </span>
            </div>
          )}

          <div className={`${featuredArticle.featuredImage ? "lg:col-span-7" : "lg:col-span-12"} space-y-3.5`}>
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5]">
                {featuredArticle.category}
              </span>
              <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5" /> {featuredArticle.readingTimeMins} min read
              </span>
              <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                <Eye className="w-3.5 h-3.5" /> {featuredArticle.views.toLocaleString()} views
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-800 hover:text-blue-700 transition-colors leading-tight">
              <Link href={`/articles/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">{featuredArticle.excerpt}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {featuredArticle.author.avatarUrl ? (
                  <img
                    src={featuredArticle.author.avatarUrl}
                    alt={featuredArticle.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold text-xs border border-slate-200">
                    {featuredArticle.author.name[0]}
                  </div>
                )}
                <div>
                  <strong className="text-xs text-slate-800 block font-bold">{featuredArticle.author.name}</strong>
                  <span className="text-[10px] text-slate-400 block font-medium">{featuredArticle.author.role}</span>
                </div>
              </div>

              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="px-4 py-1.5 rounded-full bg-[#0c1220] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
              >
                Read Guide <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md hover:border-slate-300/80 transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {art.featuredImage && (
                <div className="h-44 w-full rounded-xl overflow-hidden relative border border-slate-100/80">
                  <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900/90 text-white shadow-xs uppercase tracking-wider">
                    {art.category}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {art.readingTimeMins} min read
                </span>
                <span>•</span>
                <span>{art.publishDate}</span>
              </div>

              <h3 className="font-bold text-base text-slate-800 hover:text-blue-700 leading-snug transition-colors">
                <Link href={`/articles/${art.slug}`}>{art.title}</Link>
              </h3>

              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">{art.excerpt}</p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {art.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/40">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-bold">By {art.author.name}</span>
              <Link
                href={`/articles/${art.slug}`}
                className="font-bold text-[#0c1220] hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                Read Article <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
