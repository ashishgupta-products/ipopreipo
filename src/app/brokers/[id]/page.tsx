import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getBrokerById, 
  getAllBrokers 
} from '../../../data/brokersData';
import { 
  TrendingUp, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  DollarSign, 
  Building2, 
  Zap, 
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

export const dynamicParams = true;

export async function generateStaticParams() {
  const brokers = getAllBrokers();
  return brokers.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const broker = getBrokerById(id);

  if (!broker) {
    return {
      title: 'Broker Not Found | IPO & PreIPO India',
      description: 'The requested stock broker could not be found.',
    };
  }

  return {
    title: `${broker.name} Review 2026: Brokerage Charges, Demat AMC & IPO Application | IPO PreIPO India`,
    description: `Complete review of ${broker.name}. Equity Delivery: ${broker.equityDelivery}, Intraday/F&O: ${broker.intradayFo}, Demat AMC: ${broker.amc}, IPO Mandate Success: ${broker.ipoUpiRating}, pros, cons, and full fee matrix.`,
  };
}

export default async function BrokerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const broker = getBrokerById(id);

  if (!broker) {
    notFound();
  }

  const allBrokers = getAllBrokers();
  const otherBrokers = allBrokers.filter((b) => b.id !== broker.id);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>
          <Link href="/brokers" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} />
            <span>All Brokers</span>
          </Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{broker.name}</span>
        </div>

        {/* Hero Card */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: broker.category === 'Discount' 
              ? 'linear-gradient(90deg, #059669, #10b981)' 
              : 'linear-gradient(90deg, #2563eb, #3b82f6)'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: broker.category === 'Discount' ? '#059669' : '#2563eb',
                  backgroundColor: broker.category === 'Discount' ? '#ecfdf5' : '#eff6ff',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: broker.category === 'Discount' ? '1px solid #a7f3d0' : '1px solid #bfdbfe'
                }}>
                  {broker.category} Broker
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem', fontWeight: 700, color: '#d97706' }}>
                  <Star size={15} fill="#d97706" />
                  <span>{broker.rating} / 5</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {broker.activeClients} Active Demat Accounts
                </span>
              </div>

              <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {broker.name}
              </h1>

              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6', maxWidth: '720px' }}>
                {broker.tagline}
              </p>
            </div>

            <div>
              <a
                href={broker.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Open {broker.name} Account</span>
                <ExternalLink size={16} />
              </a>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', marginTop: '0.4rem' }}>
                SEBI: {broker.sebiRegNo}
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
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Equity Delivery</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>{broker.charges.equityDelivery}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Long-term & IPO holdings</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Intraday / F&O</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{broker.charges.equityOptions}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Per executed order</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Demat AMC</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{broker.charges.dematAmc}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Annual maintenance</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>IPO UPI Success Rate</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>{broker.ipoUpiRating.split(' ')[0]}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Fast mandate dispatch</span>
            </div>
          </div>
        </div>

        {/* Detailed Review & Background */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} color="#2563eb" />
            <span>About {broker.name}</span>
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.7', marginBottom: '1.25rem' }}>
            {broker.about}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <div>
              Headquarters: <strong style={{ color: '#0f172a' }}>{broker.headquarters}</strong>
            </div>
            <div>
              Best Suited For: <strong style={{ color: '#0f172a' }}>{broker.bestFor}</strong>
            </div>
          </div>
        </section>

        {/* Pros & Cons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #bbf7d0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>{broker.name} Advantages (Pros)</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {broker.pros.map((pro, idx) => (
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
              {broker.cons.map((con, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                  <XCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Brokerage & Fee Matrix */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} color="#059669" />
            <span>Complete Brokerage & Charges Breakdown</span>
          </h2>

          <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Segment / Service</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Fee & Brokerage Schedule</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Equity Delivery</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#059669', fontWeight: 700 }}>{broker.charges.equityDelivery}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Equity Intraday</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{broker.charges.equityIntraday}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Equity Futures</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{broker.charges.equityFutures}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Equity Options</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155', fontWeight: 600 }}>{broker.charges.equityOptions}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Account Opening Fee</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{broker.charges.accountOpening}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Demat AMC (Annual Maintenance)</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{broker.charges.dematAmc}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>DP Charges on Stock Sale</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{broker.charges.dpCharges}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Call & Trade Surcharge</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{broker.charges.callAndTrade}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* IPO Bidding Features & Supported Platforms */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#2563eb" />
              <span>IPO Bidding via {broker.name}</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {broker.ipoFeatures.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={14} color="#2563eb" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#059669" />
              <span>Supported Trading Platforms</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {broker.platforms.map((plat, i) => (
                <span key={i} style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#334155',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)'
                }}>
                  {plat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Other Stock Brokers */}
        <section style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Compare Other Leading Brokers
            </h3>
            <Link href="/brokers" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
              View All Brokers &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {otherBrokers.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/brokers/${item.id}`}
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
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: item.category === 'Discount' ? '#059669' : '#2563eb' }}>
                      {item.category}
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
                    Delivery: <strong style={{ color: '#059669' }}>{item.equityDelivery}</strong> • AMC: {item.amc}
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
                  <span>View Review & Charges</span>
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
