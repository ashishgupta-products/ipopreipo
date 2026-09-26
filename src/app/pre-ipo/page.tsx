'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import MarketTicker from '../../components/layout/MarketTicker';
import Footer from '../../components/layout/Footer';
import PreIpoCard from '../../components/preipo/PreIpoCard';
import PreIpoTable from '../../components/preipo/PreIpoTable';
import PreIpoDetailModal from '../../components/preipo/PreIpoDetailModal';
import PreIpoInquiryModal from '../../components/preipo/PreIpoInquiryModal';
import IpoCalculatorModal from '../../components/calculators/IpoCalculatorModal';

import { INDIAN_PRE_IPOS } from '../../data/preIpoData';
import { INDIAN_IPOS } from '../../data/ipoData';
import { PreIpoItem, IpoItem } from '../../types';

import { 
  Award, 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  Lock, 
  FileText, 
  ArrowLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function PreIpoPage() {
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'VALUATION_DESC' | 'RETURNS_DESC' | 'PRICE_ASC' | 'PRICE_DESC'>('VALUATION_DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modals
  const [selectedPreIpo, setSelectedPreIpo] = useState<PreIpoItem | null>(null);
  const [tradeModal, setTradeModal] = useState<{ item: PreIpoItem; type: 'BUY' | 'SELL' } | null>(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  // Extract unique sectors
  const sectors = useMemo(() => {
    const list = Array.from(new Set(INDIAN_PRE_IPOS.map((item) => item.sector.split(' / ')[0].split(' & ')[0])));
    return ['ALL', ...list];
  }, []);

  // Filter & Sort
  const filteredAndSortedPreIpos = useMemo(() => {
    let result = INDIAN_PRE_IPOS.filter((item) => {
      // Sector filter
      if (sectorFilter !== 'ALL' && !item.sector.toLowerCase().includes(sectorFilter.toLowerCase())) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSymbol = item.symbol.toLowerCase().includes(q);
        const matchesSector = item.sector.toLowerCase().includes(q);
        const matchesIsin = item.isin.toLowerCase().includes(q);
        const matchesPromoter = item.promoters.toLowerCase().includes(q);
        if (!matchesName && !matchesSymbol && !matchesSector && !matchesIsin && !matchesPromoter) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'VALUATION_DESC') return b.valuationCr - a.valuationCr;
      if (sortBy === 'RETURNS_DESC') return b.change1YPercent - a.change1YPercent;
      if (sortBy === 'PRICE_ASC') return a.sharePrice - b.sharePrice;
      if (sortBy === 'PRICE_DESC') return b.sharePrice - a.sharePrice;
      return 0;
    });
  }, [sectorFilter, sortBy, searchQuery]);

  // Aggregate stats
  const totalMarketCap = INDIAN_PRE_IPOS.reduce((acc, curr) => acc + curr.valuationCr, 0);
  const avgReturn = (INDIAN_PRE_IPOS.reduce((acc, curr) => acc + curr.change1YPercent, 0) / INDIAN_PRE_IPOS.length).toFixed(1);
  const minTicket = Math.min(...INDIAN_PRE_IPOS.map((i) => i.minInvestment));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Sticky Navbar */}
      <Navbar
        activeTab="pre-ipo"
        setActiveTab={(tab) => {
          if (tab !== 'pre-ipo') {
            window.location.href = tab === 'all-ipos' ? '/' : `/?tab=${tab}`;
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCalculator={() => setCalculatorOpen(true)}
      />

      {/* Rolling Ticker */}
      <MarketTicker />

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingTop: '1.5rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: '#64748b',
          marginBottom: '1.25rem'
        }}>
          <Link href="/" style={{ color: '#387ed1', fontWeight: 600 }}>
            Home
          </Link>
          <ChevronRight size={13} />
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Pre-IPO & Unlisted Shares</span>
        </div>

        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
          border: '1px solid #bae6fd',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem 2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="glass-badge badge-cyan" style={{ fontSize: '0.72rem', padding: '3px 9px' }}>
                <Award size={13} /> Institutional Unlisted Shares Desk
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#059669" />
                100% Demat Transfer via CDSL / NSDL
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#0f172a', lineHeight: '1.2', marginBottom: '0.75rem' }}>
              Pre-IPO & Unlisted Shares Marketplace
            </h1>
            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Invest directly in India’s most valuable private companies before their public DRHP filing and IPO listing. 
              Holding shares in your own Demat account allows you to participate in pre-listing institutional wealth creation.
            </p>
          </div>

          {/* Aggregate Market Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e0f2fe'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Tracked Marketplace Cap
              </div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7' }}>
                ₹{(totalMarketCap / 100000).toFixed(2)} Lakh Cr
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Across {INDIAN_PRE_IPOS.length} Market Leaders</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Avg 1-Year Growth
              </div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                +{avgReturn}%
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Leader: NSE (+114.5%)</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Entry Ticket From
              </div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                ₹{minTicket.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Starting at boAt (50 shares)</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Delivery Escrow
              </div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                T+1 Settlement
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Direct to your Broker Demat</div>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <section style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#ffffff',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-card)'
          }}>
            {/* Sector Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginRight: '4px' }}>
                Sector:
              </span>
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSectorFilter(sec)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: sectorFilter === sec ? '#0284c7' : '#64748b',
                    backgroundColor: sectorFilter === sec ? '#f0f9ff' : '#ffffff',
                    border: sectorFilter === sec ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {sec === 'ALL' ? 'All Sectors' : sec}
                </button>
              ))}
            </div>

            {/* Sort & View Mode */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    fontWeight: 600
                  }}
                >
                  <option value="VALUATION_DESC">Highest Valuation</option>
                  <option value="RETURNS_DESC">Top 1-Year Return</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                </select>
              </div>

              {/* View Toggle */}
              <div style={{
                display: 'flex',
                backgroundColor: '#ffffff',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => setViewMode('GRID')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    color: viewMode === 'GRID' ? '#ffffff' : '#64748b',
                    backgroundColor: viewMode === 'GRID' ? '#0284c7' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                  title="Card view"
                >
                  <LayoutGrid size={15} />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setViewMode('TABLE')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    color: viewMode === 'TABLE' ? '#ffffff' : '#64748b',
                    backgroundColor: viewMode === 'TABLE' ? '#0284c7' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                  title="Table view"
                >
                  <TableIcon size={15} />
                  <span>Table</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Count Banner */}
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Showing <strong>{filteredAndSortedPreIpos.length}</strong> unlisted companies</span>
          <span>Settlement Mode: <strong>CDSL / NSDL DIS Slip</strong></span>
        </div>

        {/* Grid or Table Listing */}
        {viewMode === 'GRID' ? (
          <div className="responsive-card-grid" style={{ marginBottom: '3rem' }}>
            {filteredAndSortedPreIpos.map((item) => (
              <PreIpoCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedPreIpo(selected)}
                onInquire={(targetItem, type) => setTradeModal({ item: targetItem, type })}
              />
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: '3rem' }}>
            <PreIpoTable
              items={filteredAndSortedPreIpos}
              onSelect={(selected) => setSelectedPreIpo(selected)}
              onInquire={(targetItem, type) => setTradeModal({ item: targetItem, type })}
            />
          </div>
        )}

        {/* Pre-IPO FAQ & Regulatory Guide */}
        <section style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <HelpCircle size={22} color="#0284c7" />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                How Unlisted & Pre-IPO Shares Work in India
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Everything you need to know about demat transfer, lock-in, and tax implications.
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.5rem'
          }}>
            {/* Card 1 */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={18} color="#059669" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  1. How Are Shares Delivered?
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                Unlisted shares are 100% digital and held under standard ISIN numbers issued by NSDL/CDSL. They transfer directly into your existing Zerodha, Groww, AngelOne, or bank Demat account via off-market DIS delivery.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Lock size={18} color="#d97706" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  2. SEBI 6-Month Lock-in Rule
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                Under SEBI (ICDR) Regulations, pre-IPO shares acquired before the IPO are subject to a mandatory 6-month lock-in period starting from the listing date on NSE/BSE. You can trade them freely before DRHP filing or after the 6-month post-listing window.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FileText size={18} color="#2563eb" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  3. Indian Taxation (Budget 2024)
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                Unlisted shares held for over 24 months qualify for Long Term Capital Gains (LTCG) taxed at 12.5% without indexation. Shares held for less than 24 months are treated as STCG and taxed at your applicable individual income tax slab rates.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      {selectedPreIpo && (
        <PreIpoDetailModal
          item={selectedPreIpo}
          onClose={() => setSelectedPreIpo(null)}
          onInquire={(item, type) => setTradeModal({ item, type })}
        />
      )}

      {tradeModal && (
        <PreIpoInquiryModal
          item={tradeModal.item}
          initialType={tradeModal.type}
          onClose={() => setTradeModal(null)}
        />
      )}

      {calculatorOpen && (
        <IpoCalculatorModal
          initialIpo={INDIAN_IPOS[0]}
          allIpos={INDIAN_IPOS}
          onClose={() => setCalculatorOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
