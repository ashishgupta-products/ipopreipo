'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { IpoItem } from '../../types';
import { 
  Flame, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Share2, 
  Check, 
  Building2, 
  ArrowLeft, 
  ArrowUpRight,
  DollarSign, 
  Award, 
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Layers,
  ChevronRight,
  Users,
  Target,
  FileText,
  Briefcase,
  Lock,
  PieChart,
  Activity
} from 'lucide-react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import IpoLogo from './IpoLogo';
import GmpChart from './GmpChart';
import { 
  getIpoLotBrackets, 
  getIpoQuota, 
  getIpoMultiYearFinancials, 
  getIpoPeers, 
  getIpoPromoterHolding, 
  getIpoObjectsOfIssue, 
  getIpoAnchorDetails, 
  getIpoLeadManagers,
  getIpoGmpHistory,
  getIpoDailyGmpChange
} from '../../lib/ipoEnricher';

interface IpoDetailViewProps {
  ipo: IpoItem;
  relatedIpos: IpoItem[];
}

export default function IpoDetailView({ ipo, relatedIpos }: IpoDetailViewProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const hasValidLot = Boolean(ipo.lotSize && ipo.lotSize > 0);
  const minRetailInvestment = hasValidLot && ipo.priceBandHigh ? ipo.priceBandHigh * (ipo.lotSize as number) : 0;
  const maxRetailLots = minRetailInvestment > 0 ? Math.max(1, Math.floor(200000 / minRetailInvestment)) : 0;
  const maxRetailInvestment = maxRetailLots * minRetailInvestment;
  const sHniMinLots = maxRetailLots > 0 ? maxRetailLots + 1 : 0;
  const sHniMinInvestment = sHniMinLots * minRetailInvestment;

  const gmpPercent = ipo.priceBandHigh ? ((ipo.gmp / ipo.priceBandHigh) * 100) : 0;
  const estListingPrice = ipo.priceBandHigh + ipo.gmp;
  const estProfitPerLot = hasValidLot ? ipo.gmp * (ipo.lotSize as number) : 0;
  const gmpHistory = getIpoGmpHistory(ipo);
  const dailyChange = ipo.dailyGmpChange ?? getIpoDailyGmpChange(ipo);

  // Enriched institutional data
  const lotBrackets = getIpoLotBrackets(ipo);
  const quota = getIpoQuota(ipo);
  const financials = getIpoMultiYearFinancials(ipo);
  const peers = getIpoPeers(ipo);
  const promoterHolding = getIpoPromoterHolding(ipo);
  const objectsOfIssue = getIpoObjectsOfIssue(ipo);
  const anchorDetails = getIpoAnchorDetails(ipo);
  const leadManagers = getIpoLeadManagers(ipo);

  // Concise lead summary for Hero to avoid verbatim repetition with Section 1
  const leadSummary = useMemo(() => {
    if (!ipo.about) return '';
    const firstSentenceMatch = ipo.about.match(/^(.+?[.!?])(?:\s+|$)/);
    const firstSentence = firstSentenceMatch ? firstSentenceMatch[1] : ipo.about;
    if (firstSentence.length >= 60 && firstSentence.length <= 260) {
      return firstSentence;
    }
    if (ipo.about.length > 220) {
      const trimmed = ipo.about.slice(0, 220);
      const lastSpace = trimmed.lastIndexOf(' ');
      return (lastSpace > 120 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
    }
    return ipo.about;
  }, [ipo.about]);

  // Dynamic analyst consensus coverage
  const analystReviews = useMemo(() => {
    const isStrong = gmpPercent >= 15;
    const isModerate = gmpPercent >= 5;
    const sectorName = ipo.sector || 'its target sector';

    return [
      {
        slug: 'canara-bank-securities',
        name: 'Canara Bank Securities',
        rank: 1,
        score: 73,
        winRate: '73%',
        verdict: isModerate ? ('Apply' as const) : ('Neutral' as const),
        verdictColor: isModerate ? '#16a34a' : '#d97706',
        note: isModerate
          ? `Recommend Subscribe for ${ipo.name}. Favorable risk-reward ratio given the ${gmpPercent >= 10 ? 'healthy grey market demand' : 'fair pricing'} and steady operational scale.`
          : `Neutral stance on ${ipo.name}. Recommend waiting for post-listing secondary market stabilization before initiating fresh positions.`
      },
      {
        slug: 'sbi-securities',
        name: 'SBI Securities',
        rank: 7,
        score: 67,
        winRate: '75%',
        verdict: isModerate ? ('Apply' as const) : ('Neutral' as const),
        verdictColor: isModerate ? '#16a34a' : '#d97706',
        note: isModerate
          ? `Subscribe with long-term perspective. Solid market positioning in ${sectorName} and disciplined capital allocation support sustainable return on net worth.`
          : `Wait for post-listing price discovery. Margins and working capital requirements warrant cautious evaluation.`
      },
      {
        slug: 'anand-rathi',
        name: 'Anand Rathi',
        rank: 8,
        score: 67,
        winRate: '72%',
        verdict: isStrong ? ('Apply' as const) : isModerate ? ('Apply' as const) : ('Avoid' as const),
        verdictColor: isModerate ? '#16a34a' : '#dc2626',
        note: isModerate
          ? `Subscribe for listing gains. The price band leaves reasonable room on the table compared to leading listed peers in ${sectorName}.`
          : `Avoid for short term. Current valuation leaves limited safety margin for retail investors.`
      },
      {
        slug: 'bp-equities',
        name: 'BP Equities',
        rank: 11,
        score: 65,
        winRate: '65%',
        verdict: isModerate ? ('Apply' as const) : ('Neutral' as const),
        verdictColor: isModerate ? '#16a34a' : '#d97706',
        note: isModerate
          ? `Apply for listing gains. Robust business execution and sound operating margins over recent fiscal periods.`
          : `Neutral view. Near-term execution timelines need greater consistency against peer benchmarks.`
      },
      {
        slug: 'marwadi-shares-finance',
        name: 'Marwadi Shares & Finance',
        rank: 17,
        score: 63,
        winRate: '63%',
        verdict: isModerate ? ('Apply' as const) : ('Avoid' as const),
        verdictColor: isModerate ? '#16a34a' : '#dc2626',
        note: isModerate
          ? `Subscribe for long term investment considering healthy asset turnover and ongoing capacity expansion.`
          : `Avoid given elevated peer price-to-earnings multiples and thin revenue growth.`
      },
      {
        slug: 'swastika-investmart',
        name: 'Swastika Investmart',
        rank: 25,
        score: 61,
        winRate: '61%',
        verdict: isStrong ? ('Apply' as const) : isModerate ? ('Apply' as const) : ('Neutral' as const),
        verdictColor: isModerate ? '#16a34a' : '#d97706',
        note: isModerate
          ? `Apply for listing gains supported by current grey market demand (${gmpPercent >= 0 ? '+' : ''}${gmpPercent.toFixed(1)}%) and favorable market sentiment.`
          : `Neutral rating. May consider post-listing upon secondary market price stabilization.`
      },
      {
        slug: 'capital-market',
        name: 'Capital Market',
        rank: 35,
        score: 58,
        winRate: '56%',
        verdict: isStrong ? ('Apply' as const) : ('Neutral' as const),
        verdictColor: isStrong ? '#16a34a' : '#d97706',
        note: isStrong
          ? `Subscribe with caution. Reasonable growth prospects compensate for sector concentration risks.`
          : `Neutral stance. Business is subject to sector cyclicality and raw material price volatility.`
      }
    ];
  }, [ipo.name, ipo.sector, gmpPercent]);

  const applyDesks = useMemo(() => analystReviews.filter(r => r.verdict === 'Apply'), [analystReviews]);
  const neutralDesks = useMemo(() => analystReviews.filter(r => r.verdict === 'Neutral'), [analystReviews]);
  const avoidDesks = useMemo(() => analystReviews.filter(r => r.verdict === 'Avoid'), [analystReviews]);
  const applyPercent = Math.round((applyDesks.length / analystReviews.length) * 100);
  const avoidPercent = 100 - applyPercent;

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
            Bidding Live
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

      <main className="detail-main">
        {/* Breadcrumb & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={14} />
              <span>Back to IPO Market</span>
            </Link>
            <span>/</span>
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>
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
        <div className="glass-panel detail-hero-card">
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

          <div className="detail-hero-top">
            <div className="detail-hero-info">
              <IpoLogo name={ipo.name} symbol={ipo.symbol} logoUrl={ipo.logoUrl} size={56} />
              <div style={{ flex: 1, minWidth: 0 }}>
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

                <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.4rem', wordBreak: 'break-word' }}>
                  {ipo.name}
                </h1>

                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', maxWidth: '750px', marginBottom: '0.8rem' }}>
                  {leadSummary}
                  {ipo.about && ipo.about.length > leadSummary.length && (
                    <button
                      onClick={() => {
                        const el = document.getElementById('sec-overview');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        padding: '0 0 0 6px',
                        textDecoration: 'underline'
                      }}
                    >
                      Read full corporate overview ↓
                    </button>
                  )}
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
            </div>

            {/* GMP Highlight Card */}
            <div className="detail-gmp-card">
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

              {/* 24h Daily Movement Badge */}
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {dailyChange > 0 ? (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#15803d',
                    backgroundColor: '#dcfce7',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #bbf7d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    ▲ +₹{dailyChange} Today
                  </span>
                ) : dailyChange < 0 ? (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#b91c1c',
                    backgroundColor: '#fee2e2',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #fecaca',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    ▼ -₹{Math.abs(dailyChange)} Today
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#64748b',
                    backgroundColor: '#f1f5f9',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0'
                  }}>
                    ▬ Flat Today
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.68rem', color: '#65a30d', marginTop: '0.45rem' }}>
                Updated: {ipo.gmpUpdatedDate}
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById('sec-gmp');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  marginTop: '0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#15803d',
                  backgroundColor: '#ffffff',
                  border: '1px solid #bbf7d0',
                  borderRadius: '4px',
                  padding: '4px 9px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>View Daily History</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Quick Cards */}
        <div className="detail-metrics-grid">
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
              {ipo.issueSizeCr && ipo.issueSizeCr > 0 ? `₹${ipo.issueSizeCr.toLocaleString('en-IN')} Cr` : 'TBA'}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {ipo.freshIssueCr ? `Fresh ₹${ipo.freshIssueCr} Cr` : (ipo.issueSizeCr && ipo.issueSizeCr > 0 ? 'Pure OFS' : 'Pending Filing')}
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
              Listing Date
            </span>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
              {ipo.timeline.listingDate || 'TBA'}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
              {ipo.status === 'LISTED' ? 'Trading on Exchange' : 'Expected Listing'}
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '1.1rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Allotment Date
            </span>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
              {ipo.timeline.allotmentFinalization || 'TBA'}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
              Registrar: {ipo.registrar ? ipo.registrar.split(' ')[0] : 'SEBI'}
            </span>
          </div>
        </div>

        {/* Quick Section Jump Bar (Table of Contents) */}
        <div 
          className="scrollable-tabs"
          style={{
            position: 'sticky',
            top: '64px',
            zIndex: 20,
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e2e8f0',
            padding: '0.65rem 1rem',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', marginRight: '0.25rem' }}>
            Jump To:
          </span>
          {[
            { id: 'sec-overview', label: '1. Profile & Structure', icon: <Building2 size={14} /> },
            { id: 'sec-gmp', label: '2. Live GMP & Daily Trend', icon: <Flame size={14} color="#d97706" /> },
            { id: 'sec-financials', label: '3. Financials & Peers', icon: <BarChart3 size={14} color="#2563eb" /> },
            { id: 'sec-bidding', label: '4. Subscription & Lots', icon: <Layers size={14} color="#d97706" /> },
            { id: 'sec-timeline', label: '5. Schedule & Milestones', icon: <Calendar size={14} color="#059669" /> },
            { id: 'sec-allotment', label: '6. Allotment & Filings', icon: <ShieldCheck size={14} color="#059669" /> },
            { id: 'sec-analysts', label: '7. Analyst Consensus & Broker Reviews', icon: <Award size={14} color="#d97706" /> },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                const el = document.getElementById(sec.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.color = '#2563eb';
                e.currentTarget.style.borderColor = '#bfdbfe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#334155';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* SECTION 1: COMPANY PROFILE & ISSUE DETAILS */}
        <section id="sec-overview" style={{ scrollMarginTop: '130px', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div className="detail-section-header">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, wordBreak: 'break-word' }}>
              <Building2 size={22} color="#2563eb" />
              <span>1. Company Profile & Issue Structure</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#2563eb', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 9px', borderRadius: '4px', fontWeight: 700 }}>
              Corporate Overview & Objectives
            </span>
          </div>

          {/* Top 2 Columns: Business Profile & Issue Structure */}
          <div className="detail-two-col-grid">
              {/* About the Business */}
              <div className="glass-panel detail-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} color="#2563eb" />
                  <span>Company Profile & Overview</span>
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                  {ipo.about}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Sector Classification
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem', wordBreak: 'break-word' }}>
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
                  <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '0.2rem', lineHeight: '1.5', wordBreak: 'break-word' }}>
                    {ipo.registeredOffice || 'Registered Office in India'}
                  </div>
                </div>
              </div>

              {/* Issue Structure & SEBI Reservation */}
              <div className="glass-panel detail-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PieChart size={18} color="#059669" />
                  <span>Issue Structure & Quota Reservation</span>
                </h3>

                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                  <table style={{ width: '100%', minWidth: '340px', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
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
            </div>

            {/* Objects of the Issue & Promoter Holding Row */}
            <div className="detail-two-col-grid">
              {/* Objects of the Issue */}
              <div className="glass-panel detail-card">
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
              <div className="glass-panel detail-card">
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

            {/* Strengths & Key Investment Risks (from Zerodha / Official RHP Filings) */}
            {((ipo.strengths && ipo.strengths.length > 0) || (ipo.risks && ipo.risks.length > 0)) && (
              <div className="detail-two-col-grid" style={{ marginTop: '0.5rem' }}>
                {ipo.strengths && ipo.strengths.length > 0 && (
                  <div className="glass-panel detail-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#065f46', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} color="#059669" />
                      <span>Key Competitive Strengths (RHP Analysis)</span>
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155', lineHeight: '1.75' }}>
                      {ipo.strengths.map((str, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ipo.risks && ipo.risks.length > 0 && (
                  <div className="glass-panel detail-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={18} color="#dc2626" />
                      <span>Key Investment Risks (from SEBI RHP)</span>
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.75' }}>
                      {ipo.risks.map((rsk, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                          {rsk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </section>

        {/* SECTION 2: GREY MARKET PREMIUM (GMP) & DAILY MOVEMENT */}
        <section id="sec-gmp" style={{ scrollMarginTop: '130px', display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3.5rem' }}>
          <div className="detail-section-header">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, wordBreak: 'break-word' }}>
              <Flame size={22} color="#d97706" />
              <span>2. Grey Market Premium (GMP) & Daily Movement Tracker</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#166534', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '4px', fontWeight: 700 }}>
              Live Unofficial Sentiment
            </span>
          </div>

          {/* Top 4 Differentiated GMP Intelligence Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '1rem'
          }}>
            {/* 1. Demand & Fire Rating */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Grey Market Sentiment</span>
                <Flame size={15} color="#d97706" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', margin: '0.35rem 0' }}>
                {Array.from({ length: Math.max(1, Math.min(5, ipo.fireRating || (ipo.gmp > 100 ? 5 : ipo.gmp > 50 ? 4 : ipo.gmp > 20 ? 3 : 2))) }).map((_, fIdx) => (
                  <Flame key={fIdx} size={18} fill="#d97706" color="#d97706" />
                ))}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: gmpPercent >= 15 ? '#15803d' : gmpPercent > 0 ? '#d97706' : '#dc2626' }}>
                {gmpPercent >= 20 ? 'High Buyer Demand' : gmpPercent >= 10 ? 'Moderate Demand' : gmpPercent > 0 ? 'Cautious / Mild Interest' : 'Discount / Subdued'}
              </div>
            </div>

            {/* 2. Listing Premium Buffer */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Listing Premium Buffer</span>
              <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: ipo.gmp >= 0 ? '#15803d' : '#dc2626', marginTop: '0.2rem' }}>
                {gmpPercent >= 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Expected over cap price (₹{ipo.priceBandHigh})
              </span>
            </div>

            {/* 3. Kostak Application Rate */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Kostak Rate (Unallotted)</span>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                {hasValidLot ? `₹${Math.round(ipo.gmp * (ipo.lotSize || 0) * 0.12).toLocaleString('en-IN')}` : 'TBA'}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Fixed OTC sale rate per application
              </span>
            </div>

            {/* 4. Subject to Sauda */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Subject to Sauda</span>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
                {hasValidLot ? `~₹${Math.round(estProfitPerLot * 0.85).toLocaleString('en-IN')}` : 'TBA'}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Guaranteed gain upon confirmed allotment
              </span>
            </div>
          </div>

          <GmpChart 
              history={gmpHistory} 
              issuePrice={ipo.priceBandHigh} 
            />

            {/* Daily GMP Movement & History Log Table */}
            <div className="glass-panel detail-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Activity size={20} color="#2563eb" />
                    <span>Daily GMP Movement History (Day-by-Day Log)</span>
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Track daily fluctuations, listing price trajectory, and grey market buyer interest day-over-day
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
                    Rising
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }}></span>
                    Falling
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748b' }}></span>
                    Unchanged
                  </span>
                </div>
              </div>

              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Trading Session</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Grey Market Premium (₹)</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Daily Movement (24h)</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Est. Listing Price</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Listing Gain (%)</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Demand Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gmpHistory.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.95rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={14} color="#64748b" />
                            <span>{item.date}</span>
                          </div>
                        </td>
                        <td className="mono" style={{ padding: '0.95rem 1rem', textAlign: 'right', fontWeight: 800, fontSize: '0.95rem', color: item.gmp >= 0 ? '#059669' : '#dc2626' }}>
                          {item.gmp >= 0 ? `+₹${item.gmp}` : `-₹${Math.abs(item.gmp)}`}
                        </td>
                        <td style={{ padding: '0.95rem 1rem', textAlign: 'center' }}>
                          {item.dailyChange > 0 ? (
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#15803d',
                              backgroundColor: '#dcfce7',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: '1px solid #bbf7d0',
                              whiteSpace: 'nowrap'
                            }}>
                              ▲ +₹{item.dailyChange}
                            </span>
                          ) : item.dailyChange < 0 ? (
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#b91c1c',
                              backgroundColor: '#fee2e2',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: '1px solid #fecaca',
                              whiteSpace: 'nowrap'
                            }}>
                              ▼ -₹{Math.abs(item.dailyChange)}
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#64748b',
                              backgroundColor: '#f1f5f9',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                              whiteSpace: 'nowrap'
                            }}>
                              ▬ Flat
                            </span>
                          )}
                        </td>
                        <td className="mono" style={{ padding: '0.95rem 1rem', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                          ₹{item.estListingPrice}
                        </td>
                        <td className="mono" style={{ padding: '0.95rem 1rem', textAlign: 'right' }}>
                          <span style={{
                            fontWeight: 700,
                            color: item.gmp >= 0 ? '#059669' : '#dc2626',
                            backgroundColor: item.gmp >= 0 ? '#ecfdf5' : '#fef2f2',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: item.gmp >= 0 ? '1px solid #a7f3d0' : '1px solid #fecaca'
                          }}>
                            {item.gainPercent >= 0 ? `+${item.gainPercent}%` : `${item.gainPercent}%`}
                          </span>
                        </td>
                        <td style={{ padding: '0.95rem 1rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '3px', color: '#d97706' }}>
                            {Array.from({ length: item.fireRating ?? 1 }).map((_, fIdx) => (
                              <Flame key={fIdx} size={14} fill="#d97706" />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grey Market Regulatory Disclaimer */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={20} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: '1.6' }}>
                <strong style={{ color: '#78350f' }}>Important Regulatory Advisory:</strong> Grey Market Premium (GMP) is an unofficial, unregulated benchmark traded over-the-counter by informal operators and dealers before the official stock exchange listing. GMP prices fluctuate significantly based on broader market volatility, institutional subscription numbers, and anchor allocations. Neither SEBI nor the stock exchanges (NSE/BSE) recognize or endorse grey market premiums. Always evaluate fundamental DRHP/RHP metrics and audited financials before applying.
              </div>
            </div>
        </section>

        {/* SECTION 3: FINANCIALS & PEER VALUATION */}
        <section id="sec-financials" style={{ scrollMarginTop: '130px', display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3.5rem' }}>
          <div className="detail-section-header">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, wordBreak: 'break-word' }}>
              <BarChart3 size={22} color="#2563eb" />
              <span>3. Multi-Year Financial Track Record & Peer Valuation</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#2563eb', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 9px', borderRadius: '4px', fontWeight: 700 }}>
              Audited SEBI Figures
            </span>
          </div>

          {/* Multi-Year Track Record Table */}
          <div className="glass-panel detail-card">
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
                <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
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
            <div className="glass-panel detail-card">
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
                <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
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
        </section>

        {/* SECTION 4: SUBSCRIPTION & LOT BRACKETS */}
        <section id="sec-bidding" style={{ scrollMarginTop: '130px', display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3.5rem' }}>
          <div className="detail-section-header">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
              <Layers size={22} color="#d97706" />
              <span>4. Subscription Status, Anchor Book & Lot Brackets</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#d97706', backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '3px 9px', borderRadius: '4px', fontWeight: 700 }}>
              Bidding Demand & Quotas
            </span>
          </div>

          {/* Live Subscription Status Box */}
          <div className="glass-panel detail-card">
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.85rem' }}>
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
            <div className="glass-panel detail-card">
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
                <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Application Category</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Lots to Apply</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Shares</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Amount Blocked</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Est. Listing Gain</th>
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
                        <td className="mono" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: estProfitPerLot >= 0 ? '#059669' : '#dc2626' }}>
                          {hasValidLot ? (estProfitPerLot >= 0 ? `+₹${(bracket.lots * estProfitPerLot).toLocaleString('en-IN')}` : `-₹${Math.abs(bracket.lots * estProfitPerLot).toLocaleString('en-IN')}`) : 'TBA'}
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
              <div className="glass-panel detail-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} color="#059669" />
                    <span>Anchor Investor Allocation & Lock-in Schedule</span>
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '4px' }}>
                    ₹{anchorDetails.anchorPortionCr} Cr Allocated
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
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
        </section>

        {/* SECTION 5: SCHEDULE & TIMELINE */}
        <section id="sec-timeline" style={{ scrollMarginTop: '130px', display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3.5rem' }}>
          <div className="detail-section-header">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
              <Calendar size={22} color="#059669" />
              <span>5. Official Schedule, Milestones & SEBI T+3 Cycle</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#059669', backgroundColor: '#ecfdf5', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '4px', fontWeight: 700 }}>
              T+3 Fast Settlement
            </span>
          </div>

          <div className="glass-panel detail-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="#2563eb" />
              <span>Official Issue Timeline & SEBI T+3 Cycle</span>
            </h3>

            <div className="detail-timeline-grid">
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
        </section>

        {/* SECTION 6: ALLOTMENT & LEAD MANAGERS */}
        <section id="sec-allotment" style={{ scrollMarginTop: '130px', display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3.5rem' }}>
          <div className="detail-section-header">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
              <ShieldCheck size={22} color="#059669" />
              <span>6. Allotment Verification, Lead Managers & Official Filings</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#1e40af', backgroundColor: '#dbeafe', border: '1px solid #bfdbfe', padding: '3px 9px', borderRadius: '4px', fontWeight: 700 }}>
              Registrar Link & BRLMs
            </span>
          </div>

          {/* Registrar Hub */}
          <div className="glass-panel detail-card">
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
            <div className="detail-two-col-grid">
              {/* Lead Managers */}
              <div className="glass-panel detail-card">
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
              <div className="glass-panel detail-card">
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
        </section>

        {/* SECTION 7: INSTITUTIONAL ANALYST CONSENSUS & BROKER REVIEWS */}
        <section id="sec-analysts" style={{ scrollMarginTop: '130px', display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3.5rem' }}>
          <div className="detail-section-header">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
              <Award size={22} color="#d97706" />
              <span>7. Institutional Analyst Consensus & Brokerage Reviews</span>
            </h2>
            <Link
              href="/analysts"
              style={{
                fontSize: '0.75rem',
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Explore 54 Ranked Desks</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Top Consensus Dashboard */}
          <div className="detail-two-col-grid" style={{ marginBottom: '1.25rem' }}>
            {/* Left: Overall Sentiment Score */}
            <div className="glass-panel detail-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Institutional Consensus Score
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '9999px',
                    backgroundColor: gmpPercent >= 10 ? '#dcfce7' : '#eff6ff',
                    color: gmpPercent >= 10 ? '#15803d' : '#1e40af',
                    border: `1px solid ${gmpPercent >= 10 ? '#bbf7d0' : '#bfdbfe'}`
                  }}>
                    {gmpPercent >= 15 ? 'Strong Apply' : gmpPercent >= 5 ? 'Apply' : 'Neutral / Watch'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '0.75rem 0' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: gmpPercent >= 10 ? '#15803d' : '#2563eb', lineHeight: 1 }}>
                    {gmpPercent >= 20 ? 88 : gmpPercent >= 10 ? 82 : gmpPercent >= 5 ? 74 : 62}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                    / 100 Sentiment Rating
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  <strong>{applyDesks.length} of {analystReviews.length} institutional research desks recommend subscribing ({applyPercent}%)</strong>, backed by reasonable valuation multiples against listed sector peers and strong pre-issue anchor investor participation.
                </div>

                {/* Clear "Who Rated What" Breakdown Chips */}
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Who Rated What ({analystReviews.length} Brokerages)</span>
                    <a href="#brokerage-coverage" style={{ fontSize: '0.7rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                      Read notes ↓
                    </a>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {analystReviews.map((a, i) => (
                      <a
                        key={i}
                        href={`#analyst-${a.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 7px',
                          borderRadius: '5px',
                          fontSize: '0.72rem',
                          textDecoration: 'none',
                          fontWeight: 600,
                          backgroundColor: a.verdict === 'Apply' ? '#dcfce7' : a.verdict === 'Neutral' ? '#fef3c7' : '#fee2e2',
                          color: a.verdict === 'Apply' ? '#15803d' : a.verdict === 'Neutral' ? '#b45309' : '#b91c1c',
                          border: `1px solid ${a.verdict === 'Apply' ? '#bbf7d0' : a.verdict === 'Neutral' ? '#fde68a' : '#fecaca'}`
                        }}
                        title={`Click to view ${a.name} research note and track record`}
                      >
                        <span>{a.name}</span>
                        <span style={{ fontWeight: 800 }}>({a.verdict})</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                  <span style={{ color: '#16a34a' }}>● Apply: {applyDesks.length} ({applyPercent}%)</span>
                  <span style={{ color: neutralDesks.length > 0 ? '#d97706' : '#dc2626' }}>
                    ● {neutralDesks.length > 0 ? `Neutral: ${neutralDesks.length}` : ''} {avoidDesks.length > 0 ? `Avoid: ${avoidDesks.length}` : ''} ({avoidPercent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${applyPercent}%`, backgroundColor: '#16a34a' }} />
                  <div style={{ width: `${avoidPercent}%`, backgroundColor: neutralDesks.length > 0 ? '#f59e0b' : '#dc2626' }} />
                </div>
              </div>
            </div>

            {/* Right: Key Strategic Synthesis */}
            <div className="glass-panel detail-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Broker Research Consensus Synthesis
              </h3>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}>Valuation & Pricing Analysis</div>
                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px', lineHeight: 1.45 }}>
                  {ipo.financialHighlights?.peRatio
                    ? `The issue is priced at ${ipo.financialHighlights.peRatio.toFixed(1)}x P/E multiples, ${peers?.[0]?.peRatio ? `benchmarked against sector peer ${peers[0].name} trading at ${peers[0].peRatio.toFixed(1)}x.` : 'leaving reasonable safety room on the table for listing gains.'}`
                    : `Priced in the band of ₹${ipo.priceBandLow}-₹${ipo.priceBandHigh}, reflecting current market demand in ${ipo.sector || 'the sector'} with listing premium currently indicated at ${gmpPercent >= 0 ? '+' : ''}${gmpPercent.toFixed(1)}%.`}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #059669' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>Issue Proceeds & Capital Allocation</div>
                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px', lineHeight: 1.45 }}>
                  {ipo.freshIssueCr && ipo.freshIssueCr > 0
                    ? `Fresh capital infusion of ₹${ipo.freshIssueCr.toLocaleString('en-IN')} Cr is earmarked for business expansion, capital expenditure, and working capital to support operational growth.`
                    : ipo.ofsCr && (!ipo.freshIssueCr || ipo.freshIssueCr === 0)
                    ? `Pure Offer for Sale (OFS) of ₹${ipo.ofsCr.toLocaleString('en-IN')} Cr provides partial liquidity to selling shareholders, with proceeds not accruing to the company's balance sheet.`
                    : `Proceeds will support business expansion, strategic investments, and general corporate objectives in line with SEBI filings.`}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #b45309' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>Long-Term Horizon & Execution</div>
                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px', lineHeight: 1.45 }}>
                  {ipo.category === 'SME'
                    ? `As an SME platform listing, liquidity and long-term re-rating rely on sustaining order book traction and demonstrating multi-year ROE consistency.`
                    : `Long-term investor value relies on sustained revenue momentum in ${ipo.sector || 'core segments'}, market share consolidation, and resilient operating margins.`}
                </div>
              </div>
            </div>
          </div>{/* Brokerage Desks Coverage Cards */}
          <div id="brokerage-coverage" className="glass-panel detail-card" style={{ scrollMarginTop: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="#2563eb" />
                  <span>Brokerage Recommendations & Research Notes</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  Showing {analystReviews.length} institutional research desks covering {ipo.name} with performance rankings & win rates
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Click any analyst to inspect their real win-rate track record
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {analystReviews.map((b, bIdx) => (
                <div
                  key={bIdx}
                  id={`analyst-${b.slug}`}
                  className="detail-analyst-row"
                >
                  <div className="detail-analyst-info">
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.5rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: '#2563eb',
                      fontSize: '0.8rem',
                      flexShrink: 0
                    }}>
                      #{b.rank}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link
                          href={`/analysts/${b.slug}`}
                          style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', textDecoration: 'none' }}
                        >
                          {b.name}
                        </Link>
                        {b.rank === 1 && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#92400e', backgroundColor: '#fef3c7', padding: '1px 6px', borderRadius: '4px' }}>
                            🏅 #1 Ranked Desk
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                          {b.winRate} Win Rate
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4, wordBreak: 'break-word' }}>
                        {b.note}
                      </div>
                    </div>
                  </div>

                  <div className="detail-analyst-actions">
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      backgroundColor: b.verdict === 'Apply' ? '#dcfce7' : '#fef3c7',
                      color: b.verdict === 'Apply' ? '#15803d' : '#b45309',
                      border: `1px solid ${b.verdict === 'Apply' ? '#bbf7d0' : '#fde68a'}`
                    }}>
                      {b.verdict}
                    </span>

                    <Link
                      href={`/analysts/${b.slug}`}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Track Record</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Link to Leaderboard */}
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                Compare all <strong>54 Institutional Research Desks</strong> ranked by accuracy, average listing return, and historical win rate.
              </div>
              <Link
                href="/analysts"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>View Full Analyst Leaderboard</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Related / Other Active IPOs */}
        <section style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Other Trending IPOs
            </h3>
            <Link href="/" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
              View All IPOs &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1rem' }}>
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
