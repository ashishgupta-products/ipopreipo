"use client";

import React, { useState } from "react";
import { Wifi, CreditCard as CreditCardIcon } from "lucide-react";

interface CreditCardGraphicProps {
  name: string;
  issuer?: string;
  logoUrl?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const CreditCardGraphic: React.FC<CreditCardGraphicProps> = ({
  name,
  issuer,
  logoUrl,
  size = "md",
  className = ""
}) => {
  const [imgError, setImgError] = useState(false);

  // Aspect ratio ~1.58:1 matching physical credit cards
  const sizeClasses = {
    xs: "w-10 h-6 rounded-xs p-1 text-[7px]",
    sm: "w-14 h-9 rounded-sm p-1 text-[8px]",
    md: "w-20 h-13 rounded-md p-1.5 text-[10px]",
    lg: "w-28 h-18 rounded-lg p-2 text-xs",
    xl: "w-40 h-25 sm:w-48 sm:h-30 rounded-xl p-3 text-xs sm:text-sm"
  };

  const nameLower = name.toLowerCase();

  let gradientTheme = "from-slate-900 via-indigo-950 to-slate-900 border-slate-700/60 text-white shadow-slate-900/30";
  let networkBadge = "VISA";
  let accentColor = "text-amber-300";

  if (nameLower.includes("hdfc") || nameLower.includes("millennia")) {
    gradientTheme = "from-blue-950 via-indigo-900 to-slate-950 border-blue-500/40 text-white shadow-blue-950/40";
    networkBadge = "VISA";
    accentColor = "text-cyan-300";
  } else if (nameLower.includes("amazon") || nameLower.includes("icici")) {
    gradientTheme = "from-slate-950 via-slate-900 to-amber-950 border-amber-500/40 text-amber-100 shadow-amber-950/40";
    networkBadge = "VISA";
    accentColor = "text-amber-400";
  } else if (nameLower.includes("sbi") || nameLower.includes("simplyclick")) {
    gradientTheme = "from-cyan-950 via-blue-900 to-indigo-950 border-cyan-500/40 text-white shadow-cyan-950/40";
    networkBadge = "Mastercard";
    accentColor = "text-blue-300";
  } else if (nameLower.includes("axis") || nameLower.includes("zone")) {
    gradientTheme = "from-rose-950 via-purple-950 to-slate-950 border-rose-500/40 text-white shadow-rose-950/40";
    networkBadge = "RuPay";
    accentColor = "text-pink-300";
  } else if (nameLower.includes("idfc") || nameLower.includes("wealth")) {
    gradientTheme = "from-neutral-950 via-stone-900 to-amber-950 border-amber-500/50 text-amber-200 shadow-amber-950/50";
    networkBadge = "Infinite";
    accentColor = "text-amber-300";
  }

  const shortName = name
    .replace(/(Credit Card|Card|Bank)/gi, "")
    .trim();

  // Standard high-res credit card image display
  if (logoUrl && !imgError) {
    return (
      <div className={`relative shrink-0 overflow-hidden bg-slate-900 border border-slate-700/50 shadow-md ${sizeClasses[size]} ${className}`}>
        <img
          src={logoUrl}
          alt={`${name} Card`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded"
        />
      </div>
    );
  }

  // Realistic Physical Credit Card Graphic Mockup
  return (
    <div
      className={`relative shrink-0 bg-gradient-to-br ${gradientTheme} border shadow-md font-sans flex flex-col justify-between overflow-hidden select-none transform transition-transform hover:scale-[1.03] ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {/* Glossy Metallic Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Top Header: Issuer Name + Wireless Wifi Icon */}
      <div className="flex justify-between items-center z-10">
        <span className="font-extrabold tracking-wider uppercase opacity-95 truncate max-w-[75%] drop-shadow-xs">
          {issuer || name.split(" ")[0]}
        </span>
        <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-80 shrink-0 rotate-90" />
      </div>

      {/* Center: Golden EMV Chip */}
      <div className="flex items-center gap-1 z-10 my-0.5">
        <div className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border border-amber-300/80 shadow-2xs flex items-center justify-center">
          <div className="w-full h-[1px] bg-amber-800/40" />
        </div>
      </div>

      {/* Bottom Footer: Card Title + Network Badge */}
      <div className="flex justify-between items-end z-10">
        <span className={`font-black tracking-tight truncate max-w-[68%] ${accentColor} drop-shadow-xs`}>
          {shortName}
        </span>
        <span className="font-extrabold italic text-[7px] sm:text-[9px] tracking-tighter opacity-90 bg-white/15 px-1 py-0.2 rounded border border-white/15">
          {networkBadge}
        </span>
      </div>
    </div>
  );
};

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "auto" | "company" | "credit_card";
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  name,
  logoUrl,
  size = "md",
  className = "",
  variant = "auto"
}) => {
  const [imageError, setImageError] = useState(false);

  const isCard =
    variant === "credit_card" ||
    (variant === "auto" &&
      (name.toLowerCase().includes("credit card") || name.toLowerCase().includes("card")));

  if (isCard) {
    return (
      <CreditCardGraphic
        name={name}
        logoUrl={logoUrl}
        size={size}
        className={className}
      />
    );
  }

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
