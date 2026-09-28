'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  TrendingUp, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  DollarSign, 
  Flame, 
  Database,
  Building,
  ArrowRight,
  Sliders,
  Award,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AdminSidebar, { AdminTab } from '../../components/admin/AdminSidebar';
import { IpoItem, IpoCategory, IpoStatus } from '../../types';

interface UserRecord {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  investor_category: string;
  demat_provider: string | null;
  role: string;
  created_at?: string;
}

interface PreIpoRecord {
  id: string;
  company_name: string;
  symbol: string | null;
  sector: string | null;
  price_per_share: number;
  lot_size: number;
  min_investment: number;
  status: string;
  description: string | null;
  logo_url: string | null;
}

export default function AdminPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [ipos, setIpos] = useState<IpoItem[]>([]);
  const [preIpos, setPreIpos] = useState<PreIpoRecord[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [ipoSearch, setIpoSearch] = useState('');
  const [ipoStatusFilter, setIpoStatusFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Modals
  const [preIpoModalOpen, setPreIpoModalOpen] = useState(false);
  const [editingPreIpo, setEditingPreIpo] = useState<Partial<PreIpoRecord> | null>(null);

  const isAdmin = (session?.user as any)?.role === 'admin';

  // Load all admin data once authorized
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, usersRes, iposRes, preIposRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/users'),
        fetch('/api/admin/ipos'),
        fetch('/api/admin/pre-ipos')
      ]);

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data.metrics);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
      if (iposRes.ok) {
        const data = await iposRes.json();
        setIpos(data.ipos || []);
      }
      if (preIposRes.ok) {
        const data = await preIposRes.json();
        setPreIpos(data.preIpos || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      loadAdminData();
    } else if (status === 'authenticated' && !isAdmin) {
      setLoading(false);
    }
  }, [status, isAdmin]);

  // Claim admin role handler (if no admin currently exists)
  const handleClaimAdmin = async () => {
    try {
      const res = await fetch('/api/admin/claim', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setActionMessage({ type: 'success', text: data.message });
        await updateSession({ user: { ...session?.user, role: 'admin' } });
        window.location.reload();
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to claim admin role.' });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Error claiming admin role.' });
    }
  };

  // Run scraper sync
  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/ipos/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Success! Processed ${data.count} IPOs into Neon DB. Source: ${data.source}`);
        await loadAdminData();
      } else {
        setSyncResult('Sync finished with cached fallback.');
      }
    } catch (err: any) {
      setSyncResult(`Sync error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // User role toggle
  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setActionMessage({ type: 'success', text: `Role updated to ${newRole.toUpperCase()}` });
      } else {
        const d = await res.json();
        setActionMessage({ type: 'error', text: d.error || 'Failed to update role' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Network error updating user role' });
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        setActionMessage({ type: 'success', text: 'User removed.' });
      } else {
        const d = await res.json();
        setActionMessage({ type: 'error', text: d.error || 'Failed to delete user' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Network error deleting user' });
    }
  };


  // Delete IPO
  const handleDeleteIpo = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete IPO "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/ipos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIpos(ipos.filter(i => i.id !== id));
        setActionMessage({ type: 'success', text: `IPO "${name}" deleted.` });
      } else {
        const d = await res.json();
        setActionMessage({ type: 'error', text: d.error || 'Failed to delete IPO' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Error deleting IPO' });
    }
  };

  // Pre-IPO Save
  const handleSavePreIpo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPreIpo?.company_name || !editingPreIpo?.price_per_share) return;

    try {
      const isEdit = !!editingPreIpo.id && preIpos.some(p => p.id === editingPreIpo.id);
      const url = '/api/admin/pre-ipos';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        id: editingPreIpo.id,
        companyName: editingPreIpo.company_name,
        symbol: editingPreIpo.symbol,
        sector: editingPreIpo.sector,
        pricePerShare: Number(editingPreIpo.price_per_share),
        lotSize: Number(editingPreIpo.lot_size || 50),
        status: editingPreIpo.status || 'AVAILABLE',
        description: editingPreIpo.description,
        logoUrl: editingPreIpo.logo_url
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setPreIpos(preIpos.map(p => p.id === data.preIpo.id ? data.preIpo : p));
        } else {
          setPreIpos([data.preIpo, ...preIpos]);
        }
        setPreIpoModalOpen(false);
        setEditingPreIpo(null);
        setActionMessage({ type: 'success', text: `Pre-IPO "${data.preIpo.company_name}" saved!` });
      } else {
        const d = await res.json();
        setActionMessage({ type: 'error', text: d.error || 'Failed to save Pre-IPO' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Error saving Pre-IPO' });
    }
  };

  // Delete Pre-IPO
  const handleDeletePreIpo = async (id: string, name: string) => {
    if (!confirm(`Delete Pre-IPO listing for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/pre-ipos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPreIpos(preIpos.filter(p => p.id !== id));
        setActionMessage({ type: 'success', text: `Pre-IPO "${name}" removed.` });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Error deleting Pre-IPO' });
    }
  };

  // Filtered IPOs
  const filteredIpos = ipos.filter(ipo => {
    const matchesSearch = ipo.name.toLowerCase().includes(ipoSearch.toLowerCase()) || 
                          ipo.symbol?.toLowerCase().includes(ipoSearch.toLowerCase());
    const matchesStatus = ipoStatusFilter === 'ALL' || ipo.status === ipoStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    return (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
           u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
           (u.phone || '').includes(userSearch);
  });

  // Loading state
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw className="animate-spin" size={36} color="#387ed1" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Verifying admin authorization...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (status === 'unauthenticated') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '520px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Admin Access Required
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
            Please sign in with your administrator credentials to access the IPO & Pre-IPO management console.
          </p>
          <Link
            href="/auth/signin?callbackUrl=/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none'
            }}
          >
            <span>Sign In to Admin Console</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '560px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem',
          border: '1px solid #fed7aa',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#fff7ed',
            color: '#ea580c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <AlertCircle size={28} />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Authorization Restricted
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            You are signed in as <strong>{session?.user?.email}</strong> with standard investor privileges. The administration suite is restricted to authorized administrators.
          </p>

          {actionMessage && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              backgroundColor: actionMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: actionMessage.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${actionMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {actionMessage.text}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleClaimAdmin}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={18} />
              <span>Claim Super Admin Role (Bootstrap Mode)</span>
            </button>
            <Link
              href="/"
              style={{
                display: 'block',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Return to Public IPO Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Platform Overview & Analytics',
      subtitle: 'Real-time telemetry, market health, and core asset distribution across India.'
    },
    ipos: {
      title: `Mainboard & SME IPO Registry (${ipos.length})`,
      subtitle: 'Manage active bidding issues, GMP premiums, price bands, and SEBI filing documents.'
    },
    'pre-ipos': {
      title: `Pre-IPO Unlisted Shares (${preIpos.length})`,
      subtitle: 'Curate high-growth private equities before public exchange debut.'
    },
    users: {
      title: `Investor Directory & Access Controls (${users.length})`,
      subtitle: 'Manage registered retail investors, HNIs, demat accounts, and administrator permissions.'
    },
    sync: {
      title: 'Database Pipeline & Data Synchronizer',
      subtitle: 'Sync live market data from Zerodha and InvestorGain directly into Neon PostgreSQL.'
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', position: 'relative' }}>
      {/* Sleek Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          ipos: ipos.length,
          preIpos: preIpos.length,
          users: users.length,
        }}
        sessionUser={session?.user as any}
        syncing={syncing}
        onTriggerSync={handleTriggerSync}
        onOpenCreateIpo={() => router.push('/admin/ipos/new')}
        onOpenCreatePreIpo={() => { setEditingPreIpo({}); setPreIpoModalOpen(true); }}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}>
        {/* Sticky Top Header Bar */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.9rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                cursor: 'pointer'
              }}
              className="admin-mobile-toggle"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu size={20} />
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>Admin Suite</span>
                <span style={{ color: '#cbd5e1', fontSize: '0.74rem' }}>/</span>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2563eb', textTransform: 'capitalize' }}>
                  {activeTab.replace('-', ' ')}
                </span>
              </div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {tabTitles[activeTab]?.title}
              </h1>
            </div>
          </div>

          {/* Header Action Shortcuts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.95rem',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: syncing ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(15, 23, 42, 0.15)'
              }}
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync Scraper'}</span>
            </button>

            {activeTab === 'ipos' && (
              <Link
                href="/admin/ipos/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.95rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                }}
              >
                <Plus size={15} />
                <span>Add IPO</span>
              </Link>
            )}

            {activeTab === 'pre-ipos' && (
              <button
                onClick={() => { setEditingPreIpo({}); setPreIpoModalOpen(true); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.95rem',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)'
                }}
              >
                <Plus size={15} />
                <span>Add Pre-IPO</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.85rem',
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
              title="Open public dashboard in new tab"
            >
              <span>Public Portal</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <main style={{
          padding: '1.75rem 2rem',
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          flex: 1
        }}>
          {/* Action toast message */}
          {actionMessage && (
            <div style={{
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: actionMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: actionMessage.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${actionMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              <span>{actionMessage.text}</span>
              <button onClick={() => setActionMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
            </div>
          )}

          {/* Sync Toast */}
          {syncResult && (
            <div style={{
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{syncResult}</span>
              <button onClick={() => setSyncResult(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
            </div>
          )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 4 Stat KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Registered Investors</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  {metrics?.users?.total || users.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  {metrics?.users?.retail || 0} Retail • {metrics?.users?.sHni || 0} sHNI • {metrics?.users?.bHni || 0} bHNI
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>IPOs in Database</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  {metrics?.ipos?.total || ipos.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{metrics?.ipos?.ongoing || 0} Ongoing</span> • {metrics?.ipos?.upcoming || 0} Upcoming • {metrics?.ipos?.closed || 0} Closed
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Pre-IPO Equities</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  {metrics?.preIpos?.total || preIpos.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  NSE, boAt, Swiggy, Reliance Retail Unlisted shares
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Neon DB Status</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Database size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
                  Connected
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                  Last sync: {metrics?.lastSync ? new Date(metrics.lastSync).toLocaleString('en-IN') : 'Live Real-time'}
                </div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Administrative Quick Actions
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <Link
                  href="/admin/ipos/new"
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  <Plus size={18} />
                  <span>Add New IPO</span>
                </Link>

                <button
                  onClick={() => {
                    setEditingPreIpo({
                      price_per_share: 500,
                      lot_size: 50,
                      status: 'AVAILABLE'
                    });
                    setPreIpoModalOpen(true);
                  }}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #fde68a',
                    backgroundColor: '#fefce8',
                    color: '#b45309',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={18} />
                  <span>Add Pre-IPO Listing</span>
                </button>

                <button
                  onClick={handleTriggerSync}
                  disabled={syncing}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: syncing ? 'not-allowed' : 'pointer'
                  }}
                >
                  <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
                  <span>{syncing ? 'Sync in progress...' : 'Run Scraper Sync'}</span>
                </button>
              </div>
            </div>

            {/* Recent Investors Preview */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Recent Investor Registrations
                </h2>
                <button
                  onClick={() => setActiveTab('users')}
                  style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  View All Investors →
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '0.75rem 1.5rem' }}>Investor</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Demat Broker</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1.5rem' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.name || 'Anonymous Investor'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: '#eff6ff',
                            color: '#2563eb'
                          }}>
                            {u.investor_category || 'RETAIL'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                          {u.demat_provider || 'Not specified'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: u.role === 'admin' ? '#f5f3ff' : '#f1f5f9',
                            color: u.role === 'admin' ? '#7c3aed' : '#475569'
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          No registered investors found in database yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE IPOS */}
        {activeTab === 'ipos' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {/* Header with Search and Add IPO */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search IPOs by company name or symbol..."
                    value={ipoSearch}
                    onChange={(e) => setIpoSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 1rem 0.55rem 2.2rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <select
                  value={ipoStatusFilter}
                  onChange={(e) => setIpoStatusFilter(e.target.value)}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="CLOSED">Closed</option>
                  <option value="LISTED">Listed</option>
                </select>
              </div>

              <Link
                href="/admin/ipos/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                <Plus size={16} />
                <span>Add New IPO</span>
              </Link>
            </div>

            {/* IPOs Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem 1.5rem' }}>IPO Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price Band</th>
                    <th style={{ padding: '0.75rem 1rem' }}>GMP (Est Gain)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIpos.map(ipo => {
                    const statusColors: Record<string, { bg: string; text: string }> = {
                      ONGOING: { bg: '#ecfdf5', text: '#059669' },
                      UPCOMING: { bg: '#eff6ff', text: '#2563eb' },
                      CLOSED: { bg: '#f1f5f9', text: '#64748b' },
                      LISTED: { bg: '#f5f3ff', text: '#7c3aed' }
                    };
                    const sc = statusColors[ipo.status] || { bg: '#f1f5f9', text: '#64748b' };
                    const gmpGain = ipo.priceBandHigh > 0 ? ((ipo.gmp / ipo.priceBandHigh) * 100).toFixed(1) : '0';

                    return (
                      <tr key={ipo.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1.5rem' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{ipo.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {ipo.symbol} • Issue: ₹{ipo.issueSizeCr} Cr
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: ipo.category === 'SME' ? '#fef3c7' : '#e0f2fe',
                            color: ipo.category === 'SME' ? '#b45309' : '#0369a1'
                          }}>
                            {ipo.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: sc.bg,
                            color: sc.text
                          }}>
                            {ipo.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#1e293b', fontWeight: 600 }}>
                          ₹{ipo.priceBandLow} - ₹{ipo.priceBandHigh}
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Lot: {ipo.lotSize} shares</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: ipo.gmp > 0 ? '#16a34a' : '#64748b' }}>
                            ₹{ipo.gmp} ({gmpGain}%)
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {Array.from({ length: ipo.fireRating || 3 }).map((_, idx) => (
                              <span key={idx} style={{ fontSize: '0.85rem' }}>🔥</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <Link
                              href={`/ipo/${ipo.id}`}
                              target="_blank"
                              title="View Public Page"
                              style={{
                                padding: '0.35rem',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                color: '#475569',
                                display: 'flex'
                              }}
                            >
                              <ExternalLink size={14} />
                            </Link>
                            <Link
                              href={`/admin/ipos/${ipo.id}/edit`}
                              title="Edit IPO (Full Page Editor)"
                              style={{
                                padding: '0.35rem',
                                borderRadius: '6px',
                                border: '1px solid #bfdbfe',
                                color: '#2563eb',
                                backgroundColor: '#eff6ff',
                                display: 'flex'
                              }}
                            >
                              <Edit3 size={14} />
                            </Link>
                            <button
                              onClick={() => handleDeleteIpo(ipo.id, ipo.name)}
                              title="Delete IPO"
                              style={{
                                padding: '0.35rem',
                                borderRadius: '6px',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                backgroundColor: '#fef2f2',
                                cursor: 'pointer',
                                display: 'flex'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE PRE-IPOS */}
        {activeTab === 'pre-ipos' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Pre-IPO & Unlisted Equities Desk
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                  Manage verified unlisted private equity opportunities published to the /pre-ipo page
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPreIpo({
                    price_per_share: 500,
                    lot_size: 50,
                    status: 'AVAILABLE'
                  });
                  setPreIpoModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                <span>Add Pre-IPO Company</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem 1.5rem' }}>Company</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Sector</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Share Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Lot Size</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Min Investment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {preIpos.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.company_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.symbol}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {item.sector || 'Unlisted'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                        ₹{Number(item.price_per_share).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {item.lot_size} shares
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#2563eb' }}>
                        ₹{Number(item.min_investment).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: item.status === 'AVAILABLE' ? '#ecfdf5' : '#fef3c7',
                          color: item.status === 'AVAILABLE' ? '#059669' : '#b45309'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => {
                              setEditingPreIpo({ ...item });
                              setPreIpoModalOpen(true);
                            }}
                            title="Edit Pre-IPO"
                            style={{
                              padding: '0.35rem',
                              borderRadius: '6px',
                              border: '1px solid #ddd6fe',
                              color: '#7c3aed',
                              backgroundColor: '#f5f3ff',
                              cursor: 'pointer',
                              display: 'flex'
                            }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePreIpo(item.id, item.company_name)}
                            title="Delete Pre-IPO"
                            style={{
                              padding: '0.35rem',
                              borderRadius: '6px',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              backgroundColor: '#fef2f2',
                              cursor: 'pointer',
                              display: 'flex'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {preIpos.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        No Pre-IPO listings found. Click "Add Pre-IPO Company" above to add unlisted shares.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USERS & ROLES */}
        {activeTab === 'users' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Investor Accounts & Roles
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                  Manage registered investor profiles, quota categories, demat accounts, and admin roles
                </p>
              </div>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search investors by name, email, phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem 0.5rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem 1.5rem' }}>Investor</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Bidding Quota</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Demat Broker</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name || 'Anonymous Investor'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {u.phone || '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#eff6ff',
                          color: '#2563eb'
                        }}>
                          {u.investor_category || 'RETAIL'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {u.demat_provider || 'Not provided'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: u.role === 'admin' ? '#f5f3ff' : '#f1f5f9',
                          color: u.role === 'admin' ? '#7c3aed' : '#475569',
                          border: u.role === 'admin' ? '1px solid #ddd6fe' : '1px solid #e2e8f0'
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button
                            onClick={() => handleToggleUserRole(u.id, u.role)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          </button>
                          {u.id !== (session?.user as any)?.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              title="Delete User"
                              style={{
                                padding: '0.35rem',
                                borderRadius: '6px',
                                border: '1px solid #fecaca',
                                backgroundColor: '#fef2f2',
                                color: '#dc2626',
                                cursor: 'pointer',
                                display: 'flex'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        No matching users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SYNC & DATABASE */}
        {activeTab === 'sync' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Live Market Scraper & Database Engine
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                    Trigger full sync from NSE, BSE, Chittorgarh, and Zerodha live feeds into Neon PostgreSQL
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Database</span>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>Neon Serverless Postgres</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total IPOs Cached</span>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{ipos.length} Public Offerings</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Pre-IPO Opportunities</span>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{preIpos.length} Unlisted Shares</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Last Scraper Sync</span>
                    <div style={{ fontWeight: 700, color: '#16a34a' }}>
                      {metrics?.lastSync ? new Date(metrics.lastSync).toLocaleString('en-IN') : 'Live Connected'}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTriggerSync}
                disabled={syncing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                }}
              >
                <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                <span>{syncing ? 'Scraping live exchanges and updating Neon DB...' : 'Run Scraper Sync Now'}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>



      {/* MODAL: ADD / EDIT PRE-IPO */}
      {preIpoModalOpen && editingPreIpo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingPreIpo.id ? 'Edit Pre-IPO Company' : 'Add Pre-IPO Opportunity'}
              </h3>
              <button
                onClick={() => { setPreIpoModalOpen(false); setEditingPreIpo(null); }}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePreIpo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Stock Exchange (NSE)"
                  value={editingPreIpo.company_name || ''}
                  onChange={(e) => setEditingPreIpo({ ...editingPreIpo, company_name: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Symbol / Ticker
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NSE"
                    value={editingPreIpo.symbol || ''}
                    onChange={(e) => setEditingPreIpo({ ...editingPreIpo, symbol: e.target.value.toUpperCase() })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Financial Exchanges"
                    value={editingPreIpo.sector || ''}
                    onChange={(e) => setEditingPreIpo({ ...editingPreIpo, sector: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Price Per Share (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 6450"
                    value={editingPreIpo.price_per_share || ''}
                    onChange={(e) => setEditingPreIpo({ ...editingPreIpo, price_per_share: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Minimum Lot Size
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={editingPreIpo.lot_size || 50}
                    onChange={(e) => setEditingPreIpo({ ...editingPreIpo, lot_size: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Availability Status
                </label>
                <select
                  value={editingPreIpo.status || 'AVAILABLE'}
                  onChange={(e) => setEditingPreIpo({ ...editingPreIpo, status: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="AVAILABLE">Available for Purchase</option>
                  <option value="PRE_LISTED">Pre-Listed (DRHP Filed)</option>
                  <option value="SOLD_OUT">Inventory Sold Out</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Overview & Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of business model, financials, and expected IPO date..."
                  value={editingPreIpo.description || ''}
                  onChange={(e) => setEditingPreIpo({ ...editingPreIpo, description: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => { setPreIpoModalOpen(false); setEditingPreIpo(null); }}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Save Pre-IPO Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
