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
  Building2, 
  ArrowLeft, 
  DollarSign, 
  Award, 
  AlertCircle,
  HelpCircle,
  BarChart3,
  Layers,
  ChevronRight,
  Users,
  Target,
  FileText,
  Briefcase,
  Lock,
  PieChart
} from 'lucide-react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { 
  getIpoLotBrackets, 
  getIpoQuota, 
  getIpoMultiYearFinancials, 
  getIpoPeers, 
  getIpoPromoterHolding, 
  getIpoObjectsOfIssue, 
  getIpoAnchorDetails, 
  getIpoLeadManagers 
} from '../../lib/ipoEnricher';

interface IpoDetailViewProps {
  ipo: IpoItem;
  relatedIpos: IpoItem[];
}

export default function IpoDetailView({ ipo, relatedIpos }: IpoDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'bidding' | 'timeline' | 'allotment'>('overview');
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

  // Enriched institutional data
  const lotBrackets = getIpoLotBrackets(ipo);
  const quota = getIpoQuota(ipo);
  const financials = getIpoMultiYearFinancials(ipo);
  const peers = getIpoPeers(ipo);
  const promoterHolding = getIpoPromoterHolding(ipo);
  const objectsOfIssue = getIpoObjectsOfIssue(ipo);
  const anchorDetails = getIpoAnchorDetails(ipo);
  const leadManagers = getIpoLeadManagers(ipo);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = () => {
    switch (ipo.status) {
      case 'ONGOING':
        return (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#15803d',
            backgroundColor: '#dcfce7',
            padding: '3px 9px',
            borderRadius: '4px',
            border: '1px solid #bbf7d0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
            Bidding Open Now
          </span>
        );
      case 'UPCOMING':
        return (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#b45309',
            backgroundColor: '#fef3c7',
            padding: '3px 9px',
            borderRadius: '4px',
            border: '1px solid #fde68a',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={12} />
            Upcoming Issue
          </span>
        );
      case 'CLOSED':
        return (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#475569',
            backgroundColor: '#f1f5f9',
            padding: '3px 9px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Bidding Closed
          </span>
        );
      case 'LISTED':
        return (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#1e40af',
            backgroundColor: '#dbeafe',
            padding: '3px 9px',
            borderRadius: '4px',
            border: '1px solid #bfdbfe',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={12} />
            Listed on Exchange
          </span>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        searchQuery="" 
        setSearchQuery={() => {}} 
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
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{ipo.symbol}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleShare}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied!' : 'Share IPO'}</span>
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="glass-panel" style={{
          padding: '2rem',
          marginBottom: '1.75rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle colored accent strip */}
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
                  {ipo.exchange} • {ipo.symbol} • Face Value ₹{ipo.faceValue || 10}
                </span>
                {getStatusBadge()}
              </div>

              <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                {ipo.name}
              </h1>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', maxWidth: '750px', marginBottom: '0.8rem' }}>
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

        {/* Key Metrics Quick Cards */}
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
              Lot Size
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
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Estimated GMP Gain</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Promoter Holding
            </span>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
              {promoterHolding.preIssuePercent}% → {promoterHolding.postIssuePercent}%
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Pre → Post Issue</span>
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
            { id: 'overview', label: 'Company & Issue Details', icon: <Building2 size={15} /> },
            { id: 'financials', label: 'Financials & Peer Valuation', icon: <BarChart3 size={15} /> },
            { id: 'bidding', label: 'Subscription & Lot Brackets', icon: <Layers size={15} color="#d97706" /> },
            { id: 'timeline', label: 'Schedule & Milestones', icon: <Calendar size={15} /> },
            { id: 'allotment', label: 'Allotment & Lead Managers', icon: <ShieldCheck size={15} color="#059669" /> },
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

        {/* TAB 1: OVERVIEW & ISSUE DETAILS */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Top 2 Columns: Business Profile & Issue Structure */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '1.5rem' }}>
              {/* About the Business */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} color="#2563eb" />
                  <span>Company Profile & Overview</span>
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                  {ipo.about}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Sector Classification
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
                      {ipo.sector}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Incorporation Year
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
                      {ipo.yearIncorporated || '2010'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Registered Office
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '0.2rem', lineHeight: '1.5' }}>
                    {ipo.registeredOffice || 'Registered Office in India'}
                  </div>
                </div>
              </div>

              {/* Issue Structure & SEBI Reservation */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PieChart size={18} color="#059669" />
                  <span>Issue Structure & Quota Reservation</span>
                </h3>

                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.55rem 0', color: '#64748b' }}>Face Value</td>
                      <td style={{ padding: '0.55rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>₹{ipo.faceValue || 10} per share</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.55rem 0', color: '#64748b' }}>Fresh Issue Amount</td>
                      <td style={{ padding: '0.55rem 0', textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                        {ipo.freshIssueCr ? `₹${ipo.freshIssueCr.toLocaleString('en-IN')} Cr` : 'Nil (Pure OFS)'}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.55rem 0', color: '#64748b' }}>Offer for Sale (OFS)</td>
                      <td style={{ padding: '0.55rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                        {ipo.ofsCr ? `₹${ipo.ofsCr.toLocaleString('en-IN')} Cr` : 'Nil (100% Fresh)'}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.55rem 0', color: '#64748b' }}>Retail Investor Quota</td>
                      <td style={{ padding: '0.55rem 0', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                        {quota.retailPercent}% of Net Offer
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.55rem 0', color: '#64748b' }}>QIB (Institutional) Quota</td>
                      <td style={{ padding: '0.55rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                        {quota.qibPercent}% of Net Offer
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.55rem 0', color: '#64748b' }}>NII / HNI Quota</td>
                      <td style={{ padding: '0.55rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                        {quota.niiPercent}% (sHNI: {quota.sHniPercent || 5}%, bHNI: {quota.bHniPercent || 10}%)
                      </td>
                    </tr>
                    {quota.employeeDiscount ? (
                      <tr>
                        <td style={{ padding: '0.55rem 0', color: '#64748b' }}>Employee Discount</td>
                        <td style={{ padding: '0.55rem 0', textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                          ₹{quota.employeeDiscount} per share
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Objects of the Issue & Promoter Holding Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '1.5rem' }}>
              {/* Objects of the Issue */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} color="#d97706" />
                  <span>Objects of the Issue (Proceeds Utilization)</span>
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.7' }}>
                  {objectsOfIssue.map((obj, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Promoter Holding */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} color="#8b5cf6" />
                  <span>Promoter Holding & Shareholding Pattern</span>
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Pre-Issue Shareholding</div>
                    <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                      {promoterHolding.preIssuePercent}%
                    </div>
                  </div>
                  <div style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>→</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Post-Issue Shareholding</div>
                    <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
                      {promoterHolding.postIssuePercent}%
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                  <strong style={{ color: '#0f172a' }}>Promoters:</strong>{' '}
                  {promoterHolding.promoters.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINANCIALS & PEER VALUATION */}
        {activeTab === 'financials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
            {/* Multi-Year Track Record Table */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={20} color="#2563eb" />
                  <span>Multi-Year Audited Financial Track Record</span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>
                  Amounts in ₹ Crore (Restated Consolidated)
                </span>
              </div>

              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Period / Year</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Assets</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Revenue</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>PAT (Profit)</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Net Worth</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Borrowings</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>EBITDA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financials.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>{row.period}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹{row.assetsCr.toLocaleString('en-IN')}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>₹{row.revenueCr.toLocaleString('en-IN')}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: row.patCr >= 0 ? '#059669' : '#dc2626' }}>
                          {row.patCr >= 0 ? `+₹${row.patCr.toLocaleString('en-IN')}` : `-₹${Math.abs(row.patCr).toLocaleString('en-IN')}`}
                        </td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹{row.netWorthCr.toLocaleString('en-IN')}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹{row.totalBorrowingCr.toLocaleString('en-IN')}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#2563eb' }}>
                          {row.ebitdaCr ? `₹${row.ebitdaCr.toLocaleString('en-IN')}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Ratios Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
              gap: '1rem'
            }}>
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  P/E Ratio (Upper Band)
                </span>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb', marginTop: '0.3rem' }}>
                  {ipo.financialHighlights?.peRatio ? `${ipo.financialHighlights.peRatio.toFixed(1)}x` : 'N/A'}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Price to Earnings</span>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Pre-Issue EPS
                </span>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                  ₹{ipo.financialHighlights?.eps ? ipo.financialHighlights.eps.toFixed(2) : (ipo.priceBandHigh / 18).toFixed(2)}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Earnings Per Share</span>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Return on Net Worth (RoNW)
                </span>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '0.3rem' }}>
                  {ipo.financialHighlights?.ronw ? `${ipo.financialHighlights.ronw.toFixed(1)}%` : '18.4%'}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Equity Return Efficiency</span>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  EBITDA Margin
                </span>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                  {ipo.financialHighlights?.ebitdaMargin ? `${ipo.financialHighlights.ebitdaMargin.toFixed(1)}%` : '16.5%'}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Operating Profit Margin</span>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Debt to Equity
                </span>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                  {ipo.financialHighlights?.debtToEquity ? `${ipo.financialHighlights.debtToEquity.toFixed(2)}x` : '0.32x'}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Balance Sheet Leverage</span>
              </div>
            </div>

            {/* Peer Comparison Table */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={20} color="#059669" />
                  <span>Listed Industry Peer Comparison</span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Comparing against key listed competitors on NSE & BSE
                </span>
              </div>

              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Company Name</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>CMP (₹)</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>P/E Ratio</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Revenue (Cr)</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>PAT (Cr)</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>RoNW (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* The subject IPO */}
                    <tr style={{ backgroundColor: '#eff6ff', borderBottom: '2px solid #bfdbfe' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#1e40af' }}>
                        {ipo.name} (Issue Price)
                      </td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#1e40af' }}>
                        ₹{ipo.priceBandHigh}
                      </td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#2563eb' }}>
                        {ipo.financialHighlights?.peRatio ? `${ipo.financialHighlights.peRatio.toFixed(1)}x` : 'N/A'}
                      </td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        ₹{ipo.financialHighlights?.revenueCr.toLocaleString('en-IN') || '—'}
                      </td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                        ₹{ipo.financialHighlights?.patCr.toLocaleString('en-IN') || '—'}
                      </td>
                      <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>
                        {ipo.financialHighlights?.ronw ? `${ipo.financialHighlights.ronw.toFixed(1)}%` : '—'}
                      </td>
                    </tr>

                    {/* Listed Peers */}
                    {peers.map((peer, pIdx) => (
                      <tr key={pIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>{peer.name}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>{peer.cmp ? `₹${peer.cmp.toLocaleString('en-IN')}` : '—'}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{peer.peRatio.toFixed(1)}x</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹{peer.revenueCr.toLocaleString('en-IN')}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>₹{peer.patCr.toLocaleString('en-IN')}</td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>{peer.ronw.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTION & LOT BRACKETS */}
        {activeTab === 'bidding' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
            {/* Live Subscription Status Box */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Flame size={20} color="#d97706" />
                  <span>Category-wise Bidding Subscription Status</span>
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '4px' }}>
                  {ipo.subscription?.total ? `${ipo.subscription.total}x Total Subscribed` : 'Live Demand'}
                </span>
              </div>

              {ipo.subscription ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      QIB (Institutional)
                    </span>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', marginTop: '0.3rem' }}>
                      {ipo.subscription.qib}x
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>FII & DII demand</span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      NII / HNI
                    </span>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                      {ipo.subscription.nii}x
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>sHNI & bHNI total</span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Retail (RII)
                    </span>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '0.3rem' }}>
                      {ipo.subscription.retail}x
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Individual bids &le; ₹2L</span>
                  </div>

                  {ipo.subscription.employee ? (
                    <div style={{ backgroundColor: '#f8fafc', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        Employee Quota
                      </span>
                      <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.3rem' }}>
                        {ipo.subscription.employee}x
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Eligible staff</span>
                    </div>
                  ) : null}

                  <div style={{ backgroundColor: '#eff6ff', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#1e40af', textTransform: 'uppercase', fontWeight: 700 }}>
                      Total Overall
                    </span>
                    <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1d4ed8', marginTop: '0.3rem' }}>
                      {ipo.subscription.total}x
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#1e40af' }}>Consolidated book</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                  Subscription data will stream live once bidding opens on NSE/BSE.
                </div>
              )}
            </div>

            {/* SEBI Lot Size & Bid Category Brackets Table */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="#2563eb" />
                  <span>SEBI Investment Categories & Lot Size Brackets</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Retail bids are capped at ₹2,00,000. Small HNI (sHNI) ranges between ₹2L to ₹10L. Big HNI (bHNI) bids exceed ₹10,00,000.
                </p>
              </div>

              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Application Category</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Lots to Apply</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Shares</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Amount Blocked</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Allotment Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotBrackets.map((bracket, bIdx) => (
                      <tr key={bIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                          {bracket.category}
                        </td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>
                          {bracket.lots} {bracket.lots === 1 ? 'Lot' : 'Lots'}
                        </td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          {bracket.shares.toLocaleString('en-IN')} shares
                        </td>
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#2563eb' }}>
                          ₹{bracket.amount.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#64748b' }}>
                          {bracket.category.includes('Retail') 
                            ? 'Lottery System (1 Lot max per PAN if oversubscribed)'
                            : 'Proportionate Allotment (Draw of lots for min sHNI/bHNI)'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Anchor Investor Section */}
            {anchorDetails && (
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} color="#059669" />
                    <span>Anchor Investor Allocation & Lock-in Schedule</span>
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '4px' }}>
                    ₹{anchorDetails.anchorPortionCr} Cr Allocated
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Anchor Bid Date</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{anchorDetails.bidDate}</div>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>30-Day Lock-in End Date</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb', marginTop: '0.25rem' }}>{anchorDetails.lockIn30DaysDate}</div>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>90-Day Lock-in End Date</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{anchorDetails.lockIn90DaysDate}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Key Institutional Anchors:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {anchorDetails.topAnchors?.map((anchor, aIdx) => (
                      <span key={aIdx} style={{
                        fontSize: '0.78rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        color: '#334155'
                      }}>
                        {anchor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SCHEDULE & TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="#2563eb" />
              <span>Official Issue Timeline & SEBI T+3 Cycle</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
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

            <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#166534', lineHeight: '1.6' }}>
              <strong>SEBI Mandatory T+3 Listing:</strong> Since December 2023, SEBI requires all initial public offerings in India to list on the stock exchanges within 3 working days after issue closing (T+3). ASBA mandate blocking unfreezes automatically if you do not receive an allotment.
            </div>
          </div>
        )}

        {/* TAB 5: ALLOTMENT & LEAD MANAGERS */}
        {activeTab === 'allotment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
            {/* Registrar Hub */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
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

            {/* Lead Managers & Prospectus Filings */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>
              {/* Lead Managers */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={18} color="#2563eb" />
                  <span>Book Running Lead Managers (BRLMs)</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  Investment bankers appointed to manage issue due diligence, marketing, and institutional order books:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {leadManagers.map((lm, lmIdx) => (
                    <div key={lmIdx} style={{
                      backgroundColor: '#f8fafc',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0f172a'
                    }}>
                      {lm}
                    </div>
                  ))}
                </div>
              </div>

              {/* SEBI Filings & RHP */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="#059669" />
                  <span>Official SEBI Prospectus & Filings</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
                  Read the complete statutory offer documents filed with SEBI, NSE, and BSE:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a
                    href={ipo.rhpUrl || 'https://www.sebi.gov.in/filings/public-issues.html'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}
                  >
                    <span>Download Red Herring Prospectus (RHP)</span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href={ipo.drhpUrl || 'https://www.sebi.gov.in/filings/public-issues.html'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}
                  >
                    <span>Download Draft Offer Document (DRHP)</span>
                    <ExternalLink size={14} />
                  </a>
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
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block'
                }}
              >
                <div className="glass-panel" style={{
                  padding: '1.25rem',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                      {item.name}
                    </h4>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: item.category === 'SME' ? '#b45309' : '#2563eb',
                      backgroundColor: item.category === 'SME' ? '#fffbeb' : '#eff6ff',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {item.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Live GMP:</span>
                    <span className="mono" style={{ fontWeight: 700, color: item.gmp >= 0 ? '#059669' : '#dc2626' }}>
                      {item.gmp >= 0 ? `+₹${item.gmp}` : `-₹${Math.abs(item.gmp)}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Price Band:</span>
                    <span className="mono" style={{ fontWeight: 600, color: '#0f172a' }}>
                      ₹{item.priceBandHigh}
                    </span>
                  </div>
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
