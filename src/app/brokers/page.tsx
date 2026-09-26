import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Top Stock Brokers in India for IPO & Trading (2026) | Zerodha, Groww, Angel One',
  description: 'Compare best Indian stock brokers for IPO application via UPI ASBA, brokerage charges, Demat AMC fees, mobile apps, and trading platforms.',
};

import { BROKERS_DATA } from '../../data/brokersData';

export default function BrokersPage() {
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
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              padding: '3px 10px',
              borderRadius: '4px',
              border: '1px solid #bfdbfe'
            }}>
              INDIAN STOCK BROKERS COMPARISON
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Updated 2026</span>
          </div>

          <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Top Stock Brokers in India for IPOs & Trading
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '800px', lineHeight: '1.6' }}>
            Compare brokerage rates, Demat AMC charges, account opening fees, and UPI ASBA mandate reliability across India’s leading SEBI-registered stockbrokers.
          </p>
        </div>

        {/* Quick Highlights Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Zap size={18} color="#059669" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Instant UPI IPO Bidding</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5' }}>
              All listed brokers support SEBI UPI 2.0 ASBA mandates. Retail investors can apply up to ₹5 Lakhs per application.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={18} color="#2563eb" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>CDSL & NSDL Security</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5' }}>
              Your shares are stored directly with national depositories (CDSL or NSDL), guaranteeing complete safety even if a broker faces downtime.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Award size={18} color="#d97706" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Zero Delivery Brokerage</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5' }}>
              Leading discount brokers like Zerodha and Dhan charge ₹0 on long-term equity delivery holdings and IPO allotments.
            </p>
          </div>
        </div>

        {/* Brokers Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {BROKERS_DATA.map((broker) => (
            <div
              key={broker.id}
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
                      <Link href={`/brokers/${broker.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {broker.name}
                      </Link>
                    </h2>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: broker.category === 'Discount' ? '#059669' : '#2563eb',
                      backgroundColor: broker.category === 'Discount' ? '#ecfdf5' : '#eff6ff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: broker.category === 'Discount' ? '1px solid #a7f3d0' : '1px solid #bfdbfe'
                    }}>
                      {broker.category} Broker
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>
                      <Star size={14} fill="#d97706" />
                      <span>{broker.rating}</span>
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '650px' }}>
                    {broker.tagline}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href={`/brokers/${broker.id}`}
                    className="btn-secondary"
                    style={{ padding: '0.55rem 1rem', fontSize: '0.825rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>View Review & Charges</span>
                    <ChevronRight size={14} />
                  </Link>

                  <a
                    href={broker.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.825rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>Open Account</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
                gap: '0.85rem',
                backgroundColor: '#f8fafc',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Active Clients</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{broker.activeClients}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Equity Delivery</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{broker.equityDelivery}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Intraday & F&O</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{broker.intradayFo}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Demat AMC</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{broker.amc}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>IPO Mandate Success</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{broker.ipoUpiRating}</div>
                </div>
              </div>

              {/* Highlights & Best For */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {broker.highlights.map((h, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#334155' }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Best For: <strong style={{ color: '#0f172a' }}>{broker.bestFor}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Helpful Tips Section */}
        <div className="glass-panel" style={{ padding: '1.75rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} />
            <span>How to Apply for Indian IPOs via Your Broker</span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#1e3a8a', lineHeight: '1.6', marginBottom: '1rem' }}>
            Under SEBI guidelines, all retail investors (bidding up to ₹5,00,000) apply for IPOs using UPI ASBA. You simply enter your Demat account, choose your bid lots at cut-off price, and submit your UPI ID (from PhonePe, Google Pay, or BHIM). Once you approve the mandate on your payment app, funds remain safely in your bank account until allotment.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
              Explore Live IPOs
            </Link>
            <Link href="/pre-ipo" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', textDecoration: 'none', backgroundColor: '#ffffff' }}>
              Explore Pre-IPO Shares
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
