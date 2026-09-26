'use client';

import React, { useState } from 'react';
import { IpoItem } from '../../types';
import { Flame, Info, ArrowUpRight, Calculator } from 'lucide-react';

interface GmpTrackerProps {
  ipos: IpoItem[];
  onSelectIpo: (ipo: IpoItem) => void;
  onOpenCalculator: (ipo: IpoItem) => void;
}

export default function GmpTracker({ ipos, onSelectIpo, onOpenCalculator }: GmpTrackerProps) {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'MAINBOARD' | 'SME'>('ALL');
  const [minBuzz, setMinBuzz] = useState<number>(0);

  const filtered = ipos
    .filter((ipo) => filterCategory === 'ALL' || ipo.category === filterCategory)
    .filter((ipo) => ipo.fireRating >= minBuzz)
    .sort((a, b) => {
      const aPct = (a.gmp / a.priceBandHigh);
      const bPct = (b.gmp / b.priceBandHigh);
      return bPct - aPct;
    });

  const topGainer = filtered[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* GMP Highlights Top Banner */}
      {topGainer && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="glass-badge badge-amber">
                <Flame size={12} /> #1 GMP LEADER
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Highest Expected Listing Gain
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {topGainer.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
              Issue Price: ₹{topGainer.priceBandHigh} • Est. Listing: ₹{topGainer.priceBandHigh + topGainer.gmp} ({((topGainer.gmp / topGainer.priceBandHigh) * 100).toFixed(1)}%)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600, textTransform: 'uppercase' }}>
                Estimated Profit / Lot
              </div>
              <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>
                ₹{(topGainer.gmp * topGainer.lotSize).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Lot: {topGainer.lotSize} shares
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => onSelectIpo(topGainer)}
            >
              <span>Full GMP Breakdown</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { id: 'ALL', label: 'All Issues' },
            { id: 'MAINBOARD', label: 'Mainboard IPOs' },
            { id: 'SME', label: 'SME IPOs' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: filterCategory === cat.id ? '#2563eb' : '#64748b',
                backgroundColor: filterCategory === cat.id ? '#eff6ff' : 'transparent',
                border: filterCategory === cat.id ? '1px solid #bfdbfe' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Buzz Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Min Demand:</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setMinBuzz(star)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: minBuzz === star ? '#ffffff' : '#64748b',
                  backgroundColor: minBuzz === star ? '#d97706' : '#f1f5f9',
                  border: minBuzz === star ? '1px solid #d97706' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                {star === 0 ? 'All' : <><Flame size={12} fill="#ffffff" /> {star}★</>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GMP Comprehensive Table */}
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
              <th style={{ padding: '0.9rem 1.25rem' }}>IPO Name</th>
              <th style={{ padding: '0.9rem 1rem' }}>Category</th>
              <th style={{ padding: '0.9rem 1rem' }}>Price Band</th>
              <th style={{ padding: '0.9rem 1rem' }}>Live GMP (₹)</th>
              <th style={{ padding: '0.9rem 1rem' }}>Est. Listing Gain (%)</th>
              <th style={{ padding: '0.9rem 1rem' }}>Est. Listing Price</th>
              <th style={{ padding: '0.9rem 1rem' }}>Profit / Lot</th>
              <th style={{ padding: '0.9rem 1rem' }}>Demand</th>
              <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Calculator</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ipo) => {
              const gmpPercent = ((ipo.gmp / ipo.priceBandHigh) * 100);
              const estPrice = ipo.priceBandHigh + ipo.gmp;
              const profitPerLot = ipo.gmp * ipo.lotSize;

              return (
                <tr
                  key={ipo.id}
                  onClick={() => onSelectIpo(ipo)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  {/* Name */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                      {ipo.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Updated: {ipo.gmpUpdatedDate}
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: ipo.category === 'SME' ? '#b45309' : '#2563eb',
                      backgroundColor: ipo.category === 'SME' ? '#fffbeb' : '#eff6ff',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: ipo.category === 'SME' ? '1px solid #fde68a' : '1px solid #bfdbfe',
                    }}>
                      {ipo.category}
                    </span>
                  </td>

                  {/* Price Band */}
                  <td style={{ padding: '1rem' }}>
                    <span className="mono" style={{ fontWeight: 600, color: '#0f172a' }}>₹{ipo.priceBandHigh}</span>
                  </td>

                  {/* GMP */}
                  <td style={{ padding: '1rem' }}>
                    <div className="mono" style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: ipo.gmp >= 0 ? '#059669' : '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {ipo.gmp > 0 && <Flame size={14} color="#d97706" />}
                      {ipo.gmp >= 0 ? `+₹${ipo.gmp}` : `-₹${Math.abs(ipo.gmp)}`}
                    </div>
                  </td>

                  {/* Est. Listing Gain */}
                  <td style={{ padding: '1rem' }}>
                    <span className="mono" style={{
                      fontWeight: 700,
                      color: ipo.gmp >= 0 ? '#059669' : '#dc2626',
                      backgroundColor: ipo.gmp >= 0 ? '#ecfdf5' : '#fef2f2',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: ipo.gmp >= 0 ? '1px solid #a7f3d0' : '1px solid #fecaca'
                    }}>
                      {gmpPercent >= 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`}
                    </span>
                  </td>

                  {/* Est Listing Price */}
                  <td style={{ padding: '1rem' }}>
                    <span className="mono" style={{ fontWeight: 600, color: '#0f172a' }}>
                      ₹{estPrice}
                    </span>
                  </td>

                  {/* Profit Per Lot */}
                  <td style={{ padding: '1rem' }}>
                    <span className="mono" style={{
                      fontWeight: 700,
                      color: profitPerLot >= 0 ? '#059669' : '#dc2626'
                    }}>
                      {profitPerLot >= 0 ? `+₹${profitPerLot.toLocaleString('en-IN')}` : `-₹${Math.abs(profitPerLot).toLocaleString('en-IN')}`}
                    </span>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      ({ipo.lotSize} sh)
                    </div>
                  </td>

                  {/* Buzz Rating */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '2px', color: '#d97706' }}>
                      {Array.from({ length: ipo.fireRating }).map((_, i) => (
                        <Flame key={i} size={14} fill="#d97706" />
                      ))}
                    </div>
                  </td>

                  {/* Calculator Button */}
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCalculator(ipo);
                      }}
                    >
                      <Calculator size={13} color="#387ed1" />
                      <span>Calculate</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* GMP Knowledge Box */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <Info size={18} color="#387ed1" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.6' }}>
          <strong style={{ color: '#0f172a' }}>How is Grey Market Premium (GMP) calculated? </strong>
          GMP is the premium amount at which an IPO’s shares trade unofficially in the grey market prior to official listing on NSE/BSE. 
          The <em>Estimated Listing Price = Cutoff Price + GMP</em>. Kostak rate refers to the profit earned by selling one entire IPO application before allotment. GMP is for estimation only and is unregulated.
        </div>
      </div>
    </div>
  );
}
