import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getPaymentAppById, 
  getAllPaymentApps 
} from '../../../data/paymentAppsData';
import { 
  Smartphone, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Zap, 
  QrCode, 
  ChevronRight,
  Info,
  Layers,
  Lock
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

export const dynamicParams = true;

export async function generateStaticParams() {
  const apps = getAllPaymentApps();
  return apps.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const app = getPaymentAppById(id);

  if (!app) {
    return {
      title: 'Payment App Not Found | IPO & PreIPO India',
      description: 'The requested UPI payment app could not be found.',
    };
  }

  return {
    title: `${app.name} UPI Review 2026: IPO Mandate Approval, Limits & Charges | IPO PreIPO India`,
    description: `Complete guide for ${app.name} (${app.developer}). IPO mandate success rate: ${app.ipoMandateSuccess}, maximum bidding limit: ${app.upiLimit}, step-by-step ASBA authorization guide, limits, and security specs.`,
  };
}

export default async function PaymentAppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = getPaymentAppById(id);

  if (!app) {
    notFound();
  }

  const allApps = getAllPaymentApps();
  const otherApps = allApps.filter((a) => a.id !== app.id);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>
          <Link href="/payment-apps" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} />
            <span>All Payment Apps</span>
          </Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{app.name}</span>
        </div>

        {/* Hero Card */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #059669, #10b981)'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#059669',
                  backgroundColor: '#ecfdf5',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: '1px solid #a7f3d0'
                }}>
                  {app.marketShare}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem', fontWeight: 700, color: '#d97706' }}>
                  <Star size={15} fill="#d97706" />
                  <span>{app.rating} / 5</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  By {app.developer}
                </span>
              </div>

              <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {app.name}
              </h1>

              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6', maxWidth: '720px' }}>
                {app.bestFor}
              </p>
            </div>

            <div>
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Visit {app.name} Portal</span>
                <ExternalLink size={16} />
              </a>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', marginTop: '0.4rem' }}>
                Headquarters: {app.headquarters}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>IPO Mandate Success</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>{app.ipoMandateSuccess}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Fastest authorization</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Max IPO Limit</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>₹5,00,000</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Per application via UPI 2.0</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>RuPay on UPI</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: app.rupayCcSupport ? '#2563eb' : '#94a3b8', marginTop: '2px' }}>
                {app.rupayCcSupport ? '✓ Supported' : '✕ Not Supported'}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Link credit card</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>UPI Lite (PIN-free)</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: app.upiLiteSupport ? '#059669' : '#94a3b8', marginTop: '2px' }}>
                {app.upiLiteSupport ? '✓ Up to ₹500' : '✕ Not Available'}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>100% server uptime</span>
            </div>
          </div>
        </div>

        {/* Detailed Review & Background */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={20} color="#059669" />
            <span>About {app.name}</span>
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.7', marginBottom: '1.25rem' }}>
            {app.about}
          </p>
        </section>

        {/* Pros & Cons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #bbf7d0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>{app.name} Advantages (Pros)</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {app.pros.map((pro, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                  <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #fecaca' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#991b1b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={18} color="#dc2626" />
              <span>Limitations (Cons)</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {app.cons.map((con, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                  <XCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step-by-Step IPO Mandate Approval Guide */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#166534', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#059669" />
            <span>How to Approve an IPO Mandate on {app.name}</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#15803d', marginBottom: '1.25rem' }}>
            Under SEBI regulations, IPO funds are not deducted when you apply. Instead, a block mandate is created in your bank account until allotment is finalized.
          </p>

          <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#14532d', lineHeight: '1.6' }}>
            {app.ipoMandateSteps.map((step, idx) => (
              <li key={idx}>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Daily Transaction & IPO Limits Breakdown */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="#2563eb" />
            <span>Official Daily Transfer & Bidding Limits</span>
          </h2>

          <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Transaction Category</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Authorized Daily Limits</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>IPO ASBA Application Limit</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#059669', fontWeight: 700 }}>{app.upiLimitsBreakdown.ipoDaily}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Peer to Peer (P2P) Daily Limit</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{app.upiLimitsBreakdown.p2pDaily}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Merchant (P2M) Payments</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{app.upiLimitsBreakdown.p2mDaily}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Max Single Transaction Cap</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{app.upiLimitsBreakdown.perTransaction}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Security Protocols */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="#059669" />
            <span>Security Protocols & Bank Encryption</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
            {app.securityFeatures.map((sec, idx) => (
              <div key={idx} style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: '#334155',
                fontWeight: 600
              }}>
                <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0 }} />
                <span>{sec}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Other UPI Apps */}
        <section style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Compare Other UPI Payment Apps
            </h3>
            <Link href="/payment-apps" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
              View All Payment Apps &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {otherApps.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/payment-apps/${item.id}`}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669' }}>
                      {item.marketShare}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>
                      <Star size={13} fill="#d97706" />
                      <span>{item.rating}</span>
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4' }}>
                    Mandate Success: <strong style={{ color: '#059669' }}>{item.ipoMandateSuccess}</strong>
                  </p>
                </div>

                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.6rem',
                  marginTop: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                  color: '#2563eb',
                  fontWeight: 600
                }}>
                  <span>View Mandate Guide</span>
                  <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
