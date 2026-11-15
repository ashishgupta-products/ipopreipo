'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import IpoTable from '../../components/ipo/IpoTable';
import IpoDetailModal from '../../components/ipo/IpoDetailModal';
import { IpoItem, StockQuote } from '../../types';
import { getMergedIpos, getEffectiveIpoStatus, parseListingDateTimestamp } from '../../lib/ipoService';
import { Trophy, TrendingUp, Filter, RotateCcw, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function IpoPerformancePage() {
  const [iposList, setIposList] = useState<IpoItem[]>(getMergedIpos());
  const [selectedIpo, setSelectedIpo] = useState<IpoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'ALL' | 'MAINBOARD' | 'SME'>('ALL');
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});

  // Fetch verified data from API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/ipos', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.ipos && data.ipos.length > 0) {
          setIposList(data.ipos);
        }
      })
      .catch((err) => console.error('Failed to load IPO performance data:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter listed IPOs only
  const listedIpos = useMemo(() => {
    return iposList.filter((ipo) => getEffectiveIpoStatus(ipo) === 'LISTED');
  }, [iposList]);

  // Compute performance KPIs
  const stats = useMemo(() => {
    if (listedIpos.length === 0) return { total: 0, positiveRate: 0, avgGain: 0, topGainer: null };

    const withGain = listedIpos.filter((i) => i.listingGainPercent !== undefined);
    const positiveCount = withGain.filter((i) => (i.listingGainPercent ?? 0) > 0).length;
    const positiveRate = withGain.length > 0 ? Math.round((positiveCount / withGain.length) * 100) : 0;

    const sumGain = withGain.reduce((acc, curr) => acc + (curr.listingGainPercent ?? 0), 0);
    const avgGain = withGain.length > 0 ? Math.round((sumGain / withGain.length) * 10) / 10 : 0;

    const sortedByGain = [...withGain].sort((a, b) => (b.listingGainPercent ?? 0) - (a.listingGainPercent ?? 0));
    const topGainer = sortedByGain[0] || null;

    return {
      total: listedIpos.length,
      positiveRate,
      avgGain,
      topGainer
    };
  }, [listedIpos]);

  // Filter by segment and search query
  const filteredIpos = useMemo(() => {
    const list = listedIpos.filter((ipo) => {
      if (segmentFilter !== 'ALL' && ipo.category !== segmentFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ipo.name.toLowerCase().includes(q);
        const matchesSym = ipo.symbol.toLowerCase().includes(q);
        const matchesSector = (ipo.sector || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSym && !matchesSector) return false;
      }
      return true;
    });

    // Invariant deduplication: guarantee zero duplicate entries
    const seenNames = new Set<string>();
    const uniqueList: IpoItem[] = [];
    for (const item of list) {
      const normKey = (item.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenNames.has(normKey)) {
        seenNames.add(normKey);
        uniqueList.push(item);
      }
    }

    // Chronological default sort (newest listed first)
    return uniqueList.sort((a, b) => {
      const dateA = parseListingDateTimestamp(a.timeline?.listingDate || a.listingDate);
      const dateB = parseListingDateTimestamp(b.timeline?.listingDate || b.listingDate);
      if (dateB !== dateA) return dateB - dateA;
      return (b.listingGainPercent ?? b.gmp ?? 0) - (a.listingGainPercent ?? a.gmp ?? 0);
    });
  }, [listedIpos, segmentFilter, searchQuery]);

  // Fetch live market quotes for CMP
  useEffect(() => {
    if (filteredIpos.length === 0) return;
    const symbols = filteredIpos
      .map((i) => i.symbol)
      .filter((s) => s && s.trim().length > 0)
      .slice(0, 30);

    if (symbols.length === 0) return;

    fetch(`/api/stocks/quote?symbols=${symbols.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.quotes) {
          setQuotes((prev) => ({ ...prev, ...data.quotes }));
        }
      })
      .catch((err) => console.error('Failed to fetch CMP quotes for performance:', err));
  }, [filteredIpos]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="container" style={{ flex: 1, paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        {/* Header Banner */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Trophy size={20} color="#059669" />
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                IPO Listing Performance
              </h1>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#059669',
                backgroundColor: '#ecfdf5',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #a7f3d0'
              }}>
                Track Record
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Realized listing day gains, historical issue prices, and live CMP returns for all listed IPOs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '0.4rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{stats.total}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Listed Tracked</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.4rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d' }}>{stats.positiveRate}%</div>
              <div style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 700 }}>Positive Listings</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.4rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>+{stats.avgGain}%</div>
              <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>Avg Day 1 Gain</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
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
          {/* Segment Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0f172a', fontWeight: 700, fontSize: '0.82rem' }}>
              <Filter size={15} color="#2563eb" />
              <span>Segment:</span>
            </div>

            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                id="perf-segment-filter"
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value as any)}
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.35rem 1.75rem 0.35rem 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <option value="ALL">🌐 All Segments ({listedIpos.length})</option>
                <option value="MAINBOARD">🏢 Mainboard ({listedIpos.filter(i => i.category === 'MAINBOARD').length})</option>
                <option value="SME">🚀 SME ({listedIpos.filter(i => i.category === 'SME').length})</option>
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: '#64748b' }} />
            </div>

            {segmentFilter !== 'ALL' && (
              <button
                onClick={() => setSegmentFilter('ALL')}
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
                  padding: '0.3rem 0.55rem'
                }}
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Showing <strong style={{ color: '#0f172a' }}>{filteredIpos.length}</strong> Listed IPOs
          </div>
        </div>

        {/* Performance Table (reusing optimized IpoTable with statusFilter="LISTED") */}
        <IpoTable
          ipos={filteredIpos}
          onSelect={(ipo) => setSelectedIpo(ipo)}
          statusFilter="LISTED"
          quotes={quotes}
        />
      </main>

      {selectedIpo && (
        <IpoDetailModal
          ipo={selectedIpo}
          onClose={() => setSelectedIpo(null)}
        />
      )}

      <Footer />
    </div>
  );
}
