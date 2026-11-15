'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  TrendingUp, 
  Search, 
  ShieldCheck, 
  Layers, 
  Menu, 
  X,
  Award,
  User,
  LogOut,
  LogIn,
  ChevronDown,
  Calendar,
  Building2,
  Rocket,
  Trophy,
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
  const [iposDropdownOpen, setIposDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const iposDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIposDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setIposDropdownOpen(false);
    }, 220); // Grace period prevents dropdown disappearing when moving cursor down
  };

  const handleDropdownToggle = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIposDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const [internalQuery, setInternalQuery] = useState(searchQuery || '');

  useEffect(() => {
    setInternalQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearchChange = (val: string) => {
    setInternalQuery(val);
    if (setSearchQuery) {
      setSearchQuery(val);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!setSearchQuery || (pathname !== '/' && !pathname.startsWith('/mainboard') && !pathname.startsWith('/sme') && !pathname.startsWith('/ipo-performance'))) {
        router.push(`/?q=${encodeURIComponent(internalQuery)}`);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (iposDropdownRef.current && !iposDropdownRef.current.contains(event.target as Node)) {
        setIposDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIposDropdownOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAnalystsPage = pathname.startsWith('/analysts');
  const isCalendarPage = pathname === '/ipo-calendar';
  const isAllotmentPage = pathname === '/allotment';
  const isMainboardPage = pathname === '/mainboard-ipo';
  const isSmePage = pathname === '/sme-ipo';
  const isPerformancePage = pathname === '/ipo-performance';
  const isPreIpoPage = pathname.startsWith('/pre-ipo') || pathname.startsWith('/preipo');
  const isSelectPage = pathname.startsWith('/select');
  const isIposPage = (pathname === '/' || pathname.startsWith('/ipo') || isMainboardPage || isSmePage || isPerformancePage || isCalendarPage || isAllotmentPage || isAnalystsPage) && !isPreIpoPage && !isSelectPage;

  const navItems: {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
    isActive: boolean;
    badge?: string;
  }[] = [
    { 
      id: 'ipos', 
      label: 'IPOs', 
      icon: <Layers size={15} />, 
      href: '/',
      isActive: isIposPage
    },
    {
      id: 'pre-ipo',
      label: 'Pre-IPO',
      icon: <Sparkles size={15} />,
      href: '/pre-ipo',
      isActive: isPreIpoPage
    },
    {
      id: 'select',
      label: 'Select',
      icon: <Award size={15} />,
      href: '/select',
      isActive: isSelectPage
    }
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
            <span style={{ color: '#387ed1' }}>Market</span>
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
            if (item.id === 'ipos') {
              return (
                <div
                  key="ipos-dropdown"
                  ref={iposDropdownRef}
                  style={{ position: 'relative' }}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <button
                    onClick={handleDropdownToggle}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.42rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.84rem',
                      fontWeight: isIposPage ? 700 : 500,
                      color: isIposPage ? '#2563eb' : '#475569',
                      backgroundColor: isIposPage ? '#eff6ff' : 'transparent',
                      border: isIposPage ? '1px solid #bfdbfe' : '1px solid transparent',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer'
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown
                      size={13}
                      style={{
                        transform: iposDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.15s ease',
                        color: isIposPage ? '#2563eb' : '#64748b'
                      }}
                    />
                  </button>

                  {iposDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        paddingTop: '6px',
                        zIndex: 60
                      }}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.05)',
                          width: '490px',
                          padding: '8px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '6px'
                        }}
                      >
                        {/* 1. Mainboard IPO */}
                        <Link
                          href="/mainboard-ipo"
                          onClick={() => setIposDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.7rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: isMainboardPage ? '#2563eb' : '#0f172a',
                            backgroundColor: isMainboardPage ? '#eff6ff' : 'transparent',
                            border: isMainboardPage ? '1px solid #bfdbfe' : '1px solid transparent',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isMainboardPage) {
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                              e.currentTarget.style.borderColor = '#e2e8f0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isMainboardPage) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                            }
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isMainboardPage ? '#dbeafe' : '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Building2 size={16} color="#2563eb" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isMainboardPage ? '#2563eb' : '#0f172a' }}>
                              Mainboard IPO
                            </div>
                            <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                              NSE & BSE Mainboard
                            </div>
                          </div>
                        </Link>

                        {/* 2. IPO Calendar */}
                        <Link
                          href="/ipo-calendar"
                          onClick={() => setIposDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.7rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: isCalendarPage ? '#2563eb' : '#0f172a',
                            backgroundColor: isCalendarPage ? '#eff6ff' : 'transparent',
                            border: isCalendarPage ? '1px solid #bfdbfe' : '1px solid transparent',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isCalendarPage) {
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                              e.currentTarget.style.borderColor = '#e2e8f0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isCalendarPage) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                            }
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isCalendarPage ? '#dbeafe' : '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Calendar size={16} color="#2563eb" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isCalendarPage ? '#2563eb' : '#0f172a' }}>
                              IPO Calendar
                            </div>
                            <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                              Bidding & listing dates
                            </div>
                          </div>
                        </Link>

                        {/* 3. SME IPO */}
                        <Link
                          href="/sme-ipo"
                          onClick={() => setIposDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.7rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: isSmePage ? '#b45309' : '#0f172a',
                            backgroundColor: isSmePage ? '#fffbeb' : 'transparent',
                            border: isSmePage ? '1px solid #fde68a' : '1px solid transparent',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSmePage) {
                              e.currentTarget.style.backgroundColor = '#fffbeb';
                              e.currentTarget.style.borderColor = '#fde68a';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSmePage) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                            }
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isSmePage ? '#fef3c7' : '#fffbeb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Rocket size={16} color="#b45309" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSmePage ? '#b45309' : '#0f172a' }}>
                              SME IPO
                            </div>
                            <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                              NSE Emerge & BSE SME
                            </div>
                          </div>
                        </Link>

                        {/* 4. Allotment */}
                        <Link
                          href="/allotment"
                          onClick={() => setIposDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.7rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: isAllotmentPage ? '#059669' : '#0f172a',
                            backgroundColor: isAllotmentPage ? '#ecfdf5' : 'transparent',
                            border: isAllotmentPage ? '1px solid #a7f3d0' : '1px solid transparent',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isAllotmentPage) {
                              e.currentTarget.style.backgroundColor = '#ecfdf5';
                              e.currentTarget.style.borderColor = '#a7f3d0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isAllotmentPage) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                            }
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isAllotmentPage ? '#d1fae5' : '#ecfdf5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <ShieldCheck size={16} color="#059669" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isAllotmentPage ? '#059669' : '#0f172a' }}>
                              Allotment
                            </div>
                            <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                              Check registrar & PAN
                            </div>
                          </div>
                        </Link>

                        {/* 5. IPO Performance */}
                        <Link
                          href="/ipo-performance"
                          onClick={() => setIposDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.7rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: isPerformancePage ? '#059669' : '#0f172a',
                            backgroundColor: isPerformancePage ? '#ecfdf5' : 'transparent',
                            border: isPerformancePage ? '1px solid #a7f3d0' : '1px solid transparent',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isPerformancePage) {
                              e.currentTarget.style.backgroundColor = '#ecfdf5';
                              e.currentTarget.style.borderColor = '#a7f3d0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isPerformancePage) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                            }
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isPerformancePage ? '#d1fae5' : '#ecfdf5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Trophy size={16} color="#059669" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isPerformancePage ? '#059669' : '#0f172a' }}>
                              IPO Performance
                            </div>
                            <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                              Listing gains & returns
                            </div>
                          </div>
                        </Link>

                        {/* 6. Analysts */}
                        <Link
                          href="/analysts"
                          onClick={() => setIposDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.7rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: isAnalystsPage ? '#d97706' : '#0f172a',
                            backgroundColor: isAnalystsPage ? '#fffbeb' : 'transparent',
                            border: isAnalystsPage ? '1px solid #fde68a' : '1px solid transparent',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isAnalystsPage) {
                              e.currentTarget.style.backgroundColor = '#fffbeb';
                              e.currentTarget.style.borderColor = '#fde68a';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isAnalystsPage) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                            }
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isAnalystsPage ? '#fef3c7' : '#fffbeb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Award size={16} color="#d97706" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isAnalystsPage ? '#d97706' : '#0f172a' }}>
                              Analysts
                            </div>
                            <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                              SEBI desk recommendations
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

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
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {/* Always-visible Navbar Searchbox on Desktop & Tablet */}
          <div 
            className="navbar-searchbox"
            style={{
              position: 'relative',
              width: '210px',
              transition: 'all 0.2s ease'
            }}
          >
            <Search size={14} color="#94a3b8" style={{
              position: 'absolute',
              left: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Search IPOs..."
              value={internalQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              style={{
                width: '100%',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.42rem 1.85rem 0.42rem 2.05rem',
                fontSize: '0.82rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontWeight: 500
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f1f5f9';
                e.target.style.boxShadow = 'none';
              }}
            />
            {internalQuery && (
              <button 
                type="button"
                onClick={() => handleSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

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
          <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
            <Search size={15} color="#94a3b8" style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              placeholder="Search IPOs..."
              value={internalQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
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

          {navItems.map((item) => {
            if (item.id === 'ipos') {
              return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: isIposPage ? '#2563eb' : '#334155',
                      backgroundColor: isIposPage ? '#eff6ff' : '#f8fafc',
                      border: isIposPage ? '1px solid #bfdbfe' : '1px solid #f1f5f9'
                    }}
                  >
                    {item.icon}
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '0.75rem', marginTop: '2px' }}>
                    <Link
                      href="/mainboard-ipo"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: isMainboardPage ? 700 : 600,
                        color: isMainboardPage ? '#2563eb' : '#475569',
                        backgroundColor: isMainboardPage ? '#eff6ff' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Building2 size={14} color="#2563eb" />
                      <span>Mainboard IPO</span>
                    </Link>
                    <Link
                      href="/sme-ipo"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: isSmePage ? 700 : 600,
                        color: isSmePage ? '#b45309' : '#475569',
                        backgroundColor: isSmePage ? '#fffbeb' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Rocket size={14} color="#b45309" />
                      <span>SME IPO</span>
                    </Link>
                    <Link
                      href="/ipo-performance"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: isPerformancePage ? 700 : 600,
                        color: isPerformancePage ? '#059669' : '#475569',
                        backgroundColor: isPerformancePage ? '#ecfdf5' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trophy size={14} color="#059669" />
                      <span>IPO Performance</span>
                    </Link>
                    <Link
                      href="/ipo-calendar"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: isCalendarPage ? 700 : 600,
                        color: isCalendarPage ? '#2563eb' : '#475569',
                        backgroundColor: isCalendarPage ? '#eff6ff' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Calendar size={14} color="#2563eb" />
                      <span>IPO Calendar</span>
                    </Link>
                    <Link
                      href="/allotment"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: isAllotmentPage ? 700 : 600,
                        color: isAllotmentPage ? '#059669' : '#475569',
                        backgroundColor: isAllotmentPage ? '#ecfdf5' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ShieldCheck size={14} color="#059669" />
                      <span>Allotment</span>
                    </Link>
                    <Link
                      href="/analysts"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: isAnalystsPage ? 700 : 600,
                        color: isAnalystsPage ? '#d97706' : '#475569',
                        backgroundColor: isAnalystsPage ? '#fffbeb' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Award size={14} color="#d97706" />
                      <span>Analysts</span>
                    </Link>
                  </div>
                </div>
              );
            }

            return (
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
            );
          })}

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
        @media (max-width: 768px) {
          .navbar-searchbox {
            display: none !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
