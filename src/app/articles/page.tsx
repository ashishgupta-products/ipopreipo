"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Search, Clock, Eye, ChevronRight, Newspaper, ArrowRight } from "lucide-react";

export default function PublicArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setNews(json.data);
        }
      } catch (err) {
        console.error("Failed to load articles page news:", err);
      } finally {
        setNewsLoading(false);
      }
    }
    
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data);
        }
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setIsLoadingArticles(false);
      }
    }

    loadNews();
    loadArticles();
  }, []);

  const categories = [
    "All",
    "Credit Cards Guide",
    "Payment Apps Guide",
    "IPO News",
    "Research Report",
    "Pre-IPO Insights",
    "Regulatory & SEBI",
  ];

  const publishedArticles = articles;

  const filteredArticles = publishedArticles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArticle = publishedArticles.find((a) => a.isFeatured) || publishedArticles[0];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Header Banner */}
      <div className="hidden md:block p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
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

      {/* Mobile Title Header */}
      <div className="md:hidden pt-2 pb-1 space-y-1">
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          Market News &amp; Guides
        </h1>
        <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
          In-depth decision guides, credit card comparisons &amp; pre-IPO valuations.
        </p>
      </div>

      {/* Featured Hero Article */}
      {featuredArticle && selectedCategory === "All" && !searchQuery && (
        <div className="hidden md:grid p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300 grid-cols-1 lg:grid-cols-12 gap-6 items-center">
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

      {/* Live Market & IPO News Section */}
      <section className="w-full">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                <Newspaper className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1.5 font-sans">
                  Live Market &amp; IPO Headlines
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  Real-time market insights and financial updates sourced directly from ET Now.
                </p>
              </div>
            </div>
          </div>

          {newsLoading ? (
            <div className="py-8 text-center text-xs font-semibold text-slate-400 animate-pulse">
              Loading latest news headlines...
            </div>
          ) : news.length === 0 ? (
            <div className="py-8 text-center text-xs font-semibold text-slate-400">
              No recent news articles available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between space-y-2 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span className="text-blue-705 font-bold uppercase tracking-wider text-[9px]">Market Update</span>
                      <span>{item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-[10px] font-bold text-blue-700 flex items-center gap-1.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 w-full">
        {/* Category Pills */}
        <div className="flex flex-row items-center gap-1.5 text-xs font-bold overflow-x-auto whitespace-nowrap scrollbar-none pb-1 md:pb-0 w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-205"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-60 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 md:top-2" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 md:py-1.5 rounded-lg border border-slate-200 bg-white md:bg-slate-50 text-slate-900 text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all shadow-3xs md:shadow-none"
          />
        </div>
      </div>

      {isLoadingArticles ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400 animate-pulse">
          Loading articles library...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400">
          No articles match your selection.
        </div>
      ) : (
        <>
          {/* Articles Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    {art.tags.slice(0, 3).map((tag: string, i: number) => (
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

          {/* Mobile News Feed */}
          <div className="md:hidden divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {filteredArticles.map((art) => (
              <Link
                key={art.id}
                href={`/articles/${art.slug}`}
                className="p-4 flex gap-3.5 hover:bg-slate-50/50 transition-colors active:bg-slate-100"
              >
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                    <span className="text-blue-750 font-extrabold uppercase tracking-wider">{art.category}</span>
                    <span>•</span>
                    <span>{art.publishDate}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal font-medium">{art.excerpt}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5 font-semibold">
                    <span>By {art.author.name}</span>
                    <span>•</span>
                    <span>{art.readingTimeMins} min read</span>
                  </div>
                </div>
                {art.featuredImage && (
                  <div className="w-18 h-18 rounded-xl overflow-hidden shrink-0 border border-slate-150 shadow-3xs bg-slate-50">
                    <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
