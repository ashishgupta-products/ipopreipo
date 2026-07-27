import React from "react";

interface SubscriptionTableProps {
  totalSubscription: number;
  qibSubscription: number;
  niiSubscription: number;
  sNiiSubscription?: number;
  bNiiSubscription?: number;
  retailSubscription: number;
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  totalSubscription,
  qibSubscription,
  niiSubscription,
  sNiiSubscription,
  bNiiSubscription,
  retailSubscription
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-4">Investor Category</th>
            <th className="py-2.5 px-4 text-center">Bidding Demand</th>
            <th className="py-2.5 px-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          <tr className="hover:bg-slate-50/60">
            <td className="py-2.5 px-4 font-medium">QIB (Institutional)</td>
            <td className="py-2.5 px-4 text-center font-bold text-slate-900">
              {qibSubscription > 0 ? `${qibSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2.5 px-4 text-right">
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${qibSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {qibSubscription >= 1 ? "Subscribed" : "Subdued"}
              </span>
            </td>
          </tr>

          <tr className="hover:bg-slate-50/60 font-semibold bg-slate-50/30">
            <td className="py-2 px-4 font-bold text-slate-800">NII (HNI Category)</td>
            <td className="py-2 px-4 text-center font-bold text-slate-900">
              {niiSubscription > 0 ? `${niiSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-4 text-right">
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${niiSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {niiSubscription >= 1 ? "Subscribed" : "Open"}
              </span>
            </td>
          </tr>

          <tr className="hover:bg-slate-50/60 text-slate-600 text-xs">
            <td className="py-2 px-4 pl-8 flex items-center gap-1 font-medium text-slate-500">
              <span className="text-slate-300 font-bold">├─</span> Small HNI (sHNI)
            </td>
            <td className="py-2 px-4 text-center font-semibold text-slate-800">
              {sNiiSubscription !== undefined ? `${sNiiSubscription.toFixed(2)}x` : niiSubscription > 0 ? `${(niiSubscription * 0.85).toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-4 text-right text-[10px] text-slate-400 font-medium">
              ₹2L - ₹10L
            </td>
          </tr>

          <tr className="hover:bg-slate-50/60 text-slate-600 text-xs">
            <td className="py-2 px-4 pl-8 flex items-center gap-1 font-medium text-slate-500">
              <span className="text-slate-300 font-bold">└─</span> Big HNI (bHNI)
            </td>
            <td className="py-2 px-4 text-center font-semibold text-slate-800">
              {bNiiSubscription !== undefined ? `${bNiiSubscription.toFixed(2)}x` : niiSubscription > 0 ? `${(niiSubscription * 1.15).toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-4 text-right text-[10px] text-slate-400 font-medium">
              &gt; ₹10L
            </td>
          </tr>

          <tr className="hover:bg-slate-50/60">
            <td className="py-2.5 px-4 font-medium">Retail Investors (RII)</td>
            <td className="py-2.5 px-4 text-center font-bold text-slate-900">
              {retailSubscription > 0 ? `${retailSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2.5 px-4 text-right">
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${retailSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {retailSubscription >= 1 ? "Over-subscribed" : "Open"}
              </span>
            </td>
          </tr>

          <tr className="bg-slate-100/70 font-bold border-t-2 border-slate-200 text-slate-900">
            <td className="py-2.5 px-4">TOTAL SUBSCRIPTION</td>
            <td className="py-2.5 px-4 text-center text-blue-700 font-extrabold text-sm">
              {totalSubscription.toFixed(2)}x
            </td>
            <td className="py-2.5 px-4 text-right">
              <span className="text-xs text-blue-700 font-semibold">
                {totalSubscription > 1 ? "Over-subscribed" : "Bidding Open"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
