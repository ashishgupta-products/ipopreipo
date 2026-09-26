'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import MarketTicker from '../components/layout/MarketTicker';
import Footer from '../components/layout/Footer';
import IpoCard from '../components/ipo/IpoCard';
import IpoTable from '../components/ipo/IpoTable';
import IpoDetailModal from '../components/ipo/IpoDetailModal';
import PreIpoCard from '../components/preipo/PreIpoCard';
import PreIpoTable from '../components/preipo/PreIpoTable';
import PreIpoDetailModal from '../components/preipo/PreIpoDetailModal';
import PreIpoInquiryModal from '../components/preipo/PreIpoInquiryModal';
import GmpTracker from '../components/gmp/GmpTracker';
import AllotmentHub from '../components/allotment/AllotmentHub';
import IpoCalculatorModal from '../components/calculators/IpoCalculatorModal';

import { INDIAN_PRE_IPOS } from '../data/preIpoData';
import { IpoItem, PreIpoItem } from '../types';
import { getMergedIpos, getLastUpdatedTimestamp } from '../lib/ipoService';

import { 
  Flame, 
  Layers, 
  Award, 
  ShieldCheck, 
  Calculator, 
  LayoutGrid, 
  Table as TableIcon, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'all-ipos' | 'live-gmp' | 'pre-ipo' | 'allotment'>('all-ipos');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MAINBOARD' | 'SME'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONGOING' | 'UPCOMING' | 'LISTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modal states
  const [selectedIpo, setSelectedIpo] = useState<IpoItem | null>(null);
  const [selectedPreIpo, setSelectedPreIpo] = useState<PreIpoItem | null>(null);
  const [tradeModal, setTradeModal] = useState<{ item: PreIpoItem; type: 'BUY' | 'SELL' } | null>(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calcInitialIpo, setCalcInitialIpo] = useState<IpoItem | null>(null);

  // Live Scraped IPO Data State
  const [iposList, setIposList] = useState<IpoItem[]>(getMergedIpos());
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Live Scraped');

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/ipos/sync', { method: 'POST' });
      const data = await res.json();
      if (data.ipos && data.ipos.length > 0) {
        setIposList(data.ipos);
        setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setSyncing(false);
    }
  };

  // Filter IPOs
  const filteredIpos = useMemo(() => {
    return iposList.filter((ipo) => {
      if (categoryFilter !== 'ALL' && ipo.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && ipo.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ipo.name.toLowerCase().includes(q);
        const matchesSymbol = ipo.symbol.toLowerCase().includes(q);
        const matchesSector = ipo.sector.toLowerCase().includes(q);
        const matchesTags = ipo.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSymbol && !matchesSector && !matchesTags) return false;
      }
      return true;
    });
  }, [iposList, categoryFilter, statusFilter, searchQuery]);

  // Filter Pre-IPOs
  const filteredPreIpos = useMemo(() => {
    if (!searchQuery.trim()) return INDIAN_PRE_IPOS;
    const q = searchQuery.toLowerCase();
    return INDIAN_PRE_IPOS.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q) ||
        item.isin.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const handleOpenCalculator = (ipo?: IpoItem) => {
    if (ipo) {
      setCalcInitialIpo(ipo);
    } else {
      setCalcInitialIpo(iposList[0]);
    }
    setCalculatorOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab as any);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCalculator={() => handleOpenCalculator()}
      />

      {/* Rolling Ticker */}
      <MarketTicker />

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingTop: '1.75rem' }}>


        {/* Section Navigation Tabs */}
        <section id="market-terminal" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '0.75rem'
          }}>
            {/* Primary Mode Tabs */}
            <div className="scrollable-tabs" style={{ maxWidth: '100%' }}>
              {[
                { id: 'all-ipos', label: 'All IPOs', icon: <Layers size={16} />, badge: `${iposList.length}` },
                { id: 'live-gmp', label: 'Live GMP Tracker', icon: <Flame size={16} color="#d97706" />, badge: 'HOT' },
                { id: 'pre-ipo', label: 'Pre-IPO & Unlisted Shares', icon: <Award size={16} color="#0284c7" />, badge: `${INDIAN_PRE_IPOS.length}` },
                { id: 'allotment', label: 'Allotment Status', icon: <ShieldCheck size={16} color="#059669" />, badge: 'Direct' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: isActive ? '#2563eb' : '#64748b',
                      backgroundColor: isActive ? '#eff6ff' : '#ffffff',
                      border: isActive ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                      boxShadow: isActive ? '0 1px 3px rgba(37, 99, 235, 0.1)' : 'var(--shadow-sm)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      backgroundColor: isActive ? '#2563eb' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#64748b',
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle */}
            {(activeTab === 'all-ipos' || activeTab === 'pre-ipo') && (
              <div style={{
                display: 'flex',
                backgroundColor: '#ffffff',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <button
                  onClick={() => setViewMode('GRID')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    color: viewMode === 'GRID' ? '#ffffff' : '#64748b',
                    backgroundColor: viewMode === 'GRID' ? '#387ed1' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                  title="Grid view"
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
                    backgroundColor: viewMode === 'TABLE' ? '#387ed1' : 'transparent',
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
            )}
          </div>
        </section>

        {/* Tab 1: ALL IPOS */}
        {activeTab === 'all-ipos' && (
          <div>
            {/* Live Scraper Sync Control Banner */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.25rem',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <span className="pulse-indicator"></span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Live Exchange Data:</span>
                <span className="glass-badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  {iposList.length} Real IPOs Active
                </span>
                <span style={{ color: '#94a3b8' }}>•</span>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Feed: {lastSyncTime}</span>
              </div>

              <button
                onClick={handleSync}
                disabled={syncing}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                title="Trigger live Python web scraper"
              >
                <RefreshCw size={13} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                <span>{syncing ? 'Scraping Live GMP & IPOs...' : 'Scrape & Sync Live Data'}</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {/* Category selector */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'center', marginRight: '4px', fontWeight: 600 }}>
                  Segment:
                </span>
                {[
                  { id: 'ALL', label: 'All Categories' },
                  { id: 'MAINBOARD', label: 'Mainboard Only' },
                  { id: 'SME', label: 'NSE & BSE SME' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCategoryFilter(item.id as any)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: categoryFilter === item.id ? '#2563eb' : '#64748b',
                      backgroundColor: categoryFilter === item.id ? '#eff6ff' : '#ffffff',
                      border: categoryFilter === item.id ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Status selector */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'center', marginRight: '4px', fontWeight: 600 }}>
                  Status:
                </span>
                {[
                  { id: 'ALL', label: 'All Status' },
                  { id: 'ONGOING', label: '🟢 Open Now' },
                  { id: 'UPCOMING', label: '⏳ Upcoming' },
                  { id: 'LISTED', label: '✨ Recent' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStatusFilter(item.id as any)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: statusFilter === item.id ? '#2563eb' : '#64748b',
                      backgroundColor: statusFilter === item.id ? '#eff6ff' : '#ffffff',
                      border: statusFilter === item.id ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count banner */}
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Showing <strong>{filteredIpos.length}</strong> IPOs matching your filters
            </div>

            {/* Cards View or Table View */}
            {viewMode === 'GRID' ? (
              <div className="responsive-card-grid" style={{ marginBottom: '2.5rem' }}>
                {filteredIpos.map((ipo) => (
                  <IpoCard
                    key={ipo.id}
                    ipo={ipo}
                    onSelect={(selected) => setSelectedIpo(selected)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ marginBottom: '2.5rem' }}>
                <IpoTable
                  ipos={filteredIpos}
                  onSelect={(selected) => setSelectedIpo(selected)}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: LIVE GMP */}
        {activeTab === 'live-gmp' && (
          <div style={{ marginBottom: '2.5rem' }}>
            <GmpTracker
              ipos={iposList}
              onSelectIpo={(ipo) => setSelectedIpo(ipo)}
              onOpenCalculator={(ipo) => handleOpenCalculator(ipo)}
            />
          </div>
        )}

        {/* Tab 3: PRE-IPO & UNLISTED */}
        {activeTab === 'pre-ipo' && (
          <div>
            {/* Pre-IPO Intro Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
              border: '1px solid #bae6fd',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              marginBottom: '1.75rem',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Award size={18} color="#0284c7" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                  Unlisted Shares & Pre-IPO Institutional Desk
                </span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Invest in Market Leaders Before They List on Dalal Street
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '780px', lineHeight: '1.6', marginBottom: '1rem' }}>
                Direct Demat transfers into your Zerodha, Groww, ICICI Direct, or AngelOne account via CDSL/NSDL off-market transfers. 
                Own shares of market leaders like <strong>National Stock Exchange (NSE)</strong>, <strong>Reliance Retail</strong>, <strong>Tata Capital</strong>, and <strong>HDB Financial</strong> today.
              </p>

              <div>
                <Link
                  href="/pre-ipo"
                  className="btn-primary"
                  style={{ backgroundColor: '#0284c7', padding: '0.55rem 1.15rem', fontSize: '0.825rem' }}
                >
                  <Award size={15} />
                  <span>Open Full Pre-IPO Marketplace (Sector Filters & Sorting) →</span>
                </Link>
              </div>
            </div>

            {/* Pre-IPO Grid or Table */}
            {viewMode === 'GRID' ? (
              <div className="responsive-card-grid" style={{ marginBottom: '2.5rem' }}>
                {filteredPreIpos.map((item) => (
                  <PreIpoCard
                    key={item.id}
                    item={item}
                    onSelect={(selected) => setSelectedPreIpo(selected)}
                    onInquire={(targetItem, type) => setTradeModal({ item: targetItem, type })}
                  />
                ))}
              </div>
            ) : (
              <div style={{ marginBottom: '2.5rem' }}>
                <PreIpoTable
                  items={filteredPreIpos}
                  onSelect={(selected) => setSelectedPreIpo(selected)}
                  onInquire={(targetItem, type) => setTradeModal({ item: targetItem, type })}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 4: ALLOTMENT STATUS */}
        {activeTab === 'allotment' && (
          <div style={{ marginBottom: '2.5rem' }}>
            <AllotmentHub
              ipos={iposList}
              onSelectIpo={(ipo) => setSelectedIpo(ipo)}
            />
          </div>
        )}

        {/* Educational Section / Indian Investor Guide */}
        <section style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          margin: '3rem 0',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <HelpCircle size={20} color="#387ed1" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Essential Guide for Indian IPO & Pre-IPO Investors
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', marginBottom: '0.5rem' }}>
                1. UPI 2.0 ASBA Mandates
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                Retail investors can apply for IPOs up to ₹5,00,000 using UPI ASBA on apps like BHIM, Google Pay, PhonePe, or netbanking. Funds are only blocked in your bank, not debited until allotment.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>
                2. Mainboard vs SME IPO Differences
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                Mainboard IPOs feature smaller lot sizes (~₹15,000) and list on the main NSE/BSE boards. SME IPOs require larger ticket sizes (~₹1.2L+), have 100% upfront margin, and trade on NSE Emerge / BSE SME platforms.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#d97706', marginBottom: '0.5rem' }}>
                3. Pre-IPO Demat Settlement
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                Unlisted shares are held securely in dematerialized form under standard ISIN numbers. Transactions settle via official depository off-market transfers directly into your personal CDSL or NSDL demat account.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      {selectedIpo && (
        <IpoDetailModal
          ipo={selectedIpo}
          onClose={() => setSelectedIpo(null)}
          onOpenCalculator={(ipo) => handleOpenCalculator(ipo)}
        />
      )}

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
          initialIpo={calcInitialIpo}
          allIpos={iposList}
          onClose={() => setCalculatorOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
