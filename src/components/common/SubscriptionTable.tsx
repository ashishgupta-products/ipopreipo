import React from "react";

interface SubscriptionItem {
  category: string;
  subCategory?: string | null;
  sharesOffered: number;
  bidsReceived: number;
  subscriptionTimes: number;
}

interface SubscriptionTableProps {
  totalSubscription: number;
  qibSubscription: number;
  niiSubscription: number;
  sNiiSubscription?: number;
  bNiiSubscription?: number;
  retailSubscription: number;
  employeeSubscription?: number;
  shareholderSubscription?: number;
  subscriptionBreakdown?: SubscriptionItem[];
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  totalSubscription,
  qibSubscription,
  niiSubscription,
  retailSubscription,
  subscriptionBreakdown,
}) => {
  if (subscriptionBreakdown && subscriptionBreakdown.length > 0) {
    return (
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Investor Category</th>
              <th className="py-2.5 px-3 text-center">Offered (L)</th>
              <th className="py-2.5 px-3 text-center">Applied (L)</th>
              <th className="py-2.5 px-3 text-right">Subscription (x)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {subscriptionBreakdown.map((item, idx) => {
              const isTotal = item.category.toLowerCase().includes("total");
              return (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/60 font-medium ${
                    isTotal ? "bg-slate-100/80 font-bold text-slate-900 border-t border-slate-200" : ""
                  }`}
                >
                  <td className="py-2 px-3 text-slate-800 font-semibold">{item.category}</td>
                  <td className="py-2 px-3 text-center text-slate-600">
                    {item.sharesOffered > 0 ? item.sharesOffered.toLocaleString("en-IN") : "-"}
                  </td>
                  <td className="py-2 px-3 text-center text-slate-600">
                    {item.bidsReceived > 0 ? item.bidsReceived.toLocaleString("en-IN") : "-"}
                  </td>
                  <td className="py-2 px-3 text-right font-extrabold text-blue-700">
                    {item.subscriptionTimes > 0 ? `${item.subscriptionTimes.toFixed(2)}x` : "0.00x"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

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
          <tr className="hover:bg-slate-50/60 font-medium">
            <td className="py-2 px-3 text-slate-800">QIB (Institutional)</td>
            <td className="py-2 px-3 text-center font-bold text-slate-900">
              {qibSubscription > 0 ? `${qibSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-3 text-right">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  qibSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {qibSubscription >= 1 ? "Subscribed" : "Open"}
              </span>
            </td>
          </tr>

          <tr className="hover:bg-slate-50/60 font-medium">
            <td className="py-2 px-3 text-slate-800">NII / HNI</td>
            <td className="py-2 px-3 text-center font-bold text-slate-900">
              {niiSubscription > 0 ? `${niiSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-3 text-right">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  niiSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {niiSubscription >= 1 ? "Subscribed" : "Open"}
              </span>
            </td>
          </tr>

          <tr className="hover:bg-slate-50/60 font-medium">
            <td className="py-2 px-3 text-slate-800">Retail Individual (RII)</td>
            <td className="py-2 px-3 text-center font-bold text-slate-900">
              {retailSubscription > 0 ? `${retailSubscription.toFixed(2)}x` : "0.00x"}
            </td>
            <td className="py-2 px-3 text-right">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  retailSubscription >= 1 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {retailSubscription >= 1 ? "Subscribed" : "Open"}
              </span>
            </td>
          </tr>

          <tr className="bg-slate-100/70 font-bold border-t border-slate-200 text-slate-900">
            <td className="py-2 px-3">TOTAL SUBSCRIPTION</td>
            <td className="py-2 px-3 text-center text-blue-700 font-extrabold text-xs">
              {totalSubscription.toFixed(2)}x
            </td>
            <td className="py-2 px-3 text-right">
              <span className="text-[10px] text-blue-700 font-bold">
                {totalSubscription >= 1 ? "Over-subscribed" : "Bidding Open"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
