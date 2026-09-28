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
  Award,
  Smartphone,
  CreditCard,
  User,
  LogOut,
  LogIn,
  ChevronDown
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
      icon: <Layers size={15} />, 
      href: '/',
      isActive: isIposPage && (!activeTab || activeTab === 'all-ipos' || activeTab === 'live-gmp' || activeTab === 'allotment')
    },
    { 
      id: 'analysts', 
      label: 'Analysts', 
      icon: <Award size={15} color="#d97706" />, 
      href: '/analysts',
      isActive: isAnalystsPage
    },
    { 
      id: 'pre-ipo', 
      label: 'Pre-IPO', 
      badge: 'SOON',
      icon: <Award size={15} color="#0284c7" />, 
      href: '/pre-ipo',
      isActive: isPreIpoPage
    },
    { 
      id: 'payment-apps', 
      label: 'Payment Apps', 
      icon: <Smartphone size={15} color="#059669" />, 
      href: '/payment-apps',
      isActive: isPaymentAppsPage
    },
    { 
      id: 'brokers', 
      label: 'Brokers', 
      icon: <TrendingUp size={15} color="#2563eb" />, 
      href: '/brokers',
      isActive: isBrokersPage
    },
    { 
      id: 'credit-cards', 
      label: 'Credit Cards', 
      icon: <CreditCard size={15} color="#8b5cf6" />, 
      href: '/credit-cards',
      isActive: isCreditCardsPage
    },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '58px',
        gap: '0.85rem'
      }}>
        {/* Brand / Logo */}
        <Link 
          href="/"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            cursor: 'pointer',
            flexShrink: 0,
            textDecoration: 'none'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #387ed1 0%, #00b386 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(56, 126, 209, 0.25)',
            flexShrink: 0
          }}>
            <TrendingUp size={18} color="#ffffff" />
          </div>
          <div style={{ 
            fontWeight: 800, 
            fontSize: '1.15rem', 
            letterSpacing: '-0.02em', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.3rem',
            color: '#0f172a',
            whiteSpace: 'nowrap'
          }}>
            <span>IPO</span>
            <span style={{ color: '#387ed1' }}>&</span>
            <span>PreIPO</span>
            <span style={{
              fontSize: '0.6rem',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              padding: '1px 5px',
              borderRadius: '4px',
              fontWeight: 700,
              border: '1px solid #bfdbfe',
              marginLeft: '2px',
              letterSpacing: '0.04em'
            }}>
              IN
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav 
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {navItems.map((item) => {
            const active = item.isActive;
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.42rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#2563eb' : '#475569',
                  backgroundColor: active ? '#eff6ff' : 'transparent',
                  border: active ? '1px solid #bfdbfe' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    border: '1px solid #fde68a',
                    marginLeft: '2px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Compact Search + Sign In Button / User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          {/* Large Screen Search input (optional compact input) */}
          {setSearchQuery && (
            <div 
              className="desktop-search"
              style={{
                position: 'relative',
                width: '180px',
                display: 'none'
              }}
            >
              <Search size={14} color="#94a3b8" style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '0.38rem 0.75rem 0.38rem 2rem',
                  fontSize: '0.8rem',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.width = '220px';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.width = '180px';
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Desktop Auth State / Single "Sign In" Button */}
          <div className="desktop-auth" style={{ position: 'relative' }} ref={userMenuRef}>
            {status === 'loading' ? (
              <div style={{
                width: '68px',
                height: '34px',
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
                    gap: '0.45rem',
                    padding: '0.3rem 0.65rem 0.3rem 0.35rem',
                    borderRadius: '20px',
                    border: '1px solid #cbd5e1',
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
                      style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb 0%, #00b386 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.user.name?.split(' ')[0] || 'Investor'}
                  </span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '230px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e2e8f0',
                    zIndex: 100,
                    padding: '0.45rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.user.name || 'Investor'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.user.email}
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.65rem',
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
                          padding: '0.5rem 0.65rem',
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
                        padding: '0.5rem 0.65rem',
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
              /* Just Sign In Button (Sign Up is available on Sign In page) */
              <Link
                href="/auth/signin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                <LogIn size={14} color="#2563eb" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '0.45rem',
              color: '#0f172a',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.85rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
          maxHeight: 'calc(100vh - 58px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* Mobile Search input */}
          {setSearchQuery && (
            <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
              <Search size={15} color="#94a3b8" style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input
                type="text"
                placeholder="Search IPOs, analysts, brokers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.55rem 0.75rem 0.55rem 2rem',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: item.isActive ? '#2563eb' : '#334155',
                backgroundColor: item.isActive ? '#eff6ff' : '#f8fafc',
                border: item.isActive ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                textDecoration: 'none'
              }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  border: '1px solid #fde68a'
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {/* Mobile Auth Button (Single clean Sign In button) */}
          <div style={{ marginTop: '0.35rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9' }}>
            {status === 'authenticated' && session?.user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb 0%, #00b386 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.user.name || 'Investor'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {session.user.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '0.55rem',
                      textAlign: 'center',
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      border: '1px solid #bfdbfe',
                      textDecoration: 'none'
                    }}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    style={{
                      padding: '0.55rem',
                      borderRadius: '8px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      border: '1px solid #fecaca',
                      cursor: 'pointer'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem',
                  width: '100%',
                  borderRadius: '8px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)'
                }}
              >
                <LogIn size={16} />
                <span>Sign In to Account</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 1260px) {
          .desktop-search {
            display: block !important;
          }
        }
        @media (max-width: 1040px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
