import React from 'react';
import Link from 'next/link';
import { IpoItem } from '../../types';
import { Flame, ChevronRight } from 'lucide-react';

interface IpoTableProps {
  ipos: IpoItem[];
  onSelect: (ipo: IpoItem) => void;
}

export default function IpoTable({ ipos, onSelect }: IpoTableProps) {
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
            <th style={{ padding: '0.9rem 1.25rem' }}>Company / Exchange</th>
            <th style={{ padding: '0.9rem 1rem' }}>Type</th>
            <th style={{ padding: '0.9rem 1rem' }}>Price Band</th>
            <th style={{ padding: '0.9rem 1rem' }}>Issue Size</th>
            <th style={{ padding: '0.9rem 1rem' }}>Live GMP</th>
            <th style={{ padding: '0.9rem 1rem' }}>Est. Listing Gain</th>
            <th style={{ padding: '0.9rem 1rem' }}>Subscription</th>
            <th style={{ padding: '0.9rem 1rem' }}>Close Date</th>
            <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {ipos.map((ipo) => {
            const gmpPercent = ((ipo.gmp / ipo.priceBandHigh) * 100);
            return (
              <tr
                key={ipo.id}
                onClick={() => onSelect(ipo)}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                {/* Company Name */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                    {ipo.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', gap: '0.5rem' }}>
                    <span>{ipo.symbol}</span>
                    <span>•</span>
                    <span>{ipo.exchange}</span>
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
                  <div className="mono" style={{ fontWeight: 600, color: '#0f172a' }}>
                    ₹{ipo.priceBandLow} - ₹{ipo.priceBandHigh}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Lot: {ipo.lotSize} sh
                  </div>
                </td>

                {/* Issue Size */}
                <td style={{ padding: '1rem' }}>
                  <div className="mono" style={{ fontWeight: 600, color: '#334155' }}>
                    ₹{ipo.issueSizeCr.toLocaleString('en-IN')} Cr
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {ipo.freshIssueCr && ipo.freshIssueCr > 0 ? `Fresh ₹${ipo.freshIssueCr} Cr` : 'Pure OFS'}
                  </div>
                </td>

                {/* Live GMP */}
                <td style={{ padding: '1rem' }}>
                  <div className="mono" style={{
                    fontWeight: 800,
                    color: ipo.gmp >= 0 ? '#059669' : '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {ipo.gmp > 0 && <Flame size={13} color="#d97706" />}
                    {ipo.gmp >= 0 ? `+₹${ipo.gmp}` : `-₹${Math.abs(ipo.gmp)}`}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {ipo.gmpUpdatedDate}
                  </div>
                </td>

                {/* Est. Listing Gain */}
                <td style={{ padding: '1rem' }}>
                  <span className="mono" style={{
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: ipo.gmp >= 0 ? '#059669' : '#dc2626',
                    backgroundColor: ipo.gmp >= 0 ? '#ecfdf5' : '#fef2f2',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: ipo.gmp >= 0 ? '1px solid #a7f3d0' : '1px solid #fecaca'
                  }}>
                    {gmpPercent >= 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`}
                  </span>
                </td>

                {/* Subscription */}
                <td style={{ padding: '1rem' }}>
                  {ipo.subscription ? (
                    <div>
                      <div className="mono" style={{ fontWeight: 700, color: '#0f172a' }}>
                        {ipo.subscription.total}x
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        Ret: {ipo.subscription.retail}x
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>-</span>
                  )}
                </td>

                {/* Close Date */}
                <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#334155' }}>
                  {ipo.timeline.biddingEnds}
                </td>

                {/* Action */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <Link
                    href={`/ipo/${ipo.id}`}
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <span>View Insights</span>
                    <ChevronRight size={13} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
