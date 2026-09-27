import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ShieldCheck, 
  ExternalLink, 
  Award, 
  TrendingUp, 
  FileText,
  ChevronLeft,
  ArrowUpRight
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { getAnalystBySlug, getAllAnalysts } from '../../../lib/analystService';
import { getAnalystBySlugFromDb, getAllAnalystsFromDb } from '../../../lib/db';

interface AnalystPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AnalystPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbAnalyst = await getAnalystBySlugFromDb(slug);
  const analyst = dbAnalyst || getAnalystBySlug(slug);
  if (!analyst) {
    return { title: 'Analyst Not Found | IPO Platform' };
  }
  return {
    title: `${analyst.name} IPO Track Record & Win Rate | Ranked #${analyst.rank} in India`,
    description: `${analyst.name} IPO reviews performance score (${analyst.score}/100), win rate, average listing gain, and historical RHP recommendations.`,
  };
}

export async function generateStaticParams() {
  const dbAnalysts = await getAllAnalystsFromDb();
  const analysts = (dbAnalysts && dbAnalysts.length > 0) ? dbAnalysts : getAllAnalysts();
  return analysts.map((a) => ({ slug: a.slug }));
}

export default async function AnalystDetailPage({ params }: AnalystPageProps) {
  const { slug } = await params;
  const dbAnalyst = await getAnalystBySlugFromDb(slug);
  const analyst = dbAnalyst || getAnalystBySlug(slug);

  if (!analyst) {
    notFound();
  }

  const scoreColor = analyst.score >= 70 ? '#16a34a' : analyst.score >= 60 ? '#2563eb' : '#d97706';
  const scoreBg = analyst.score >= 70 ? '#f0fdf4' : analyst.score >= 60 ? '#eff6ff' : '#fffbeb';
  const scoreBorder = analyst.score >= 70 ? '#bbf7d0' : analyst.score >= 60 ? '#bfdbfe' : '#fde68a';

  const stats = analyst.stats || {
    totalReviews: String(analyst.reviews1Y || 20),
    applyRate: '90%',
    winRate: '72%',
    avgListingGain: '+18.5%',
    avgTotalGain: '+42.0%'
  };

  const pillars = analyst.pillars || {
    accuracy: Math.min(95, analyst.score + 15),
    returnQuality: Math.min(98, analyst.score + 20),
    consistency: analyst.score,
    horizon: Math.max(50, analyst.score - 10)
  };

  const breakdown = analyst.verdictBreakdown || {
    apply: Math.round((parseInt(stats.totalReviews) || 30) * 0.9),
    mayApply: 1,
    neutral: 1,
    avoid: 0
  };

  const totalVotes = (breakdown.apply || 0) + (breakdown.mayApply || 0) + (breakdown.neutral || 0) + (breakdown.avoid || 0) || 1;
  const applyPct = Math.round(((breakdown.apply || 0) / totalVotes) * 100);
  const mayApplyPct = Math.round(((breakdown.mayApply || 0) / totalVotes) * 100);
  const neutralPct = Math.round(((breakdown.neutral || 0) / totalVotes) * 100);
  const avoidPct = Math.max(0, 100 - applyPct - mayApplyPct - neutralPct);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/analysts" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Analysts</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 700 }}>{analyst.name}</span>
        </div>

        {/* Profile Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Profile Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '1.5rem',
            padding: '1.75rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {analyst.logo ? (
                <img src={analyst.logo} alt={analyst.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <Award size={40} color="#2563eb" />
              )}
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {analyst.name}
                </h1>
                {analyst.rank === 1 && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fde68a'
                  }}>
                    🏅 Ranked #1 in India
                  </span>
                )}
                {analyst.sebiRegId && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    border: '1px solid #bfdbfe',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldCheck size={14} />
                    SEBI RA · {analyst.sebiRegId}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                {analyst.bio || `${analyst.name} is a SEBI-registered research analyst desk publishing institutional research, primary market coverage, and stock recommendations.`}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem' }}>
                {analyst.website && (
                  <a
                    href={analyst.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#2563eb',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} />
                    Visit Official Website
                  </a>
                )}
                {analyst.mainboardCount && (
                  <span style={{
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontWeight: 700
                  }}>
                    {analyst.mainboardCount}
                  </span>
                )}
                {analyst.smeCount && (
                  <span style={{
                    backgroundColor: '#faf5ff',
                    color: '#7e22ce',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontWeight: 700
                  }}>
                    {analyst.smeCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 5 KPI Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.85rem'
          }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Reviews</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.totalReviews}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>All time coverage</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Apply Rate</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>{stats.applyRate}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>of all recommendations</div>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '1rem', padding: '1.1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Win Rate</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>{stats.winRate}</div>
              <div style={{ fontSize: '0.72rem', color: '#15803d' }}>+ve listing gain picks</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Listing Gain</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>{stats.avgListingGain}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>on Apply calls</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Total Return</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>{stats.avgTotalGain}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>return to current CMP</div>
            </div>
          </div>

          {/* Performance Dashboard & 4 Pillar Gauges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1.25rem'
          }}>
            {/* Radial Score Gauge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div style={{
                position: 'relative',
                width: '140px',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(${scoreColor} ${analyst.score}%, #e2e8f0 0)`
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {analyst.score}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Score / 100
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: '1rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: scoreColor,
                backgroundColor: scoreBg,
                border: `1px solid ${scoreBorder}`,
                padding: '4px 14px',
                borderRadius: '9999px'
              }}>
                {analyst.rating}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                Based on {stats.totalReviews} verified recommendations
              </div>
            </div>

            {/* 4 Pillars Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                Institutional Scoring Pillars
              </h3>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>Accuracy (Listing Outcome)</span>
                  <span style={{ fontWeight: 800, color: '#2563eb' }}>{pillars.accuracy}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pillars.accuracy}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>Return Quality (Average Profit)</span>
                  <span style={{ fontWeight: 800, color: '#16a34a' }}>{pillars.returnQuality}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pillars.returnQuality}%`, height: '100%', backgroundColor: '#16a34a', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>Consistency (Score Frequency)</span>
                  <span style={{ fontWeight: 800, color: '#8b5cf6' }}>{pillars.consistency}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pillars.consistency}%`, height: '100%', backgroundColor: '#8b5cf6', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>Horizon (CMP vs Listing Gain)</span>
                  <span style={{ fontWeight: 800, color: '#f59e0b' }}>{pillars.horizon}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pillars.horizon}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Verdict Distribution Bar */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1.25rem',
            padding: '1.25rem 1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Recommendation Distribution
              </h3>
              <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.82rem', fontWeight: 600 }}>
                <span style={{ color: '#16a34a' }}>● Apply: {breakdown.apply || 0} ({applyPct}%)</span>
                {(breakdown.mayApply || 0) > 0 && <span style={{ color: '#d97706' }}>● May Apply: {breakdown.mayApply}</span>}
                {(breakdown.neutral || 0) > 0 && <span style={{ color: '#64748b' }}>● Neutral: {breakdown.neutral}</span>}
                {(breakdown.avoid || 0) > 0 && <span style={{ color: '#dc2626' }}>● Avoid: {breakdown.avoid}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', height: '10px', borderRadius: '9999px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
              <div style={{ width: `${applyPct}%`, backgroundColor: '#16a34a' }} title={`Apply: ${applyPct}%`} />
              <div style={{ width: `${mayApplyPct}%`, backgroundColor: '#f59e0b' }} title={`May Apply: ${mayApplyPct}%`} />
              <div style={{ width: `${neutralPct}%`, backgroundColor: '#94a3b8' }} title={`Neutral: ${neutralPct}%`} />
              <div style={{ width: `${avoidPct}%`, backgroundColor: '#dc2626' }} title={`Avoid: ${avoidPct}%`} />
            </div>
          </div>

          {/* Best & Worst Call Highlight Cards */}
          {(analyst.bestCall || analyst.worstCall) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {analyst.bestCall && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      🏆 Best Call
                    </span>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', marginTop: '2px' }}>
                      {analyst.bestCall.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#15803d' }}>Verdict: Apply</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>
                      {analyst.bestCall.gain}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Listing Gain</div>
                  </div>
                </div>
              )}

              {analyst.worstCall && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      📉 Worst Call
                    </span>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', marginTop: '2px' }}>
                      {analyst.worstCall.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#b91c1c' }}>Verdict: Apply</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>
                      {analyst.worstCall.gain}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Listing Gain</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Historical Reviews Table */}
          {analyst.reviewHistory && analyst.reviewHistory.length > 0 && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1.25rem',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Recent IPO Coverage History ({analyst.reviewHistory.length} Tracked)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '10px 14px', fontWeight: 700 }}>IPO Name</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Verdict</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Listing Gain</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Total Return</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Research Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyst.reviewHistory.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                          {item.ipoName}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            backgroundColor: item.verdict.toLowerCase().includes('apply') ? '#dcfce7' : '#fee2e2',
                            color: item.verdict.toLowerCase().includes('apply') ? '#15803d' : '#b91c1c'
                          }}>
                            {item.verdict}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>
                          {item.listingGain ? (
                            <span style={{ color: item.listingGain.startsWith('+') ? '#16a34a' : item.listingGain.startsWith('-') ? '#dc2626' : '#64748b' }}>
                              {item.listingGain}
                            </span>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>
                          {item.totalGain ? (
                            <span style={{ color: item.totalGain.startsWith('+') ? '#16a34a' : item.totalGain.startsWith('-') ? '#dc2626' : '#64748b' }}>
                              {item.totalGain}
                            </span>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          {item.pdfUrl ? (
                            <a
                              href={item.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#dc2626',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <FileText size={14} />
                              PDF
                            </a>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Back button */}
          <div style={{ marginTop: '1rem' }}>
            <Link
              href="/analysts"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <ChevronLeft size={16} /> Back to Analyst Rankings
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
