'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import MarketTicker from '../../components/layout/MarketTicker';
import Footer from '../../components/layout/Footer';
import { 
  Award, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Bell, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Layers, 
  Building2, 
  Coins,
  Send
} from 'lucide-react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PreIpoComingSoonPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Target launch countdown (45 days from current date)
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 42,
    hours: 14,
    minutes: 38,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
    }, 600);
  };

  const previewCompanies = [
    {
      name: 'National Stock Exchange (NSE)',
      symbol: 'NSE',
      sector: 'Financial Market Infrastructure',
      estPrice: '₹6,450',
      minLot: 25,
      valuation: '₹3,22,500 Cr',
      drhpStatus: 'SEBI Clearance Pending',
      isin: 'INE747B01016',
      badgeColor: '#0284c7'
    },
    {
      name: 'Tata Capital Limited',
      symbol: 'TATACAP',
      sector: 'Diversified NBFC & Lending',
      estPrice: '₹1,090',
      minLot: 50,
      valuation: '₹94,000 Cr',
      drhpStatus: 'Mandatory RBI Listing 2026',
      isin: 'INE306N01010',
      badgeColor: '#2563eb'
    },
    {
      name: 'boAt (Imagine Marketing)',
      symbol: 'BOAT',
      sector: 'Consumer Electronics & Wearables',
      estPrice: '₹920',
      minLot: 50,
      valuation: '₹11,500 Cr',
      drhpStatus: 'Refiling IPO Prospectus',
      isin: 'INE025D01017',
      badgeColor: '#dc2626'
    },
    {
      name: 'Reliance Retail Ventures',
      symbol: 'RELRETAIL',
      sector: 'Omnichannel Retail & E-Commerce',
      estPrice: '₹2,550',
      minLot: 20,
      valuation: '₹8,50,000 Cr',
      drhpStatus: 'Pre-IPO Corporate Restructuring',
      isin: 'INE712P01014',
      badgeColor: '#059669'
    },
    {
      name: 'HDB Financial Services',
      symbol: 'HDBFS',
      sector: 'Retail Finance & NBFC',
      estPrice: '₹835',
      minLot: 100,
      valuation: '₹66,000 Cr',
      drhpStatus: 'HDFC Bank Board Approved',
      isin: 'INE756I01014',
      badgeColor: '#7c3aed'
    },
    {
      name: 'API Holdings (PharmEasy)',
      symbol: 'PHARMEASY',
      sector: 'Digital Healthcare & Telemedicine',
      estPrice: '₹12.40',
      minLot: 2000,
      valuation: '₹8,400 Cr',
      drhpStatus: 'Rights Issue Turnaround Phase',
      isin: 'INE04Q001010',
      badgeColor: '#ea580c'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Sticky Navbar */}
      <Navbar />

      {/* Rolling Ticker */}
      <MarketTicker />

      {/* Main Content */}
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
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Pre-IPO & Unlisted Shares</span>
          <ChevronRight size={13} />
          <span style={{
            backgroundColor: '#fef3c7',
            color: '#b45309',
            fontSize: '0.7rem',
            padding: '2px 7px',
            borderRadius: '4px',
            fontWeight: 700,
            border: '1px solid #fde68a'
          }}>
            COMING SOON
          </span>
        </div>

        {/* Hero Banner with Glassmorphism and Glow */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1.25rem',
          background: 'linear-gradient(135deg, #091e3a 0%, #0b2e59 40%, #0c3e74 100%)',
          color: '#ffffff',
          padding: '3rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 20px 40px -15px rgba(11, 46, 89, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Subtle Ambient Background Orbs */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 126, 209, 0.35) 0%, rgba(0, 179, 134, 0.15) 100%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            {/* Status Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#93c5fd',
              marginBottom: '1.25rem'
            }}>
              <span className="pulse-indicator" style={{ backgroundColor: '#38bdf8' }}></span>
              <span>INSTITUTIONAL UNLISTED SHARES DESK • LAUNCHING SOON</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: '1.15',
              marginBottom: '1rem',
              color: '#ffffff'
            }}>
              Pre-IPO & Unlisted Shares Marketplace
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.65',
              color: '#cbd5e1',
              maxWidth: '720px',
              margin: '0 auto 2.25rem'
            }}>
              Direct Demat access to India’s most valuable unicorns, private market giants, and pre-DRHP enterprises. 
              We are currently establishing licensed institutional escrow trustees and custody pipelines for 100% compliant Demat settlement.
            </p>

            {/* Live Countdown Grid */}
            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(4, minmax(70px, 95px))',
              gap: '0.75rem',
              marginBottom: '2.5rem'
            }}>
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINUTES', value: timeLeft.minutes },
                { label: 'SECONDS', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '0.85rem',
                    padding: '0.85rem 0.5rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="mono" style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: '1.1'
                  }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#94a3b8',
                    marginTop: '4px'
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Priority Waitlist Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '1rem',
              padding: '1.75rem 2rem',
              maxWidth: '560px',
              margin: '0 auto',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#f8fafc',
                marginBottom: '0.5rem'
              }}>
                <Bell size={16} color="#38bdf8" />
                <span>Get Early Access & Priority Allocation</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                Join 1,840+ retail & HNI investors on the private waitlist. Receive instant notifications and zero brokerage on your first order.
              </p>

              {subscribed ? (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '1rem',
                  borderRadius: '0.65rem',
                  color: '#6ee7b7',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle2 size={18} color="#34d399" />
                  <span><strong>You are on the priority waitlist!</strong> We will email you the moment trading goes live.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#387ed1',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1.4rem',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 2px 10px rgba(56, 126, 209, 0.4)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>{loading ? 'Joining...' : 'Join Waitlist'}</span>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Feature Trust Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}>
          {[
            {
              icon: <ShieldCheck size={24} color="#059669" />,
              title: '100% Demat Settlement',
              desc: 'Direct off-market credit into your CDSL or NSDL Demat account (Zerodha, Groww, Angel One, Upstox).'
            },
            {
              icon: <Lock size={24} color="#2563eb" />,
              title: 'SEBI Trustee Escrow',
              desc: 'Funds are safeguarded in an institutional SEBI-registered escrow account until verified delivery of shares.'
            },
            {
              icon: <Coins size={24} color="#d97706" />,
              title: 'Zero Hidden Markups',
              desc: 'Real-time transparent pricing with fair lot sizes. Institutional rates accessible to retail investors.'
            },
            {
              icon: <Building2 size={24} color="#7c3aed" />,
              title: 'Pre-Listing Research',
              desc: 'Complete financial statements, peer comparisons, shareholding patterns, and IPO DRHP probability trackers.'
            }
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.85rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Upcoming Unlisted Stocks Preview Pipeline */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="glass-badge badge-blue" style={{ fontSize: '0.72rem' }}>
                  CATALOG PREVIEW
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>6 Companies in Pipeline</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                Upcoming Unlisted Shares in Preparation
              </h2>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#f1f5f9',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              color: '#475569',
              fontWeight: 600
            }}>
              <Lock size={13} />
              <span>Trading Desk Opens with Platform Launch</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1rem'
          }}>
            {previewCompanies.map((company, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.85rem',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        backgroundColor: '#eff6ff',
                        color: company.badgeColor,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid #bfdbfe'
                      }}>
                        {company.symbol}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '0.35rem' }}>
                        {company.name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {company.sector}
                      </div>
                    </div>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #fde68a'
                    }}>
                      <Clock size={11} />
                      <span>LOCKED</span>
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    marginBottom: '0.85rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Est. Unlisted Price</div>
                      <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                        {company.estPrice}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Private Valuation</div>
                      <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb' }}>
                        {company.valuation}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.78rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Demat ISIN:</span>
                      <span className="mono" style={{ color: '#0f172a', fontWeight: 600 }}>{company.isin}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>DRHP / Listing Status:</span>
                      <span style={{ color: '#059669', fontWeight: 600 }}>{company.drhpStatus}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Min. Lot: {company.minLot} shares</span>
                  <span style={{ fontSize: '0.78rem', color: '#387ed1', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span>In Preparation</span>
                    <Sparkles size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross Promotion Call to Action: Explore Live IPOs */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="pulse-indicator" style={{ backgroundColor: '#10b981' }}></span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>MARKET IS LIVE TODAY</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              Looking for Active IPOs & Real-Time GMP?
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5' }}>
              Track 50+ Mainboard & SME public issues with live grey market premiums, institutional analyst consensus rankings, and direct registrar allotment checks.
            </p>
          </div>

          <Link
            href="/"
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '0.85rem 1.6rem',
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <span>Explore Active IPOs</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
