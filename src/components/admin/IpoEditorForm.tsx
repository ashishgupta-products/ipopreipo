'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building, 
  DollarSign, 
  Flame, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Users, 
  ShieldCheck, 
  ArrowLeft, 
  Save, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2,
  HelpCircle,
  Briefcase,
  PieChart
} from 'lucide-react';
import { IpoItem, IpoCategory, IpoStatus } from '../../types';

interface IpoEditorFormProps {
  initialData?: Partial<IpoItem>;
  isNew?: boolean;
}

export default function IpoEditorForm({ initialData = {}, isNew = false }: IpoEditorFormProps) {
  const router = useRouter();

  // Active section inside the full page editor
  const [activeSection, setActiveSection] = useState<
    'basic' | 'pricing' | 'gmp' | 'timeline' | 'subscription' | 'profile' | 'quota' | 'financials' | 'insights'
  >('basic');

  const [saving, setSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<IpoItem>>({
    id: initialData.id || '',
    name: initialData.name || '',
    symbol: initialData.symbol || '',
    logoUrl: initialData.logoUrl || '',
    category: (initialData.category as IpoCategory) || 'MAINBOARD',
    status: (initialData.status as IpoStatus) || 'UPCOMING',
    exchange: initialData.exchange || 'NSE & BSE',
    sector: initialData.sector || 'Diversified Manufacturing',
    tags: initialData.tags || ['Mainboard', 'NSE & BSE'],

    // Pricing
    priceBandLow: initialData.priceBandLow ?? 100,
    priceBandHigh: initialData.priceBandHigh ?? 108,
    faceValue: initialData.faceValue ?? 10,
    lotSize: initialData.lotSize ?? 100,
    issueSizeCr: initialData.issueSizeCr ?? 450,
    freshIssueCr: initialData.freshIssueCr ?? 380,
    ofsCr: initialData.ofsCr ?? 70,
    listingPrice: initialData.listingPrice ?? undefined,

    // GMP
    gmp: initialData.gmp ?? 0,
    dailyGmpChange: initialData.dailyGmpChange ?? 0,
    gmpTrend: initialData.gmpTrend || 'STABLE',
    fireRating: (initialData.fireRating as any) ?? 3,
    gmpUpdatedDate: initialData.gmpUpdatedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),

    // Timeline
    timeline: {
      biddingStarts: initialData.timeline?.biddingStarts || '',
      biddingEnds: initialData.timeline?.biddingEnds || '',
      allotmentFinalization: initialData.timeline?.allotmentFinalization || 'T+1 after Close',
      refundInitiation: initialData.timeline?.refundInitiation || 'T+2 after Close',
      creditOfShares: initialData.timeline?.creditOfShares || 'T+2 after Close',
      listingDate: initialData.timeline?.listingDate || ''
    },

    // Subscription
    subscription: {
      qib: initialData.subscription?.qib ?? 0,
      nii: initialData.subscription?.nii ?? 0,
      retail: initialData.subscription?.retail ?? 0,
      employee: initialData.subscription?.employee ?? 0,
      total: initialData.subscription?.total ?? 0
    },

    // Profile & Disclosures
    about: initialData.about || '',
    yearIncorporated: initialData.yearIncorporated ?? 2015,
    registeredOffice: initialData.registeredOffice || '',
    registrar: initialData.registrar || 'Link Intime India Pvt Ltd',
    registrarUrl: initialData.registrarUrl || 'https://linkintime.co.in/initial_offer/public-issues.html',
    leadManagers: initialData.leadManagers || ['Kotak Mahindra Capital', 'Axis Capital Ltd'],
    rhpUrl: initialData.rhpUrl || '',
    drhpUrl: initialData.drhpUrl || '',

    // Quotas & Promoters
    quotaReservation: {
      qibPercent: initialData.quotaReservation?.qibPercent ?? 50,
      niiPercent: initialData.quotaReservation?.niiPercent ?? 15,
      sHniPercent: initialData.quotaReservation?.sHniPercent ?? 5,
      bHniPercent: initialData.quotaReservation?.bHniPercent ?? 10,
      retailPercent: initialData.quotaReservation?.retailPercent ?? 35,
      employeeDiscount: initialData.quotaReservation?.employeeDiscount ?? 0
    },
    promoterHolding: {
      preIssuePercent: initialData.promoterHolding?.preIssuePercent ?? 85,
      postIssuePercent: initialData.promoterHolding?.postIssuePercent ?? 65,
      promoters: initialData.promoterHolding?.promoters || ['Promoter Group & Founding Directors']
    },

    // Financial Highlights
    financialHighlights: {
      revenueCr: initialData.financialHighlights?.revenueCr ?? 1500,
      patCr: initialData.financialHighlights?.patCr ?? 180,
      eps: initialData.financialHighlights?.eps ?? 8.5,
      peRatio: initialData.financialHighlights?.peRatio ?? 24.5,
      ronw: initialData.financialHighlights?.ronw ?? 18.2,
      ebitdaMargin: initialData.financialHighlights?.ebitdaMargin ?? 16.5,
      patMargin: initialData.financialHighlights?.patMargin ?? 12.0,
      debtToEquity: initialData.financialHighlights?.debtToEquity ?? 0.35
    },

    // Insights
    strengths: initialData.strengths || [
      'Strong brand presence with extensive pan-India distribution.',
      'High operating margins and consistent multi-year revenue growth.'
    ],
    risks: initialData.risks || [
      'High dependency on top 5 key clients and regional supplier hubs.',
      'Raw material price fluctuations and strict compliance regulations.'
    ],
    objectsOfIssue: initialData.objectsOfIssue || [
      'Funding capital expenditures for capacity expansion.',
      'Prepayment or repayment of outstanding borrowings.'
    ]
  });

  // Multiline string states for array inputs
  const [tagsStr, setTagsStr] = useState((formData.tags || []).join(', '));
  const [leadManagersStr, setLeadManagersStr] = useState((formData.leadManagers || []).join(', '));
  const [promotersStr, setPromotersStr] = useState((formData.promoterHolding?.promoters || []).join(', '));
  const [strengthsStr, setStrengthsStr] = useState((formData.strengths || []).join('\n'));
  const [risksStr, setRisksStr] = useState((formData.risks || []).join('\n'));
  const [objectsStr, setObjectsStr] = useState((formData.objectsOfIssue || []).join('\n'));

  // Calculated stats
  const calculatedMinInvestment = (formData.priceBandHigh || 0) * (formData.lotSize || 0);
  const calculatedGainPercent = (formData.priceBandHigh && formData.priceBandHigh > 0)
    ? (((formData.gmp || 0) / formData.priceBandHigh) * 100).toFixed(1)
    : '0.0';
  const calculatedEstListingPrice = (formData.priceBandHigh || 0) + (formData.gmp || 0);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setActionMessage({ type: 'error', text: 'Company Name is required.' });
      return;
    }

    try {
      setSaving(true);
      setActionMessage(null);

      // Construct clean payload with parsed arrays
      const payload: Partial<IpoItem> = {
        ...formData,
        tags: tagsStr.split(',').map(s => s.trim()).filter(Boolean),
        leadManagers: leadManagersStr.split(',').map(s => s.trim()).filter(Boolean),
        promoterHolding: {
          ...formData.promoterHolding!,
          promoters: promotersStr.split(',').map(s => s.trim()).filter(Boolean)
        },
        strengths: strengthsStr.split('\n').map(s => s.trim()).filter(Boolean),
        risks: risksStr.split('\n').map(s => s.trim()).filter(Boolean),
        objectsOfIssue: objectsStr.split('\n').map(s => s.trim()).filter(Boolean),
      };

      const url = '/api/admin/ipos';
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage({
          type: 'success',
          text: `IPO "${payload.name}" saved successfully to Neon PostgreSQL database!`
        });
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to save IPO record.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: `Network error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'basic', label: '1. Identity & Exchange', icon: <Building size={16} /> },
    { id: 'pricing', label: '2. Pricing & Issue Structure', icon: <DollarSign size={16} /> },
    { id: 'gmp', label: '3. Live GMP & Sentiment', icon: <Flame size={16} /> },
    { id: 'timeline', label: '4. SEBI Timeline & Dates', icon: <Calendar size={16} /> },
    { id: 'subscription', label: '5. Subscription Multipliers', icon: <TrendingUp size={16} /> },
    { id: 'profile', label: '6. Profile & RHP Documents', icon: <FileText size={16} /> },
    { id: 'quota', label: '7. Quotas & Promoters', icon: <PieChart size={16} /> },
    { id: 'financials', label: '8. Financial Ratios', icon: <Briefcase size={16} /> },
    { id: 'insights', label: '9. Strengths, Risks & Objects', icon: <HelpCircle size={16} /> },
  ] as const;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Top Breadcrumb & Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Admin Dashboard</span>
            </Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700 }}>
              {isNew ? 'Create New IPO' : `Edit: ${formData.name || 'IPO'}`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {isNew ? 'Add New IPO to Database' : `Edit: ${formData.name}`}
            </h1>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: formData.category === 'MAINBOARD' ? '#eff6ff' : '#fef3c7',
              color: formData.category === 'MAINBOARD' ? '#2563eb' : '#d97706',
              border: `1px solid ${formData.category === 'MAINBOARD' ? '#bfdbfe' : '#fde68a'}`
            }}>
              {formData.category}
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: formData.status === 'ONGOING' ? '#ecfdf5' : '#f1f5f9',
              color: formData.status === 'ONGOING' ? '#059669' : '#475569',
              border: `1px solid ${formData.status === 'ONGOING' ? '#a7f3d0' : '#e2e8f0'}`
            }}>
              {formData.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isNew && formData.id && (
            <Link
              href={`/ipo/${formData.id}`}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.15rem',
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>Preview Live Page</span>
              <ExternalLink size={14} />
            </Link>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving to Neon DB...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionMessage && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          fontSize: '0.95rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: actionMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: actionMessage.type === 'success' ? '#166534' : '#991b1b',
          border: `1px solid ${actionMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {actionMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}

      {/* Main 2-Column Section Navigation + Form Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }} className="ipo-editor-layout">
        {/* Left Sticky Section Picker */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          position: 'sticky',
          top: '80px'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.5rem 0.75rem 0.25rem' }}>
            Form Sections
          </div>
          {sections.map(s => {
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ color: isActive ? '#38bdf8' : '#64748b' }}>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            );
          })}

          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
            <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Quick Stats</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                Est. Listing: ₹{calculatedEstListingPrice} (+{calculatedGainPercent}%)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                Min Lot: ₹{calculatedMinInvestment.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Content Card */}
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          {/* SECTION 1: BASIC DETAILS */}
          {activeSection === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  1. Corporate Identity & Exchange Listing
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Primary identifiers, trading symbols, and category classification.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Company / IPO Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-One Steels India Limited"
                    value={formData.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoSlug = isNew ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : formData.id;
                      setFormData({ ...formData, name, id: autoSlug });
                    }}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Stock Symbol / Ticker *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AONESTEELS"
                    value={formData.symbol || ''}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as IpoCategory })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="MAINBOARD">MAINBOARD (Large Cap / Core)</option>
                    <option value="SME">SME (Small & Medium Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as IpoStatus })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="UPCOMING">UPCOMING (Announced / DRHP)</option>
                    <option value="ONGOING">ONGOING (Bidding Active Now)</option>
                    <option value="CLOSED">CLOSED (Awaiting Allotment)</option>
                    <option value="LISTED">LISTED (Trading on Exchange)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Exchange
                  </label>
                  <select
                    value={formData.exchange}
                    onChange={(e) => setFormData({ ...formData, exchange: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="NSE & BSE">NSE & BSE</option>
                    <option value="NSE SME">NSE SME</option>
                    <option value="BSE SME">BSE SME</option>
                    <option value="NSE">NSE Only</option>
                    <option value="BSE">BSE Only</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Electricals & Power Transmission"
                    value={formData.sector || ''}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Custom URL Slug / ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. a-one-steels-india"
                    value={formData.id || ''}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    disabled={!isNew}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: !isNew ? '#f1f5f9' : '#ffffff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Company Logo URL
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                  {formData.logoUrl && (
                    <div style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={formData.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Badges & Search Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zerodha Verified, Mainboard, High Growth, NSE & BSE"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          )}

          {/* SECTION 2: PRICING & STRUCTURE */}
          {activeSection === 'pricing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  2. Price Band, Lot Size & Capital Structure
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Issue price bounds, lot sizes, fresh capital vs OFS breakdown.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Price Band Floor / Low (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.priceBandLow ?? ''}
                    onChange={(e) => setFormData({ ...formData, priceBandLow: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Price Band Cap / High (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.priceBandHigh ?? ''}
                    onChange={(e) => setFormData({ ...formData, priceBandHigh: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Face Value (₹ / share)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 10 or 2"
                    value={formData.faceValue ?? 10}
                    onChange={(e) => setFormData({ ...formData, faceValue: parseFloat(e.target.value) || 10 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Market Lot Size (Shares) *
                  </label>
                  <input
                    type="number"
                    value={formData.lotSize ?? ''}
                    onChange={(e) => setFormData({ ...formData, lotSize: parseInt(e.target.value, 10) || 0 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Calculated minimum retail investment: <strong>₹{calculatedMinInvestment.toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Total Issue Size (₹ Cr) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.issueSizeCr ?? ''}
                    onChange={(e) => setFormData({ ...formData, issueSizeCr: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Fresh Issue Component (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.freshIssueCr ?? ''}
                    onChange={(e) => setFormData({ ...formData, freshIssueCr: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Offer For Sale (OFS) (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.ofsCr ?? ''}
                    onChange={(e) => setFormData({ ...formData, ofsCr: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Final Listing Price (₹, If Listed)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 420"
                    value={formData.listingPrice ?? ''}
                    onChange={(e) => setFormData({ ...formData, listingPrice: parseFloat(e.target.value) || undefined })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: GMP & SENTIMENT */}
          {activeSection === 'gmp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  3. Live Grey Market Premium (GMP) & Sentiment
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Real-time unlisted market premium, listing day expectations, and buyer demand rating.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Live GMP (₹ per share) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.gmp ?? 0}
                    onChange={(e) => setFormData({ ...formData, gmp: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, color: '#059669' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Daily Change in GMP (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. +12 or -5"
                    value={formData.dailyGmpChange ?? 0}
                    onChange={(e) => setFormData({ ...formData, dailyGmpChange: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    GMP Trend Indicator
                  </label>
                  <select
                    value={formData.gmpTrend || 'STABLE'}
                    onChange={(e) => setFormData({ ...formData, gmpTrend: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="UP">▲ UP (Bullish Demand)</option>
                    <option value="DOWN">▼ DOWN (Weakening Premium)</option>
                    <option value="STABLE">■ STABLE (Flat Trading)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Heat / Fire Rating (1 to 5)
                  </label>
                  <select
                    value={formData.fireRating || 3}
                    onChange={(e) => setFormData({ ...formData, fireRating: parseInt(e.target.value, 10) as any })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value={1}>🔥 1 Fire (Cold / Subdued)</option>
                    <option value={2}>🔥🔥 2 Fires (Moderate)</option>
                    <option value={3}>🔥🔥🔥 3 Fires (Good Interest)</option>
                    <option value={4}>🔥🔥🔥🔥 4 Fires (Very Strong)</option>
                    <option value={5}>🔥🔥🔥🔥🔥 5 Fires (Blockbuster Demand)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    GMP Last Updated Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 28 Sep, 10:30 AM"
                    value={formData.gmpUpdatedDate || ''}
                    onChange={(e) => setFormData({ ...formData, gmpUpdatedDate: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Estimated Listing Price</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>
                    ₹{calculatedEstListingPrice} <span style={{ fontSize: '1rem', fontWeight: 600 }}>per share</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Estimated Gain %</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>
                    +{calculatedGainPercent}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SEBI TIMELINE */}
          {activeSection === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  4. SEBI IPO Timetable & Critical Schedule Dates
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Enter standard SEBI T+3 schedule dates (e.g. "25 Sep 2026" or "2026-09-25").
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Bidding Starts / Issue Open Date *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24 Sep 2026"
                    value={formData.timeline?.biddingStarts || ''}
                    onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline!, biddingStarts: e.target.value } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Bidding Ends / Issue Close Date *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 28 Sep 2026"
                    value={formData.timeline?.biddingEnds || ''}
                    onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline!, biddingEnds: e.target.value } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Allotment Finalization Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 29 Sep 2026"
                    value={formData.timeline?.allotmentFinalization || ''}
                    onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline!, allotmentFinalization: e.target.value } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Refund Initiation Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Sep 2026"
                    value={formData.timeline?.refundInitiation || ''}
                    onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline!, refundInitiation: e.target.value } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Credit of Shares to Demat Account
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Sep 2026"
                    value={formData.timeline?.creditOfShares || ''}
                    onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline!, creditOfShares: e.target.value } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Official Listing on Stock Exchange
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01 Oct 2026"
                    value={formData.timeline?.listingDate || ''}
                    onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline!, listingDate: e.target.value } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: SUBSCRIPTION */}
          {activeSection === 'subscription' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  5. Live Subscription Multipliers (x)
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Enter live subscription times (e.g. 42.5x for QIB, 15.2x for Retail).
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    QIB Multiplier (x)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 52.4"
                    value={formData.subscription?.qib ?? ''}
                    onChange={(e) => setFormData({ ...formData, subscription: { ...formData.subscription!, qib: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    NII / HNI Multiplier (x)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 28.5"
                    value={formData.subscription?.nii ?? ''}
                    onChange={(e) => setFormData({ ...formData, subscription: { ...formData.subscription!, nii: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Retail Investor Multiplier (x)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 14.8"
                    value={formData.subscription?.retail ?? ''}
                    onChange={(e) => setFormData({ ...formData, subscription: { ...formData.subscription!, retail: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Employee Quota Multiplier (x)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 2.5"
                    value={formData.subscription?.employee ?? ''}
                    onChange={(e) => setFormData({ ...formData, subscription: { ...formData.subscription!, employee: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Total Overall Subscription (x)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 25.8"
                    value={formData.subscription?.total ?? ''}
                    onChange={(e) => setFormData({ ...formData, subscription: { ...formData.subscription!, total: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: PROFILE & DOCUMENTS */}
          {activeSection === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  6. Corporate Profile, Registrar & RHP Prospectus
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Detailed company description, legal registrar allotment portal, and SEBI filing PDFs.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  About the Company & Business Operations *
                </label>
                <textarea
                  rows={4}
                  placeholder="Comprehensive description of the business model, products, manufacturing footprint, and markets..."
                  value={formData.about || ''}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Year Incorporated
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2014"
                    value={formData.yearIncorporated ?? ''}
                    onChange={(e) => setFormData({ ...formData, yearIncorporated: parseInt(e.target.value, 10) || undefined })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Registered Corporate Office Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai / Bengaluru, India"
                    value={formData.registeredOffice || ''}
                    onChange={(e) => setFormData({ ...formData, registeredOffice: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Registrar to the Offer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Link Intime India Pvt Ltd"
                    value={formData.registrar || ''}
                    onChange={(e) => setFormData({ ...formData, registrar: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Registrar Allotment Status Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkintime.co.in/initial_offer/public-issues.html"
                    value={formData.registrarUrl || ''}
                    onChange={(e) => setFormData({ ...formData, registrarUrl: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Lead Managers / Merchant Bankers (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kotak Mahindra Capital, Axis Capital, ICICI Securities"
                  value={leadManagersStr}
                  onChange={(e) => setLeadManagersStr(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Official Red Herring Prospectus (RHP) PDF Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://.../RHP.pdf"
                    value={formData.rhpUrl || ''}
                    onChange={(e) => setFormData({ ...formData, rhpUrl: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    SEBI Draft Red Herring Prospectus (DRHP) Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.sebi.gov.in/filings/public-issues.html"
                    value={formData.drhpUrl || ''}
                    onChange={(e) => setFormData({ ...formData, drhpUrl: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: QUOTAS & PROMOTERS */}
          {activeSection === 'quota' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  7. Reservation Quotas & Promoter Shareholding
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Investor quota reservations (QIB, NII, Retail) and promoter dilution percentages.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    QIB Quota (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.quotaReservation?.qibPercent ?? 50}
                    onChange={(e) => setFormData({ ...formData, quotaReservation: { ...formData.quotaReservation!, qibPercent: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    NII / HNI Quota (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.quotaReservation?.niiPercent ?? 15}
                    onChange={(e) => setFormData({ ...formData, quotaReservation: { ...formData.quotaReservation!, niiPercent: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Retail Quota (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.quotaReservation?.retailPercent ?? 35}
                    onChange={(e) => setFormData({ ...formData, quotaReservation: { ...formData.quotaReservation!, retailPercent: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Small HNI Quota (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.quotaReservation?.sHniPercent ?? 5}
                    onChange={(e) => setFormData({ ...formData, quotaReservation: { ...formData.quotaReservation!, sHniPercent: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Big HNI Quota (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.quotaReservation?.bHniPercent ?? 10}
                    onChange={(e) => setFormData({ ...formData, quotaReservation: { ...formData.quotaReservation!, bHniPercent: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Employee Discount (₹/sh)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.quotaReservation?.employeeDiscount ?? 0}
                    onChange={(e) => setFormData({ ...formData, quotaReservation: { ...formData.quotaReservation!, employeeDiscount: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Promoter Holding Pre-Issue (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.promoterHolding?.preIssuePercent ?? 85}
                    onChange={(e) => setFormData({ ...formData, promoterHolding: { ...formData.promoterHolding!, preIssuePercent: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Promoter Holding Post-Issue (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.promoterHolding?.postIssuePercent ?? 65}
                    onChange={(e) => setFormData({ ...formData, promoterHolding: { ...formData.promoterHolding!, postIssuePercent: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Promoters & Key Executive Names (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founding Directors, Family Trust, Key Promoters"
                  value={promotersStr}
                  onChange={(e) => setPromotersStr(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          )}

          {/* SECTION 8: FINANCIALS */}
          {activeSection === 'financials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  8. Financial Performance & Valuation Ratios
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Audited annual earnings, profitability margins, and balance sheet metrics.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Annual Total Revenue (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.financialHighlights?.revenueCr ?? ''}
                    onChange={(e) => setFormData({ ...formData, financialHighlights: { ...formData.financialHighlights!, revenueCr: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Profit After Tax / PAT (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.financialHighlights?.patCr ?? ''}
                    onChange={(e) => setFormData({ ...formData, financialHighlights: { ...formData.financialHighlights!, patCr: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Basic EPS (₹ / share)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.financialHighlights?.eps ?? ''}
                    onChange={(e) => setFormData({ ...formData, financialHighlights: { ...formData.financialHighlights!, eps: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Price-to-Earnings (P/E)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.financialHighlights?.peRatio ?? ''}
                    onChange={(e) => setFormData({ ...formData, financialHighlights: { ...formData.financialHighlights!, peRatio: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Return on Net Worth (RoNW %)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.financialHighlights?.ronw ?? ''}
                    onChange={(e) => setFormData({ ...formData, financialHighlights: { ...formData.financialHighlights!, ronw: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    EBITDA Margin (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.financialHighlights?.ebitdaMargin ?? ''}
                    onChange={(e) => setFormData({ ...formData, financialHighlights: { ...formData.financialHighlights!, ebitdaMargin: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    PAT Margin (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.financialHighlights?.patMargin ?? ''}
                    onChange={(e) => setFormData({ ...formData, financialHighlights: { ...formData.financialHighlights!, patMargin: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Debt to Equity Ratio
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.financialHighlights?.debtToEquity ?? ''}
                    onChange={(e) => setFormData({ ...formData, financialHighlights: { ...formData.financialHighlights!, debtToEquity: parseFloat(e.target.value) || 0 } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: INSIGHTS & RISKS */}
          {activeSection === 'insights' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  9. Prospectus Strengths, Risk Factors & Objects
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Enter each item on a separate new line.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>
                  Competitive Strengths (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Strong brand presence&#10;Integrated manufacturing capabilities&#10;Consistent dividend track record"
                  value={strengthsStr}
                  onChange={(e) => setStrengthsStr(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#991b1b', marginBottom: '6px' }}>
                  Key Risk Factors (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Customer concentration risk&#10;Foreign exchange exposure&#10;Pending regulatory proceedings"
                  value={risksStr}
                  onChange={(e) => setRisksStr(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e40af', marginBottom: '6px' }}>
                  Objects of the Issue / Utilization of Funds (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Funding capital expenditure for new facility (₹150 Cr)&#10;Debt reduction and loan repayment (₹80 Cr)&#10;General corporate purposes (₹50 Cr)"
                  value={objectsStr}
                  onChange={(e) => setObjectsStr(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* Form Action Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #e2e8f0',
            marginTop: '2rem',
            paddingTop: '1.25rem'
          }}>
            <Link
              href="/admin"
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.75rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .ipo-editor-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
