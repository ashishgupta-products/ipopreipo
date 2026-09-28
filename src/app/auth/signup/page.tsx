'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TrendingUp, Lock, Mail, User, Phone, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [investorCategory, setInvestorCategory] = useState('RETAIL');
  const [dematProvider, setDematProvider] = useState('Zerodha');
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Register user via /api/auth/register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          investorCategory,
          dematProvider,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create account.');
      }

      // 2. Automatically log the user in
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push('/auth/signin');
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/profile' });
    } catch (err) {
      console.error(err);
      setGoogleLoading(false);
    }
  };

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
        <div style={{
          width: '100%',
          maxWidth: '500px',
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
              Create Investor Account
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Join India&apos;s leading IPO tracking & Pre-IPO unlisted market terminal
            </p>
          </div>

          {/* Segmented Auth Switcher (Sign In / Sign Up) */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '9px',
            marginBottom: '1.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <Link
              href="/auth/signin"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.42rem 0.5rem',
                borderRadius: '7px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.84rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              Sign In
            </Link>
            <div style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.42rem 0.5rem',
              borderRadius: '7px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.84rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
            }}>
              Create Account
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

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.4rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.4rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem 0.7rem 2.4rem',
                      borderRadius: '0.6rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Mobile (For Bidding SMS)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem 0.7rem 2.4rem',
                      borderRadius: '0.6rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Investor Category & Broker Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Investor Category
                </label>
                <select
                  value={investorCategory}
                  onChange={(e) => setInvestorCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="RETAIL">Retail (Up to ₹2 Lakh)</option>
                  <option value="sHNI">sHNI (₹2 Lakh - ₹10 Lakh)</option>
                  <option value="bHNI">bHNI (Above ₹10 Lakh)</option>
                  <option value="INSTITUTIONAL">Corporate / Institutional</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Primary Demat Broker
                </label>
                <select
                  value={dematProvider}
                  onChange={(e) => setDematProvider(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="Zerodha">Zerodha (Kite)</option>
                  <option value="Groww">Groww</option>
                  <option value="Angel One">Angel One</option>
                  <option value="Upstox">Upstox</option>
                  <option value="ICICI Direct">ICICI Direct</option>
                  <option value="HDFC Sky">HDFC Sky</option>
                  <option value="Other">Other CDSL/NSDL Broker</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
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
              <span>{loading ? 'Creating account in Neon DB...' : 'Create Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.5rem 0',
            color: '#94a3b8',
            fontSize: '0.8rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span style={{ padding: '0 1rem', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          {/* Google Sign-In */}
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
            <span>{googleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}</span>
          </button>

          {/* Footer Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Already have an account? </span>
            <Link href="/auth/signin" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
