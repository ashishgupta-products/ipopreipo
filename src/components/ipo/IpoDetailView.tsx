'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IpoItem } from '../../types';
import { 
  Flame, 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Share2, 
  Check, 
  Calculator, 
  Building2, 
  ArrowLeft, 
  DollarSign, 
  Award, 
  AlertCircle,
  HelpCircle,
  BarChart3,
  Layers,
  ChevronRight
} from 'lucide-react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

interface IpoDetailViewProps {
  ipo: IpoItem;
  relatedIpos: IpoItem[];
}

export default function IpoDetailView({ ipo, relatedIpos }: IpoDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'timeline' | 'allotment' | 'calculator'>('overview');
  const [lots, setLots] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const minRetailInvestment = ipo.priceBandHigh * ipo.lotSize;
  const maxRetailLots = Math.max(1, Math.floor(200000 / minRetailInvestment));
  const maxRetailInvestment = maxRetailLots * minRetailInvestment;
  const sHniMinLots = maxRetailLots + 1;
  const sHniMinInvestment = sHniMinLots * minRetailInvestment;

  const gmpPercent = ((ipo.gmp / ipo.priceBandHigh) * 100);
  const estListingPrice = ipo.priceBandHigh + ipo.gmp;
  const estProfitPerLot = ipo.gmp * ipo.lotSize;

  // Interactive Calculator dynamic values
  const calcTotalShares = lots * ipo.lotSize;
  const calcTotalInvestment = lots * minRetailInvestment;
  const calcEstProfit = lots * estProfitPerLot;
  const calcEstTotalValue = calcTotalInvestment + calcEstProfit;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getStatusBadge = () => {
    switch (ipo.status) {
      case 'ONGOING':
        return (
          <span className="glass-badge badge-emerald" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
            <span className="pulse-indicator"></span>
            Open Now
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="glass-badge badge-indigo" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
            <Clock size={12} />
            Upcoming
          </span>
        );
      case 'LISTED':
        return (
          <span className="glass-badge badge-cyan" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
            <Sparkles size={12} />
            Listed
          </span>
        );
      case 'CLOSED':
        return (
          <span className="glass-badge badge-amber" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
            Bidding Closed
          </span>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        searchQuery="" 
        setSearchQuery={() => {}} 
        onOpenCalculator={() => setActiveTab('calculator')} 
      />

      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={14} />
              <span>Back to IPO Market</span>
            </Link>
            <span>/</span>
            <Link href="/?tab=all-ipos" style={{ color: '#64748b', textDecoration: 'none' }}>
              IPOs
            </Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{ipo.name}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleShare}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {copied ? <Check size={14} color="#059669" /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied!' : 'Share IPO'}</span>
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          {/* Top color ribbon */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: ipo.category === 'SME' 
              ? 'linear-gradient(90deg, #f59e0b, #d97706)' 
              : 'linear-gradient(90deg, #2563eb, #059669)'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: 'min(100%, 280px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: ipo.category === 'SME' ? '#b45309' : '#2563eb',
                  backgroundColor: ipo.category === 'SME' ? '#fffbeb' : '#eff6ff',
                  padding: '3px 9px',
                  borderRadius: '4px',
                  border: ipo.category === 'SME' ? '1px solid #fde68a' : '1px solid #bfdbfe',
                }}>
                  {ipo.category} IPO
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                  {ipo.exchange} • {ipo.symbol}
                </span>
                {getStatusBadge()}
              </div>

              <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                {ipo.name}
              </h1>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', maxWidth: '720px', marginBottom: '0.8rem' }}>
                {ipo.about}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {ipo.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: '0.72rem',
                    color: '#475569',
                    backgroundColor: '#f1f5f9',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* GMP Highlight Card */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              minWidth: 'min(100%, 240px)',
              width: 'max-content',
              maxWidth: '100%',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <Flame size={16} color="#d97706" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Grey Market Premium
                </span>
              </div>

              <div className="mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: ipo.gmp >= 0 ? '#15803d' : '#dc2626', lineHeight: '1.2' }}>
                {ipo.gmp >= 0 ? `+₹${ipo.gmp}` : `-₹${Math.abs(ipo.gmp)}`}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span className="mono" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: ipo.gmp >= 0 ? '#15803d' : '#dc2626',
                  backgroundColor: ipo.gmp >= 0 ? '#dcfce7' : '#fee2e2',
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}>
                  {gmpPercent >= 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#166534' }}>
                  Est. ₹{estListingPrice}
                </span>
              </div>

              <div style={{ fontSize: '0.68rem', color: '#65a30d', marginTop: '0.6rem' }}>
                Updated: {ipo.gmpUpdatedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Price Band
            </span>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
              ₹{ipo.priceBandLow} - ₹{ipo.priceBandHigh}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Per Equity Share</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Min Lot Size
            </span>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
              {ipo.lotSize} Shares
            </div>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
              ₹{minRetailInvestment.toLocaleString('en-IN')} (1 Lot)
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Issue Size
            </span>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
              ₹{ipo.issueSizeCr.toLocaleString('en-IN')} Cr
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {ipo.freshIssueCr ? `Fresh ₹${ipo.freshIssueCr} Cr` : 'Pure OFS'}
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Profit Per Lot
            </span>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: estProfitPerLot >= 0 ? '#059669' : '#dc2626', marginTop: '0.25rem' }}>
              {estProfitPerLot >= 0 ? `+₹${estProfitPerLot.toLocaleString('en-IN')}` : `-₹${Math.abs(estProfitPerLot).toLocaleString('en-IN')}`}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Based on Live GMP</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Retail Max Limit
            </span>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
              {maxRetailLots} Lots ({maxRetailLots * ipo.lotSize} sh)
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              ₹{maxRetailInvestment.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Registrar
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ipo.registrar.split(' ')[0]} {ipo.registrar.split(' ')[1] || ''}
            </div>
            <a 
              href={ipo.registrarUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '0.72rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
            >
              <span>Check Portal</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="scrollable-tabs" style={{
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.5rem',
          marginBottom: '1.75rem',
          width: '100%'
        }}>
          {[
            { id: 'overview', label: 'Company Overview & IPO Details', icon: <Building2 size={15} /> },
            { id: 'financials', label: 'Financial Health & Valuation', icon: <BarChart3 size={15} /> },
            { id: 'timeline', label: 'Important Schedule & Dates', icon: <Calendar size={15} /> },
            { id: 'allotment', label: 'Allotment Status Hub', icon: <ShieldCheck size={15} color="#059669" /> },
            { id: 'calculator', label: 'Returns Calculator', icon: <Calculator size={15} color="#2563eb" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: isActive ? '#2563eb' : '#64748b',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} color="#2563eb" />
                <span>About the Business</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.7', marginBottom: '1rem' }}>
                {ipo.about}
              </p>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  Industry Sector
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                  {ipo.sector}
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="#059669" />
                <span>Issue Structure & Reservation</span>
              </h3>
              <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0', color: '#64748b' }}>Face Value</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>₹10 per share</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0', color: '#64748b' }}>Issue Type</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>100% Book Built</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0', color: '#64748b' }}>Listing At</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{ipo.exchange}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0', color: '#64748b' }}>Retail Reservation</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#059669' }}>35% of Net Offer</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0', color: '#64748b' }}>QIB (Institutional)</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>50% of Net Offer</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.65rem 0', color: '#64748b' }}>NII / HNI</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>15% of Net Offer</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#2563eb" />
              <span>Key Financial Indicators (Restated Consolidated)</span>
            </h3>

            {ipo.financialHighlights ? (
              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Financial Metric</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Reported Value</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Benchmark Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Total Revenue</td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        ₹{ipo.financialHighlights.revenueCr} Cr
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>Annual top-line turnover</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Profit After Tax (PAT)</td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: ipo.financialHighlights.patCr >= 0 ? '#059669' : '#dc2626' }}>
                        {ipo.financialHighlights.patCr >= 0 ? `+₹${ipo.financialHighlights.patCr} Cr` : `-₹${Math.abs(ipo.financialHighlights.patCr)} Cr`}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>Bottom line net profitability</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Earnings Per Share (EPS)</td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        ₹{ipo.financialHighlights.eps.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>Diluted pre-issue EPS</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Price to Earnings (P/E)</td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                        {ipo.financialHighlights.peRatio ? `${ipo.financialHighlights.peRatio.toFixed(1)}x` : 'N/A'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>Based on upper price band</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Return on Net Worth (RoNW)</td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                        {ipo.financialHighlights.ronw.toFixed(1)}%
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>Capital efficiency ratio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <p>Detailed audited financials are currently being compiled from RHP / DRHP filings.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="#2563eb" />
              <span>Official Issue Timeline & Progress</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '1rem' }}>
              {[
                { label: '1. Bidding Starts', date: ipo.timeline.biddingStarts, isDone: true, color: '#2563eb' },
                { label: '2. Bidding Closes', date: ipo.timeline.biddingEnds, isDone: ipo.status !== 'UPCOMING', color: '#f59e0b' },
                { label: '3. Allotment Basis', date: ipo.timeline.allotmentFinalization, isDone: ipo.status === 'LISTED' || ipo.status === 'CLOSED', color: '#059669' },
                { label: '4. Refunds / Demat', date: ipo.timeline.refundInitiation, isDone: ipo.status === 'LISTED', color: '#0284c7' },
                { label: '5. Listing Date', date: ipo.timeline.listingDate, isDone: ipo.status === 'LISTED', color: '#8b5cf6' },
              ].map((step, idx) => (
                <div key={idx} style={{
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  backgroundColor: step.isDone ? '#f8fafc' : '#ffffff',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: step.color,
                    marginBottom: '0.5rem'
                  }} />
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{step.label}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
                    {step.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'allotment' && (
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="#059669" />
                  <span>Check Allotment Status: {ipo.name}</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Official Registrar: <strong style={{ color: '#0f172a' }}>{ipo.registrar}</strong>
                </p>
              </div>

              <a
                href={ipo.registrarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '0.6rem 1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Open {ipo.registrar.split(' ')[0]} Portal</span>
                <ExternalLink size={15} />
              </a>
            </div>

            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
                How to verify allotment status on {ipo.registrar}:
              </h4>
              <ol style={{ fontSize: '0.85rem', color: '#15803d', paddingLeft: '1.25rem', lineHeight: '1.6', margin: 0 }}>
                <li>Click the direct portal button above to navigate to the official registrar server.</li>
                <li>In the dropdown, select <strong>{ipo.name}</strong> from the issue list.</li>
                <li>Choose your preferred query method: <strong>PAN Number</strong>, <strong>Application Number</strong>, or <strong>DP Client ID</strong>.</li>
                <li>Enter the captcha security code and click <strong>Submit</strong> to view shares allotted.</li>
              </ol>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>
              <strong>Note:</strong> Allotment results are finalized by the registrar around <strong>{ipo.timeline.allotmentFinalization}</strong>. If shares are allotted, they are credited to your Demat by {ipo.timeline.creditOfShares}. If not allotted, ASBA funds are unblocked within 24 hours.
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={20} color="#2563eb" />
              <span>Interactive Return & Listing Gain Calculator</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                  Number of Lots to Apply:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => setLots(Math.max(1, lots - 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={lots}
                    onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: '90px',
                      padding: '0.5rem',
                      textAlign: 'center',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1'
                    }}
                  />
                  <button
                    onClick={() => setLots(lots + 1)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    = {calcTotalShares} Shares
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[1, 2, 5, maxRetailLots, sHniMinLots].map((quickLot) => (
                    <button
                      key={quickLot}
                      onClick={() => setLots(quickLot)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        backgroundColor: lots === quickLot ? '#eff6ff' : '#f1f5f9',
                        color: lots === quickLot ? '#2563eb' : '#475569',
                        border: lots === quickLot ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                        cursor: 'pointer'
                      }}
                    >
                      {quickLot === 1 ? '1 Lot (Retail)' : quickLot === maxRetailLots ? `Max Retail (${quickLot}L)` : `${quickLot} Lots`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculator Summary Card */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Application Amount (Blocked):</span>
                  <span className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    ₹{calcTotalInvestment.toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Expected Listing Gain (GMP):</span>
                  <span className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: calcEstProfit >= 0 ? '#059669' : '#dc2626' }}>
                    {calcEstProfit >= 0 ? `+₹${calcEstProfit.toLocaleString('en-IN')}` : `-₹${Math.abs(calcEstProfit).toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Est. Portfolio Value:</span>
                  <span className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb' }}>
                    ₹{calcEstTotalValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related / Other Active IPOs */}
        <section style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Other Trending IPOs
            </h3>
            <Link href="/?tab=all-ipos" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
              View All IPOs &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {relatedIpos.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/ipo/${item.id}`}
                className="glass-panel"
                style={{
                  padding: '1.1rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: item.category === 'SME' ? '#b45309' : '#2563eb',
                      backgroundColor: item.category === 'SME' ? '#fffbeb' : '#eff6ff',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {item.category}
                    </span>
                    <span className="mono" style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: item.gmp >= 0 ? '#059669' : '#dc2626'
                    }}>
                      GMP +₹{item.gmp}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    ₹{item.priceBandHigh} • Lot: {item.lotSize}
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.5rem',
                  marginTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: '#2563eb',
                  fontWeight: 600
                }}>
                  <span>View Insights</span>
                  <ChevronRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
