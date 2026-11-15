'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
  Search, 
  ChevronRight, 
  Star, 
  ExternalLink,
  TrendingUp,
  CreditCard,
  Building2,
  Smartphone,
  Layers
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: 'Brokers' | 'Credit Cards' | 'Bank Accounts' | 'Payment Apps';
  categoryLabel: string;
  rating: number;
  highlight: string;
  fee: string;
  badge?: string;
  badgeColor?: string;
  link: string;
}

const SELECT_PRODUCTS: ProductItem[] = [
  // Brokers
  {
    id: 'zerodha',
    name: 'Zerodha',
    category: 'Brokers',
    categoryLabel: 'Broker',
    rating: 4.8,
    highlight: '₹0 Equity Delivery • ₹20 Intraday & F&O',
    fee: '₹200 Open | ₹300/yr AMC',
    badge: 'Popular',
    badgeColor: '#2563eb',
    link: 'https://zerodha.com'
  },
  {
    id: 'groww',
    name: 'Groww',
    category: 'Brokers',
    categoryLabel: 'Broker',
    rating: 4.7,
    highlight: 'Zero AMC for Life • 1-Click IPO Pre-Apply',
    fee: '₹0 Free Opening & AMC',
    badge: 'Zero AMC',
    badgeColor: '#059669',
    link: 'https://groww.in'
  },
  {
    id: 'angelone',
    name: 'Angel One',
    category: 'Brokers',
    categoryLabel: 'Broker',
    rating: 4.6,
    highlight: 'Free SmartAPI Algos • ₹0 Delivery for Life',
    fee: '₹0 Free Opening',
    badge: 'SmartAPI',
    badgeColor: '#7c3aed',
    link: 'https://angelone.in'
  },
  {
    id: 'upstox',
    name: 'Upstox',
    category: 'Brokers',
    categoryLabel: 'Broker',
    rating: 4.5,
    highlight: 'Built-in Option Greeks & Strategy Builder',
    fee: '₹0 Free Opening | ₹150 AMC',
    link: 'https://upstox.com'
  },

  // Credit Cards
  {
    id: 'sbi-cashback',
    name: 'SBI Cashback Card',
    category: 'Credit Cards',
    categoryLabel: 'Credit Card',
    rating: 4.9,
    highlight: 'Flat 5% Cashback on All Online Spends',
    fee: '₹999/yr (Waived on ₹2L)',
    badge: 'Top Pick',
    badgeColor: '#059669',
    link: 'https://www.sbicard.com'
  },
  {
    id: 'amazon-pay-icici',
    name: 'Amazon Pay ICICI',
    category: 'Credit Cards',
    categoryLabel: 'Credit Card',
    rating: 4.9,
    highlight: 'Unlimited 5% Amazon Cashback • No Upper Cap',
    fee: '₹0 Lifetime Free',
    badge: 'Free',
    badgeColor: '#b45309',
    link: 'https://www.icicibank.com'
  },
  {
    id: 'hdfc-millennia',
    name: 'HDFC Millennia',
    category: 'Credit Cards',
    categoryLabel: 'Credit Card',
    rating: 4.8,
    highlight: '5% Cashback on Amazon, Swiggy, Zomato + Lounges',
    fee: '₹1,000/yr',
    link: 'https://www.hdfcbank.com'
  },

  // Bank Accounts
  {
    id: 'kotak-811',
    name: 'Kotak 811',
    category: 'Bank Accounts',
    categoryLabel: 'Savings',
    rating: 4.6,
    highlight: 'Zero Balance Digital Account • Up to 7% Interest',
    fee: '₹0 Min Balance',
    badge: 'Zero Bal',
    badgeColor: '#2563eb',
    link: 'https://www.kotak.com'
  },
  {
    id: 'idfc-first',
    name: 'IDFC FIRST Bank',
    category: 'Bank Accounts',
    categoryLabel: 'Savings',
    rating: 4.7,
    highlight: 'Monthly Interest Payouts • Up to 7.25% p.a.',
    fee: 'Zero Fee Banking',
    link: 'https://www.idfcfirstbank.com'
  },

  // Payment Apps
  {
    id: 'bhim-upi',
    name: 'BHIM UPI',
    category: 'Payment Apps',
    categoryLabel: 'UPI App',
    rating: 4.6,
    highlight: 'Official Sovereign NPCI • 100% Ad-Free • Best for IPOs',
    fee: '100% Free',
    badge: 'NPCI',
    badgeColor: '#059669',
    link: 'https://www.bhimupi.org.in'
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    category: 'Payment Apps',
    categoryLabel: 'UPI App',
    rating: 4.7,
    highlight: 'Fast Multi-Bank UPI Routing & Instant Mandates',
    fee: '100% Free',
    link: 'https://www.phonepe.com'
  }
];

export default function SelectPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Brokers', 'Credit Cards', 'Bank Accounts', 'Payment Apps'];

  const filteredProducts = SELECT_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Brokers':
        return <TrendingUp size={16} />;
      case 'Credit Cards':
        return <CreditCard size={16} />;
      case 'Bank Accounts':
        return <Building2 size={16} />;
      case 'Payment Apps':
        return <Smartphone size={16} />;
      default:
        return <Layers size={16} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '1.25rem', paddingBottom: '3rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          color: '#64748b',
          marginBottom: '1rem'
        }}>
          <Link href="/" style={{ color: '#387ed1', textDecoration: 'none', fontWeight: 600 }}>
            Home
          </Link>
          <ChevronRight size={13} />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Select</span>
        </div>

        {/* Clean Minimal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: 0
            }}>
              Select Financial Products
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0 0' }}>
              Compare verified stock brokers, credit cards, bank accounts, and UPI payment apps.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px', maxWidth: '100%' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.42rem 0.85rem 0.42rem 2rem',
                fontSize: '0.82rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1rem',
          WebkitOverflowScrolling: 'touch'
        }}>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.38rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  border: active ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: active ? '#2563eb' : '#ffffff',
                  color: active ? '#ffffff' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.12s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 1. Desktop & Tablet Clean Table */}
        <div className="select-desktop-table" style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.84rem'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                color: '#64748b',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                <th style={{ padding: '0.75rem 0.85rem' }}>Key Highlight</th>
                <th style={{ padding: '0.75rem 0.85rem' }}>Charges &amp; Fees</th>
                <th style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>Rating</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No products found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    {/* 1. Product Name & Category */}
                    <td style={{ padding: '0.7rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: `${p.badgeColor || '#2563eb'}12`,
                          color: p.badgeColor || '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {getCategoryIcon(p.category)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                              {p.name}
                            </span>
                            {p.badge && (
                              <span style={{
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                padding: '1px 5px',
                                borderRadius: '4px',
                                backgroundColor: `${p.badgeColor || '#2563eb'}15`,
                                color: p.badgeColor || '#2563eb',
                                border: `1px solid ${p.badgeColor || '#2563eb'}30`,
                                whiteSpace: 'nowrap'
                              }}>
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {p.categoryLabel}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Key Highlight */}
                    <td style={{ padding: '0.7rem 0.85rem', color: '#334155', fontWeight: 500 }}>
                      {p.highlight}
                    </td>

                    {/* 3. Charges & Fees */}
                    <td style={{ padding: '0.7rem 0.85rem', color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {p.fee}
                    </td>

                    {/* 4. Rating */}
                    <td style={{ padding: '0.7rem 0.85rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem' }}>{p.rating}</span>
                      </div>
                    </td>

                    {/* 5. Action */}
                    <td style={{ padding: '0.7rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <span>Visit</span>
                        <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 2. Mobile Clean Cards (Screens <= 768px) */}
        <div className="select-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              No products found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={`mob-${p.id}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
                }}
              >
                {/* Top line: Icon, Name, Rating, Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: `${p.badgeColor || '#2563eb'}12`,
                      color: p.badgeColor || '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getCategoryIcon(p.category)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </span>
                        {p.badge && (
                          <span style={{
                            fontSize: '0.58rem',
                            fontWeight: 700,
                            padding: '1px 4px',
                            borderRadius: '3px',
                            backgroundColor: `${p.badgeColor || '#2563eb'}15`,
                            color: p.badgeColor || '#2563eb'
                          }}>
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {p.categoryLabel} • ★ {p.rating}
                      </div>
                    </div>
                  </div>

                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      flexShrink: 0
                    }}
                  >
                    <span>Visit</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                {/* Bottom line: Highlight & Fee */}
                <div style={{
                  fontSize: '0.76rem',
                  color: '#475569',
                  backgroundColor: '#f8fafc',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  <span style={{ fontWeight: 500 }}>{p.highlight}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{p.fee}</span>
                </div>
              </div>
            ))
          )}
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
