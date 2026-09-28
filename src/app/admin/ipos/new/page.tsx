'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '../../../../components/admin/AdminSidebar';
import IpoEditorForm from '../../../../components/admin/IpoEditorForm';

export default function NewIpoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === 'admin';

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw className="animate-spin" size={32} color="#2563eb" />
      </div>
    );
  }

  if (status === 'unauthenticated' || !isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '520px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Admin Access Required
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Sign in with administrative privileges to create and manage IPO listings.
          </p>
          <Link
            href="/auth/signin?callbackUrl=/admin/ipos/new"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}
          >
            <span>Sign In to Continue</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f8fafc', position: 'relative' }}>
      <AdminSidebar
        activeTab="ipos"
        setActiveTab={(t) => router.push('/admin')}
        counts={{ ipos: 0, preIpos: 0, users: 0 }}
        sessionUser={session?.user as any}
        syncing={false}
        onTriggerSync={() => {}}
        onOpenCreateIpo={() => {}}
        onOpenCreatePreIpo={() => router.push('/admin')}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div style={{ flex: 1, minWidth: 0, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '2rem', maxWidth: '1500px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <IpoEditorForm isNew={true} />
        </main>
      </div>
    </div>
  );
}
