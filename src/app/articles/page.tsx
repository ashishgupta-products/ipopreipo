"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  Eye, 
  ChevronRight, 
  Newspaper, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  FileText
} from "lucide-react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80", // Chart
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80", // Trading screen
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80", // Digital metrics
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80", // Bull sculpture
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80"  // Rupee / cash / coins
];

export default function PublicArticlesPage() {
  const [activeTab, setActiveTab] = useState<"research" | "news">("research");
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState<boolean>(true);
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      // Load Research Articles
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setArticles(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setArticlesLoading(false);
      }

      // Load News Feed
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setNews(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load articles page news:", err);
      } finally {
        setNewsLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredResearch = articles.find((a) => a.isFeatured) || articles[0];
  const remainingResearch = articles.filter((a) => a.id !== featuredResearch?.id);

  const featuredNews = news[0];
  const remainingNews = news.slice(1);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-6 font-sans bg-[#f8fafc]">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80">
              <BookOpen className="w-3.5 h-3.5" />
              IPO RESEARCH DESK &amp; MARKET INSIGHTS
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              In-Depth IPO Valuation Reports &amp; Market Guides
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl font-medium">
              Read comprehensive fundamental reviews, promoter holding analyses, financial breakdowns, and real-time news headlines for upcoming and listed IPOs.
            </p>
          </div>
        </div>

        {/* Tab Switcher: Research Reports vs Live News */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab("research")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "research"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            IPO Research Reports ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "news"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
            Live Market News ({news.length})
          </button>
        </div>
      </div>

      {/* RESEARCH ARTICLES TAB */}
      {activeTab === "research" && (
        <>
          {articlesLoading ? (
            <div className="py-24 text-center text-xs font-semibold text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              Loading IPO research articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="py-24 text-center text-xs font-semibold text-slate-400 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              No research articles available. Please check back shortly.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Featured Research Card */}
              {featuredResearch && (
                <Link
                  href={`/articles/${featuredResearch.slug}`}
                  className="group grid p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer"
                >
                  <div className="lg:col-span-5 relative h-56 sm:h-72 w-full rounded-xl overflow-hidden shadow-xs border border-slate-100/80 bg-slate-100">
                    <img
                      src={featuredResearch.featuredImage || FALLBACK_IMAGES[0]}
                      alt={featuredResearch.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGES[0];
                      }}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> FEATURED REPORT
                    </span>
                  </div>

                  <div className="lg:col-span-7 space-y-3.5">
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {featuredResearch.category}
                      </span>
                      <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> {featuredResearch.readingTimeMins} min read
                      </span>
                      <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                        <Eye className="w-3.5 h-3.5" /> {featuredResearch.views.toLocaleString()} views
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                      {featuredResearch.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                      {featuredResearch.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        {featuredResearch.author?.avatarUrl ? (
                          <img
                            src={featuredResearch.author.avatarUrl}
                            alt={featuredResearch.author.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center border border-blue-200">
                            {featuredResearch.author?.name ? featuredResearch.author.name.charAt(0) : "A"}
                          </div>
                        )}
                        <div>
                          <strong className="text-xs text-slate-800 block font-bold">
                            {featuredResearch.author?.name || "Equity Research Desk"}
                          </strong>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {featuredResearch.author?.role || "Senior Analyst"} • {featuredResearch.publishDate}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                        Read Full Analysis <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Research Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {remainingResearch.map((art, index) => (
                  <Link
                    key={art.id || index}
                    href={`/articles/${art.slug}`}
                    className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="h-44 w-full rounded-xl overflow-hidden relative border border-slate-100/80 bg-slate-100">
                        <img
                          src={art.featuredImage || FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length]}
                          alt={art.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length];
                          }}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900/90 text-white shadow-xs uppercase tracking-wider">
                          {art.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {art.readingTimeMins} min read
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {art.views?.toLocaleString() || 0}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 leading-snug transition-colors line-clamp-2">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        {art.author?.avatarUrl ? (
                          <img
                            src={art.author.avatarUrl}
                            alt={art.author.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                            {art.author?.name ? art.author.name.charAt(0) : "A"}
                          </div>
                        )}
                        <span className="text-slate-600 font-semibold text-[11px]">
                          {art.author?.name || "Analyst"}
                        </span>
                      </div>
                      <span className="font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read Report <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* LIVE NEWS FEED TAB */}
      {activeTab === "news" && (
        <>
          {newsLoading ? (
            <div className="py-24 text-center text-xs font-semibold text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              Loading latest news headlines...
            </div>
          ) : news.length === 0 ? (
            <div className="py-24 text-center text-xs font-semibold text-slate-400 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              No recent news articles available. Please check back shortly.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Featured News */}
              {featuredNews && (
                <a
                  href={featuredNews.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer"
                >
                  <div className="lg:col-span-5 relative h-56 sm:h-72 w-full rounded-xl overflow-hidden shadow-xs border border-slate-100/80 bg-slate-100">
                    <img
                      src={featuredNews.imageUrl || FALLBACK_IMAGES[0]}
                      alt={featuredNews.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGES[0];
                      }}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <Newspaper className="w-3 h-3" /> BREAKING NEWS
                    </span>
                  </div>

                  <div className="lg:col-span-7 space-y-3.5">
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {featuredNews.source || "Market Feed"}
                      </span>
                      <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> 3 min read
                      </span>
                      <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                        <Eye className="w-3.5 h-3.5" /> Live
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                      {featuredNews.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                      {featuredNews.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-xs">
                          {featuredNews.source ? featuredNews.source.charAt(0) : "N"}
                        </div>
                        <div>
                          <strong className="text-xs text-slate-800 block font-bold">{featuredNews.source || "News Feed"}</strong>
                          <span className="text-[10px] text-slate-400 block font-medium">Editorial Feed</span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                        Read on Publisher <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              )}

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {remainingNews.map((art, index) => (
                  <a
                    key={index}
                    href={art.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="h-44 w-full rounded-xl overflow-hidden relative border border-slate-100/80 bg-slate-100">
                        <img
                          src={art.imageUrl || FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length]}
                          alt={art.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length];
                          }}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900/90 text-white shadow-xs uppercase tracking-wider">
                          {art.title.toLowerCase().includes("ipo") ? "IPO News" : "Market News"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 3 min read
                        </span>
                        <span>•</span>
                        <span>{art.pubDate ? new Date(art.pubDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}</span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 leading-snug transition-colors line-clamp-2">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-4">
                        {art.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-bold">By {art.source || "News Feed"}</span>
                      <span className="font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read Story <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
