'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/Navbar';
import MarketTicker from '../components/layout/MarketTicker';
import Footer from '../components/layout/Footer';
import IpoCard from '../components/ipo/IpoCard';
import IpoTable from '../components/ipo/IpoTable';
import IpoDetailModal from '../components/ipo/IpoDetailModal';
import { IpoItem } from '../types';
import { getMergedIpos } from '../lib/ipoService';

import { 
  LayoutGrid, 
  Table as TableIcon, 
  HelpCircle,
  RefreshCw,
  ChevronDown,
  Filter,
  RotateCcw
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  // Redirect legacy query parameters (e.g. /?tab=payment-apps -> /payment-apps)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'payment-apps') {
        router.replace('/payment-apps');
      } else if (tab === 'pre-ipo') {
        router.replace('/pre-ipo');
      } else if (tab === 'brokers') {
        router.replace('/brokers');
      } else if (tab === 'credit-cards') {
        router.replace('/credit-cards');
      } else if (tab === 'analysts') {
        router.replace('/analysts');
      }
    }
  }, [router]);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MAINBOARD' | 'SME'>('MAINBOARD');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONGOING' | 'UPCOMING' | 'CLOSED' | 'LISTED'>('ONGOING');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modal states
  const [selectedIpo, setSelectedIpo] = useState<IpoItem | null>(null);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Sticky Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Rolling Ticker */}
      <MarketTicker />

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingTop: '1.75rem' }}>
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

        {/* Filter Dropdowns Bar & View Mode Toggle */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0f172a', fontWeight: 700, fontSize: '0.88rem' }}>
              <Filter size={16} color="#2563eb" />
              <span>Filters:</span>
            </div>

            {/* Status Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="status-filter-select" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                Status:
              </label>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select
                  id="status-filter-select"
                  aria-label="Filter IPOs by Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundColor: statusFilter === 'ONGOING' ? '#ecfdf5' : '#f8fafc',
                    color: statusFilter === 'ONGOING' ? '#065f46' : '#1e293b',
                    border: statusFilter === 'ONGOING' ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 2.2rem 0.45rem 0.85rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <option value="ONGOING">🟢 Open Now (Bidding Active)</option>
                  <option value="UPCOMING">⏳ Upcoming Issues</option>
                  <option value="CLOSED">🔒 Closed / Allotment</option>
                  <option value="LISTED">✨ Recently Listed</option>
                  <option value="ALL">📋 All Statuses</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', pointerEvents: 'none', color: statusFilter === 'ONGOING' ? '#059669' : '#64748b' }} />
              </div>
            </div>

            {/* Segment / Category Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="category-filter-select" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                Segment:
              </label>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select
                  id="category-filter-select"
                  aria-label="Filter IPOs by Segment"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundColor: categoryFilter === 'MAINBOARD' ? '#eff6ff' : '#f8fafc',
                    color: categoryFilter === 'MAINBOARD' ? '#1e40af' : '#1e293b',
                    border: categoryFilter === 'MAINBOARD' ? '1.5px solid #3b82f6' : '1px solid #cbd5e1',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 2.2rem 0.45rem 0.85rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <option value="MAINBOARD">🏢 Mainboard Only</option>
                  <option value="SME">🚀 NSE & BSE SME</option>
                  <option value="ALL">🌐 All Categories</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', pointerEvents: 'none', color: categoryFilter === 'MAINBOARD' ? '#2563eb' : '#64748b' }} />
              </div>
            </div>

            {/* Reset Filters Quick Button */}
            {(statusFilter !== 'ALL' || categoryFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setCategoryFilter('ALL');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-sm)',
                  color: '#475569',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.35rem 0.65rem',
                  transition: 'all 0.15s ease'
                }}
                title="Clear filters and view all IPOs"
              >
                <RotateCcw size={12} />
                <span>Reset to All</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
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
                  backgroundColor: viewMode === 'GRID' ? '#2563eb' : 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Grid Cards view"
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  color: viewMode === 'TABLE' ? '#ffffff' : '#64748b',
                  backgroundColor: viewMode === 'TABLE' ? '#2563eb' : 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Table view"
              >
                <TableIcon size={14} />
                <span>Table</span>
              </button>
            </div>

            {/* Showing count indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b' }}>
              <span>Showing</span>
              <span style={{
                fontWeight: 800,
                color: '#0f172a',
                backgroundColor: '#f1f5f9',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {filteredIpos.length}
              </span>
              <span>IPOs</span>
            </div>
          </div>
        </div>

        {/* Cards View or Table View or Empty State */}
        {filteredIpos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: '#ffffff',
            border: '1px dashed #cbd5e1',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2.5rem'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              No IPOs Found Matching Your Filters
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
              There are currently no IPO issues matching Status: <strong>{statusFilter}</strong> and Segment: <strong>{categoryFilter}</strong>.
            </p>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
            >
              View All Active & Upcoming IPOs
            </button>
          </div>
        ) : viewMode === 'GRID' ? (
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
              Essential Guide for Indian IPO Investors
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
                3. SEBI T+3 Listing Cycle
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                Under SEBI guidelines, all IPOs finalize allotment on T+1, initiate unblocking/refunds and credit shares on T+2, and list on the stock exchange on T+3 business days.
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
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
