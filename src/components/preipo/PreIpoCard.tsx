'use client';

import React from 'react';
import { PreIpoItem } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ArrowUpRight, 
  Flame 
} from 'lucide-react';

interface PreIpoCardProps {
  item: PreIpoItem;
  onInquire: (item: PreIpoItem, type: 'BUY' | 'SELL') => void;
  onSelect: (item: PreIpoItem) => void;
}

export default function PreIpoCard({ item, onInquire, onSelect }: PreIpoCardProps) {
  const isPositive = item.change1YPercent >= 0;

  return (
    <div 
      className="glass-panel"
      style={{
        padding: '1.4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Top Accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #0284c7, #387ed1)'
      }} />

      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
              <span className="glass-badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 7px' }}>
                Unlisted Equity
              </span>
              {item.status === 'HOT' && (
                <span className="glass-badge badge-amber" style={{ fontSize: '0.65rem', padding: '1px 7px' }}>
                  <Flame size={10} /> HOT
                </span>
              )}
            </div>
            <h3 
              onClick={() => onSelect(item)} 
              style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer', lineHeight: '1.3' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0284c7')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
            >
              {item.name}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              {item.sector}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              ₹{item.sharePrice.toLocaleString('en-IN')}
            </div>
            <div className="mono" style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: isPositive ? '#059669' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '2px'
            }}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{isPositive ? `+${item.change1YPercent}%` : `${item.change1YPercent}%`} (1Y)</span>
            </div>
          </div>
        </div>

        {/* Pricing & Valuation Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.65rem',
          backgroundColor: '#f8fafc',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          margin: '0.85rem 0',
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Min Investment</div>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              ₹{item.minInvestment.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Lot: {item.lotSize} shares</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Valuation</div>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7' }}>
              ₹{item.valuationCr.toLocaleString('en-IN')} Cr
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              P/E: {item.peRatio ? `${item.peRatio}x` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Expected IPO Timeline */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 'var(--radius-md)',
          padding: '0.55rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.85rem',
          fontSize: '0.75rem',
          color: '#0369a1'
        }}>
          <Calendar size={14} style={{ flexShrink: 0 }} />
          <span>
            <strong>Listing Roadmap: </strong>{item.expectedIpoTimeline}
          </span>
        </div>

        {/* ISIN & Promoters info */}
        <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>ISIN: <span className="mono" style={{ color: '#334155', fontWeight: 600 }}>{item.isin}</span></span>
          <span>Face Value: ₹{item.faceValue}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #f1f5f9'
      }}>
        <button
          className="btn-primary"
          style={{
            padding: '0.5rem',
            fontSize: '0.8rem',
            backgroundColor: '#0284c7',
            boxShadow: '0 1px 3px rgba(2, 132, 199, 0.25)'
          }}
          onClick={() => onInquire(item, 'BUY')}
        >
          <span>Buy Shares</span>
          <ArrowUpRight size={14} />
        </button>

        <button
          className="btn-secondary"
          style={{ padding: '0.5rem', fontSize: '0.8rem' }}
          onClick={() => onInquire(item, 'SELL')}
        >
          <span>Sell Unlisted</span>
        </button>
      </div>
    </div>
  );
}
