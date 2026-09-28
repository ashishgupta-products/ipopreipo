'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '../../../../../components/admin/AdminSidebar';
import IpoEditorForm from '../../../../../components/admin/IpoEditorForm';
import { IpoItem } from '../../../../../types';

export default function EditIpoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [ipo, setIpo] = useState<IpoItem | null>(null);
  const [loadingIpo, setLoadingIpo] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isAdmin = (session?.user as any)?.role === 'admin';

  useEffect(() => {
    if (status === 'authenticated' && isAdmin && id) {
      fetch(`/api/admin/ipos?id=${encodeURIComponent(id)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.ipo) {
            setIpo(data.ipo);
          } else {
            setLoadError(data.error || 'Failed to locate IPO record.');
          }
        })
        .catch((err) => {
          setLoadError(err.message || 'Error fetching IPO data.');
        })
        .finally(() => {
          setLoadingIpo(false);
        });
    }
  }, [status, isAdmin, id]);

  if (status === 'loading' || (status === 'authenticated' && isAdmin && loadingIpo)) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <RefreshCw className="animate-spin" size={36} color="#2563eb" />
        <p style={{ color: '#64748b', fontSize: '0.92rem' }}>Loading IPO record from Neon Database...</p>
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
            Sign in with administrative credentials to modify this IPO.
          </p>
          <Link
            href={`/auth/signin?callbackUrl=/admin/ipos/${id}/edit`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}
          >
            <span>Sign In to Continue</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (loadError || !ipo) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '560px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', border: '1px solid #fed7aa' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <AlertCircle size={28} />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            IPO Not Found
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            {loadError || `Could not find an IPO matching ID "${id}".`}
          </p>
          <Link
            href="/admin"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}
          >
            <span>Return to Admin Dashboard</span>
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
        onOpenCreateIpo={() => router.push('/admin/ipos/new')}
        onOpenCreatePreIpo={() => router.push('/admin')}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div style={{ flex: 1, minWidth: 0, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '2rem', maxWidth: '1500px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <IpoEditorForm initialData={ipo} isNew={false} />
        </main>
      </div>
    </div>
  );
}
