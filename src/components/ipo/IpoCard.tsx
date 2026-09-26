'use client';

import React from 'react';
import Link from 'next/link';
import { IpoItem } from '../../types';
import { 
  Flame, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Sparkles 
} from 'lucide-react';

interface IpoCardProps {
  ipo: IpoItem;
  onSelect: (ipo: IpoItem) => void;
  onCheckAllotment?: (ipo: IpoItem) => void;
}

export default function IpoCard({ ipo, onSelect, onCheckAllotment }: IpoCardProps) {
  const minInvestment = ipo.priceBandHigh * ipo.lotSize;
  const gmpPercent = ((ipo.gmp / ipo.priceBandHigh) * 100);
  const estListingPrice = ipo.priceBandHigh + ipo.gmp;

  const getStatusBadge = () => {
    switch (ipo.status) {
      case 'ONGOING':
        return (
          <span className="glass-badge badge-emerald">
            <span className="pulse-indicator"></span>
            Open Now
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="glass-badge badge-indigo">
            <Clock size={11} />
            Upcoming
          </span>
        );
      case 'LISTED':
        return (
          <span className="glass-badge badge-cyan">
            <Sparkles size={11} />
            Listed
          </span>
        );
      case 'CLOSED':
        return (
          <span className="glass-badge badge-amber">
            Closed
          </span>
        );
    }
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.3' }}>
              {ipo.name}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              {ipo.sector}
            </p>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
            {getStatusBadge()}
            {ipo.fireRating >= 4 && (
              <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Flame size={12} fill="#d97706" />
                {ipo.fireRating}/5 Demand
              </span>
            )}
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
              Price Band
            </div>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              ₹{ipo.priceBandLow} - ₹{ipo.priceBandHigh}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              Lot: {ipo.lotSize} shares
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Min Investment
            </div>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              ₹{minInvestment.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              Size: ₹{ipo.issueSizeCr.toLocaleString('en-IN')} Cr
            </div>
          </div>
        </div>

        {/* Grey Market Premium (GMP) Banner */}
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
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: ipo.gmp >= 0 ? '#059669' : '#dc2626' }}>
              {ipo.gmp >= 0 ? `+₹${ipo.gmp}` : `-₹${Math.abs(ipo.gmp)}`}
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
          <Calendar size={13} />
          <span>Close: <strong style={{ color: '#334155' }}>{ipo.timeline.biddingEnds}</strong></span>
        </div>

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
          <span>View Insights</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
