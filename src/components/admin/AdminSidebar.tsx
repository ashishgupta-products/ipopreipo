'use client';

import React from 'react';
import Link from 'next/link';
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
  Activity,
  CheckCircle2
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export type AdminTab = 'overview' | 'ipos' | 'pre-ipos' | 'users' | 'sync';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  counts: {
    ipos: number;
    preIpos: number;
    users: number;
  };
  sessionUser?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  syncing: boolean;
  onTriggerSync: () => void;
  onOpenCreateIpo: () => void;
  onOpenCreatePreIpo: () => void;
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
  onOpenCreateIpo,
  onOpenCreatePreIpo,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: AdminSidebarProps) {
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; count?: number; badge?: string }[] = [
    { 
      id: 'overview', 
      label: 'Overview & Analytics', 
      icon: <TrendingUp size={19} />, 
      badge: 'Live' 
    },
    { 
      id: 'ipos', 
      label: 'Mainboard & SME IPOs', 
      icon: <Layers size={19} />, 
      count: counts.ipos 
    },
    { 
      id: 'pre-ipos', 
      label: 'Pre-IPO Unlisted Shares', 
      icon: <Award size={19} />, 
      count: counts.preIpos 
    },
    { 
      id: 'users', 
      label: 'Investor Community', 
      icon: <Users size={19} />, 
      count: counts.users 
    },
    { 
      id: 'sync', 
      label: 'Database & Sync Engine', 
      icon: <Database size={19} />, 
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
            backgroundColor: 'rgba(5, 10, 24, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          position: isMobileOpen ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          bottom: 0,
          height: '100vh',
          width: isCollapsed ? '78px' : '270px',
          minWidth: isCollapsed ? '78px' : '270px',
          backgroundColor: '#090d16',
          color: '#f8fafc',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isMobileOpen 
            ? 'translateX(0)' 
            : (typeof window !== 'undefined' && window.innerWidth <= 1024 ? 'translateX(-100%)' : 'none'),
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.35)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        className="admin-sidebar"
      >
        {/* Brand & Workspace Header */}
        <div style={{
          padding: isCollapsed ? '1.25rem 0.75rem' : '1.25rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '0.75rem',
          position: 'relative',
          backgroundColor: '#060911'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden' }}>
            <div style={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <ShieldCheck size={22} color="#ffffff" strokeWidth={2.2} />
            </div>

            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: 800, 
                    letterSpacing: '-0.02em', 
                    color: '#ffffff',
                    whiteSpace: 'nowrap'
                  }}>
                    IPO Terminal
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    letterSpacing: '0.04em'
                  }}>
                    ADMIN
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  Control & Management Suite
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              display: 'none', // shown via media query or default
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            className="desktop-collapse-btn"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Database Health Pill */}
        {!isCollapsed ? (
          <div style={{
            margin: '0.95rem 1rem 0.5rem',
            padding: '0.6rem 0.85rem',
            borderRadius: '9px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                position: 'relative',
                display: 'inline-flex',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }}></span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#34d399' }}>
                Neon Serverless DB
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#6ee7b7', backgroundColor: 'rgba(16, 185, 129, 0.16)', padding: '1px 6px', borderRadius: '4px' }}>
              Online
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.75rem 0' }} title="Neon PostgreSQL Active">
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }}></span>
          </div>
        )}

        {/* Main Navigation List */}
        <div style={{ flex: 1, padding: isCollapsed ? '0.75rem 0.5rem' : '0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {!isCollapsed && (
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#64748b',
              padding: '0.5rem 0.6rem 0.25rem'
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
                  padding: isCollapsed ? '0.75rem 0' : '0.75rem 0.95rem',
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
                  backgroundColor: isActive ? 'rgba(37, 99, 235, 0.18)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))' : 'none'
                  }}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span style={{
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      letterSpacing: '-0.01em',
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
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#93c5fd' : '#94a3b8',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        border: isActive ? '1px solid rgba(147, 197, 253, 0.3)' : 'none'
                      }}>
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        backgroundColor: isActive ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        letterSpacing: '0.04em'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Quick Actions Section */}
          {!isCollapsed ? (
            <>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#64748b',
                padding: '1.25rem 0.6rem 0.35rem'
              }}>
                Quick Shortcuts
              </div>

              <button
                onClick={onOpenCreateIpo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '9px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#60a5fa',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="admin-shortcut-btn"
              >
                <Plus size={16} />
                <span>Create New IPO</span>
              </button>

              <button
                onClick={onOpenCreatePreIpo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '9px',
                  backgroundColor: 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  color: '#c084fc',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="admin-shortcut-btn"
              >
                <Award size={16} />
                <span>Add Pre-IPO Equity</span>
              </button>

              <button
                onClick={onTriggerSync}
                disabled={syncing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '9px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="admin-shortcut-btn"
              >
                <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} color="#38bdf8" />
                <span>{syncing ? 'Syncing...' : 'Sync Scraper Data'}</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
              <button
                onClick={onOpenCreateIpo}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Create New IPO"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={onTriggerSync}
                disabled={syncing}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
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
                <RefreshCw size={17} className={syncing ? 'animate-spin' : ''} />
              </button>
            </div>
          )}
        </div>

        {/* Footer: Admin User Profile & External Link */}
        <div style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1rem 1.15rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#060911',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {!isCollapsed && (
            <Link
              href="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              className="admin-footer-link"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={14} color="#f59e0b" />
                <span>View Public Terminal</span>
              </div>
              <ExternalLink size={13} />
            </Link>
          )}

          {/* Admin User Chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
              <div style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: '0 0 10px rgba(124, 58, 237, 0.4)'
              }}>
                {userInitial}
              </div>

              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {sessionUser?.name || sessionUser?.email?.split('@')[0] || 'Administrator'}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
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
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease'
                }}
                className="admin-signout-btn"
                title="Sign Out"
              >
                <LogOut size={16} />
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
          transform: translateY(-1px);
        }
        .admin-footer-link:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }
        .admin-signout-btn:hover {
          color: #ef4444 !important;
        }
        @media (min-width: 1025px) {
          .desktop-collapse-btn {
            display: flex !important;
          }
        }
        @media (max-width: 1024px) {
          .desktop-collapse-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
