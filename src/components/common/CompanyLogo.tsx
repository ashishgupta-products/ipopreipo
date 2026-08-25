"use client";

import React, { useState, useEffect } from "react";
import { 
  Wifi, 
  CreditCard as CreditCardIcon, 
  Building2, 
  Factory, 
  TrendingUp, 
  Zap, 
  Coins, 
  Briefcase, 
  ShieldCheck,
  Cpu,
  Layers,
  Film,
  Clapperboard,
  Plane,
  Pill,
  Activity,
  Gem,
  Sparkles,
  Cog,
  Wrench,
  Sprout,
  Package,
  Truck,
  Car,
  Headphones,
  ShoppingCart,
  ShoppingBag,
  Compass,
  Utensils,
  Droplets,
  Radio,
  Dumbbell,
  Landmark,
  Code2,
  Tv
} from "lucide-react";

interface SectorTheme {
  icon: React.ElementType;
  gradient: string;
  badgeColor: string;
  textColor: string;
}

function getSectorTheme(name: string): SectorTheme {
  const lower = name.toLowerCase();

  // Entertainment / Films / Media
  if (lower.includes("sunshine") || lower.includes("picture") || lower.includes("film") || lower.includes("cinema") || lower.includes("media") || lower.includes("studio") || lower.includes("entertain")) {
    return {
      icon: Film,
      gradient: "from-amber-500 via-orange-600 to-rose-700",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-200",
      textColor: "text-white"
    };
  }

  // Aviation / Travel / Transport
  if (lower.includes("skyways") || lower.includes("air") || lower.includes("aviation") || lower.includes("fly") || lower.includes("flight") || lower.includes("makemytrip") || lower.includes("travel")) {
    return {
      icon: Plane,
      gradient: "from-sky-500 via-blue-600 to-indigo-800",
      badgeColor: "bg-sky-50 text-sky-900 border-sky-200",
      textColor: "text-white"
    };
  }

  // Healthcare / Pharma / Labs / Medical
  if (lower.includes("pharma") || lower.includes("health") || lower.includes("symbiotec") || lower.includes("lab") || lower.includes("medic") || lower.includes("bio") || lower.includes("care") || lower.includes("hospital")) {
    return {
      icon: Pill,
      gradient: "from-emerald-500 via-teal-600 to-cyan-800",
      badgeColor: "bg-emerald-50 text-emerald-900 border-emerald-200",
      textColor: "text-white"
    };
  }

  // Jewellery / Gems / Gold
  if (lower.includes("jewel") || lower.includes("gold") || lower.includes("shankesh") || lower.includes("lalithaa") || lower.includes("augmont") || lower.includes("diamond") || lower.includes("gem") || lower.includes("priority")) {
    return {
      icon: Gem,
      gradient: "from-yellow-500 via-amber-600 to-yellow-800",
      badgeColor: "bg-yellow-50 text-amber-900 border-yellow-200",
      textColor: "text-white"
    };
  }

  // Engineering / Machinery / Tools
  if (lower.includes("engineer") || lower.includes("sumax") || lower.includes("hy-tech") || lower.includes("technocrat") || lower.includes("machin") || lower.includes("tool") || lower.includes("steel") || lower.includes("metal")) {
    return {
      icon: Cog,
      gradient: "from-slate-700 via-slate-800 to-indigo-950",
      badgeColor: "bg-slate-100 text-slate-900 border-slate-300",
      textColor: "text-white"
    };
  }

  // Agriculture / Seeds / Food
  if (lower.includes("seed") || lower.includes("dhanwel") || lower.includes("agro") || lower.includes("crop") || lower.includes("farm") || lower.includes("agri")) {
    return {
      icon: Sprout,
      gradient: "from-green-600 via-emerald-700 to-teal-900",
      badgeColor: "bg-green-50 text-green-900 border-green-200",
      textColor: "text-white"
    };
  }

  // Food / Beverages / Restaurants
  if (lower.includes("beverage") || lower.includes("coca-cola") || lower.includes("parle") || lower.includes("food") || lower.includes("swiggy") || lower.includes("zomato") || lower.includes("snack") || lower.includes("dairy")) {
    return {
      icon: Utensils,
      gradient: "from-rose-500 via-red-600 to-amber-700",
      badgeColor: "bg-rose-50 text-rose-900 border-rose-200",
      textColor: "text-white"
    };
  }

  // Textiles / Fabrics / Knitwear / Fashion
  if (lower.includes("textile") || lower.includes("knit") || lower.includes("fascinate") || lower.includes("madhur") || lower.includes("craft") || lower.includes("fashion") || lower.includes("fabindia") || lower.includes("garment") || lower.includes("apparel")) {
    return {
      icon: Sparkles,
      gradient: "from-purple-600 via-fuchsia-600 to-pink-700",
      badgeColor: "bg-purple-50 text-purple-900 border-purple-200",
      textColor: "text-white"
    };
  }

  // Electronics / Audio / Gadgets
  if (lower.includes("boat") || lower.includes("audio") || lower.includes("headphone") || lower.includes("sound") || lower.includes("kuku")) {
    return {
      icon: Headphones,
      gradient: "from-red-600 via-rose-700 to-neutral-900",
      badgeColor: "bg-red-50 text-red-900 border-red-200",
      textColor: "text-white"
    };
  }

  // E-commerce / Quick Commerce / Retail
  if (lower.includes("zepto") || lower.includes("flipkart") || lower.includes("mopshop") || lower.includes("retail") || lower.includes("cart") || lower.includes("store") || lower.includes("shop")) {
    return {
      icon: ShoppingCart,
      gradient: "from-violet-600 via-purple-700 to-indigo-900",
      badgeColor: "bg-violet-50 text-violet-900 border-violet-200",
      textColor: "text-white"
    };
  }

  // Fintech / Payments / Banking / Stock Exchanges
  if (lower.includes("phonepe") || lower.includes("payu") || lower.includes("nse") || lower.includes("innoviti") || lower.includes("upstox") || lower.includes("manipal payment") || lower.includes("gaja") || lower.includes("asset") || lower.includes("wealth") || lower.includes("fincorp") || lower.includes("capital") || lower.includes("finance") || lower.includes("bank") || lower.includes("eaaa")) {
    return {
      icon: TrendingUp,
      gradient: "from-blue-600 via-indigo-700 to-purple-900",
      badgeColor: "bg-blue-50 text-blue-900 border-blue-200",
      textColor: "text-white"
    };
  }

  // Telecom / Tech / Software / Cloud
  if (lower.includes("jio") || lower.includes("esds") || lower.includes("software") || lower.includes("tech") || lower.includes("cloud") || lower.includes("data") || lower.includes("digital") || lower.includes("tempsens")) {
    return {
      icon: Cpu,
      gradient: "from-cyan-600 via-blue-700 to-indigo-900",
      badgeColor: "bg-cyan-50 text-cyan-900 border-cyan-200",
      textColor: "text-white"
    };
  }

  // Energy / Power / Renewables
  if (lower.includes("energy") || lower.includes("power") || lower.includes("solar") || lower.includes("waaree") || lower.includes("bajaj energy") || lower.includes("green") || lower.includes("electric")) {
    return {
      icon: Zap,
      gradient: "from-amber-500 via-emerald-600 to-teal-800",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-200",
      textColor: "text-white"
    };
  }

  // Real Estate / Infra / Industrial Parks
  if (lower.includes("annu") || lower.includes("project") || lower.includes("horizon") || lower.includes("park") || lower.includes("infra") || lower.includes("build") || lower.includes("realty") || lower.includes("housing")) {
    return {
      icon: Building2,
      gradient: "from-slate-700 via-blue-800 to-slate-900",
      badgeColor: "bg-slate-50 text-slate-900 border-slate-200",
      textColor: "text-white"
    };
  }

  // Automotive / Motors
  if (lower.includes("motor") || lower.includes("hero") || lower.includes("hyundai") || lower.includes("cardekho") || lower.includes("auto") || lower.includes("vehicle")) {
    return {
      icon: Car,
      gradient: "from-slate-800 via-blue-900 to-slate-950",
      badgeColor: "bg-slate-100 text-slate-900 border-slate-300",
      textColor: "text-white"
    };
  }

  // Water / Filtration
  if (lower.includes("kent") || lower.includes("water") || lower.includes("ro ")) {
    return {
      icon: Droplets,
      gradient: "from-cyan-500 via-blue-600 to-teal-700",
      badgeColor: "bg-cyan-50 text-cyan-900 border-cyan-200",
      textColor: "text-white"
    };
  }

  // Default Business Theme
  return {
    icon: Building2,
    gradient: "from-blue-700 via-indigo-800 to-slate-900",
    badgeColor: "bg-blue-50 text-blue-900 border-blue-200",
    textColor: "text-white"
  };
}

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

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

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

  return (
    <div
      className={`relative shrink-0 bg-gradient-to-br ${gradientTheme} border shadow-md font-sans flex flex-col justify-between overflow-hidden select-none transform transition-transform hover:scale-[1.03] ${sizeClasses[size]} ${className}`}
      title={name}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="flex justify-between items-center z-10">
        <span className="font-extrabold tracking-wider uppercase opacity-95 truncate max-w-[75%] drop-shadow-xs">
          {issuer || name.split(" ")[0]}
        </span>
        <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-80 shrink-0 rotate-90" />
      </div>

      <div className="flex items-center gap-1 z-10 my-0.5">
        <div className="w-3.5 h-2.5 sm:w-4 sm:h-3 rounded-xs bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border border-amber-300/80 shadow-2xs flex items-center justify-center">
          <div className="w-full h-[1px] bg-amber-800/40" />
        </div>
      </div>

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

  useEffect(() => {
    setImageError(false);
  }, [logoUrl]);

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

  // Dimension classes
  const sizeClasses = {
    xs: "w-8 h-8 rounded-lg",
    sm: "w-10 h-10 rounded-xl",
    md: "w-12 h-12 rounded-xl",
    lg: "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl",
    xl: "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl"
  };

  const iconSizes = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7 sm:w-8 sm:h-8",
    xl: "w-10 h-10 sm:w-12 sm:h-12"
  };

  // If a valid external logo image is available and hasn't failed, show it
  if (logoUrl && !imageError) {
    return (
      <div className={`relative shrink-0 overflow-hidden bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1.5 ${sizeClasses[size]} ${className}`}>
        <img
          src={logoUrl}
          alt={`${name} Logo`}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain rounded"
        />
      </div>
    );
  }

  // Dynamic Sector Theme & Icon matching for the IPO company
  const theme = getSectorTheme(name);
  const SectorIcon = theme.icon;

  return (
    <div
      className={`shrink-0 bg-gradient-to-br ${theme.gradient} border border-white/20 shadow-md flex items-center justify-center select-none relative overflow-hidden group transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {/* Glossy Refraction Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
      
      {/* Decorative Radial Backdrop Glow */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-white/20 rounded-full blur-sm pointer-events-none" />

      {/* High-Fidelity Company Sector Icon */}
      <SectorIcon className={`${iconSizes[size]} ${theme.textColor} drop-shadow-md transform group-hover:scale-110 transition-transform duration-300`} strokeWidth={2.2} />
    </div>
  );
};
