'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
  Award, 
  Search, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  Check, 
  ArrowRight, 
  CreditCard, 
  Smartphone, 
  Building2, 
  SlidersHorizontal,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: 'Brokers' | 'Credit Cards' | 'Bank Accounts' | 'Payment Apps';
  tagline: string;
  rating: number;
  ratingCount: string;
  badge?: string;
  badgeColor?: string;
  fee: string;
  amcFee?: string;
  highlights: string[];
  pros: string[];
  bestFor: string;
  link: string;
}

const SELECT_PRODUCTS: ProductItem[] = [
  // Stock Brokers
  {
    id: 'zerodha',
    name: 'Zerodha Kite',
    category: 'Brokers',
    tagline: 'Pioneer of discount broking in India with the largest active retail trading community.',
    rating: 4.8,
    ratingCount: '1.2M+ Reviews',
    badge: 'TOP BROKER',
    badgeColor: '#2563eb',
    fee: '₹200 Account Opening',
    amcFee: '₹300/year',
    highlights: [
      '₹0 Brokerage on Equity Delivery & Direct Mutual Funds',
      '₹20 or 0.03% max per executed order for Intraday & F&O',
      'Instant UPI IPO Bidding with real-time mandate tracking',
      'Console portfolio analytics & Tax-P&L statements'
    ],
    pros: ['Cleanest desktop & mobile Kite UI', 'Zero spam or sales calls', 'Massive API ecosystem (Kite Connect)'],
    bestFor: 'Active traders, IPO applicants & long-term investors',
    link: 'https://zerodha.com'
  },
  {
    id: 'groww',
    name: 'Groww Invest',
    category: 'Brokers',
    tagline: 'Simplest financial super-app for stocks, direct mutual funds, IPOs, and gold.',
    rating: 4.7,
    ratingCount: '2.5M+ Reviews',
    badge: 'ZERO AMC',
    badgeColor: '#059669',
    fee: '₹0 Free Opening',
    amcFee: '₹0 Free Lifetime',
    highlights: [
      '₹0 Account Maintenance Charges (AMC) forever',
      '₹20 or 0.05% per executed order for Equity Delivery',
      '₹20 flat for Equity Intraday and F&O derivatives',
      '1-Click Pre-apply for upcoming Mainboard and SME IPOs'
    ],
    pros: ['Extremely intuitive for beginners', 'Zero annual account fees', 'Paperless 5-minute KYC verification'],
    bestFor: 'First-time investors, IPO enthusiasts & SIP planners',
    link: 'https://groww.in'
  },
  {
    id: 'angelone',
    name: 'Angel One SuperApp',
    category: 'Brokers',
    tagline: 'Tech-driven full-service discount hybrid with advanced charting and algorithmic trading.',
    rating: 4.6,
    ratingCount: '950K+ Reviews',
    badge: 'SMART TOOLS',
    badgeColor: '#7c3aed',
    fee: '₹0 Free Opening',
    amcFee: '₹0 First Year (₹240/yr after)',
    highlights: [
      '₹0 Brokerage on Equity Delivery for life',
      'Flat ₹20 per order for Intraday, F&O, Currencies & Commodities',
      'Free ARQ Prime AI robo-advisory & research recommendations',
      'Instant high-value IPO UPI mandate approvals'
    ],
    pros: ['Free SmartAPI integration for algos', 'Extensive research advisory desk', 'Wide offline branch network'],
    bestFor: 'Derivative traders, algo programmers & research seekers',
    link: 'https://angelone.in'
  },
  {
    id: 'upstox',
    name: 'Upstox Pro',
    category: 'Brokers',
    tagline: 'Backed by Ratan Tata, engineered for serious speed, option Greeks, and TradingView charts.',
    rating: 4.5,
    ratingCount: '800K+ Reviews',
    fee: '₹0 Free Opening',
    amcFee: '₹150/year',
    highlights: [
      'Built-in Option Strategy Builder with real-time payoff graphs',
      'Flat ₹20 per trade for Intraday and F&O',
      'Advanced TradingView & ChartIQ dual integration',
      'Fast UPI mandate processing for SME & Mainboard IPOs'
    ],
    pros: ['Top-tier option analytics & Greeks', 'Ultra-fast order execution engine', 'GTT with trailing stop-loss'],
    bestFor: 'F&O traders & technical chartists',
    link: 'https://upstox.com'
  },

  // Credit Cards
  {
    id: 'sbi-cashback',
    name: 'SBI Cashback Credit Card',
    category: 'Credit Cards',
    tagline: 'The undisputed benchmark for direct online statement cashback across any merchant in India.',
    rating: 4.9,
    ratingCount: '450K+ Cardholders',
    badge: 'BEST VALUE',
    badgeColor: '#059669',
    fee: '₹999 Annual Fee',
    highlights: [
      '5% Cashback on nearly all online spends without merchant lock-in',
      '1% Cashback on all offline POS transactions',
      'Direct auto-credit of earned cashback into next billing statement',
      'Annual fee reversal on spends above ₹2,00,000 in a year'
    ],
    pros: ['No coupon codes or voucher redemption hassle', 'Widest online coverage in India', 'High monthly cap of ₹5,000 cashback'],
    bestFor: 'General online shopping & monthly household spends',
    link: 'https://www.sbicard.com'
  },
  {
    id: 'hdfc-millennia',
    name: 'HDFC Millennia Credit Card',
    category: 'Credit Cards',
    tagline: 'Tailored for millennials with guaranteed cashback on Amazon, Flipkart, Swiggy, Zomato, and Uber.',
    rating: 4.8,
    ratingCount: '600K+ Cardholders',
    fee: '₹1,000 Annual Fee',
    highlights: [
      '5% Cashback on Amazon, Flipkart, Myntra, Swiggy, Zomato & Uber',
      '1% Cashback on all other retail transactions and wallet reloads',
      '8 Complimentary domestic airport lounge visits per calendar year',
      'Annual fee waiver on annual spends of ₹1,00,000+'
    ],
    pros: ['Strong airport lounge access benefit', 'Accepted universally across India', 'Excellent HDFC SmartBuy multipliers'],
    bestFor: 'Food delivery, e-commerce & domestic travelers',
    link: 'https://www.hdfcbank.com'
  },
  {
    id: 'amazon-pay-icici',
    name: 'Amazon Pay ICICI Card',
    category: 'Credit Cards',
    tagline: 'India\'s most popular lifetime free credit card with uncapped Amazon Pay cashback.',
    rating: 4.9,
    ratingCount: '3M+ Cardholders',
    badge: 'LIFETIME FREE',
    badgeColor: '#b45309',
    fee: '₹0 Lifetime Free',
    highlights: [
      '5% Unlimited Cashback on Amazon India for Prime subscribers',
      '3% Cashback on Amazon India for non-Prime members',
      '2% Cashback on 100+ Amazon Pay partner merchants (recharges, flights, bills)',
      '1% Cashback on all other offline and online domestic spends'
    ],
    pros: ['Zero joining and zero annual fee forever', 'No cap on total cashback earned', 'Direct monthly credit to Amazon Pay balance'],
    bestFor: 'Amazon loyalists & zero-maintenance seekers',
    link: 'https://www.icicibank.com'
  },

  // Bank Accounts
  {
    id: 'kotak-811',
    name: 'Kotak 811 Super Digital Account',
    category: 'Bank Accounts',
    tagline: 'Zero-balance instant digital savings account with high interest rates and virtual debit card.',
    rating: 4.6,
    ratingCount: '500K+ Customers',
    badge: 'ZERO BALANCE',
    badgeColor: '#2563eb',
    fee: '₹0 Min Balance',
    highlights: [
      'Zero balance savings account with no penalty charges',
      'Up to 7.00% p.a. interest through Active Money auto-sweep FD',
      'Instant video KYC from home in under 10 minutes',
      'Priority Net Banking ASBA interface for high-allotment IPO bids'
    ],
    pros: ['No minimum balance maintenance pressure', 'Instant virtual debit card issuance', 'Smooth UPI & ASBA execution'],
    bestFor: 'Secondary savings, emergency funds & IPO bidding',
    link: 'https://www.kotak.com'
  },
  {
    id: 'idfc-first',
    name: 'IDFC FIRST Savings Account',
    category: 'Bank Accounts',
    tagline: 'Industry-leading monthly interest payouts with zero fee banking on 28+ routine services.',
    rating: 4.7,
    ratingCount: '350K+ Customers',
    fee: '₹10,000 / ₹25,000 AMB',
    highlights: [
      'Up to 7.25% p.a. interest credited every single month',
      'Zero fee on IMPS, NEFT, RTGS, and routine banking transactions',
      'Unlimited free ATM withdrawals across any bank in India',
      'Zero forex markup debit cards available on select variants'
    ],
    pros: ['Monthly compounding interest credit', 'Exceptional mobile banking interface', 'Dedicated relationship manager on senior tiers'],
    bestFor: 'High-yield cash parking & premium net banking',
    link: 'https://www.idfcfirstbank.com'
  },

  // Payment Apps
  {
    id: 'bhim-upi',
    name: 'BHIM UPI (NPCI)',
    category: 'Payment Apps',
    tagline: 'The official National Payments Corporation of India (NPCI) app with zero tracking and pure security.',
    rating: 4.6,
    ratingCount: '1M+ Downloads',
    badge: 'SOVEREIGN NPCI',
    badgeColor: '#059669',
    fee: '100% Free',
    highlights: [
      'Direct server communication with NPCI central UPI switch',
      'Zero advertising banners, loan spam, or data harvesting',
      'High success rate on IPO UPI mandate acceptance and approvals',
      'Support for UPI Circle delegate accounts and UPI Lite wallet'
    ],
    pros: ['Highest server uptime during peak banking hours', '100% privacy and ad-free experience', 'Instant revoke & block of suspicious mandates'],
    bestFor: 'Security-conscious investors & IPO mandate approvals',
    link: 'https://www.bhimupi.org.in'
  },
  {
    id: 'phonepe',
    name: 'PhonePe UPI',
    category: 'Payment Apps',
    tagline: 'India\'s market share leader in UPI processing with multi-bank fallback routing engines.',
    rating: 4.7,
    ratingCount: '10M+ Reviews',
    badge: 'MOST POPULAR',
    badgeColor: '#7c3aed',
    fee: '100% Free',
    highlights: [
      'Intelligent multi-bank handle routing (@ybl, @ibl, @axl)',
      'Instant notification push for ASBA IPO mandate blocks',
      'UPI Lite support for rapid pin-less payments under ₹500',
      'Comprehensive bill payment, FASTag, and insurance integrations'
    ],
    pros: ['Near-zero failed transactions with bank switch failovers', 'Instant push notifications for IPO blocks', 'Wide merchant scan QR support'],
    bestFor: 'Daily utility bills, P2P transfers & IPO mandate approvals',
    link: 'https://www.phonepe.com'
  }
];

export default function SelectPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const categories = ['All', 'Brokers', 'Credit Cards', 'Bank Accounts', 'Payment Apps'];

  const filteredProducts = SELECT_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Brokers':
        return <TrendingUp size={17} />;
      case 'Credit Cards':
        return <CreditCard size={17} />;
      case 'Bank Accounts':
        return <Building2 size={17} />;
      case 'Payment Apps':
        return <Smartphone size={17} />;
      default:
        return <Award size={17} />;
    }
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
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Select</span>
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
            FINANCIAL COMPARISONS
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
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.85rem',
              border: '1px solid #a7f3d0'
            }}>
              <Award size={14} />
              <span>Independent Financial Product Intelligence</span>
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
              marginBottom: '0.75rem'
            }}>
              Select: Compare India&apos;s Best Financial Products
            </h1>

            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              Unbiased, data-driven comparisons of top stock brokers, reward credit cards, high-yield digital bank accounts, and UPI payment apps engineered for Indian retail investors and market participants.
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
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>PRODUCTS EVALUATED</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>120+ Audited</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>COMMISSION BIAS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>0% Unbiased</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>SEBI / RBI VERIFIED</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>100% Regulated</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>BEST FOR IPO BIDDING</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>UPI 2.0 & ASBA</div>
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
          marginBottom: '1.25rem'
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
              placeholder="Search brokers, cards, banks..."
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

        {/* Results Counter & View Mode Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
            Showing <strong style={{ color: '#0f172a' }}>{filteredProducts.length}</strong> products in <strong style={{ color: '#2563eb' }}>{selectedCategory}</strong>
          </div>

          {/* Desktop Table / Card switcher */}
          <div 
            className="select-view-toggle"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '2px',
              gap: '2px'
            }}
          >
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: viewMode === 'table' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? '#eff6ff' : 'transparent',
                color: viewMode === 'table' ? '#2563eb' : '#64748b',
                transition: 'all 0.15s ease'
              }}
              title="Table View"
            >
              <TableIcon size={13} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: viewMode === 'card' ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'card' ? '#eff6ff' : 'transparent',
                color: viewMode === 'card' ? '#2563eb' : '#64748b',
                transition: 'all 0.15s ease'
              }}
              title="Card Grid View"
            >
              <LayoutGrid size={13} />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* 1. TABLE VIEW (Cards in table format) */}
        {viewMode === 'table' && (
          <div className="select-desktop-table" style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
            marginBottom: '3rem'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.82rem'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.73rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Product / Platform</th>
                    <th style={{ padding: '0.85rem 0.85rem' }}>Category</th>
                    <th style={{ padding: '0.85rem 0.85rem' }}>Rating</th>
                    <th style={{ padding: '0.85rem 0.85rem' }}>Charges &amp; Fees</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Key Highlights</th>
                    <th style={{ padding: '0.85rem 0.85rem' }}>Best For</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={`table-${product.id}`}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                    >
                      {/* Product Name, Icon & Tagline */}
                      <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top', minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: `${product.badgeColor || '#2563eb'}12`,
                            color: product.badgeColor || '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}>
                            {getCategoryIcon(product.category)}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                                {product.name}
                              </span>
                              {product.badge && (
                                <span style={{
                                  fontSize: '0.6rem',
                                  fontWeight: 800,
                                  padding: '1px 5px',
                                  borderRadius: '4px',
                                  backgroundColor: `${product.badgeColor || '#2563eb'}15`,
                                  color: product.badgeColor || '#2563eb',
                                  border: `1px solid ${product.badgeColor || '#2563eb'}30`,
                                  whiteSpace: 'nowrap'
                                }}>
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px', lineHeight: 1.4 }}>
                              {product.tagline}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Pill */}
                      <td style={{ padding: '0.85rem 0.85rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #e2e8f0'
                        }}>
                          {product.category}
                        </span>
                      </td>

                      {/* Rating */}
                      <td style={{ padding: '0.85rem 0.85rem', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Star size={13} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.86rem' }}>{product.rating}</span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                          {product.ratingCount}
                        </div>
                      </td>

                      {/* Charges & Fees */}
                      <td style={{ padding: '0.85rem 0.85rem', verticalAlign: 'top', minWidth: '140px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                          {product.fee}
                        </div>
                        {product.amcFee && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                            AMC: {product.amcFee}
                          </div>
                        )}
                      </td>

                      {/* Highlights */}
                      <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top', minWidth: '260px' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {product.highlights.slice(0, 3).map((h, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '0.75rem', color: '#334155', lineHeight: 1.35 }}>
                              <Check size={12} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Best For */}
                      <td style={{ padding: '0.85rem 0.85rem', verticalAlign: 'top', minWidth: '150px' }}>
                        <div style={{
                          fontSize: '0.74rem',
                          color: '#475569',
                          lineHeight: 1.4,
                          backgroundColor: '#f8fafc',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #f1f5f9'
                        }}>
                          {product.bestFor}
                        </div>
                      </td>

                      {/* Action CTA */}
                      <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '6px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          <span>Explore</span>
                          <ExternalLink size={11} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. CARD VIEW (Rendered when toggled to card or as fallback) */}
        {viewMode === 'card' && (
          <div 
            className="select-card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3rem'
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={`grid-${product.id}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.35rem',
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
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {product.name}
                        </h3>
                        {product.badge && (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: `${product.badgeColor || '#2563eb'}15`,
                            color: product.badgeColor || '#2563eb',
                            border: `1px solid ${product.badgeColor || '#2563eb'}40`
                          }}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                          <Star size={13} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{product.rating}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>({product.ratingCount})</span>
                        <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>•</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{product.category}</span>
                      </div>
                    </div>

                    <div style={{
                      textAlign: 'right',
                      backgroundColor: '#f8fafc',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '0.66rem', color: '#64748b' }}>Charges</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{product.fee}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, marginBottom: '1rem' }}>
                    {product.tagline}
                  </p>

                  {/* Highlights List */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
                      Key Advantages
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {product.highlights.map((h, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78rem', color: '#334155' }}>
                          <Check size={13} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#0f172a' }}>Best Suited For:</strong> {product.bestFor}
                  </div>
                </div>

                {/* Action Link */}
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      padding: '0.45rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Explore Details</span>
                    <ExternalLink size={12} />
                  </a>

                  {product.amcFee && (
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      AMC: <strong style={{ color: '#0f172a' }}>{product.amcFee}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. MOBILE CARDS VIEW (Clean responsive card layout for small screens <= 768px) */}
        <div className="select-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '0.85rem', marginBottom: '3rem' }}>
          {filteredProducts.map((product) => (
            <div
              key={`mobile-${product.id}`}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.1rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: `${product.badgeColor || '#2563eb'}15`,
                    color: product.badgeColor || '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getCategoryIcon(product.category)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                        {product.name}
                      </span>
                      {product.badge && (
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          backgroundColor: `${product.badgeColor || '#2563eb'}15`,
                          color: product.badgeColor || '#2563eb',
                          border: `1px solid ${product.badgeColor || '#2563eb'}30`
                        }}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{product.category}</span>
                      <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>•</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    flexShrink: 0
                  }}
                >
                  <span>Explore</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              {/* Tagline */}
              <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                {product.tagline}
              </div>

              {/* Fee & Best For Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
                borderRadius: '8px',
                padding: '0.65rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Fees / Charges</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginTop: '1px' }}>
                    {product.fee}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Annual AMC</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', marginTop: '1px' }}>
                    {product.amcFee || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Top 2 Highlights */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {product.highlights.slice(0, 2).map((h, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '0.75rem', color: '#334155' }}>
                    <Check size={12} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Side-by-Side Broker Comparison Matrix */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <SlidersHorizontal size={20} color="#2563eb" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Top Stock Brokers Comparison Matrix
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Quick reference matrix comparing upfront account opening, delivery charges, intraday execution costs, and IPO support.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>Broker Name</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>Delivery Brokerage</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>Intraday / F&amp;O</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>Account Opening</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>Annual AMC</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>IPO Pre-Apply</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#2563eb' }}>Zerodha (Kite)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>₹0 (Free)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹20 / order</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹200</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹300/yr</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>Supported</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#fcfcfd' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#059669' }}>Groww</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹20 or 0.05%</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹20 / order</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>₹0 (Free)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>₹0 Lifetime</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>Supported</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#7c3aed' }}>Angel One</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>₹0 (Free)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹20 / order</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>₹0 (Free)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹0 1st Yr (₹240)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>Supported</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#fcfcfd' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0284c7' }}>Upstox Pro</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹20 or 2.5%</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹20 / order</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>₹0 (Free)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹150/yr</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 600 }}>Supported</td>
                </tr>
              </tbody>
            </table>
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
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>READY TO INVEST?</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              Use Your Demat Account to Bid on Active IPOs
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
              Discover real-time GMP, analyst buy/avoid recommendations, and registrar allotment status on 50+ issues.
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

      <style jsx>{`
        @media (max-width: 768px) {
          .select-desktop-table {
            display: none !important;
          }
          .select-mobile-cards {
            display: flex !important;
          }
          .select-view-toggle {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .select-mobile-cards {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
