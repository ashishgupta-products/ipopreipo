'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  TrendingUp, 
  Search, 
  ShieldCheck, 
  Layers, 
  Menu, 
  X,
  Flame,
  Award,
  Smartphone,
  CreditCard,
  User,
  LogOut,
  LogIn,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery = '',
  setSearchQuery
}: NavbarProps = {}) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPreIpoPage = pathname === '/pre-ipo' || pathname.startsWith('/pre-ipo/');
  const isPaymentAppsPage = pathname === '/payment-apps' || pathname.startsWith('/payment-apps/');
  const isBrokersPage = pathname === '/brokers' || pathname.startsWith('/brokers/');
  const isCreditCardsPage = pathname === '/credit-cards' || pathname.startsWith('/credit-cards/');
  const isAnalystsPage = pathname.startsWith('/analysts');
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
      id: 'analysts', 
      label: 'Analysts', 
      icon: <Award size={16} color="#d97706" />, 
      href: '/analysts',
      isActive: isAnalystsPage
    },
    { 
      id: 'pre-ipo', 
      label: 'Preipo', 
      badge: 'SOON',
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
                {(item as any).badge && (
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: '1px solid #fde68a',
                    marginLeft: '2px'
                  }}>
                    {(item as any).badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Desktop Auth State / Profile Menu */}
          <div className="desktop-auth-container" style={{ position: 'relative' }} ref={userMenuRef}>
            {status === 'loading' ? (
              <div style={{
                width: '72px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0'
              }} />
            ) : status === 'authenticated' && session?.user ? (
              <div>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.65rem 0.35rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #e2e8f0',
                    backgroundColor: userMenuOpen ? '#eff6ff' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  aria-label="User Account Menu"
                >
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb 0%, #00b386 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.user.name?.split(' ')[0] || 'Investor'}
                  </span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e2e8f0',
                    zIndex: 100,
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}>
                    <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.user.name || 'Investor'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.user.email}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid #bfdbfe'
                        }}>
                          {(session.user as any).investorCategory || 'Retail'}
                        </span>
                        {(session.user as any).dematProvider && (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 600,
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {(session.user as any).dematProvider}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#334155',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <User size={15} color="#387ed1" />
                      <span>My Profile & Demat</span>
                    </Link>

                    {(session.user as any).role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#7c3aed',
                          backgroundColor: '#f5f3ff',
                          border: '1px solid #ddd6fe',
                          textDecoration: 'none',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ede9fe')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f5f3ff')}
                      >
                        <ShieldCheck size={15} color="#7c3aed" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <LogOut size={15} color="#dc2626" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Link
                  href="/auth/signin"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  <LogIn size={14} color="#64748b" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth/signup"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #387ed1 0%, #2563eb 100%)',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

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
              onClick={() => setMobileMenuOpen(false)}
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
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && (
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  border: '1px solid #fde68a'
                }}>
                  {(item as any).badge}
                </span>
              )}
            </Link>
          ))}

          {/* Auth in Mobile Drawer */}
          <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
            {status === 'authenticated' && session?.user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb 0%, #00b386 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}>
                    {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.user.name || 'Investor'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {(session.user as any).investorCategory || 'Retail'} • {(session.user as any).dematProvider || 'Demat'}
                    </div>
                  </div>
                </div>

                {(session.user as any).role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '0.6rem',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f5f3ff',
                      color: '#7c3aed',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      border: '1px solid #ddd6fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Admin Console</span>
                  </Link>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '0.6rem',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    Profile & Demat
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    style={{
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      border: '1px solid #fecaca',
                      cursor: 'pointer'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '0.6rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '0.6rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #387ed1 0%, #2563eb 100%)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
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
          .desktop-auth-container {
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
