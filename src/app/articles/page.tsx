"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Clock, Eye, ChevronRight, Newspaper, ArrowRight } from "lucide-react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80", // Chart
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80", // Trading screen
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80", // Digital metrics
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80", // Bull sculpture
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80"  // Rupee / cash / coins
];

export default function PublicArticlesPage() {
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);

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
    loadNews();
  }, []);

  const featuredArticle = news[0];
  const remainingArticles = news.slice(1);

  // Mobile layout view selector: 'reels' or 'list'
  const [mobileView, setMobileView] = useState<"reels" | "list">("reels");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleShare = async (art: any, index: number) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: art.title,
          text: art.description,
          url: art.link,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${art.title} - ${art.link}`);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex && index >= 0 && index < news.length) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-6 font-sans bg-[#f8fafc]">
      {/* Header Banner */}
      <div className="hidden md:block p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/80">
              <BookOpen className="w-3 h-3" />
              LIVE FINANCIAL NEWS &amp; RESEARCH DESK
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Real-Time Market Headlines, IPO Insights &amp; Financial Updates
            </h1>
            <p className="text-slate-650 text-[11px] sm:text-xs leading-relaxed max-w-3xl font-medium">
              Stay ahead of the curve with direct automated market reports, listing evaluations, and regulatory changes parsed in real-time from financial publishers.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Title Header */}
      <div className="md:hidden pt-2 pb-1 space-y-1">
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          Market News &amp; Blogs
        </h1>
        <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
          Real-time financial updates, listing guides &amp; market updates.
        </p>
      </div>

      {newsLoading ? (
        <div className="py-24 text-center text-xs font-semibold text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          Loading latest news headlines...
        </div>
      ) : news.length === 0 ? (
        <div className="py-24 text-center text-xs font-semibold text-slate-400 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          No recent news articles available. Please check back shortly.
        </div>
      ) : (
        <>
          {/* Featured Hero Article */}
          {featuredArticle && (
            <a
              href={featuredArticle.link}
              target="_blank"
              rel="noreferrer"
              className="group hidden md:grid p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all duration-300 grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer"
            >
              <div className="lg:col-span-5 relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-xs border border-slate-100/80">
                <img
                  src={FALLBACK_IMAGES[0]}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
                  FEATURED STORY
                </span>
              </div>

              <div className="lg:col-span-7 space-y-3.5">
                <div className="flex items-center gap-3 flex-wrap text-xs">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5]">
                    Market Update
                  </span>
                  <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" /> 3 min read
                  </span>
                  <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                    <Eye className="w-3.5 h-3.5" /> Live
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                  {featuredArticle.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold text-xs border border-slate-200">
                      E
                    </div>
                    <div>
                      <strong className="text-xs text-slate-800 block font-bold">ET Now</strong>
                      <span className="text-[10px] text-slate-400 block font-medium">Editorial Feed</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">
                    Read Article <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </a>
          )}

          {/* Articles Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {remainingArticles.map((art, index) => (
              <a
                key={index}
                href={art.link}
                target="_blank"
                rel="noreferrer"
                className="group p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md hover:border-slate-300/80 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="h-44 w-full rounded-xl overflow-hidden relative border border-slate-100/80">
                    <img
                      src={FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length]}
                      alt={art.title}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900/90 text-white shadow-xs uppercase tracking-wider">
                      IPO News
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 3 min read
                    </span>
                    <span>•</span>
                    <span>{art.pubDate ? new Date(art.pubDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-700 leading-snug transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {art.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-bold">By ET Now</span>
                  <span className="font-bold text-[#0c1220] group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                    Read Article <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Mobile News Feed - Reels View */}
          {mobileView === "reels" ? (
            <div className="md:hidden fixed inset-x-0 top-0 bottom-14 z-[9990] bg-[#f8fafc] flex flex-col select-none">
              
              {/* Progress Indicator Bars */}
              <div className="absolute top-2.5 inset-x-4 z-50 flex gap-1">
                {news.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-1 flex-1 rounded-full bg-slate-200/80 overflow-hidden"
                  >
                    <div
                      className={`h-full bg-blue-600 transition-all duration-300 ${
                        idx === activeIndex
                          ? "w-full"
                          : idx < activeIndex
                          ? "w-full bg-blue-600/70"
                          : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Reels Custom Header */}
              <div className="absolute top-6 inset-x-0 z-45 px-4 flex justify-between items-center bg-gradient-to-b from-white/90 via-white/40 to-transparent pb-8">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span className="font-black text-xs text-slate-800 uppercase tracking-wider">Market Shorts</span>
                </div>
                <button
                  onClick={() => setMobileView("list")}
                  className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-slate-700 font-extrabold text-[10px] border border-slate-200/80 shadow-xs flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  List View
                </button>
              </div>

              {/* Snap-Scroll Container */}
              <div
                onScroll={handleScroll}
                className="flex-1 w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth scrollbar-none"
              >
                {news.map((art, index) => {
                  const bgImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                  return (
                    <div
                      key={index}
                      className="w-full h-full snap-start relative flex flex-col justify-between"
                      style={{ height: "calc(100dvh - 56px)" }}
                    >
                      {/* Ambient Blur Backdrop Image */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={bgImage}
                          alt=""
                          className="w-full h-full object-cover scale-110 blur-xl opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-[#f8fafc]/90 to-[#f8fafc]" />
                      </div>

                      {/* Content Section */}
                      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 pt-16 pb-4 max-w-md mx-auto w-full">
                        
                        {/* Featured Graphic Card */}
                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-slate-200/80 relative group mb-6 bg-white flex items-center justify-center">
                          <img
                            src={bgImage}
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/60 uppercase tracking-wider">
                            ET Now Live Feed
                          </span>
                        </div>

                        {/* Title & Metadata */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-700">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-850 border border-blue-200/60 uppercase tracking-wider">IPO News</span>
                            <span>•</span>
                            <span>{art.pubDate ? new Date(art.pubDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}</span>
                          </div>

                          <h3 className="font-black text-base text-slate-900 leading-snug tracking-tight">
                            {art.title}
                          </h3>

                          <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                            {art.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Sidebar Interactions Overlay */}
                      <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4">
                        <button
                          onClick={() => handleShare(art, index)}
                          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 active:scale-90 transition-all shadow-md hover:bg-slate-50"
                        >
                          {copiedIndex === index ? (
                            <span className="text-[10px] text-emerald-600 font-bold">Copied</span>
                          ) : (
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.278m0 0a3.002 3.002 0 112.166-2.164m-2.166 2.164l-4.636 2.278m0 0A3.002 3.002 0 1012.7 17.3l4.636-2.278" />
                            </svg>
                          )}
                        </button>
                        <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">Share</span>
                      </div>

                      {/* Swipe / Action Bar Container */}
                      <div className="relative z-10 px-4 pb-6 pt-2 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/80 to-transparent w-full">
                        <div className="max-w-md mx-auto flex flex-col gap-3">
                          <a
                            href={art.link}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 border border-blue-500"
                          >
                            Read Full Story
                            <ChevronRight className="w-4 h-4" />
                          </a>
                          
                          <div className="flex justify-center items-center gap-1 text-[9px] font-bold text-slate-550">
                            <span>Swipe up for next story</span>
                            <ChevronRight className="w-3 h-3 rotate-90 animate-bounce" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Mobile News Feed - Standard List View */
            <div className="md:hidden divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {news.map((art, index) => (
                <a
                  key={index}
                  href={art.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 flex gap-3.5 hover:bg-slate-50/50 transition-colors active:bg-slate-100 cursor-pointer"
                >
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                      <span className="text-blue-750 font-extrabold uppercase tracking-wider">IPO News</span>
                      <span>•</span>
                      <span>{art.pubDate ? new Date(art.pubDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal font-medium">{art.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5 font-semibold">
                      <span>By ET Now</span>
                      <span>•</span>
                      <span>3 min read</span>
                    </div>
                  </div>
                  <div className="w-18 h-18 rounded-xl overflow-hidden shrink-0 border border-slate-150 shadow-3xs bg-slate-50">
                    <img
                      src={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
