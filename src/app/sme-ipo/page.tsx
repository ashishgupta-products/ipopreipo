'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import IpoTable from '../../components/ipo/IpoTable';
import IpoDetailModal from '../../components/ipo/IpoDetailModal';
import { IpoItem, StockQuote } from '../../types';
import { getMergedIpos, getEffectiveIpoStatus, parseListingDateTimestamp } from '../../lib/ipoService';
import { Rocket, Filter, RotateCcw, ChevronDown } from 'lucide-react';

export default function SmeIpoPage() {
  const [iposList, setIposList] = useState<IpoItem[]>(getMergedIpos());
  const [selectedIpo, setSelectedIpo] = useState<IpoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'LIVE' | 'UPCOMING' | 'LISTED'>('LIVE');
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
      .catch((err) => console.error('Failed to load SME IPO data:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter only SME IPOs
  const smeIpos = useMemo(() => {
    return iposList.filter((ipo) => ipo.category === 'SME');
  }, [iposList]);

  // Compute status counts for SME
  const statusCounts = useMemo(() => {
    const counts = { LIVE: 0, UPCOMING: 0, LISTED: 0 };
    for (const ipo of smeIpos) {
      const eff = getEffectiveIpoStatus(ipo);
      if (counts[eff] !== undefined) counts[eff]++;
    }
    return counts;
  }, [smeIpos]);

  // If no LIVE SME IPOs, default to UPCOMING or LISTED
  useEffect(() => {
    if (statusCounts.LIVE === 0 && statusCounts.UPCOMING > 0) {
      setStatusFilter('UPCOMING');
    } else if (statusCounts.LIVE === 0 && statusCounts.UPCOMING === 0 && statusCounts.LISTED > 0) {
      setStatusFilter('LISTED');
    }
  }, [statusCounts.LIVE, statusCounts.UPCOMING, statusCounts.LISTED]);

  // Filter and sort
  const filteredIpos = useMemo(() => {
    const list = smeIpos.filter((ipo) => {
      const eff = getEffectiveIpoStatus(ipo);
      if (statusFilter !== eff) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ipo.name.toLowerCase().includes(q);
        const matchesSym = ipo.symbol.toLowerCase().includes(q);
        const matchesSector = (ipo.sector || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSym && !matchesSector) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (statusFilter === 'LISTED') {
        const dateA = parseListingDateTimestamp(a.timeline?.listingDate || a.listingDate);
        const dateB = parseListingDateTimestamp(b.timeline?.listingDate || b.listingDate);
        if (dateB !== dateA) return dateB - dateA;
        return (b.listingGainPercent ?? b.gmp ?? 0) - (a.listingGainPercent ?? a.gmp ?? 0);
      }
      return (b.gmp || 0) - (a.gmp || 0);
    });
  }, [smeIpos, statusFilter, searchQuery]);

  // Fetch live market quotes for listed items
  useEffect(() => {
    if (statusFilter !== 'LISTED' || filteredIpos.length === 0) return;
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
      .catch((err) => console.error('Failed to fetch CMP quotes for SME:', err));
  }, [statusFilter, filteredIpos]);

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
              <Rocket size={20} color="#b45309" />
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                SME IPOs
              </h1>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#b45309',
                backgroundColor: '#fffbeb',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #fde68a'
              }}>
                NSE Emerge & BSE SME
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Live bidding, upcoming issues, lot sizes, and performance of Small & Medium Enterprises.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '0.4rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{statusCounts.LIVE}</div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>Open Now</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.4rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{statusCounts.UPCOMING}</div>
              <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>Upcoming</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.4rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{statusCounts.LISTED}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Listed</div>
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
          {/* Status Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0f172a', fontWeight: 700, fontSize: '0.82rem' }}>
              <Filter size={15} color="#2563eb" />
              <span>Status:</span>
            </div>

            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                id="sme-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
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
                <option value="LIVE">🟢 Ongoing ({statusCounts.LIVE})</option>
                <option value="UPCOMING">🔵 Upcoming ({statusCounts.UPCOMING})</option>
                <option value="LISTED">✨ Listed ({statusCounts.LISTED})</option>
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: '#64748b' }} />
            </div>

            {statusFilter !== 'LIVE' && statusCounts.LIVE > 0 && (
              <button
                onClick={() => setStatusFilter('LIVE')}
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
            Showing <strong style={{ color: '#0f172a' }}>{filteredIpos.length}</strong> SME IPOs
          </div>
        </div>

        {/* SME Table */}
        <IpoTable
          ipos={filteredIpos}
          onSelect={(ipo) => setSelectedIpo(ipo)}
          statusFilter={statusFilter}
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
