'use client';

import React from 'react';
import { PreIpoItem } from '../../types';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Users, 
  Calendar, 
  ArrowUpRight 
} from 'lucide-react';

interface PreIpoDetailModalProps {
  item: PreIpoItem | null;
  onClose: () => void;
  onInquire: (item: PreIpoItem, type: 'BUY' | 'SELL') => void;
}

export default function PreIpoDetailModal({ item, onClose, onInquire }: PreIpoDetailModalProps) {
  if (!item) return null;

  const isPositive = item.change1YPercent >= 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', padding: '1.75rem', backgroundColor: '#ffffff' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="glass-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              Pre-IPO Unlisted Equity
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              ISIN: <strong className="mono" style={{ color: '#0f172a' }}>{item.isin}</strong>
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}>
            {item.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.4rem', lineHeight: '1.5' }}>
            {item.about}
          </p>
        </div>

        {/* Key Metrics Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
          gap: '0.75rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Unlisted Price</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              ₹{item.sharePrice.toLocaleString('en-IN')}
            </div>
            <div className="mono" style={{ fontSize: '0.72rem', color: isPositive ? '#059669' : '#dc2626', fontWeight: 600 }}>
              {isPositive ? `+${item.change1YPercent}%` : `${item.change1YPercent}%`} 1Y
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Valuation (M-Cap)</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>
              ₹{item.valuationCr.toLocaleString('en-IN')} Cr
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              P/E: {item.peRatio ? `${item.peRatio}x` : 'N/A'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Min Investment</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              ₹{item.minInvestment.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Lot: {item.lotSize} shares
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Face Value</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155' }}>
              ₹{item.faceValue}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Depository: CDSL/NSDL
            </div>
          </div>
        </div>

        {/* Listing Roadmap */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Calendar size={20} color="#0284c7" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>
              Expected IPO & Listing Roadmap
            </div>
            <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>
              {item.expectedIpoTimeline}
            </div>
          </div>
        </div>

        {/* Financial Performance Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} color="#387ed1" />
            <span>Financial Performance (₹ Crores)</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))',
            gap: '0.5rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Revenue</div>
              <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                ₹{item.financials.revenueCr.toLocaleString('en-IN')} Cr
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>EBITDA</div>
              <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#0284c7' }}>
                ₹{item.financials.ebitdaCr.toLocaleString('en-IN')} Cr
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>PAT (Profit)</div>
              <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: item.financials.patCr >= 0 ? '#059669' : '#dc2626' }}>
                ₹{item.financials.patCr.toLocaleString('en-IN')} Cr
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>YoY Growth</div>
              <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: item.financials.yoyGrowth >= 0 ? '#059669' : '#dc2626' }}>
                {item.financials.yoyGrowth >= 0 ? `+${item.financials.yoyGrowth}%` : `${item.financials.yoyGrowth}%`}
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Investors */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} color="#059669" />
            <span>Key Institutional Investors & Promoters</span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {item.investors.map((inv, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.78rem',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  color: '#334155',
                  fontWeight: 500
                }}
              >
                {inv}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            className="btn-primary"
            style={{
              padding: '0.75rem',
              backgroundColor: '#0284c7',
            }}
            onClick={() => {
              onClose();
              onInquire(item, 'BUY');
            }}
          >
            <ArrowUpRight size={16} />
            <span>Place Buy Inquiry (₹{item.minInvestment.toLocaleString('en-IN')})</span>
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '0.75rem' }}
            onClick={() => {
              onClose();
              onInquire(item, 'SELL');
            }}
          >
            <span>Sell Unlisted Holding</span>
          </button>
        </div>
      </div>
    </div>
  );
}
