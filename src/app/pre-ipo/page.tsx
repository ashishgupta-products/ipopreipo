'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ArrowLeft, Clock } from 'lucide-react';

export default function PreIpoPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '3rem 2rem',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <Clock size={28} />
          </div>

          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Preipo (Unlisted)
          </h1>

          <div style={{
            display: 'inline-block',
            backgroundColor: '#fef3c7',
            color: '#b45309',
            fontSize: '0.82rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid #fde68a',
            marginBottom: '1.25rem',
            letterSpacing: '0.03em'
          }}>
            Coming Soon
          </div>

          <p style={{
            fontSize: '0.92rem',
            color: '#64748b',
            lineHeight: 1.5,
            marginBottom: '2rem'
          }}>
            Our Pre-IPO desk is coming soon. Stay tuned for updates!
          </p>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '0.65rem 1.4rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.15s ease'
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Live IPOs</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
