import React from "react";
import Link from "next/link";
import { Briefcase, Star, CheckCircle2, XCircle, ExternalLink, ChevronRight } from "lucide-react";
import { MOCK_BROKERS } from "@/data/mockBrokers";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function BrokersPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
          <Briefcase className="w-3.5 h-3.5" />
          STOCK BROKER ANALYSIS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Compare Stock Brokers for IPO Applications
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          Evaluate brokerage fees, Demat account AMC, UPI 2.0 mandate speeds, and platform reliability across leading Indian stockbrokers.
        </p>
      </div>

      {/* Broker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_BROKERS.map((broker) => (
          <div
            key={broker.id}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <CompanyLogo name={broker.name} logoUrl={broker.logoUrl} size="lg" />
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 hover:text-blue-700">
                      <Link href={`/brokers/${broker.slug}`}>{broker.name}</Link>
                    </h3>
                    <span className="text-xs text-sky-700 font-semibold">{broker.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {broker.rating} / 5.0
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Delivery:</span>
                  <strong className="text-emerald-700 font-bold">{broker.equityDeliveryFee}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Intraday:</span>
                  <strong className="text-slate-900 font-bold">{broker.equityIntradayFee}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Demat AMC:</span>
                  <strong className="text-slate-900 font-bold">{broker.dematAnualFee}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Opening:</span>
                  <strong className="text-slate-900 font-bold">{broker.accountOpeningFee}</strong>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Advantages:
                </span>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {broker.pros.slice(0, 2).map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Link
                href={`/brokers/${broker.slug}`}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                Detailed Review <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={broker.openAccountUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                Open Demat <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
