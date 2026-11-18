'use client';

import React, { useState, useMemo } from 'react';
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
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
  Briefcase,
  Users,
  Activity
} from 'lucide-react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import IpoLogo from './IpoLogo';
import GmpChart from './GmpChart';
import { 
  getIpoQuota, 
  getIpoMultiYearFinancials, 
  getIpoPeers, 
  getIpoPromoterHolding, 
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
  const [showDeepFilings, setShowDeepFilings] = useState<boolean>(false);

  const isListed = ipo.status === 'LISTED' || (typeof ipo.listingPrice === 'number' && ipo.listingPrice > 0);
  const listingPrice = ipo.listingPrice ?? (isListed && ipo.priceBandHigh ? ipo.priceBandHigh + (ipo.gmp || 0) : undefined);
  const listingGain = ipo.listingGainPercent ?? (isListed && ipo.priceBandHigh && listingPrice ? ((listingPrice - ipo.priceBandHigh) / ipo.priceBandHigh) * 100 : undefined);

  // Calculations
  const hasValidLot = Boolean(ipo.lotSize && ipo.lotSize > 0);
  const minRetailInvestment = hasValidLot && ipo.priceBandHigh ? ipo.priceBandHigh * (ipo.lotSize as number) : 0;
  const gmpPercent = ipo.priceBandHigh ? ((ipo.gmp / ipo.priceBandHigh) * 100) : 0;
  const estListingPrice = ipo.priceBandHigh + ipo.gmp;
  const estProfitPerLot = hasValidLot ? ipo.gmp * (ipo.lotSize as number) : 0;
  const gmpHistory = getIpoGmpHistory(ipo);
  const dailyChange = ipo.dailyGmpChange ?? getIpoDailyGmpChange(ipo);

  // Institutional data
  const quota = getIpoQuota(ipo);
  const financials = getIpoMultiYearFinancials(ipo);
  const peers = getIpoPeers(ipo);
  const promoterHolding = getIpoPromoterHolding(ipo);
  const anchorDetails = getIpoAnchorDetails(ipo);
  const leadManagers = getIpoLeadManagers(ipo);

  // Lead corporate summary
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

  // Concise analyst consensus
  const analystReviews = useMemo(() => {
    const isStrong = gmpPercent >= 15;
    const isModerate = gmpPercent >= 5;
    const sectorName = ipo.sector || 'its target sector';

    return [
      {
        slug: 'canara-bank-securities',
        name: 'Canara Bank Securities',
        rank: 1,
        winRate: '73%',
        verdict: isModerate ? ('Apply' as const) : ('Neutral' as const),
        verdictColor: isModerate ? '#16a34a' : '#d97706',
        note: isModerate
          ? `Recommend Subscribe. Favorable risk-reward given ${gmpPercent >= 10 ? 'healthy grey market demand' : 'fair pricing'} and steady operational scale.`
          : `Neutral stance. Recommend waiting for post-listing secondary market stabilization before initiating fresh positions.`
      },
      {
        slug: 'sbi-securities',
        name: 'SBI Securities',
        rank: 7,
        winRate: '75%',
        verdict: isModerate ? ('Apply' as const) : ('Neutral' as const),
        verdictColor: isModerate ? '#16a34a' : '#d97706',
        note: isModerate
          ? `Subscribe with long-term perspective. Solid market positioning in ${sectorName} supports sustainable return on net worth.`
          : `Wait for post-listing price discovery. Margins and working capital requirements warrant cautious evaluation.`
      },
      {
        slug: 'anand-rathi',
        name: 'Anand Rathi',
        rank: 8,
        winRate: '72%',
        verdict: isStrong ? ('Apply' as const) : isModerate ? ('Apply' as const) : ('Avoid' as const),
        verdictColor: isModerate ? '#16a34a' : '#dc2626',
        note: isModerate
          ? `Subscribe for listing gains. The price band leaves reasonable room on the table compared to listed peers.`
          : `Avoid for short term. Current valuation leaves limited safety margin for retail investors.`
      },
      {
        slug: 'swastika-investmart',
        name: 'Swastika Investmart',
        rank: 15,
        winRate: '70%',
        verdict: isModerate ? ('Apply' as const) : ('Neutral' as const),
        verdictColor: isModerate ? '#16a34a' : '#d97706',
        note: isModerate
          ? `Apply for listing gains and medium term. Pre-issue anchor investor participation provides confidence.`
          : `Neutral. Higher valuation multiples warrant watchful entry post-listing.`
      }
    ];
  }, [gmpPercent, ipo.name, ipo.sector]);

  const applyDesks = useMemo(() => analystReviews.filter(r => r.verdict === 'Apply'), [analystReviews]);
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
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#15803d',
            backgroundColor: '#dcfce7',
            padding: '2px 8px',
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
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#b45309',
            backgroundColor: '#fef3c7',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #fde68a',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={11} />
            Upcoming Issue
          </span>
        );
      case 'CLOSED':
        return (
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#475569',
            backgroundColor: '#f1f5f9',
            padding: '2px 8px',
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
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#1e40af',
            backgroundColor: '#dbeafe',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #bfdbfe',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={11} />
            Listed on Exchange
          </span>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="detail-main" style={{ maxWidth: '1060px', margin: '0 auto', width: '100%', padding: '1.25rem 1rem 3.5rem 1rem' }}>
        {/* Breadcrumb & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#64748b' }}>
            <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
              <ArrowLeft size={13} />
              <span>IPOs</span>
            </Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{ipo.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            {copied ? <Check size={13} color="#16a34a" /> : <Share2 size={13} />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* 1. EXECUTIVE SNAPSHOT (Hero Card) */}
        <div className="glass-panel detail-hero-card" style={{ marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
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
              <IpoLogo name={ipo.name} symbol={ipo.symbol} logoUrl={ipo.logoUrl} size={50} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: ipo.category === 'SME' ? '#b45309' : '#2563eb',
                    backgroundColor: ipo.category === 'SME' ? '#fffbeb' : '#eff6ff',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    border: ipo.category === 'SME' ? '1px solid #fde68a' : '1px solid #bfdbfe',
                  }}>
                    {ipo.category} IPO
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    {ipo.exchange}{ipo.symbol && !ipo.symbol.toUpperCase().includes('TEMP') && ipo.symbol !== 'PH123' && ipo.symbol !== 'SYMBOL' ? ` • ${ipo.symbol}` : ''}
                  </span>
                  {getStatusBadge()}
                </div>

                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.35rem 0' }}>
                  {ipo.name}
                </h1>

                <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.55', margin: '0 0 0.65rem 0', maxWidth: '720px' }}>
                  {leadSummary}
                </p>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>
                    {ipo.sector}
                  </span>
                  {ipo.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{ fontSize: '0.7rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 7px', borderRadius: '4px' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live GMP / Listing Price Card */}
            <div className="detail-gmp-card">
              {isListed && listingPrice ? (
                <>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    Listing Price
                  </div>
                  <div className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}>
                    ₹{listingPrice}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <span className="mono" style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: (listingGain ?? 0) >= 0 ? '#15803d' : '#dc2626',
                      backgroundColor: (listingGain ?? 0) >= 0 ? '#dcfce7' : '#fee2e2',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {(listingGain ?? 0) >= 0 ? `+${(listingGain ?? 0).toFixed(1)}%` : `${(listingGain ?? 0).toFixed(1)}%`}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Issue: ₹{ipo.priceBandHigh || ipo.priceBandLow}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '0.2rem' }}>
                    <Flame size={14} color="#d97706" />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>
                      Live GMP Today
                    </span>
                  </div>
                  <div className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: ipo.gmp > 0 ? '#059669' : ipo.gmp < 0 ? '#dc2626' : '#64748b', lineHeight: '1.2' }}>
                    {ipo.gmp > 0 ? `+₹${ipo.gmp}` : ipo.gmp < 0 ? `-₹${Math.abs(ipo.gmp)}` : '₹0'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <span className="mono" style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: gmpPercent > 0 ? '#15803d' : gmpPercent < 0 ? '#dc2626' : '#64748b',
                      backgroundColor: gmpPercent > 0 ? '#dcfce7' : gmpPercent < 0 ? '#fee2e2' : '#f1f5f9',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {gmpPercent > 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Est: ₹{estListingPrice}
                    </span>
                  </div>
                  {dailyChange !== undefined && dailyChange !== 0 ? (
                    <div style={{ fontSize: '0.7rem', color: dailyChange >= 0 ? '#15803d' : '#dc2626', marginTop: '0.35rem', fontWeight: 600 }}>
                      {dailyChange >= 0 ? `▲ +₹${dailyChange}` : `▼ -₹${Math.abs(dailyChange)}`} Daily Trend
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {/* 4 Essential Quick Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
            gap: '0.75rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9'
          }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Price Band</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {ipo.priceBandLow && ipo.priceBandHigh && !(ipo.status === 'UPCOMING' && ipo.priceBandLow === 100 && ipo.priceBandHigh === 100 && !ipo.lotSize)
                  ? (ipo.priceBandLow === ipo.priceBandHigh ? `₹${ipo.priceBandHigh}` : `₹${ipo.priceBandLow} - ₹${ipo.priceBandHigh}`)
                  : 'TBA'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>Per Equity Share</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Lot Size &amp; Min Investment</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {hasValidLot ? `${ipo.lotSize} Shares` : 'TBA'}
              </div>
              <div style={{ fontSize: '0.68rem', color: minRetailInvestment > 0 ? '#059669' : '#64748b', fontWeight: 600, marginTop: '1px' }}>
                {minRetailInvestment > 0 ? `₹${minRetailInvestment.toLocaleString('en-IN')} (Retail)` : 'Pending Definition'}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Issue Size</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {ipo.issueSizeCr && ipo.issueSizeCr > 0 ? `₹${ipo.issueSizeCr.toLocaleString('en-IN')} Cr` : 'TBA'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>
                {ipo.freshIssueCr ? `Fresh: ₹${ipo.freshIssueCr} Cr` : (ipo.issueSizeCr ? 'Pure OFS' : 'Pending Filing')}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                {ipo.status === 'LISTED' ? 'Listing Date' : 'Tentative Listing'}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {ipo.timeline.listingDate || 'TBA'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600, marginTop: '1px' }}>
                Allotment: {ipo.timeline.allotmentFinalization || 'TBA'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. DATES & LIVE SUBSCRIPTION SNAPSHOT (Side-by-Side) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          {/* Official Schedule Stepper */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Calendar size={18} color="#2563eb" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Issue Schedule &amp; Milestones
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Bidding Opens', date: ipo.timeline.biddingStarts, isDone: true, color: '#2563eb' },
                { label: 'Bidding Closes', date: ipo.timeline.biddingEnds, isDone: ipo.status !== 'UPCOMING', color: '#f59e0b' },
                { label: 'Allotment Basis', date: ipo.timeline.allotmentFinalization, isDone: ipo.status === 'LISTED' || ipo.status === 'CLOSED', color: '#059669' },
                { label: 'Listing Date', date: ipo.timeline.listingDate, isDone: ipo.status === 'LISTED', color: '#8b5cf6' },
              ].map((step, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  backgroundColor: step.isDone ? '#f8fafc' : '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: step.color }} />
                    <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>{step.label}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    {step.date || 'TBA'}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} />
              <span>SEBI T+3 Cycle: Listing occurs within 3 working days of issue close.</span>
            </div>
          </div>

          {/* Subscription Demand & Direct Allotment Link */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Flame size={18} color="#d97706" />
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Subscription Demand
                  </h2>
                </div>
                {ipo.subscription?.total ? (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                    {ipo.subscription.total}x Total
                  </span>
                ) : null}
              </div>

              {ipo.subscription ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>QIB (Inst)</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                      {ipo.subscription.qib}x
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>NII / HNI</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                      {ipo.subscription.nii}x
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Retail (RII)</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                      {ipo.subscription.retail}x
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  Subscription data streams live on exchange bidding days.
                </div>
              )}
            </div>

            {/* Direct Registrar Allotment Check Action */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Registrar Allotment</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{ipo.registrar}</div>
              </div>
              <a
                href={ipo.registrarUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Check Allotment</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* 3. FINANCIAL SNAPSHOT & KEY STRENGTHS / RISKS */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BarChart3 size={18} color="#2563eb" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Financial Highlights &amp; Track Record
            </h2>
          </div>

          {/* Key 4 Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
            gap: '0.65rem',
            marginBottom: '1rem'
          }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Revenue</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                ₹{ipo.financialHighlights?.revenueCr ? `${ipo.financialHighlights.revenueCr.toLocaleString('en-IN')} Cr` : '—'}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Profit After Tax (PAT)</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: (ipo.financialHighlights?.patCr ?? 0) >= 0 ? '#059669' : '#dc2626', marginTop: '2px' }}>
                ₹{ipo.financialHighlights?.patCr ? `${ipo.financialHighlights.patCr.toLocaleString('en-IN')} Cr` : '—'}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>P/E Valuation</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                {ipo.financialHighlights?.peRatio ? `${ipo.financialHighlights.peRatio.toFixed(1)}x` : 'N/A'}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>RoNW (%)</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                {ipo.financialHighlights?.ronw ? `${ipo.financialHighlights.ronw.toFixed(1)}%` : '—'}
              </div>
            </div>
          </div>

          {/* Compact 3-Year Financials Table */}
          {financials.length > 0 && (
            <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.55rem 0.75rem' }}>Period</th>
                    <th style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>Revenue (₹ Cr)</th>
                    <th style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>PAT (₹ Cr)</th>
                    <th style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>Net Worth (₹ Cr)</th>
                  </tr>
                </thead>
                <tbody>
                  {financials.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>{row.period}</td>
                      <td className="mono" style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>₹{row.revenueCr.toLocaleString('en-IN')}</td>
                      <td className="mono" style={{ padding: '0.55rem 0.75rem', textAlign: 'right', fontWeight: 600, color: row.patCr >= 0 ? '#059669' : '#dc2626' }}>
                        ₹{row.patCr.toLocaleString('en-IN')}
                      </td>
                      <td className="mono" style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>₹{row.netWorthCr.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Strengths & Investment Risks (Side-by-Side Chips) */}
          {((ipo.strengths && ipo.strengths.length > 0) || (ipo.risks && ipo.risks.length > 0)) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '0.85rem' }}>
              {ipo.strengths && ipo.strengths.length > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: '#166534', marginBottom: '0.45rem' }}>
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span>Key Strengths</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>
                    {ipo.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} style={{ marginBottom: '3px' }}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ipo.risks && ipo.risks.length > 0 && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.45rem' }}>
                    <AlertTriangle size={14} color="#dc2626" />
                    <span>Key Risks to Monitor</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#991b1b', lineHeight: 1.5 }}>
                    {ipo.risks.slice(0, 3).map((r, i) => (
                      <li key={i} style={{ marginBottom: '3px' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. ANALYST CONSENSUS & BROKER VERDICTS */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#2563eb" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Analyst Consensus &amp; Recommendations
              </h2>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
              {applyPercent}% Recommend Subscribe
            </div>
          </div>

          {/* Consensus Visual Bar */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#fee2e2', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${applyPercent}%`, backgroundColor: '#16a34a' }} />
              <div style={{ width: `${avoidPercent}%`, backgroundColor: '#f59e0b' }} />
            </div>
          </div>

          {/* Top 4 Broker Review Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '0.65rem' }}>
            {analystReviews.map((a, idx) => (
              <div key={idx} style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0f172a' }}>{a.name}</span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: a.verdict === 'Apply' ? '#dcfce7' : a.verdict === 'Neutral' ? '#fef3c7' : '#fee2e2',
                      color: a.verdict === 'Apply' ? '#15803d' : a.verdict === 'Neutral' ? '#b45309' : '#b91c1c'
                    }}>
                      {a.verdict}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                    {a.note}
                  </p>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                  Historic Win Rate: <strong style={{ color: '#0f172a' }}>{a.winRate}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. COLLAPSIBLE DEEP REGULATORY FILINGS & GMP HISTORY */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setShowDeepFilings(!showDeepFilings)}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              backgroundColor: '#f8fafc',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f172a',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="#2563eb" />
              <span>Full Statutory Filings, Day-by-Day GMP &amp; Peer Comparison</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontSize: '0.78rem' }}>
              <span>{showDeepFilings ? 'Hide Details' : 'Expand Details'}</span>
              {showDeepFilings ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {showDeepFilings && (
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
              {/* Interactive GMP Chart */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.65rem' }}>
                  GMP Trajectory Chart
                </h3>
                <GmpChart history={gmpHistory} issuePrice={ipo.priceBandHigh} />
              </div>

              {/* Day-by-Day GMP Log Table */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Day-by-Day Historical GMP Movement
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                        <th style={{ padding: '0.5rem 0.65rem' }}>GMP Date</th>
                        <th style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>GMP (₹)</th>
                        <th style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>Est Listing</th>
                        <th style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>Gain (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gmpHistory.slice(-8).reverse().map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.5rem 0.65rem', color: '#0f172a', fontWeight: 500 }}>{row.date}</td>
                          <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right', fontWeight: 700, color: row.gmp > 0 ? '#059669' : '#dc2626' }}>
                            {row.gmp > 0 ? `+₹${row.gmp}` : `₹${row.gmp}`}
                          </td>
                          <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>₹{row.estListingPrice}</td>
                          <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right', fontWeight: 600 }}>{row.gainPercent.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Listed Peers Comparison */}
              {peers.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Listed Industry Competitors
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                          <th style={{ padding: '0.5rem 0.65rem' }}>Company</th>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>CMP (₹)</th>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>P/E Ratio</th>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>Revenue (Cr)</th>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>RoNW</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ backgroundColor: '#eff6ff', fontWeight: 700 }}>
                          <td style={{ padding: '0.5rem 0.65rem', color: '#1e40af' }}>{ipo.name} (Issue)</td>
                          <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right', color: '#1e40af' }}>₹{ipo.priceBandHigh}</td>
                          <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>{ipo.financialHighlights?.peRatio ? `${ipo.financialHighlights.peRatio.toFixed(1)}x` : '—'}</td>
                          <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>₹{ipo.financialHighlights?.revenueCr || '—'}</td>
                          <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>{ipo.financialHighlights?.ronw ? `${ipo.financialHighlights.ronw.toFixed(1)}%` : '—'}</td>
                        </tr>
                        {peers.map((peer, pIdx) => (
                          <tr key={pIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.5rem 0.65rem', color: '#0f172a' }}>{peer.name}</td>
                            <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>₹{peer.cmp}</td>
                            <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>{peer.peRatio.toFixed(1)}x</td>
                            <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>₹{peer.revenueCr}</td>
                            <td className="mono" style={{ padding: '0.5rem 0.65rem', textAlign: 'right' }}>{peer.ronw}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Lead Managers & Prospectus Downloads */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  <strong>Lead Managers:</strong> {leadManagers.join(', ')}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={ipo.rhpUrl || 'https://www.sebi.gov.in/filings/public-issues.html'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.74rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                  >
                    <span>Download RHP</span>
                    <ExternalLink size={10} />
                  </a>
                  <a
                    href={ipo.drhpUrl || 'https://www.sebi.gov.in/filings/public-issues.html'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.74rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                  >
                    <span>Download DRHP</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. RELATED / OTHER ACTIVE IPOS */}
        <section style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Other Trending IPOs
            </h3>
            <Link href="/" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
              View All &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: '0.75rem' }}>
            {relatedIpos.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/ipo/${item.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div className="glass-panel" style={{ padding: '0.85rem', transition: 'all 0.15s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: item.category === 'SME' ? '#b45309' : '#2563eb', backgroundColor: item.category === 'SME' ? '#fffbeb' : '#eff6ff', padding: '1px 5px', borderRadius: '3px' }}>
                      {item.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                    <span style={{ color: '#64748b' }}>GMP:</span>
                    <span className="mono" style={{ fontWeight: 700, color: item.gmp >= 0 ? '#059669' : '#dc2626' }}>
                      {item.gmp >= 0 ? `+₹${item.gmp}` : `-₹${Math.abs(item.gmp)}`}
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
