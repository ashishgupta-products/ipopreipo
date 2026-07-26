"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Clock, Eye, Sparkles, ChevronRight, User, Tag } from "lucide-react";
import { MOCK_ARTICLES } from "@/data/mockArticles";
import { ArticleCategory, ArticlePost } from "@/types/editor";

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
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white space-y-3 shadow-xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          FINANCIAL GUIDES &amp; COMPARISON DESK
        </span>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Financial Research, Credit Card Guides &amp; Market Insights
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          In-depth decision guides, side-by-side credit card comparisons, DRHP teardowns, pre-IPO valuations, and regulatory SEBI analysis written by financial analysts.
        </p>
      </div>

      {/* Featured Hero Article */}
      {featuredArticle && selectedCategory === "All" && !searchQuery && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-blue-300 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {featuredArticle.featuredImage && (
            <div className="lg:col-span-5 relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-inner">
              <img
                src={featuredArticle.featuredImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider shadow">
                FEATURED STORY
              </span>
            </div>
          )}

          <div className={`${featuredArticle.featuredImage ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {featuredArticle.category}
              </span>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {featuredArticle.readingTimeMins} min read
              </span>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {featuredArticle.views.toLocaleString()} views
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight hover:text-blue-700">
              <Link href={`/articles/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">{featuredArticle.excerpt}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {featuredArticle.author.avatarUrl ? (
                  <img
                    src={featuredArticle.author.avatarUrl}
                    alt={featuredArticle.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                    {featuredArticle.author.name[0]}
                  </div>
                )}
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">{featuredArticle.author.name}</strong>
                  <span className="text-[10px] text-slate-500 block">{featuredArticle.author.role}</span>
                </div>
              </div>

              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                Read Guide <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedCategory === cat
                  ? "bg-blue-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search articles or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-700"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {art.featuredImage && (
                <div className="h-44 w-full rounded-lg overflow-hidden relative">
                  <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-900/90 text-white shadow">
                    {art.category}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {art.readingTimeMins} min read
                </span>
                <span>•</span>
                <span>{art.publishDate}</span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 hover:text-blue-700 leading-snug">
                <Link href={`/articles/${art.slug}`}>{art.title}</Link>
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{art.excerpt}</p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                {art.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">By {art.author.name}</span>
              <Link
                href={`/articles/${art.slug}`}
                className="font-extrabold text-blue-900 hover:text-blue-700 flex items-center gap-1"
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
