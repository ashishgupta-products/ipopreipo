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
}

export const GMPCard: React.FC<GMPCardProps> = ({
  gmp,
  gmpPercent,
  expectedListingPrice,
  priceBandMax,
  updatedTime = "Live",
  compact = false,
  lotSize
}) => {
  const isPositive = gmp > 0;
  const isNeutral = gmp === 0;

  if (compact) {
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
        {isPositive && (
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            +{gmpPercent.toFixed(1)}%
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
            isPositive
              ? "text-emerald-700"
              : isNeutral
              ? "text-slate-600"
              : "text-rose-700"
          }`}
        >
          {isPositive ? `+₹${gmp}` : isNeutral ? "₹0" : `-₹${Math.abs(gmp)}`}
        </span>

        {isPositive && (
          <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +{gmpPercent.toFixed(1)}%
          </span>
        )}
      </div>

      {lotSize && gmp > 0 && (
        <div className="flex justify-between items-center text-[11px] text-emerald-800 bg-emerald-50/60 border border-emerald-200/50 rounded px-2.5 py-1.5 font-medium">
          <span>Est. Profit Per Lot (GMP × Lot):</span>
          <strong className="text-emerald-700 font-extrabold text-sm">
            ₹{(gmp * lotSize).toLocaleString("en-IN")}
          </strong>
        </div>
      )}

      <div className="flex justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-200">
        <span>Issue: <strong>₹{priceBandMax}</strong></span>
        <span>Expected Listing: <strong className="text-emerald-700 font-bold">₹{expectedListingPrice}</strong></span>
      </div>
    </div>
  );
};
