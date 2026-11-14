'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/Navbar';
import MarketTicker from '../components/layout/MarketTicker';
import Footer from '../components/layout/Footer';
import IpoCard from '../components/ipo/IpoCard';
import IpoTable from '../components/ipo/IpoTable';
import IpoCalendar from '../components/ipo/IpoCalendar';
import IpoDetailModal from '../components/ipo/IpoDetailModal';
import { IpoItem } from '../types';
import { getMergedIpos, getEffectiveIpoStatus } from '../lib/ipoService';

import { 
  LayoutGrid, 
  Table as TableIcon, 
  Calendar as CalendarIcon,
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
      const view = params.get('view');
      const status = params.get('status');

      if (tab === 'analysts') {
        router.replace('/analysts');
      } else if (tab === 'allotment') {
        router.replace('/allotment');
      } else if (tab === 'calendar' || view === 'calendar') {
        setViewMode('CALENDAR');
      }

      if (status === 'upcoming') {
        setStatusFilter('UPCOMING');
      } else if (status === 'listed') {
        setStatusFilter('LISTED');
      } else if (status === 'live' || status === 'ongoing') {
        setStatusFilter('LIVE');
      }
    }
  }, [router]);

  // Fetch live IPO data from Neon PostgreSQL on initial mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/ipos', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.ipos && data.ipos.length > 0) {
          setIposList(data.ipos);
        }
      })
      .catch((err) => console.error('Failed to load initial data from Neon DB:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MAINBOARD' | 'SME'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'LIVE' | 'UPCOMING' | 'LISTED'>('LIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE' | 'CALENDAR'>('GRID');

  // Modal states
  const [selectedIpo, setSelectedIpo] = useState<IpoItem | null>(null);

  // Live Scraped IPO Data State
  const [iposList, setIposList] = useState<IpoItem[]>(getMergedIpos());

  // Count IPOs per status category for dynamic option badges & intelligent default selection
  const statusCounts = useMemo(() => {
    const counts = { LIVE: 0, UPCOMING: 0, LISTED: 0 };
    iposList.forEach((ipo) => {
      if (categoryFilter !== 'ALL' && ipo.category !== categoryFilter) return;
      const s = getEffectiveIpoStatus(ipo);
      counts[s]++;
    });
    return counts;
  }, [iposList, categoryFilter]);

  // If initial load has 0 LIVE IPOs and no explicit ?status URL parameter was passed, default to UPCOMING
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get('status');
      if (!statusParam && statusCounts.LIVE === 0 && statusCounts.UPCOMING > 0) {
        setStatusFilter('UPCOMING');
      }
    }
  }, [statusCounts.LIVE, statusCounts.UPCOMING]);

  // Filter IPOs
  const filteredIpos = useMemo(() => {
    const list = iposList.filter((ipo) => {
      if (categoryFilter !== 'ALL' && ipo.category !== categoryFilter) return false;

      const effectiveStatus = getEffectiveIpoStatus(ipo);
      if (statusFilter !== effectiveStatus) return false;

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

    // Sort: For listed sort by realized listing gain, for live/upcoming sort by live status then GMP
    return list.sort((a, b) => {
      if (statusFilter === 'LISTED') {
        return (b.listingGainPercent ?? b.gmp ?? 0) - (a.listingGainPercent ?? a.gmp ?? 0);
      }
      const isALive = getEffectiveIpoStatus(a) === 'LIVE';
      const isBLive = getEffectiveIpoStatus(b) === 'LIVE';
      if (isALive && !isBLive) return -1;
      if (isBLive && !isALive) return 1;
      return (b.gmp || 0) - (a.gmp || 0);
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
        {/* Single-Line All-in-One Filter & View Mode Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '0.6rem 1rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {/* Left: Filters (Status, Segment, Reset) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0f172a', fontWeight: 700, fontSize: '0.82rem' }}>
              <Filter size={15} color="#2563eb" />
              <span>Filters:</span>
            </div>

            {/* Status Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label htmlFor="status-filter-select" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>
                Status:
              </label>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select
                  id="status-filter-select"
                  aria-label="Filter IPOs by Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'LIVE' | 'UPCOMING' | 'LISTED')}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundColor:
                      statusFilter === 'LIVE'
                        ? '#ecfdf5'
                        : statusFilter === 'UPCOMING'
                        ? '#fffbeb'
                        : '#f5f3ff',
                    color:
                      statusFilter === 'LIVE'
                        ? '#065f46'
                        : statusFilter === 'UPCOMING'
                        ? '#92400e'
                        : '#5b21b6',
                    border:
                      statusFilter === 'LIVE'
                        ? '1.5px solid #10b981'
                        : statusFilter === 'UPCOMING'
                        ? '1.5px solid #f59e0b'
                        : '1.5px solid #8b5cf6',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.35rem 1.75rem 0.35rem 0.65rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <option value="LIVE">🟢 Live ({statusCounts.LIVE})</option>
                  <option value="UPCOMING">⏳ Upcoming ({statusCounts.UPCOMING})</option>
                  <option value="LISTED">✨ Listed ({statusCounts.LISTED})</option>
                </select>
                <ChevronDown
                  size={13}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    pointerEvents: 'none',
                    color:
                      statusFilter === 'LIVE'
                        ? '#059669'
                        : statusFilter === 'UPCOMING'
                        ? '#d97706'
                        : '#7c3aed'
                  }}
                />
              </div>
            </div>

            {/* Segment Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label htmlFor="category-filter-select" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>
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
                    padding: '0.35rem 1.75rem 0.35rem 0.65rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <option value="MAINBOARD">🏢 Mainboard</option>
                  <option value="SME">🚀 SME</option>
                  <option value="ALL">🌐 All</option>
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: categoryFilter === 'MAINBOARD' ? '#2563eb' : '#64748b' }} />
              </div>
            </div>

            {/* Reset Filters Quick Button */}
            {(statusFilter !== 'LIVE' || categoryFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setStatusFilter('LIVE');
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
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.3rem 0.55rem',
                  transition: 'all 0.15s ease'
                }}
                title="Clear filters and view all IPOs"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: View Mode Toggle & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              padding: '2px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => setViewMode('GRID')}
                style={{
                  padding: '0.3rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  color: viewMode === 'GRID' ? '#ffffff' : '#64748b',
                  backgroundColor: viewMode === 'GRID' ? '#2563eb' : 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Grid Cards view"
              >
                <LayoutGrid size={13} />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                style={{
                  padding: '0.3rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  color: viewMode === 'TABLE' ? '#ffffff' : '#64748b',
                  backgroundColor: viewMode === 'TABLE' ? '#2563eb' : 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Table view"
              >
                <TableIcon size={13} />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('CALENDAR')}
                style={{
                  padding: '0.3rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  color: viewMode === 'CALENDAR' ? '#ffffff' : '#64748b',
                  backgroundColor: viewMode === 'CALENDAR' ? '#2563eb' : 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Interactive IPO Calendar view"
              >
                <CalendarIcon size={13} />
                <span>Calendar</span>
              </button>
            </div>

            {/* Showing count indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}>
              <span>Showing</span>
              <span style={{
                fontWeight: 800,
                color: '#0f172a',
                backgroundColor: '#f1f5f9',
                padding: '1px 6px',
                borderRadius: '5px'
              }}>
                {viewMode === 'CALENDAR' ? iposList.length : filteredIpos.length}
              </span>
              <span>IPOs</span>
            </div>
          </div>
        </div>

        {/* Calendar View OR Cards View OR Table View OR Empty State */}
        {viewMode === 'CALENDAR' ? (
          <div style={{ marginBottom: '2.5rem' }}>
            <IpoCalendar
              ipos={iposList}
              onSelectIpo={(selected) => setSelectedIpo(selected)}
            />
          </div>
        ) : filteredIpos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: '#ffffff',
            border: '1px dashed #cbd5e1',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2.5rem'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
              {statusFilter === 'LIVE' ? '🟢' : '🔍'}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              {statusFilter === 'LIVE'
                ? 'No IPOs Open for Bidding Today'
                : 'No IPOs Found Matching Your Filters'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '460px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
              {statusFilter === 'LIVE'
                ? 'There are currently no active public issues accepting bids today. IPO bidding windows typically operate Monday to Friday between 10:00 AM and 5:00 PM IST.'
                : `There are currently no IPO issues matching Status: ${statusFilter} and Segment: ${categoryFilter}.`}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {statusFilter === 'LIVE' ? (
                <>
                  {statusCounts.UPCOMING > 0 && (
                    <button
                      onClick={() => setStatusFilter('UPCOMING')}
                      className="btn-primary"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1.15rem' }}
                    >
                      View Upcoming IPOs ({statusCounts.UPCOMING})
                    </button>
                  )}
                  {statusCounts.LISTED > 0 && (
                    <button
                      onClick={() => setStatusFilter('LISTED')}
                      className="btn-secondary"
                      style={{
                        fontSize: '0.85rem',
                        padding: '0.5rem 1.15rem',
                        backgroundColor: '#f5f3ff',
                        color: '#6d28d9',
                        borderColor: '#ddd6fe'
                      }}
                    >
                      View Listed IPOs ({statusCounts.LISTED})
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setStatusFilter(statusCounts.UPCOMING > 0 ? 'UPCOMING' : 'LISTED');
                    setCategoryFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
                >
                  Reset Filters
                </button>
              )}
            </div>
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
