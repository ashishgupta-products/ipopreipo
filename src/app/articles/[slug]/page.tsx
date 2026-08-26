"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Tag, 
} from "lucide-react";
import ArticleCardComparisonWidget from "@/components/articles/ArticleCardComparisonWidget";
import PaymentAppCompareWidget from "@/components/articles/PaymentAppCompareWidget";
import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${resolvedParams.slug}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const json = await res.json();
            if (json.success) {
              setArticle(json.data);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load article details:", e);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-sans bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-slate-350 border-t-blue-700 animate-spin"></div>
        <p className="text-slate-500 text-xs font-semibold">Loading article details...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-sans bg-[#f8fafc]">
        <h1 className="text-xl font-black text-slate-900">Article Not Found</h1>
        <p className="text-slate-600 text-xs font-medium">The article you requested could not be located in our database.</p>
        <Link href="/articles" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0c1220] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles Hub
        </Link>
      </div>
    );
  }

  const isCreditCardGuide = article.category === "Credit Cards Guide" || article.slug.includes("credit-card");
  const isPaymentAppGuide = article.category === "Payment Apps Guide" || article.slug.includes("payment-app") || article.slug.includes("upi");

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-6 space-y-5 font-sans bg-[#f8fafc]">
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0c1220] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>

        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#eef2ff] text-[#4f46e5] border border-blue-100">
          {article.category}
        </span>
      </div>

      {/* Article Header */}
      <div className="space-y-3 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
          {article.excerpt}
        </p>

        {/* Metadata & Author Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            {article.author.avatarUrl ? (
              <img
                src={article.author.avatarUrl}
                alt={article.author.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-xs border border-slate-200">
                {article.author.name[0]}
              </div>
            )}
            <div>
              <strong className="text-slate-800 block font-bold">{article.author.name}</strong>
              <span className="text-slate-400 block text-[10px] font-medium">{article.author.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-semibold text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readingTimeMins} min read
            </span>
            <span>•</span>
            <span>Published {article.publishDate}</span>
          </div>
        </div>
      </div>

      {/* Featured Banner Image */}
      {article.featuredImage && (
        <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-xs border border-slate-100/80">
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500" />
        </div>
      )}

      {/* Embedded Interactive Card Selector Widget (If Credit Card Article) */}
      {isCreditCardGuide && (
        <div className="my-5">
          <ArticleCardComparisonWidget />
        </div>
      )}

      {/* Embedded Interactive Payment App Selector Widget (If Payment App Article) */}
      {isPaymentAppGuide && (
        <div className="my-5">
          <PaymentAppCompareWidget />
        </div>
      )}

      {/* Article Body Content */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/60 shadow-xs space-y-5 text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
        <div
          className="prose prose-slate max-w-none space-y-4"
          dangerouslySetInnerHTML={{
            __html: article.content
              .replace(/# (.*)/g, '<h1 class="text-lg sm:text-xl font-black text-slate-900 mt-6 mb-3">$1</h1>')
              .replace(/## (.*)/g, '<h2 class="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2 border-b border-slate-200 pb-1">$1</h2>')
              .replace(/### (.*)/g, '<h3 class="text-xs sm:text-sm font-bold text-slate-900 mt-4 mb-1">$1</h3>')
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>')
              .replace(/\n\n/g, '<p class="mb-3"></p>')
              .replace(/- (.*)/g, '<li class="ml-4 list-disc text-slate-600 font-medium">$1</li>')
          }}
        />
      </div>

      {/* Tags & Explore More */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Tag className="w-3.5 h-3.5 text-blue-800" />
          Tags &amp; Keywords:
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {article.tags.map((t: string, i: number) => (
            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/40">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Cross-Link Call to Action */}
      <div className="p-5 rounded-2xl bg-[#0c1220] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-950/10 shadow-xs">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-sm sm:text-base tracking-tight">Want to Compare All Credit Cards Side-by-Side?</h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Use our interactive Cashback &amp; Net Savings Estimator with live monthly spend sliders.
          </p>
        </div>

        <Link
          href="/credit-cards"
          className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-xs"
        >
          Launch Comparison Desk
        </Link>
      </div>
    </div>
  );
}
