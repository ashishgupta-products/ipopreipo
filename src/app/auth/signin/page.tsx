'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TrendingUp, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, User, Zap } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fastLoadingRole, setFastLoadingRole] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(
    urlError === 'Configuration'
      ? 'Server configuration alert: Please verify AUTH_SECRET in your Vercel project settings.'
      : urlError === 'CredentialsSignin'
      ? 'Invalid email or password. Please verify your credentials.'
      : urlError
      ? `Authentication notice: ${urlError}`
      : ''
  );

  const executeSignIn = async (userEmail: string, userPass: string, redirectTarget?: string) => {
    setError('');
    try {
      const res = await signIn('credentials', {
        email: userEmail,
        password: userPass,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password. Please verify the credentials.');
      } else {
        const dest = redirectTarget || callbackUrl;
        router.push(dest);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during sign in.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await executeSignIn(email, password);
    setLoading(false);
  };

  const handle1ClickDevLogin = async (userEmail: string, userPass: string, roleName: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setFastLoadingRole(roleName);
    const target = roleName === 'admin' && callbackUrl === '/' ? '/admin' : callbackUrl;
    await executeSignIn(userEmail, userPass, target);
    setFastLoadingRole(null);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (err) {
      console.error(err);
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '460px',
      backgroundColor: '#ffffff',
      borderRadius: '1.25rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
      padding: '2.5rem 2rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #387ed1 0%, #00b386 100%)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(56, 126, 209, 0.3)'
        }}>
          <TrendingUp size={24} color="#ffffff" />
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
          Sign in to manage your investor profile, Demat broker & watchlists
        </p>
      </div>

      {/* ⚡ DEV FAST-LOGIN 1-CLICK SHORTCUTS */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        padding: '1.15rem',
        marginBottom: '1.75rem',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em', color: '#f8fafc' }}>
              DEV SHORTCUTS (1-CLICK LOGIN)
            </span>
          </div>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            padding: '2px 7px',
            borderRadius: '4px',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            NO TYPING
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handle1ClickDevLogin('admin@ipopreipo.com', 'admin123', 'admin')}
            disabled={fastLoadingRole !== null || loading}
            style={{
              padding: '0.75rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)',
              transition: 'transform 0.1s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>{fastLoadingRole === 'admin' ? 'Logging in...' : 'Super Admin'}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#ddd6fe' }}>admin@ipopreipo.com</span>
          </button>

          <button
            type="button"
            onClick={() => handle1ClickDevLogin('investor@ipopreipo.com', 'investor123', 'investor')}
            disabled={fastLoadingRole !== null || loading}
            style={{
              padding: '0.75rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
              transition: 'transform 0.1s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.85rem' }}>
              <User size={16} />
              <span>{fastLoadingRole === 'investor' ? 'Logging in...' : 'Retail Investor'}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#bfdbfe' }}>investor@ipopreipo.com</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem 1rem',
          borderRadius: '0.65rem',
          fontSize: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.4rem',
                borderRadius: '0.6rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 2.4rem',
                borderRadius: '0.6rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: '#ffffff'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || fastLoadingRole !== null}
          style={{
            marginTop: '0.5rem',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.6rem',
            padding: '0.85rem',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
            transition: 'opacity 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          <span>{loading ? 'Signing in...' : 'Sign In to Portal'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '1.75rem 0',
        color: '#94a3b8',
        fontSize: '0.8rem'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        <span style={{ padding: '0 1rem', fontWeight: 600 }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
      </div>

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '0.6rem',
          padding: '0.75rem',
          fontWeight: 600,
          fontSize: '0.88rem',
          color: '#334155',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          transition: 'background-color 0.2s'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.36 7.34 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
        <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
      </button>

      {/* Footer Link */}
      <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#64748b' }}>
        <span>Don&apos;t have an account? </span>
        <Link href="/auth/signup" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem'
      }}>
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Loading authentication portal...
          </div>
        }>
          <SignInContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
