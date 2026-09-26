'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      padding: '3.5rem 0 2rem 0',
      marginTop: '5rem',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1: Brand & Purpose */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #387ed1 0%, #00b386 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TrendingUp size={18} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
                IPO <span style={{ color: '#387ed1' }}>&</span> PreIPO India
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
              India’s premier intelligence terminal for Mainboard & SME Initial Public Offerings (IPOs), real-time Grey Market Premiums (GMP), and Unlisted / Pre-IPO equity opportunities.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>SEBI Compliant Research & Data Aggregator</span>
            </div>
          </div>

          {/* Col 2: Major Official Registrars */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Allotment Registrars
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#475569' }}>
              <li>
                <a href="https://linkintime.co.in/initial_offer/public-issues.html" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Link Intime India <ExternalLink size={12} color="#94a3b8" />
                </a>
              </li>
              <li>
                <a href="https://kosmic.kfintech.com/ipostatus/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  KFin Technologies <ExternalLink size={12} color="#94a3b8" />
                </a>
              </li>
              <li>
                <a href="https://www.bigshareonline.com/ipo_Allotment.html" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Bigshare Services <ExternalLink size={12} color="#94a3b8" />
                </a>
              </li>
              <li>
                <a href="https://www.skylinerta.com/ipo.php" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Skyline Financial <ExternalLink size={12} color="#94a3b8" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Portals */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Exchanges & Regulators
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#475569' }}>
              <li>
                <a href="https://www.nseindia.com/market-data/all-upcoming-issues-ipo" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  NSE India IPO Portal <ExternalLink size={12} color="#94a3b8" />
                </a>
              </li>
              <li>
                <a href="https://www.bseindia.com/publicissue.html" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  BSE India Public Issues <ExternalLink size={12} color="#94a3b8" />
                </a>
              </li>
              <li>
                <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Securities and Exchange Board of India (SEBI) <ExternalLink size={12} color="#94a3b8" />
                </a>
              </li>
              <li>
                <a href="https://www.cdslindia.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  CDSL & NSDL Demat Depository <ExternalLink size={12} color="#94a3b8" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Navigation */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Market Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>
                <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>
                  IPOs (Mainboard & SME)
                </Link>
              </li>
              <li>
                <Link href="/pre-ipo" style={{ color: '#475569', textDecoration: 'none' }}>
                  Preipo & Unlisted Shares
                </Link>
              </li>
              <li>
                <Link href="/payment-apps" style={{ color: '#475569', textDecoration: 'none' }}>
                  Payment Apps (UPI 2.0 ASBA)
                </Link>
              </li>
              <li>
                <Link href="/brokers" style={{ color: '#475569', textDecoration: 'none' }}>
                  Stock Brokers Comparison
                </Link>
              </li>
              <li>
                <Link href="/credit-cards" style={{ color: '#475569', textDecoration: 'none' }}>
                  Credit Cards & RuPay UPI
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Risk Disclaimer Box */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.6' }}>
              <strong style={{ color: '#0f172a' }}>Important Regulatory Disclosure & Risk Warning: </strong>
              The information provided on this platform is solely for educational, research, and informational purposes and does not constitute financial, investment, legal, or tax advice. Grey Market Premium (GMP) is an unregulated, speculative indicator determined by peer-to-peer unofficial trades and is subject to extreme volatility; it is not endorsed by SEBI, NSE, or BSE. Unlisted and Pre-IPO shares carry liquidity risk and capital loss risk. Always consult a SEBI registered investment advisor (RIA) before making any investment decisions.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} IPO & PreIPO India. Made with precision for Indian Investors.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>SEBI Research Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
