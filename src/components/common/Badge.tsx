import React from "react";
import { IPOStatus, IPOCategory } from "@/types/ipo";

interface BadgeProps {
  type?: "status" | "category" | "gmp" | "custom";
  status?: IPOStatus;
  category?: IPOCategory;
  customText?: string;
  className?: string;
  openDate?: string;
  closeDate?: string;
  allotmentDate?: string;
  listingDate?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type = "status",
  status,
  category,
  customText,
  className = "",
  openDate,
  closeDate,
  allotmentDate,
  listingDate
}) => {
  if (type === "category" || category) {
    const isSme = category === "sme";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
          isSme
            ? "bg-amber-50 text-amber-700 border border-amber-200"
            : "bg-blue-50 text-blue-700 border border-blue-200"
        } ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isSme ? "bg-amber-500" : "bg-blue-600"
          }`}
        />
        {isSme ? "SME" : "MAINBOARD"}
      </span>
    );
  }

  if (type === "status" || status) {
    let displayStatus = status || "closed";
    const todayStr = new Date().toISOString().split("T")[0];

    if (openDate && closeDate) {
      if (listingDate && listingDate === todayStr) {
        displayStatus = "listing_today" as any;
      } else if (listingDate && listingDate < todayStr) {
        displayStatus = "listed";
      } else if (allotmentDate && allotmentDate <= todayStr) {
        displayStatus = "allotted" as any;
      } else if (closeDate < todayStr) {
        displayStatus = "awaiting_allotment" as any;
      } else if (openDate <= todayStr && todayStr <= closeDate) {
        displayStatus = "live";
      } else if (openDate > todayStr) {
        displayStatus = "upcoming";
      }
    } else {
      if (status === "allotment_out") {
        displayStatus = "allotted" as any;
      }
    }

    switch (displayStatus as any) {
      case "live":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            LIVE
          </span>
        );
      case "upcoming":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200 ${className}`}
          >
            UPCOMING
          </span>
        );
      case "awaiting_allotment":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
          >
            AWAITING ALLOTMENT
          </span>
        );
      case "allotted":
      case "allotment_out":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 ${className}`}
          >
            ALLOTTED
          </span>
        );
      case "listing_today":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
            LISTING TODAY
          </span>
        );
      case "listed":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
          >
            LISTED
          </span>
        );
      default:
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
          >
            CLOSED
          </span>
        );
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
    >
      {customText}
    </span>
  );
};
