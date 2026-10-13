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
import { getMergedIpos } from '../lib/ipoService';

import { 
  LayoutGrid, 
  Table as TableIcon, 
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  RotateCcw,
  ShieldCheck,
  ExternalLink
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
      } else if (tab === 'allotment') {
        router.replace('/allotment');
      } else if (tab === 'calendar' || view === 'calendar') {
        setViewMode('CALENDAR');
      }

      if (status === 'closed' || tab === 'closed') {
        setStatusFilter('CLOSED');
      }
    }
  }, [router]);

  // Fetch live IPO data from Neon PostgreSQL on initial mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/ipos')
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

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MAINBOARD' | 'SME'>('MAINBOARD');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'ONGOING' | 'UPCOMING' | 'CLOSED' | 'LISTED'>('LIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE' | 'CALENDAR'>('GRID');

  // Modal states
  const [selectedIpo, setSelectedIpo] = useState<IpoItem | null>(null);

  // Live Scraped IPO Data State
  const [iposList, setIposList] = useState<IpoItem[]>(getMergedIpos());

  const isDatesAnnounced = (ipo: IpoItem) => {
    const start = ipo.timeline?.biddingStarts?.trim();
    if (!start) return false;
    const sLow = start.toLowerCase();
    if (sLow === 'tba' || sLow.includes('tba') || sLow.includes('announced') || start === '–' || start === '-') {
      return false;
    }
    // Reject corrupted strings where ISO date is prepended (e.g. 2026-09-2417th)
    if (/^\d{4}-\d{2}-\d{2}/.test(start)) {
      return false;
    }

    // Must be a CURRENT or FUTURE date, not in the past!
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const now = new Date();
    const currentMonth = now.getMonth(); // 9 for October

    const parsedDate = Date.parse(start);
    if (!isNaN(parsedDate)) {
      const d = new Date(parsedDate);
      now.setHours(0, 0, 0, 0);
      return d >= now;
    }

    // Fallback: check if the month in the string has already passed this year
    for (let i = 0; i < months.length; i++) {
      if (sLow.includes(months[i])) {
        if (i < currentMonth) return false;
        break;
      }
    }

    return true;
  };

  // Filter IPOs
  const filteredIpos = useMemo(() => {
    const list = iposList.filter((ipo) => {
      if (categoryFilter !== 'ALL' && ipo.category !== categoryFilter) return false;

      if (statusFilter === 'LIVE') {
        const isLiveOrAnnounced = ipo.status === 'ONGOING' || (ipo.status === 'UPCOMING' && isDatesAnnounced(ipo));
        if (!isLiveOrAnnounced) return false;
      } else if (statusFilter !== 'ALL' && ipo.status !== statusFilter) {
        return false;
      }

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

    // Sort: Currently open (ONGOING) first, then upcoming with announced dates, then by GMP
    return list.sort((a, b) => {
      if (a.status === 'ONGOING' && b.status !== 'ONGOING') return -1;
      if (b.status === 'ONGOING' && a.status !== 'ONGOING') return 1;
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
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundColor: (statusFilter === 'LIVE' || statusFilter === 'ONGOING') ? '#ecfdf5' : '#f8fafc',
                    color: (statusFilter === 'LIVE' || statusFilter === 'ONGOING') ? '#065f46' : '#1e293b',
                    border: (statusFilter === 'LIVE' || statusFilter === 'ONGOING') ? '1.5px solid #10b981' : '1px solid #cbd5e1',
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
                  <option value="LIVE">🟢 Live & Announced</option>
                  <option value="ONGOING">⚡ Live Only (Active)</option>
                  <option value="UPCOMING">⏳ Upcoming (TBA)</option>
                  <option value="CLOSED">🔒 Closed / Allotment</option>
                  <option value="LISTED">✨ Recently Listed</option>
                  <option value="ALL">📋 All Statuses</option>
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: (statusFilter === 'LIVE' || statusFilter === 'ONGOING') ? '#059669' : '#64748b' }} />
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

        {/* Closed / Allotment Gateway Ribbon */}
        {statusFilter === 'CLOSED' && viewMode !== 'CALENDAR' && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-lg)',
            padding: '0.9rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={20} color="#059669" />
              <div>
                <div style={{ fontWeight: 700, color: '#065f46', fontSize: '0.88rem' }}>
                  Official Registrar Allotment Status Hub
                </div>
                <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                  These issues have closed bidding and are currently finalizing allotment. You can check share allocation via PAN on official registrar gateways.
                </div>
              </div>
            </div>
            <Link
              href="/allotment"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#059669',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                transition: 'background-color 0.15s ease'
              }}
            >
              <span>Check Allotment Portals</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        )}

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
