import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Smartphone, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  Award,
  QrCode,
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Best UPI Payment Apps in India (2026) | PhonePe, Google Pay, BHIM, Paytm for IPOs',
  description: 'Compare top Indian UPI payment apps for instant IPO mandate approvals, UPI 2.0 ASBA limits, transaction success rates, and RuPay credit card on UPI.',
};

import { PAYMENT_APPS_DATA } from '../../data/paymentAppsData';

export default function PaymentAppsPage() {
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
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '3px 10px',
              borderRadius: '4px',
              border: '1px solid #a7f3d0'
            }}>
              INDIAN PAYMENT APPS & UPI TERMINAL
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>NPCI Verified 2026</span>
          </div>

          <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Top UPI Payment Apps in India
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '800px', lineHeight: '1.6' }}>
            Compare India’s leading UPI apps by IPO mandate approval speed, transaction success rates, RuPay credit card integration, and daily transfer limits.
          </p>
        </div>

        {/* NPCI Stats Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Zap size={18} color="#059669" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>IPO UPI Limit</span>
            </div>
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>₹5,00,000</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Per application via NPCI/SEBI UPI 2.0</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <ShieldCheck size={18} color="#2563eb" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>ASBA Fund Protection</span>
            </div>
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>100% Safe</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Money remains in your account earning interest</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <QrCode size={18} color="#d97706" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Credit Card on UPI</span>
            </div>
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>RuPay Linked</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Scan & pay using credit line anywhere</p>
          </div>
        </div>

        {/* Apps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {PAYMENT_APPS_DATA.map((app) => (
            <div
              key={app.id}
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
                      <Link href={`/payment-apps/${app.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {app.name}
                      </Link>
                    </h2>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#059669',
                      backgroundColor: '#ecfdf5',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid #a7f3d0'
                    }}>
                      {app.marketShare}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>
                      <Star size={14} fill="#d97706" />
                      <span>{app.rating}</span>
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    By {app.developer}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href={`/payment-apps/${app.id}`}
                    className="btn-primary"
                    style={{ padding: '0.55rem 1rem', fontSize: '0.825rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>View Mandate Guide & Specs</span>
                    <ChevronRight size={14} />
                  </Link>

                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.825rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>Visit App Portal</span>
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
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>IPO Mandate Success</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{app.ipoMandateSuccess}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Max UPI Bidding Limit</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{app.upiLimit.split('/')[0]}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>RuPay Credit on UPI</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: app.rupayCcSupport ? '#2563eb' : '#94a3b8', marginTop: '2px' }}>
                    {app.rupayCcSupport ? '✓ Supported' : '✕ Not Supported'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>UPI Lite (No PIN)</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: app.upiLiteSupport ? '#059669' : '#94a3b8', marginTop: '2px' }}>
                    {app.upiLiteSupport ? '✓ Up to ₹500' : '✕ Not Available'}
                  </div>
                </div>
              </div>

              {/* Highlights & Best For */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {app.highlights.map((h, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#334155' }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Best For: <strong style={{ color: '#0f172a' }}>{app.bestFor}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tip Box */}
        <div className="glass-panel" style={{ padding: '1.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} />
            <span>Pro Tip: Approving IPO Mandates Promptly</span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#15803d', lineHeight: '1.6', marginBottom: '1rem' }}>
            When you submit an IPO bid on your broker, the registrar initiates a UPI mandate request sent directly to your payment app. Mandates must be approved before 5:00 PM on the issue closing day. Apps like PhonePe and BHIM offer the highest delivery rate and direct SMS push notifications.
          </p>
          <Link href="/" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
            Check Live IPOs Open Now &rarr;
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
