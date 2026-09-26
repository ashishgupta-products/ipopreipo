'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  TrendingUp, 
  Search, 
  Calculator, 
  ShieldCheck, 
  Layers, 
  Menu, 
  X,
  Flame,
  Award,
  Smartphone,
  CreditCard
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onOpenCalculator?: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery = '',
  setSearchQuery,
  onOpenCalculator
}: NavbarProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isPreIpoPage = pathname === '/pre-ipo';
  const isPaymentAppsPage = pathname === '/payment-apps';
  const isBrokersPage = pathname === '/brokers';
  const isCreditCardsPage = pathname === '/credit-cards';
  const isIposPage = pathname === '/' || pathname.startsWith('/ipo');

  const navItems = [
    { 
      id: 'ipos', 
      label: 'IPOs', 
      icon: <Layers size={16} />, 
      href: '/',
      isActive: isIposPage && (!activeTab || activeTab === 'all-ipos' || activeTab === 'live-gmp' || activeTab === 'allotment')
    },
    { 
      id: 'pre-ipo', 
      label: 'Preipo', 
      icon: <Award size={16} color="#0284c7" />, 
      href: '/pre-ipo',
      isActive: isPreIpoPage
    },
    { 
      id: 'payment-apps', 
      label: 'Payment Apps', 
      icon: <Smartphone size={16} color="#059669" />, 
      href: '/payment-apps',
      isActive: isPaymentAppsPage
    },
    { 
      id: 'brokers', 
      label: 'Brokers', 
      icon: <TrendingUp size={16} color="#2563eb" />, 
      href: '/brokers',
      isActive: isBrokersPage
    },
    { 
      id: 'credit-cards', 
      label: 'Credit Cards', 
      icon: <CreditCard size={16} color="#8b5cf6" />, 
      href: '/credit-cards',
      isActive: isCreditCardsPage
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (setActiveTab) {
      if (item.id === 'ipos') {
        setActiveTab('all-ipos');
      } else {
        setActiveTab(item.id);
      }
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '1rem'
      }}>
        {/* Brand / Logo */}
        <Link 
          href="/"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            cursor: 'pointer' 
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #387ed1 0%, #00b386 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(56, 126, 209, 0.25)'
          }}>
            <TrendingUp size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              letterSpacing: '-0.02em', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              color: '#0f172a'
            }}>
              <span>IPO</span>
              <span style={{ color: '#387ed1' }}>&</span>
              <span>PreIPO</span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                padding: '2px 7px',
                borderRadius: '4px',
                fontWeight: 700,
                border: '1px solid #bfdbfe',
                marginLeft: '4px'
              }}>
                INDIA
              </span>
            </div>
            <div 
              className="brand-subtext hide-on-mobile-sm"
              style={{ 
                fontSize: '0.72rem', 
                color: '#64748b', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}
            >
              <span className="pulse-indicator"></span>
              <span>Live NSE • BSE • SME • Unlisted Desk</span>
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <div style={{
          flex: '1',
          maxWidth: '360px',
          display: 'none',
          position: 'relative',
        }} className="desktop-search">
          <Search size={16} color="#94a3b8" style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            type="text"
            placeholder={isPreIpoPage ? "Search unlisted shares (NSE, boAt, Reliance)..." : "Search IPO, SME or Pre-IPO..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              fontSize: '0.85rem',
              color: '#0f172a',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.backgroundColor = '#ffffff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.backgroundColor = '#f1f5f9';
            }}
          />
          {searchQuery && setSearchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '0.75rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Desktop Nav Items */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }} className="desktop-nav">
          {navItems.map((item) => {
            const active = item.isActive;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: active ? '#2563eb' : '#475569',
                  backgroundColor: active ? '#eff6ff' : 'transparent',
                  border: active ? '1px solid #bfdbfe' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

          {/* Action Button: Calculator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onOpenCalculator ? (
            <button
              onClick={onOpenCalculator}
              className="btn-secondary"
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.825rem',
                minWidth: '38px',
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="IPO Listing Gain Calculator"
              aria-label="IPO Calculator"
            >
              <Calculator size={16} color="#387ed1" />
              <span className="hide-on-mobile">IPO Calculator</span>
            </button>
          ) : (
            <Link
              href="/#market-terminal"
              className="btn-secondary"
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.825rem',
                textDecoration: 'none',
                minWidth: '38px',
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="IPO Listing Gain Calculator"
              aria-label="IPO Calculator"
            >
              <Calculator size={16} color="#387ed1" />
              <span className="hide-on-mobile">IPO Calculator</span>
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '0.5rem',
              color: '#0f172a',
              minWidth: '42px',
              minHeight: '42px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          maxHeight: 'calc(100vh - 70px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* Mobile Search input */}
          <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
            <Search size={16} color="#94a3b8" style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 1rem 0.6rem 2.2rem',
                fontSize: '0.9rem',
                color: '#0f172a'
              }}
            />
          </div>

          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                handleNavClick(item);
                setMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: item.isActive ? '#2563eb' : '#475569',
                backgroundColor: item.isActive ? '#eff6ff' : '#f8fafc',
                border: item.isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                textAlign: 'left'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (min-width: 1180px) {
          .desktop-search {
            display: block !important;
          }
        }
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
