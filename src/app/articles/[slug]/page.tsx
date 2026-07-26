"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Share2, 
  BookOpen, 
  Tag, 
  User, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { MOCK_ARTICLES } from "@/data/mockArticles";
import ArticleCardComparisonWidget from "@/components/articles/ArticleCardComparisonWidget";
import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const article = MOCK_ARTICLES.find((a) => a.slug === resolvedParams.slug);

  if (!article) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
        <p className="text-slate-600 text-sm">The article you requested could not be located in our database.</p>
        <Link href="/articles" className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles Hub
        </Link>
      </div>
    );
  }

  const isCreditCardGuide = article.category === "Credit Cards Guide" || article.slug.includes("credit-card");

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>

        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
          {article.category}
        </span>
      </div>

      {/* Article Header */}
      <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {article.title}
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed font-medium">
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
              <div className="w-9 h-9 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                {article.author.name[0]}
              </div>
            )}
            <div>
              <strong className="text-slate-900 block font-bold">{article.author.name}</strong>
              <span className="text-slate-500 block text-[11px]">{article.author.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-700" /> {article.readingTimeMins} min read
            </span>
            <span>•</span>
            <span>Published {article.publishDate}</span>
          </div>
        </div>
      </div>

      {/* Featured Banner Image */}
      {article.featuredImage && (
        <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-md">
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Embedded Interactive Card Selector Widget (If Credit Card Article) */}
      {isCreditCardGuide && (
        <div className="my-6">
          <ArticleCardComparisonWidget />
        </div>
      )}

      {/* Article Body Content */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-800 text-sm leading-relaxed font-normal">
        <div
          className="prose prose-slate max-w-none space-y-4"
          dangerouslySetInnerHTML={{
            __html: article.content
              .replace(/# (.*)/g, '<h1 class="text-2xl font-black text-slate-900 mt-6 mb-3">$1</h1>')
              .replace(/## (.*)/g, '<h2 class="text-xl font-bold text-slate-900 mt-5 mb-2 border-b border-slate-200 pb-1">$1</h2>')
              .replace(/### (.*)/g, '<h3 class="text-base font-bold text-slate-900 mt-4 mb-1">$1</h3>')
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>')
              .replace(/\n\n/g, '<p class="mb-3"></p>')
              .replace(/- (.*)/g, '<li class="ml-4 list-disc text-slate-700">$1</li>')
          }}
        />
      </div>

      {/* Tags & Explore More */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Tag className="w-3.5 h-3.5 text-blue-700" />
          Tags &amp; Keywords:
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {article.tags.map((t, i) => (
            <span key={i} className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-700">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Cross-Link Call to Action */}
      <div className="p-6 rounded-2xl bg-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-base">Want to Compare All Credit Cards Side-by-Side?</h4>
          <p className="text-xs text-slate-300">
            Use our interactive Cashback &amp; Net Savings Estimator with live monthly spend sliders.
          </p>
        </div>

        <Link
          href="/credit-cards"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 transition-all shadow-md"
        >
          Launch Card Comparison Desk →
        </Link>
      </div>
    </div>
  );
}
