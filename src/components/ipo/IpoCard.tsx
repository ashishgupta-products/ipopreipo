'use client';

import React from 'react';
import Link from 'next/link';
import { IpoItem, StockQuote } from '../../types';
import {
  Flame,
  TrendingUp,
  Calendar,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import IpoLogo from './IpoLogo';

interface IpoCardProps {
  ipo: IpoItem;
  onSelect: (ipo: IpoItem) => void;
  onCheckAllotment?: (ipo: IpoItem) => void;
  quote?: StockQuote;
}

function cleanTimelineDate(dateStr?: string): string {
  if (!dateStr) return 'TBA';
  let s = dateStr.trim();
  if (s.toLowerCase().includes('tba') || s.toLowerCase().includes('announced') || s === '–' || s === '-') {
    return 'TBA';
  }
  // Strip any accidental ISO date prefix (e.g. 2026-09-2417th -> 17th)
  s = s.replace(/^\d{4}-\d{2}-\d{2}/, '').trim();
  return s || 'TBA';
}

export default function IpoCard({ ipo, onSelect, onCheckAllotment, quote }: IpoCardProps) {
  const isListed = ipo.status === 'LISTED' || (typeof ipo.listingPrice === 'number' && ipo.listingPrice > 0);
  const listingPrice = ipo.listingPrice ?? (isListed && ipo.priceBandHigh ? ipo.priceBandHigh + (ipo.gmp || 0) : undefined);
  const listingGain = ipo.listingGainPercent ?? (isListed && ipo.priceBandHigh && listingPrice ? ((listingPrice - ipo.priceBandHigh) / ipo.priceBandHigh) * 100 : 0);

  const cmp = quote?.currentPrice ?? listingPrice;
  const cmpChange = quote?.change;
  const cmpChangePercent = quote?.changePercent;
  const totalReturn = (cmp && ipo.priceBandHigh) ? ((cmp - ipo.priceBandHigh) / ipo.priceBandHigh) * 100 : listingGain;

  const hasValidLot = Boolean(ipo.lotSize && ipo.lotSize > 0);
  const minInvestment = hasValidLot && ipo.priceBandHigh ? ipo.priceBandHigh * (ipo.lotSize as number) : null;
  const gmpPercent = ipo.priceBandHigh ? ((ipo.gmp / ipo.priceBandHigh) * 100) : 0;
  const estListingPrice = listingPrice ?? (ipo.priceBandHigh + ipo.gmp);
  const dailyChange = ipo.dailyGmpChange !== undefined ? ipo.dailyGmpChange : (ipo.gmpTrend === 'UP' ? 15 : ipo.gmpTrend === 'DOWN' ? -10 : 0);

  const getStatusBadge = () => {
    // 1. If listed or has official listing price, always show Listed
    if (isListed) {
      return (
        <span className="glass-badge badge-cyan">
          <Sparkles size={11} />
          Listed
        </span>
      );
    }

    // 2. If status is ONGOING or LIVE
    if (ipo.status === 'ONGOING' || (ipo.status as string) === 'LIVE') {
      const rawStart = cleanTimelineDate(ipo.timeline?.biddingStarts);
      if (rawStart === 'TBA') {
        return (
          <span className="glass-badge badge-indigo">
            <Clock size={11} />
            Upcoming
          </span>
        );
      }
      return (
        <span className="glass-badge badge-emerald">
          <span className="pulse-indicator"></span>
          Live
        </span>
      );
    }

    // 3. If UPCOMING
    if (ipo.status === 'UPCOMING') {
      const rawStart = ipo.timeline?.biddingStarts;
      const start = cleanTimelineDate(rawStart);
      const hasAnnounced = start !== 'TBA';
      if (hasAnnounced) {
        const shortDate = start.replace(/\s+\d{4}$/, '').replace(/(\d+)(st|nd|rd|th)/gi, '$1');
        return (
          <span className="glass-badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
            <Calendar size={11} color="#2563eb" />
            Opens {shortDate}
          </span>
        );
      }
      return (
        <span className="glass-badge badge-indigo">
          <Clock size={11} />
          Upcoming
        </span>
      );
    }

    // 4. If CLOSED
    if (ipo.status === 'CLOSED') {
      return (
        <span className="glass-badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d97706' }} />
          Closed / Allotment
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: '#ffffff'
      }}
      onClick={() => onSelect(ipo)}
    >
      {/* Top category ribbon */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: ipo.category === 'SME'
          ? 'linear-gradient(90deg, #f59e0b, #d97706)'
          : 'linear-gradient(90deg, #387ed1, #00b386)'
      }} />

      {/* Header Info */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <IpoLogo name={ipo.name} symbol={ipo.symbol} logoUrl={ipo.logoUrl} size={42} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: ipo.category === 'SME' ? '#b45309' : '#2563eb',
                  backgroundColor: ipo.category === 'SME' ? '#fffbeb' : '#eff6ff',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: ipo.category === 'SME' ? '1px solid #fde68a' : '1px solid #bfdbfe',
                }}>
                  {ipo.category}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {ipo.exchange}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.3' }}>
                {ipo.name}
              </h3>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
            {getStatusBadge()}
          </div>
        </div>

        {/* Pricing & Lot Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          backgroundColor: '#f8fafc',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          margin: '0.75rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              {isListed ? 'Issue Price' : 'Price Band'}
            </div>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              {isListed && ipo.priceBandHigh
                ? (ipo.priceBandLow === ipo.priceBandHigh ? `₹${ipo.priceBandHigh}` : `₹${ipo.priceBandLow} - ₹${ipo.priceBandHigh}`)
                : (ipo.priceBandLow && ipo.priceBandHigh ? `₹${ipo.priceBandLow} - ₹${ipo.priceBandHigh}` : 'TBA')}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              {hasValidLot ? `Lot: ${ipo.lotSize} shares` : 'Lot: TBA'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              {isListed ? 'Issue Size' : 'Min Investment'}
            </div>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              {isListed
                ? (ipo.issueSizeCr && ipo.issueSizeCr > 0 ? `₹${ipo.issueSizeCr.toLocaleString('en-IN')} Cr` : '₹100 Cr+')
                : (minInvestment ? `₹${minInvestment.toLocaleString('en-IN')}` : 'TBA')}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              {isListed
                ? (ipo.timeline?.listingDate ? `Listed: ${ipo.timeline.listingDate}` : 'Exchange Listed')
                : (ipo.issueSizeCr && ipo.issueSizeCr > 0 ? `Size: ₹${ipo.issueSizeCr.toLocaleString('en-IN')} Cr` : 'Size: TBA')}
            </div>
          </div>
        </div>

        {/* Listing Price & Live Current Market Price (CMP) Banner */}
        {isListed && listingPrice ? (
          <div style={{
            backgroundColor: (totalReturn ?? 0) >= 0 ? '#f0fdf4' : '#fef2f2',
            border: (totalReturn ?? 0) >= 0 ? '1px solid #bbf7d0' : '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>
                <span className="pulse-indicator" style={{ width: '6px', height: '6px', backgroundColor: '#16a34a' }}></span>
                <span>Current Market Price</span>
                {quote ? (
                  <span style={{ fontSize: '0.62rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                    Live
                  </span>
                ) : null}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '2px' }}>
                <span className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{cmp}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Listed at: ₹{listingPrice}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                {quote ? "Today's Change" : "Listing Gain"}
              </div>
              {quote && cmpChange !== undefined ? (
                <div>
                  <div className="mono" style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: cmpChange >= 0 ? '#15803d' : '#dc2626'
                  }}>
                    {cmpChange >= 0 ? `+₹${cmpChange}` : `-₹${Math.abs(cmpChange)}`} ({cmpChangePercent ? (cmpChangePercent >= 0 ? `+${cmpChangePercent.toFixed(1)}%` : `${cmpChangePercent.toFixed(1)}%`) : ''})
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    Total Gain: <strong style={{ color: (totalReturn ?? 0) >= 0 ? '#15803d' : '#dc2626' }}>
                      {(totalReturn ?? 0) >= 0 ? `+${(totalReturn ?? 0).toFixed(1)}%` : `${(totalReturn ?? 0).toFixed(1)}%`}
                    </strong>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mono" style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: (listingGain ?? 0) >= 0 ? '#059669' : '#dc2626',
                  }}>
                    {(listingGain ?? 0) >= 0 ? `+${(listingGain ?? 0).toFixed(1)}%` : `${(listingGain ?? 0).toFixed(1)}%`}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {ipo.listingDayClose ? `Day Close: ₹${ipo.listingDayClose}` : `Issue: ₹${ipo.priceBandHigh || ipo.priceBandLow}`}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: ipo.gmp >= 0 ? '#ecfdf5' : '#fef2f2',
            border: ipo.gmp >= 0 ? '1px solid #a7f3d0' : '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: ipo.gmp >= 0 ? '#059669' : '#dc2626', fontWeight: 700 }}>
                <Flame size={13} color={ipo.gmp >= 0 ? '#059669' : '#dc2626'} />
                <span>Grey Market Premium</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: ipo.gmp >= 0 ? '#059669' : '#dc2626' }}>
                  {ipo.gmp >= 0 ? `+₹${ipo.gmp}` : `-₹${Math.abs(ipo.gmp)}`}
                </span>
                {dailyChange !== 0 ? (
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: dailyChange > 0 ? '#15803d' : '#b91c1c',
                    backgroundColor: dailyChange > 0 ? '#dcfce7' : '#fee2e2',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    {dailyChange > 0 ? `▲ +₹${dailyChange}` : `▼ -₹${Math.abs(dailyChange)}`}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    ▬ Flat
                  </span>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Est. Gain
              </div>
              <div className="mono" style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: ipo.gmp >= 0 ? '#059669' : '#dc2626',
              }}>
                {gmpPercent >= 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Est: ₹{estListingPrice}
              </div>
            </div>
          </div>
        )}

        {/* Subscription Progress */}
        {ipo.subscription && (
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: '0.25rem' }}>
              <span>Total Subscribed: <strong style={{ color: '#0f172a' }}>{ipo.subscription.total}x</strong></span>
              <span>Retail: {ipo.subscription.retail}x | QIB: {ipo.subscription.qib}x</span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(ipo.subscription.total * 5, 100)}%`,
                background: ipo.subscription.total > 10 ? 'linear-gradient(90deg, #059669, #0284c7)' : '#387ed1',
                borderRadius: '3px'
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Footer Dates & Actions */}
      <div style={{
        borderTop: '1px solid #f1f5f9',
        paddingTop: '0.75rem',
        marginTop: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#64748b' }}>
          <Calendar size={13} color={isListed ? '#16a34a' : '#64748b'} />
          {isListed ? (
            <span>Listed on: <strong style={{ color: '#166534', fontWeight: 700 }}>{ipo.timeline?.listingDate || 'Completed'}</strong></span>
          ) : ipo.status === 'CLOSED' ? (
            <span>Allotment: <strong style={{ color: '#6d28d9' }}>{ipo.timeline.allotmentFinalization || 'In Progress'}</strong></span>
          ) : ipo.status === 'UPCOMING' ? (
            <span>Opens: <strong style={{ color: '#2563eb' }}>{cleanTimelineDate(ipo.timeline.biddingStarts)}</strong></span>
          ) : (
            <span>Close: <strong style={{ color: '#334155' }}>{ipo.timeline.biddingEnds}</strong></span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {ipo.status === 'CLOSED' && (
            <a
              href={ipo.registrarUrl || 'https://linkintime.co.in/initial_offer/public-issues.html'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Check Allotment on ${ipo.registrar || 'Registrar'}`}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#059669',
                backgroundColor: '#ecfdf5',
                padding: '4px 8px',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid #a7f3d0',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1fae5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ecfdf5')}
            >
              Allotment
            </a>
          )}

          <Link
            href={`/ipo/${ipo.id}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              padding: '4px 10px',
              borderRadius: '6px',
              textDecoration: 'none',
              border: '1px solid #bfdbfe',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
          >
            <span>Insights</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
