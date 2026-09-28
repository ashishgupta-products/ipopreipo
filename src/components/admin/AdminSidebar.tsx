'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Award, 
  Users, 
  Database, 
  RefreshCw, 
  Plus, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Sparkles,
  Zap,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export type AdminTab = 'overview' | 'ipos' | 'pre-ipos' | 'payment-apps' | 'users' | 'sync';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  counts: {
    ipos: number;
    preIpos: number;
    paymentApps?: number;
    users: number;
  };
  sessionUser?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  syncing: boolean;
  onTriggerSync: () => void;
  onOpenCreateIpo?: () => void;
  onOpenCreatePreIpo?: () => void;
  onOpenCreatePaymentApp?: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  counts,
  sessionUser,
  syncing,
  onTriggerSync,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: AdminSidebarProps) {
  const router = useRouter();

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; count?: number; badge?: string }[] = [
    { 
      id: 'overview', 
      label: 'Overview & Analytics', 
      icon: <TrendingUp size={18} />, 
      badge: 'Live' 
    },
    { 
      id: 'ipos', 
      label: 'Mainboard & SME IPOs', 
      icon: <Layers size={18} />, 
      count: counts.ipos 
    },
    { 
      id: 'pre-ipos', 
      label: 'Pre-IPO Shares', 
      icon: <Award size={18} />, 
      count: counts.preIpos 
    },
    { 
      id: 'payment-apps', 
      label: 'UPI Payment Apps', 
      icon: <Smartphone size={18} />, 
      count: counts.paymentApps 
    },
    { 
      id: 'users', 
      label: 'Investor Community', 
      icon: <Users size={18} />, 
      count: counts.users 
    },
    { 
      id: 'sync', 
      label: 'Database & Sync', 
      icon: <Database size={18} />, 
      badge: 'Neon DB' 
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const userInitial = sessionUser?.name?.[0] || sessionUser?.email?.[0]?.toUpperCase() || 'A';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 10, 24, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: isCollapsed ? '72px' : '255px',
          minWidth: isCollapsed ? '72px' : '255px',
          maxWidth: isCollapsed ? '72px' : '255px',
          height: '100vh',
          backgroundColor: '#090d16',
          color: '#f8fafc',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.35)',
        }}
        className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        {/* 1. TOP HEADER: Brand & Workspace */}
        <div style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1rem 1.15rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '0.65rem',
          flexShrink: 0,
          backgroundColor: '#060911'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{
              width: '36px',
              height: '36px',
              minWidth: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <ShieldCheck size={20} color="#ffffff" strokeWidth={2.2} />
            </div>

            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: 800, 
                    letterSpacing: '-0.02em', 
                    color: '#ffffff',
                    whiteSpace: 'nowrap'
                  }}>
                    IPO Terminal
                  </span>
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    padding: '1px 5px',
                    borderRadius: '999px',
                    letterSpacing: '0.04em'
                  }}>
                    ADMIN
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  Management Suite
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            className="desktop-collapse-btn"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* 2. SUB-HEADER: Neon DB Status (Compact) */}
        {!isCollapsed ? (
          <div style={{
            margin: '0.65rem 0.85rem 0.25rem',
            padding: '0.4rem 0.65rem',
            borderRadius: '7px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{
                display: 'inline-flex',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }}></span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399' }}>
                Neon PostgreSQL
              </span>
            </div>
            <span style={{ fontSize: '0.62rem', color: '#6ee7b7', backgroundColor: 'rgba(16, 185, 129, 0.16)', padding: '1px 5px', borderRadius: '3px' }}>
              Online
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0', flexShrink: 0 }} title="Neon PostgreSQL Online">
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }}></span>
          </div>
        )}

        {/* 3. MIDDLE SCROLLABLE SECTION: Navigation Tabs & Shortcuts */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: isCollapsed ? '0.5rem 0.4rem' : '0.5rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }} className="admin-sidebar-scroll">
          {!isCollapsed && (
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#64748b',
              padding: '0.4rem 0.5rem 0.15rem'
            }}>
              Navigation
            </div>
          )}

          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  width: '100%',
                  padding: isCollapsed ? '0.65rem 0' : '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
                  backgroundColor: isActive ? 'rgba(37, 99, 235, 0.18)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))' : 'none'
                  }}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span style={{
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <div>
                    {item.count !== undefined && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#93c5fd' : '#94a3b8',
                        padding: '1px 7px',
                        borderRadius: '999px',
                      }}>
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        backgroundColor: isActive ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        padding: '1px 6px',
                        borderRadius: '5px'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Quick Shortcuts */}
          {!isCollapsed ? (
            <div style={{ marginTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#64748b',
                padding: '0.15rem 0.5rem'
              }}>
                Quick Actions
              </div>

              <Link
                href="/admin/ipos/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '7px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#60a5fa',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                className="admin-shortcut-btn"
              >
                <Plus size={15} />
                <span>Create New IPO</span>
              </Link>

              <button
                onClick={onTriggerSync}
                disabled={syncing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '7px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="admin-shortcut-btn"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} color="#38bdf8" />
                <span>{syncing ? 'Syncing...' : 'Sync Scraper Data'}</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
              <Link
                href="/admin/ipos/new"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Create New IPO"
              >
                <Plus size={16} />
              </Link>
              <button
                onClick={onTriggerSync}
                disabled={syncing}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: syncing ? 'not-allowed' : 'pointer'
                }}
                title="Sync Scraper Data"
              >
                <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
              </button>
            </div>
          )}
        </div>

        {/* 4. BOTTOM FOOTER: Public Terminal Link & Profile */}
        <div style={{
          padding: isCollapsed ? '0.75rem 0.4rem' : '0.75rem 0.95rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#060911',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          flexShrink: 0
        }}>
          {!isCollapsed && (
            <Link
              href="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              className="admin-footer-link"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={13} color="#f59e0b" />
                <span>View Public Terminal</span>
              </div>
              <ExternalLink size={12} />
            </Link>
          )}

          {/* Admin User Chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
              <div style={{
                width: '32px',
                height: '32px',
                minWidth: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                boxShadow: '0 0 8px rgba(124, 58, 237, 0.4)'
              }}>
                {userInitial}
              </div>

              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {sessionUser?.name || sessionUser?.email?.split('@')[0] || 'Administrator'}
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {sessionUser?.email || 'admin@ipopreipo.com'}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease'
                }}
                className="admin-signout-btn"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .admin-nav-item:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
        }
        .admin-shortcut-btn:hover {
          filter: brightness(1.15);
        }
        .admin-footer-link:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }
        .admin-signout-btn:hover {
          color: #ef4444 !important;
        }
        .admin-sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .admin-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        @media (min-width: 1025px) {
          .desktop-collapse-btn {
            display: flex !important;
          }
          .admin-mobile-toggle {
            display: none !important;
          }
          aside.admin-sidebar {
            position: relative !important;
            transform: none !important;
          }
        }
        @media (max-width: 1024px) {
          .desktop-collapse-btn {
            display: none !important;
          }
          .admin-mobile-toggle {
            display: flex !important;
          }
          aside.admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            z-index: 9999 !important;
            transform: translateX(-100%);
          }
          aside.admin-sidebar.mobile-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}
