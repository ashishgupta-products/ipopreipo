"use client";

import React, { useState } from "react";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  name,
  logoUrl,
  size = "md",
  className = ""
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate initials from company name (e.g. "Hyundai Motor India" -> "HM", "Swiggy" -> "SW")
  const words = name.replace(/(Limited|IPO|Inc|Corp|Ltd|Pvt)/gi, "").trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : words[0]?.slice(0, 2).toUpperCase() || "IP";

  // Size dimensions
  const sizeClasses = {
    xs: "w-6 h-6 text-[10px] rounded-md",
    sm: "w-8 h-8 text-xs rounded-lg",
    md: "w-10 h-10 text-xs font-black rounded-xl",
    lg: "w-12 h-12 text-sm font-black rounded-xl",
    xl: "w-16 h-16 text-lg font-black rounded-2xl"
  };

  // Curated color themes based on name char codes for consistent visual branding
  const charCodeSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgGradients = [
    "from-blue-700 to-indigo-900 text-white border-blue-600/30",
    "from-emerald-700 to-teal-900 text-white border-emerald-600/30",
    "from-purple-700 to-violet-900 text-white border-purple-600/30",
    "from-amber-600 to-orange-800 text-white border-amber-600/30",
    "from-rose-700 to-pink-900 text-white border-rose-600/30",
    "from-cyan-700 to-blue-900 text-white border-cyan-600/30"
  ];
  const activeGradient = bgGradients[charCodeSum % bgGradients.length];

  if (logoUrl && !imageError) {
    return (
      <div className={`relative shrink-0 overflow-hidden bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1 ${sizeClasses[size]} ${className}`}>
        <img
          src={logoUrl}
          alt={`${name} Logo`}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain rounded"
        />
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 bg-gradient-to-br ${activeGradient} border shadow-xs font-black flex items-center justify-center tracking-tight ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};
