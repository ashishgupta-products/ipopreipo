'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
  Building2, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Coins, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface PreIpoCompany {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  category: 'Infrastructure' | 'Fintech & NBFC' | 'Consumer & Retail' | 'Tech & Health';
  estPrice: string;
  valuation: string;
  minLot: number;
  isin: string;
  drhpStatus: string;
  drhpBadgeColor: string;
  badgeColor: string;
  description: string;
  keyMetric: string;
  keyMetricLabel: string;
}

const PRE_IPO_DATA: PreIpoCompany[] = [
  {
    id: 'nse',
    name: 'National Stock Exchange (NSE)',
    symbol: 'NSE',
    sector: 'Financial Market Infrastructure',
    category: 'Infrastructure',
    estPrice: '₹6,450',
    valuation: '₹3,22,500 Cr',
    minLot: 25,
    isin: 'INE747B01016',
    drhpStatus: 'SEBI Clearance Pending',
    drhpBadgeColor: '#0284c7',
    badgeColor: '#0284c7',
    description: 'India\'s largest exchange operator by equity volume and global leader in derivative contracts.',
    keyMetric: '₹8,350 Cr',
    keyMetricLabel: 'Annual PAT'
  },
  {
    id: 'tata-capital',
    name: 'Tata Capital Limited',
    symbol: 'TATACAP',
    sector: 'Diversified NBFC & Lending',
    category: 'Fintech & NBFC',
    estPrice: '₹1,090',
    valuation: '₹94,000 Cr',
    minLot: 50,
    isin: 'INE306N01010',
    drhpStatus: 'Mandatory RBI Listing 2026',
    drhpBadgeColor: '#2563eb',
    badgeColor: '#2563eb',
    description: 'Flagship financial services arm of the Tata Group with expansive corporate and retail credit franchise.',
    keyMetric: '₹1,58,000 Cr',
    keyMetricLabel: 'Total AUM'
  },
  {
    id: 'reliance-retail',
    name: 'Reliance Retail Ventures Ltd',
    symbol: 'RELRETAIL',
    sector: 'Omnichannel Retail & E-Commerce',
    category: 'Consumer & Retail',
    estPrice: '₹2,550',
    valuation: '₹8,50,000 Cr',
    minLot: 20,
    isin: 'INE712P01014',
    drhpStatus: 'Pre-IPO Restructuring',
    drhpBadgeColor: '#059669',
    badgeColor: '#059669',
    description: 'India\'s largest retailer operating over 18,000 physical stores across grocery, electronics, and fashion.',
    keyMetric: '₹3,06,000 Cr',
    keyMetricLabel: 'Gross Revenue'
  },
  {
    id: 'hdb-financial',
    name: 'HDB Financial Services',
    symbol: 'HDBFS',
    sector: 'Retail Lending & Vehicle Finance',
    category: 'Fintech & NBFC',
    estPrice: '₹835',
    valuation: '₹66,000 Cr',
    minLot: 100,
    isin: 'INE756I01014',
    drhpStatus: 'HDFC Bank Board Approved',
    drhpBadgeColor: '#7c3aed',
    badgeColor: '#7c3aed',
    description: 'Non-banking finance subsidiary of HDFC Bank specializing in secured loans and consumer durables.',
    keyMetric: '₹90,000 Cr',
    keyMetricLabel: 'Loan Book'
  },
  {
    id: 'boat-imagine',
    name: 'boAt (Imagine Marketing Ltd)',
    symbol: 'BOAT',
    sector: 'Consumer Electronics & Audio',
    category: 'Consumer & Retail',
    estPrice: '₹920',
    valuation: '₹11,500 Cr',
    minLot: 50,
    isin: 'INE025D01017',
    drhpStatus: 'Refiling Draft Prospectus',
    drhpBadgeColor: '#dc2626',
    badgeColor: '#dc2626',
    description: 'Market leader in hearables and wearable tech with strong domestic manufacturing presence.',
    keyMetric: '32% Share',
    keyMetricLabel: 'India Market Share'
  },
  {
    id: 'zepto',
    name: 'Zepto (KiranaKart Technologies)',
    symbol: 'ZEPTO',
    sector: 'Quick Commerce & Hyperlocal',
    category: 'Consumer & Retail',
    estPrice: '₹420',
    valuation: '₹42,000 Cr',
    minLot: 100,
    isin: 'INE01KZ01018',
    drhpStatus: 'HQ Domiciled to India',
    drhpBadgeColor: '#d97706',
    badgeColor: '#d97706',
    description: 'Fastest-growing quick commerce pioneer delivering groceries and everyday essentials in under 10 minutes.',
    keyMetric: '₹10,000 Cr+',
    keyMetricLabel: 'Annualized GMV'
  },
  {
    id: 'flipkart',
    name: 'Flipkart Online Services',
    symbol: 'FLIPKART',
    sector: 'E-Commerce Marketplace',
    category: 'Consumer & Retail',
    estPrice: '₹1,850',
    valuation: '₹2,80,000 Cr',
    minLot: 30,
    isin: 'INE824F01012',
    drhpStatus: 'Reverse Flip in Progress',
    drhpBadgeColor: '#0284c7',
    badgeColor: '#0284c7',
    description: 'Walmart-backed digital commerce powerhouse commanding leading market share in Indian online shopping.',
    keyMetric: '500M+ Users',
    keyMetricLabel: 'Registered Base'
  },
  {
    id: 'pharmeasy',
    name: 'API Holdings (PharmEasy)',
    symbol: 'PHARMEASY',
    sector: 'Digital Healthcare & Telemedicine',
    category: 'Tech & Health',
    estPrice: '₹12.40',
    valuation: '₹8,400 Cr',
    minLot: 2000,
    isin: 'INE04Q001010',
    drhpStatus: 'Rights Issue Turnaround',
    drhpBadgeColor: '#ea580c',
    badgeColor: '#ea580c',
    description: 'Integrated digital healthcare platform providing online pharmacy, diagnostic tests, and teleconsultations.',
    keyMetric: '₹6,000 Cr',
    keyMetricLabel: 'GMV Managed'
  }
];

export default function PreIpoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedCompanyAlert, setSelectedCompanyAlert] = useState<string>('NSE');

  const categories = ['All', 'Infrastructure', 'Fintech & NBFC', 'Consumer & Retail', 'Tech & Health'];

  const filteredCompanies = PRE_IPO_DATA.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.isin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '1.75rem', paddingBottom: '3.5rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: '#64748b',
          marginBottom: '1.5rem'
        }}>
          <Link href="/" style={{ color: '#387ed1', textDecoration: 'none', fontWeight: 600 }}>
            Home
          </Link>
          <ChevronRight size={13} />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Pre-IPO & Unlisted Shares</span>
          <ChevronRight size={13} />
          <span style={{
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 700,
            border: '1px solid #bfdbfe'
          }}>
            PRIVATE EQUITIES
          </span>
        </div>

        {/* Hero Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2.25rem 2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 126, 209, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.85rem',
              border: '1px solid #bfdbfe'
            }}>
              <Sparkles size={14} />
              <span>Institutional Pre-IPO Discovery</span>
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
              marginBottom: '0.75rem'
            }}>
              Pre-IPO & Unlisted Equities Terminal
            </h1>

            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              Track private valuations, indicative unlisted share prices, ISIN demat codes, and SEBI DRHP filing progress for India&apos;s highest-profile tech unicorns and late-stage enterprises before they hit the public bourses.
            </p>

            {/* Quick Metrics Ticker */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1rem 1.25rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>COMPANIES MONITORED</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>50+ Late-Stage</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>CUMULATIVE VALUATION</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>₹18,50,000 Cr+</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>SETTLEMENT ROUTE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>CDSL / NSDL Demat</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>SEBI PRE-IPO LOCK-IN</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>6 Months Post-Listing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: active ? '1px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: active ? '#2563eb' : '#ffffff',
                    color: active ? '#ffffff' : '#475569'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by company or ISIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 1rem 0.45rem 2.1rem',
                fontSize: '0.82rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
        </div>

        {/* Unlisted Companies Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}>
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: `${company.badgeColor}15`,
                      color: company.badgeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.88rem'
                    }}>
                      {company.symbol.slice(0, 4)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                        {company.name}
                      </h3>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        {company.sector}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '3px 7px',
                    borderRadius: '4px',
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                    whiteSpace: 'nowrap'
                  }}>
                    {company.category}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45, marginBottom: '1rem' }}>
                  {company.description}
                </p>

                {/* Metrics Box */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.65rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '0.85rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Est. Unlisted Share</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {company.estPrice}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Private Valuation</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb' }}>
                      {company.valuation}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{company.keyMetricLabel}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {company.keyMetric}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Minimum Lot</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
                      {company.minLot} shares
                    </div>
                  </div>
                </div>

                {/* ISIN & Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Demat ISIN:</span>
                    <span style={{ fontFamily: 'monospace', color: '#0f172a', fontWeight: 600 }}>{company.isin}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>DRHP Stage:</span>
                    <span style={{ color: company.drhpBadgeColor, fontWeight: 700 }}>{company.drhpStatus}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div style={{
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <button
                  onClick={() => {
                    setSelectedCompanyAlert(company.symbol);
                    const el = document.getElementById('waitlist-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={12} />
                  <span>Notify Listing</span>
                </button>

                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={11} />
                  <span>Unlisted</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Early Access Alert Section */}
        <div 
          id="waitlist-section"
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            marginBottom: '3rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem'
          }}
        >
          <div style={{ maxWidth: '580px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(56, 126, 209, 0.25)',
              color: '#60a5fa',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}>
              <CheckCircle2 size={13} />
              <span>Instant DRHP & Filing Intelligence</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.65rem' }}>
              Get Instant Alerts When DRHP Is Filed
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.55 }}>
              Receive immediate push notifications when companies like {selectedCompanyAlert || 'NSE'}, boAt, or Tata Capital submit their Draft Red Herring Prospectus to SEBI, including official price band announcements and anchor allocations.
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: '380px' }}>
            {subscribed ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: '10px',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>You&apos;re on the priority list!</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                  We will notify you immediately once official filing documents are published.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Subscribe for DRHP Alerts</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Regulatory & Mechanics Guide */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            Key Rules & Regulatory Guidelines for Pre-IPO Equities
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}>
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <Clock size={18} color="#b45309" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Mandatory 6-Month Lock-In
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Under revised SEBI ICDR regulations, pre-IPO shares held by non-promoters are locked in for a period of 6 months from the date of official exchange listing.
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <ShieldCheck size={18} color="#059669" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Demat-Only Credit
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Unlisted shares must be held directly in your CDSL or NSDL demat account via valid ISIN. Physical certificate transfers are prohibited for public transactions.
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <Coins size={18} color="#2563eb" />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Capital Gains Taxation
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Holding period for long-term capital gains on unlisted equities is 24 months, taxed at 12.5% without indexation under Finance Act 2024 revisions.
              </p>
            </div>
          </div>
        </div>

        {/* Cross Promotion Call to Action: Explore Live IPOs */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="pulse-indicator" style={{ backgroundColor: '#10b981' }}></span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>ACTIVE MARKET ISSUES</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              Looking for Active IPOs & Real-Time GMP?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
              Track 50+ Mainboard & SME public issues with live grey market premiums and subscription updates.
            </p>
          </div>

          <Link
            href="/"
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '0.65rem 1.35rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>Explore Active IPOs</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
