import React from "react";
import Link from "next/link";
import { TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";
import { DynamicTagline } from "@/components/common/DynamicTagline";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/logo.svg" alt="ipo preipo Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-lg text-white lowercase">
                ipo <span className="text-blue-400">preipo</span>
                <span className="text-xs text-blue-400 font-bold">.com</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              <strong>ipo preipo.com</strong> is a comprehensive financial intelligence portal for tracking Indian IPOs, Pre-IPO unlisted shares, credit card offers, payment apps, commercial banks, and stockbroker comparisons.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 font-semibold">
              <span>Made with</span>
              <span className="text-rose-500 text-xs">❤️</span>
              <DynamicTagline />
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">IPO &amp; Equity</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/calculators" className="hover:text-white text-emerald-400 font-semibold transition-colors">
                  Financial &amp; IPO Calculators
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-white text-blue-400 font-semibold transition-colors">
                  IPO Calendar &amp; Schedule
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Mainboard IPO Tracker
                </Link>
              </li>
              <li>
                <Link href="/?tab=sme" className="hover:text-white transition-colors">
                  SME IPO Market
                </Link>
              </li>
              <li>
                <Link href="/pre-ipo" className="hover:text-white text-amber-400 transition-colors">
                  Pre-IPO &amp; Unlisted Shares
                </Link>
              </li>
              <li>
                <Link href="/anchor-lockins" className="hover:text-white text-purple-400 transition-colors">
                  Anchor Lock-in Expiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Financial Products */}
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Fintech &amp; Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/brokers" className="hover:text-white transition-colors">
                  Top Stock Brokers
                </Link>
              </li>
              <li>
                <Link href="/payment-apps" className="hover:text-white transition-colors">
                  UPI &amp; Payment Apps
                </Link>
              </li>
              <li>
                <Link href="/credit-cards" className="hover:text-white transition-colors">
                  Best Credit Cards
                </Link>
              </li>
              <li>
                <Link href="/banks" className="hover:text-white transition-colors">
                  Top Commercial Banks
                </Link>
              </li>
              <li>
                <Link href="/buybacks" className="hover:text-white text-emerald-400 transition-colors">
                  Share Buybacks Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Subscribe to ipo preipo.com</h4>
            <p className="text-slate-400 mb-3">
              Get instant GMP updates, bidding alerts, credit card deals, and allotment notices directly to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg font-bold transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 text-[11px] text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> Financial product comparison and IPO data provided on <strong>ipo preipo.com</strong> is purely informational. Credit card approval and banking terms depend on individual bank eligibility criteria. Always consult a certified financial advisor before making investment or loan commitments.
          </p>
          <p className="text-center text-slate-500 pt-4">
            © {new Date().getFullYear()} <strong>ipo preipo.com</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
