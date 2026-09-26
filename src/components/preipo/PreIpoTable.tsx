'use client';

import React from 'react';
import { PreIpoItem } from '../../types';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface PreIpoTableProps {
  items: PreIpoItem[];
  onInquire: (item: PreIpoItem, type: 'BUY' | 'SELL') => void;
  onSelect: (item: PreIpoItem) => void;
}

export default function PreIpoTable({ items, onInquire, onSelect }: PreIpoTableProps) {
  return (
    <div className="table-responsive-wrapper">
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.875rem'
      }}>
        <thead>
          <tr style={{
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            color: '#64748b',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <th style={{ padding: '0.9rem 1.25rem' }}>Company / ISIN</th>
            <th style={{ padding: '0.9rem 1rem' }}>Sector</th>
            <th style={{ padding: '0.9rem 1rem' }}>Unlisted Price</th>
            <th style={{ padding: '0.9rem 1rem' }}>1-Year Trend</th>
            <th style={{ padding: '0.9rem 1rem' }}>Min Investment</th>
            <th style={{ padding: '0.9rem 1rem' }}>Valuation</th>
            <th style={{ padding: '0.9rem 1rem' }}>Expected IPO</th>
            <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Trade Desk</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isPositive = item.change1YPercent >= 0;
            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                {/* Company & ISIN */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div 
                    onClick={() => onSelect(item)}
                    style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#0284c7')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: '0.5rem' }}>
                    <span className="mono">{item.isin}</span>
                    <span>•</span>
                    <span>FV ₹{item.faceValue}</span>
                  </div>
                </td>

                {/* Sector */}
                <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#475569' }}>
                  {item.sector}
                </td>

                {/* Unlisted Price */}
                <td style={{ padding: '1rem' }}>
                  <div className="mono" style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    ₹{item.sharePrice.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Lot: {item.lotSize} sh
                  </div>
                </td>

                {/* 1Y Trend */}
                <td style={{ padding: '1rem' }}>
                  <span className="mono" style={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: isPositive ? '#059669' : '#dc2626',
                    backgroundColor: isPositive ? '#ecfdf5' : '#fef2f2',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositive ? `+${item.change1YPercent}%` : `${item.change1YPercent}%`}
                  </span>
                </td>

                {/* Min Investment */}
                <td style={{ padding: '1rem' }}>
                  <div className="mono" style={{ fontWeight: 700, color: '#0f172a' }}>
                    ₹{item.minInvestment.toLocaleString('en-IN')}
                  </div>
                </td>

                {/* Valuation */}
                <td style={{ padding: '1rem' }}>
                  <div className="mono" style={{ fontWeight: 700, color: '#0284c7' }}>
                    ₹{item.valuationCr.toLocaleString('en-IN')} Cr
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    P/E: {item.peRatio ? `${item.peRatio}x` : 'N/A'}
                  </div>
                </td>

                {/* Expected IPO */}
                <td style={{ padding: '1rem', fontSize: '0.78rem', color: '#334155' }}>
                  {item.expectedIpoTimeline}
                </td>

                {/* Actions */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <button
                      className="btn-primary"
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#0284c7',
                      }}
                      onClick={() => onInquire(item, 'BUY')}
                    >
                      <span>Buy</span>
                      <ArrowUpRight size={12} />
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => onInquire(item, 'SELL')}
                    >
                      Sell
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
