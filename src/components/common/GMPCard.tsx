import React from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";

interface GMPCardProps {
  gmp: number;
  gmpPercent: number;
  expectedListingPrice: number;
  priceBandMax: number;
  updatedTime?: string;
  compact?: boolean;
  lotSize?: number;
  gmpTrends?: any[];
}

export const GMPCard: React.FC<GMPCardProps> = ({
  gmp,
  gmpPercent,
  expectedListingPrice,
  priceBandMax,
  updatedTime = "Live",
  compact = false,
  lotSize,
  gmpTrends
}) => {
  const hasData = gmp > 0 || (gmpTrends && gmpTrends.length > 0);
  const isPositive = gmp > 0;
  const isNeutral = gmp === 0 && !hasData;

  if (compact) {
    if (!hasData) {
      return (
        <span className="text-slate-400 font-medium text-xs">--</span>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span
          className={
            isPositive
              ? "text-emerald-700 font-bold"
              : isNeutral
              ? "text-slate-500"
              : "text-rose-700 font-bold"
          }
        >
          {isPositive ? `+₹${gmp}` : isNeutral ? "₹0" : `-₹${Math.abs(gmp)}`}
        </span>
        {!isNeutral && (
          <span className={`text-[11px] px-1.5 py-0.5 rounded border ${
            isPositive 
              ? "text-emerald-700 bg-emerald-50 border-emerald-200" 
              : "text-rose-700 bg-rose-50 border-rose-200"
          }`}>
            {isPositive ? "+" : ""}{gmpPercent.toFixed(1)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
      <div className="flex justify-between items-center text-slate-500 text-[11px]">
        <span className="font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          ESTIMATED GMP
        </span>
        <span>Updated: {updatedTime}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-xl font-extrabold tracking-tight ${
            !hasData 
              ? "text-slate-400"
              : isPositive
              ? "text-emerald-700"
              : isNeutral
              ? "text-slate-600"
              : "text-rose-700"
          }`}
        >
          {!hasData ? "N/A" : isPositive ? `+₹${gmp}` : isNeutral ? "₹0" : `-₹${Math.abs(gmp)}`}
        </span>

        {hasData && !isNeutral && (
          <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
            isPositive 
              ? "text-emerald-700 bg-emerald-100/60" 
              : "text-rose-700 bg-rose-100/60"
          }`}>
            <ArrowUpRight className={`w-3 h-3 mr-0.5 ${!isPositive && "rotate-90"}`} />
            {isPositive ? "+" : ""}{gmpPercent.toFixed(1)}%
          </span>
        )}
        {!hasData && (
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-500">
            No active trade
          </span>
        )}
      </div>

      {lotSize && hasData && !isNeutral && (
        <div className={`flex justify-between items-center text-[11px] border rounded px-2.5 py-1.5 font-medium ${
          isPositive 
            ? "text-emerald-800 bg-emerald-50/60 border-emerald-200/50" 
            : "text-rose-800 bg-rose-50/60 border-rose-200/50"
        }`}>
          <span>{isPositive ? "Est. Profit Per Lot (GMP × Lot):" : "Est. Loss Per Lot (GMP × Lot):"}</span>
          <strong className={`font-extrabold text-sm ${isPositive ? "text-emerald-700" : "text-rose-700"}`}>
            ₹{Math.abs(gmp * lotSize).toLocaleString("en-IN")}
          </strong>
        </div>
      )}

      <div className="flex justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-200">
        <span>Issue: <strong>₹{priceBandMax}</strong></span>
        <span>Expected Listing: <strong className={!hasData ? "text-slate-500 font-bold" : `${expectedListingPrice < priceBandMax ? "text-rose-700" : "text-emerald-700"} font-bold`}>{!hasData ? "--" : `₹${expectedListingPrice}`}</strong></span>
      </div>
    </div>
  );
};
