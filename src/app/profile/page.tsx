'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award, 
  Save, 
  LogOut, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Building2,
  Lock
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [investorCategory, setInvestorCategory] = useState('RETAIL');
  const [dematProvider, setDematProvider] = useState('Zerodha');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Protect route
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Load profile from API / Neon DB
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setName(data.user.name || '');
            setEmail(data.user.email || '');
            setPhone(data.user.phone || '');
            setInvestorCategory(data.user.investorCategory || 'RETAIL');
            setDematProvider(data.user.dematProvider || 'Zerodha');
          }
        })
        .catch((err) => console.error('Failed to load profile:', err));
    }
  }, [status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          investorCategory,
          dematProvider,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setSuccessMsg('Profile updated and saved to Neon PostgreSQL successfully!');
      // Update client session
      await update({
        user: {
          name,
          phone,
          investorCategory,
          dematProvider,
        },
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>Loading investor profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryLabels: Record<string, { label: string; cap: string; color: string; bg: string }> = {
    RETAIL: { label: 'Retail Investor (RII)', cap: 'Max Bidding Limit: ₹2,00,000 per IPO', color: '#0284c7', bg: '#eff6ff' },
    sHNI: { label: 'Small HNI (sHNI)', cap: 'Bidding Range: ₹2,00,000 to ₹10,00,000', color: '#d97706', bg: '#fffbeb' },
    bHNI: { label: 'Big HNI (bHNI)', cap: 'Bidding Range: Above ₹10,00,000', color: '#7c3aed', bg: '#f5f3ff' },
    INSTITUTIONAL: { label: 'Institutional / Corporate', cap: 'QIB / Corporate Placement', color: '#059669', bg: '#ecfdf5' },
  };

  const catMeta = categoryLabels[investorCategory] || categoryLabels.RETAIL;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '2rem', paddingBottom: '3.5rem', maxWidth: '880px' }}>
        {/* Header Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              Investor Account & Profile
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Managed securely in your Neon PostgreSQL database
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fca5a5',
              padding: '0.55rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Investor Classification Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: catMeta.bg,
              border: `2px solid ${catMeta.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: catMeta.color
            }}>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {name || 'Investor'}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backgroundColor: catMeta.bg,
                  color: catMeta.color,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${catMeta.color}33`
                }}>
                  {catMeta.label}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                {email} • {catMeta.cap}
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#f1f5f9',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            color: '#334155',
            fontWeight: 600
          }}>
            <ShieldCheck size={15} color="#059669" />
            <span>Neon DB Synced</span>
          </div>
        </div>

        {/* Notices */}
        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#059669',
            padding: '0.85rem 1rem',
            borderRadius: '0.65rem',
            fontSize: '0.88rem',
            marginBottom: '1.25rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.85rem 1rem',
            borderRadius: '0.65rem',
            fontSize: '0.88rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Settings Form */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            Personal & Bidding Preferences
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Full Legal Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.4rem',
                      borderRadius: '0.6rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Email Address (Fixed)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    disabled
                    value={email}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.4rem',
                      borderRadius: '0.6rem',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      fontSize: '0.9rem',
                      color: '#64748b',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Mobile Phone (For IPO Allotment SMS)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.4rem',
                      borderRadius: '0.6rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Investor Bidding Category
                </label>
                <select
                  value={investorCategory}
                  onChange={(e) => setInvestorCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="RETAIL">Retail (Up to ₹2,00,000 / IPO)</option>
                  <option value="sHNI">sHNI (₹2 Lakh to ₹10 Lakh / IPO)</option>
                  <option value="bHNI">bHNI (Above ₹10 Lakh / IPO)</option>
                  <option value="INSTITUTIONAL">Institutional / Corporate</option>
                </select>
              </div>
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
                  padding: '0.75rem 1rem',
                  borderRadius: '0.6rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="Zerodha">Zerodha (Kite / UPI 2.0 ASBA)</option>
                <option value="Groww">Groww</option>
                <option value="Angel One">Angel One</option>
                <option value="Upstox">Upstox</option>
                <option value="ICICI Direct">ICICI Direct</option>
                <option value="HDFC Sky">HDFC Sky</option>
                <option value="Other">Other CDSL/NSDL Broker</option>
              </select>
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.6rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)',
                  opacity: saving ? 0.7 : 1
                }}
              >
                <Save size={16} />
                <span>{saving ? 'Saving changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
