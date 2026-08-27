"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, Star } from "lucide-react";

interface WatchlistButtonProps {
  ipoSlug: string;
  ipoId?: string;
  ipoName?: string;
  variant?: "icon" | "button" | "pill";
  className?: string;
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  ipoSlug,
  ipoId,
  ipoName,
  variant = "icon",
  className = "",
}) => {
  const { isWatchlisted, toggleWatchlist, isAuthenticated } = useAuth();
  const [animating, setAnimating] = useState(false);

  const saved = isWatchlisted(ipoSlug);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    await toggleWatchlist(ipoSlug, ipoId);
    setTimeout(() => setAnimating(false), 400);
  };

  if (variant === "pill") {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          saved
            ? "bg-amber-500/10 text-amber-700 border-amber-300 dark:border-amber-500/30 dark:text-amber-400"
            : "bg-white/80 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300"
        } ${animating ? "scale-110" : "scale-100"} ${className}`}
        title={saved ? "Remove from Watchlist" : "Add to Watchlist"}
      >
        <Star
          className={`w-3.5 h-3.5 ${
            saved ? "fill-amber-500 text-amber-500" : "text-slate-400"
          }`}
        />
        <span>{saved ? "Watchlisted" : "Watchlist"}</span>
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
          saved
            ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
        } ${animating ? "scale-105" : "scale-100"} ${className}`}
      >
        <Bookmark
          className={`w-4 h-4 ${
            saved ? "fill-amber-600 text-amber-600" : "text-slate-500"
          }`}
        />
        <span>{saved ? "In Watchlist" : "Add to Watchlist"}</span>
      </button>
    );
  }

  // Icon only
  return (
    <button
      onClick={handleClick}
      className={`p-1.5 rounded-lg transition-all ${
        saved
          ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
          : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
      } ${animating ? "scale-125" : "scale-100"} ${className}`}
      title={saved ? `Remove ${ipoName || "IPO"} from Watchlist` : `Add ${ipoName || "IPO"} to Watchlist`}
      aria-label="Toggle Watchlist"
    >
      <Star
        className={`w-4 h-4 ${
          saved ? "fill-amber-500 text-amber-500" : "text-slate-400"
        }`}
      />
    </button>
  );
};
