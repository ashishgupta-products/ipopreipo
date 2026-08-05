import React from "react";

interface SubscriptionTableProps {
  totalSubscription: number;
  qibSubscription: number;
  niiSubscription: number;
  sNiiSubscription?: number;
  bNiiSubscription?: number;
  retailSubscription: number;
  employeeSubscription?: number;
  shareholderSubscription?: number;
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  totalSubscription,
  qibSubscription,
  niiSubscription,
  sNiiSubscription,
  bNiiSubscription,
  retailSubscription,
  employeeSubscription,
  shareholderSubscription
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Investor Category</th>
            <th className="py-2.5 px-3 text-center">Bidding Demand</th>
            <th className="py-2.5 px-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {/* QIB Row */}
          <tr className="hover:bg-slate-50/60 font-medium">
            <td className="py-2 px-3 text-slate-800">QIB</td>
            <td className="py-2 px-3 text-center font-bold text-slate-900">
              {qibSubscription > 0 ? `${qibSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-3 text-right">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${qibSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {qibSubscription >= 1 ? "Subscribed" : "Open"}
              </span>
            </td>
          </tr>

          {/* NIB Row */}
          <tr className="hover:bg-slate-50/60 font-medium">
            <td className="py-2 px-3 text-slate-800">NIB</td>
            <td className="py-2 px-3 text-center font-bold text-slate-900">
              {niiSubscription > 0 ? `${niiSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-3 text-right">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${niiSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {niiSubscription >= 1 ? "Subscribed" : "Open"}
              </span>
            </td>
          </tr>



          {/* Retail Row */}
          <tr className="hover:bg-slate-50/60 font-medium">
            <td className="py-2 px-3 text-slate-800">Retail</td>
            <td className="py-2 px-3 text-center font-bold text-slate-900">
              {retailSubscription > 0 ? `${retailSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-3 text-right">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${retailSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {retailSubscription >= 1 ? "Subscribed" : "Open"}
              </span>
            </td>
          </tr>

          {/* Total Row */}
          <tr className="bg-slate-100/70 font-bold border-t border-slate-200 text-slate-900">
            <td className="py-2 px-3">TOTAL SUBSCRIPTION</td>
            <td className="py-2 px-3 text-center text-blue-750 font-extrabold text-xs">
              {totalSubscription.toFixed(2)}x
            </td>
            <td className="py-2 px-3 text-right">
              <span className="text-[10px] text-blue-750 font-bold">
                {totalSubscription > 1 ? "Over-subscribed" : "Bidding Open"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
