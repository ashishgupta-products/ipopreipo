import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getCreditCardById, 
  getAllCreditCards 
} from '../../../data/creditCardsData';
import { 
  CreditCard, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Zap, 
  Sparkles, 
  ChevronRight,
  Info,
  Layers,
  Plane,
  Coins
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

export const dynamicParams = true;

export async function generateStaticParams() {
  const cards = getAllCreditCards();
  return cards.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const card = getCreditCardById(id);

  if (!card) {
    return {
      title: 'Credit Card Not Found | IPO & PreIPO India',
      description: 'The requested credit card could not be found.',
    };
  }

  return {
    title: `${card.name} Review 2026: Cashback, Fees, Lounge Access & RuPay UPI | IPO PreIPO India`,
    description: `Complete review of ${card.name} issued by ${card.bank}. Reward Rate: ${card.rewardRate}, Joining Fee: ${card.joiningFee}, Lounge Access: ${card.loungeAccess}, eligibility, and pros/cons.`,
  };
}

export default async function CreditCardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = getCreditCardById(id);

  if (!card) {
    notFound();
  }

  const allCards = getAllCreditCards();
  const otherCards = allCards.filter((c) => c.id !== card.id);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>
          <Link href="/credit-cards" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} />
            <span>All Credit Cards</span>
          </Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{card.name}</span>
        </div>

        {/* Hero Card */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8b5cf6, #a855f7)'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#8b5cf6',
                  backgroundColor: '#f5f3ff',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd6fe'
                }}>
                  {card.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  {card.network} • Issued by {card.bank}
                </span>
              </div>

              <h1 className="text-fluid-h1" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {card.name}
              </h1>

              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6', maxWidth: '720px' }}>
                {card.bestFor}
              </p>
            </div>

            <div>
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#8b5cf6' }}
              >
                <span>Apply for {card.name}</span>
                <ExternalLink size={16} />
              </a>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', marginTop: '0.4rem' }}>
                Official Bank Application
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
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Reward Rate</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>{card.rewardRate}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Primary benefit</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Joining Fee</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{card.joiningFee}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>First year charge</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Annual Fee</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{card.annualFee.split('(')[0]}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Waived on {card.annualWaiverSpend}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Airport Lounge</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>{card.loungeAccess}</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Travel privileges</span>
            </div>
          </div>
        </div>

        {/* Detailed Review & Background */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="#8b5cf6" />
            <span>About {card.name}</span>
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.7', marginBottom: '1.25rem' }}>
            {card.about}
          </p>
        </section>

        {/* Pros & Cons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #bbf7d0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>{card.name} Advantages (Pros)</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {card.pros.map((pro, idx) => (
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
              {card.cons.map((con, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                  <XCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Rewards Matrix */}
        <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins size={20} color="#059669" />
            <span>Complete Spend & Reward Rates Matrix</span>
          </h2>

          <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Spending Category</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Reward / Cashback Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Online Shopping & Ecommerce</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#059669', fontWeight: 700 }}>{card.rewardBreakdown.onlineShopping}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Offline In-Store Spends</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{card.rewardBreakdown.offlineSpends}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>UPI Payments (RuPay)</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#8b5cf6', fontWeight: 600 }}>{card.rewardBreakdown.upiSpends}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Utility Bill Payments</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{card.rewardBreakdown.utilities}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Fuel Surcharge Waiver</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{card.rewardBreakdown.fuel}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Lounge Access & Eligibility */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plane size={18} color="#2563eb" />
              <span>Airport Lounge Access Details</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {card.loungeDetails.map((lounge, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                  <CheckCircle2 size={14} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{lounge}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#059669" />
              <span>Application Eligibility Criteria</span>
            </h3>
            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem 0', color: '#64748b' }}>Age Requirement</td>
                  <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{card.eligibility.minAge}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem 0', color: '#64748b' }}>Minimum Monthly Salary</td>
                  <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{card.eligibility.minIncomeSalaried}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.65rem 0', color: '#64748b' }}>Recommended Credit Score</td>
                  <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 700, color: '#059669' }}>{card.eligibility.minCreditScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Credit Cards */}
        <section style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Compare Other Top Credit Cards
            </h3>
            <Link href="/credit-cards" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
              View All Credit Cards &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {otherCards.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/credit-cards/${item.id}`}
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
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {item.bank}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4' }}>
                    Reward: <strong style={{ color: '#059669' }}>{item.rewardRate}</strong>
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
                  <span>View Rewards & Fees</span>
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
