import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  CreditCard, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  Award,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Best Credit Cards in India (2026) | Cashback, UPI RuPay & Reward Cards',
  description: 'Compare best Indian credit cards for online shopping cashback, UPI payments on RuPay, airport lounge access, and lifetime free options.',
};

import { CREDIT_CARDS_DATA } from '../../data/creditCardsData';

export default function CreditCardsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#8b5cf6',
              backgroundColor: '#f5f3ff',
              padding: '3px 10px',
              borderRadius: '4px',
              border: '1px solid #ddd6fe'
            }}>
              INDIAN CREDIT CARDS COMPARISON
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Updated 2026</span>
          </div>

          <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Top Credit Cards in India: Cashback, RuPay UPI & Travel
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '800px', lineHeight: '1.6' }}>
            Maximize your wealth with India’s highest rewarding credit cards. Compare joining fees, annual waivers, RuPay UPI linkability, and airport lounge privileges.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Zap size={18} color="#059669" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Top Cashback Rate</span>
            </div>
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>5% Flat</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Direct statement credit without expiry</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <CreditCard size={18} color="#8b5cf6" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>RuPay on UPI</span>
            </div>
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>1.5% Rewards</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Scan merchant QR codes directly with credit card</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={18} color="#d97706" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Zero Cost Options</span>
            </div>
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>Lifetime Free</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Amazon Pay ICICI with no annual fee</p>
          </div>
        </div>

        {/* Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {CREDIT_CARDS_DATA.map((card) => (
            <div
              key={card.id}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                transition: 'box-shadow 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                      <Link href={`/credit-cards/${card.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {card.name}
                      </Link>
                    </h2>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#8b5cf6',
                      backgroundColor: '#f5f3ff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd6fe'
                    }}>
                      {card.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      {card.network}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Issued by {card.bank}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href={`/credit-cards/${card.id}`}
                    className="btn-secondary"
                    style={{ padding: '0.55rem 1rem', fontSize: '0.825rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>View Rewards & Eligibility</span>
                    <ChevronRight size={14} />
                  </Link>

                  <a
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.825rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#8b5cf6' }}
                  >
                    <span>Apply Now</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
                gap: '0.85rem',
                backgroundColor: '#f8fafc',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Reward Rate</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{card.rewardRate}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Joining Fee</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{card.joiningFee}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Annual Maintenance</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{card.annualFee.split('(')[0]}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Airport Lounge Access</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{card.loungeAccess}</div>
                </div>
              </div>

              {/* Highlights & Best For */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {card.highlights.map((h, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#334155' }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Best For: <strong style={{ color: '#0f172a' }}>{card.bestFor}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Helpful Tips Section */}
        <div className="glass-panel" style={{ padding: '1.75rem', backgroundColor: '#fdf4ff', border: '1px solid #f5d0fe', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#86198f', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} />
            <span>Smart Tip: RuPay Credit Cards on UPI</span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#701a75', lineHeight: '1.6', marginBottom: '1rem' }}>
            Cards issued on the RuPay network (like Tata Neu Infinity) can be directly linked to PhonePe, Google Pay, or Paytm. You can scan any merchant QR code and pay directly from your credit card without using bank savings, getting up to 50 days of interest-free credit and reward points on UPI transactions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/payment-apps" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
              Compare UPI Payment Apps &rarr;
            </Link>
            <Link href="/" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', textDecoration: 'none', backgroundColor: '#ffffff' }}>
              Explore Live IPOs
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
