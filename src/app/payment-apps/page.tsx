import React from "react";
import Link from "next/link";
import { Smartphone, Star, CheckCircle2, XCircle, ExternalLink, Download, ChevronRight } from "lucide-react";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";
import { CompanyLogo } from "@/components/common/CompanyLogo";

export default function PaymentAppsPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Smartphone className="w-3.5 h-3.5" />
          UPI &amp; PAYMENT APPS DESK
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Compare Top UPI &amp; Payment Apps in India
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          Evaluate Indian UPI apps by transaction speed, RuPay credit card integration, UPI Lite features, cashback rewards, free credit score tracking, and security ratings.
        </p>
      </div>

      {/* Payment App Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_PAYMENT_APPS.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <CompanyLogo name={app.name} logoUrl={app.logoUrl} size="lg" />
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 hover:text-emerald-700">
                      <Link href={`/payment-apps/${app.slug}`}>{app.name}</Link>
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">{app.developer} ({app.downloadsTier})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {app.playStoreRating} / 5.0
                </div>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                {app.upiLiteSupport && (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    UPI Lite
                  </span>
                )}
                {app.ruPayUpiSupport && (
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    RuPay Credit Card
                  </span>
                )}
              </div>

              {/* Key Features */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-800 block">Supported Core Features:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {app.keyFeatures.slice(0, 3).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Link
                href={`/payment-apps/${app.slug}`}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
              >
                Detailed Review <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={app.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                Get App <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
