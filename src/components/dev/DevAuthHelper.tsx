'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Zap, LogOut, Check, ChevronUp, ChevronDown } from 'lucide-react';

export default function DevAuthHelper() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleQuickLogin = async (email: string, pass: string, role: string) => {
    setLoadingRole(role);
    try {
      // If currently signed in, sign out first or switch
      if (status === 'authenticated') {
        await signOut({ redirect: false });
      }

      const res = await signIn('credentials', {
        email,
        password: pass,
        redirect: false
      });

      if (res?.ok) {
        setOpen(false);
        router.refresh();
      } else {
        alert('Quick login failed. Make sure dev accounts are seeded in Neon DB.');
      }
    } catch (err) {
      console.error('Quick login error:', err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '18px',
      left: '18px',
      zIndex: 9999,
      fontFamily: 'inherit'
    }}>
      {/* Popover Card */}
      {open && (
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '14px',
          padding: '1rem',
          width: '280px',
          boxShadow: '0 20px 30px -10px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          animation: 'fadeIn 0.15s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="#f59e0b" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.02em', color: '#f8fafc' }}>
                DEV FAST-LOGIN
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>

          {session?.user ? (
            <div style={{ backgroundColor: '#1e293b', padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem' }}>
              <div style={{ color: '#94a3b8' }}>Currently active:</div>
              <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{session.user.email}</div>
              <div style={{ color: '#38bdf8', fontWeight: 600 }}>Role: {(session.user as any).role || 'user'}</div>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              1-Click shortcut to login without typing credentials:
            </div>
          )}

          {/* Quick Login Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => handleQuickLogin('admin@ipopreipo.com', 'admin123', 'admin')}
              disabled={loadingRole !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                cursor: loadingRole !== null ? 'not-allowed' : 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} />
                <span>{loadingRole === 'admin' ? 'Logging in...' : 'Super Admin'}</span>
              </div>
              <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: '4px' }}>
                1-CLICK
              </span>
            </button>

            <button
              onClick={() => handleQuickLogin('investor@ipopreipo.com', 'investor123', 'investor')}
              disabled={loadingRole !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                cursor: loadingRole !== null ? 'not-allowed' : 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} />
                <span>{loadingRole === 'investor' ? 'Logging in...' : 'Retail Investor'}</span>
              </div>
              <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: '4px' }}>
                1-CLICK
              </span>
            </button>

            {status === 'authenticated' && (
              <button
                onClick={() => signOut({ redirect: false }).then(() => router.refresh())}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: '#334155',
                  color: '#f8fafc',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginTop: '4px'
                }}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.45rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          border: '1px solid #334155',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: 700,
          transition: 'all 0.2s'
        }}
        title="Developer Quick Login Shortcut"
      >
        <Zap size={14} color="#f59e0b" fill="#f59e0b" />
        <span>Dev Shortcut</span>
        {open ? <ChevronDown size={13} color="#94a3b8" /> : <ChevronUp size={13} color="#94a3b8" />}
      </button>
    </div>
  );
}
