'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface TickerItem {
  id: string;
  name: string;
  label: string;
  value: string;
  sub: string;
  isPositive: boolean;
  type: 'INDEX' | 'GMP' | 'PREIPO';
}

const TICKER_ITEMS: TickerItem[] = [
  { id: '1', name: 'NIFTY 50', label: 'Index', value: '24,852.15', sub: '+152.40 (+0.62%)', isPositive: true, type: 'INDEX' },
  { id: '2', name: 'SENSEX', label: 'Index', value: '81,381.30', sub: '+442.20 (+0.55%)', isPositive: true, type: 'INDEX' },
  { id: '3', name: 'WAAREE', label: 'Listing Gain', value: '₹2,550', sub: '+70.0% Gain', isPositive: true, type: 'GMP' },
  { id: '4', name: 'NTPC GREEN', label: 'Live GMP', value: '₹14', sub: '+13.0% Est.', isPositive: true, type: 'GMP' },
  { id: '5', name: 'DANISH POWER', label: 'SME GMP', value: '₹310', sub: '+81.6% 🔥', isPositive: true, type: 'GMP' },
  { id: '6', name: 'SWIGGY', label: 'Live GMP', value: '₹25', sub: '+6.4% Est.', isPositive: true, type: 'GMP' },
  { id: '7', name: 'NSE INDIA', label: 'Pre-IPO', value: '₹6,850', sub: '+114.5% 1Y', isPositive: true, type: 'PREIPO' },
  { id: '8', name: 'TATA CAPITAL', label: 'Pre-IPO', value: '₹980', sub: '+88.4% 1Y', isPositive: true, type: 'PREIPO' },
  { id: '9', name: 'RELIANCE RETAIL', label: 'Pre-IPO', value: '₹2,850', sub: '+32.8% 1Y', isPositive: true, type: 'PREIPO' },
  { id: '10', name: 'HDB FINANCIAL', label: 'Pre-IPO', value: '₹1,150', sub: '+44.2% 1Y', isPositive: true, type: 'PREIPO' },
];

export default function MarketTicker() {
  const displayItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      overflow: 'hidden',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      zIndex: 40
    }}>
      {/* Fixed Live indicator badge */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        padding: '0 0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        zIndex: 10,
        borderRight: '1px solid #e2e8f0',
        boxShadow: '2px 0 6px rgba(0, 0, 0, 0.03)'
      }}>
        <span className="pulse-indicator"></span>
        <span style={{ 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          letterSpacing: '0.04em', 
          color: '#334155', 
          textTransform: 'uppercase' 
        }}>
          Live Desk
        </span>
      </div>

      {/* Marquee ticker track */}
      <div className="ticker-track" style={{ paddingLeft: '130px' }}>
        {displayItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 1.25rem',
              fontSize: '0.78rem',
              borderRight: '1px solid #e2e8f0',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontWeight: 700, color: '#0f172a' }}>
              {item.name}
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              color: '#64748b',
              backgroundColor: '#e2e8f0',
              padding: '1px 5px',
              borderRadius: '3px'
            }}>
              {item.label}
            </span>
            <span className="mono" style={{ fontWeight: 600, color: '#1e293b' }}>
              {item.value}
            </span>
            <span className="mono" style={{
              fontWeight: 600,
              fontSize: '0.72rem',
              color: item.isPositive ? '#059669' : '#dc2626',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {item.type === 'GMP' && <Flame size={11} color="#d97706" />}
              {item.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
