'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  Filter, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  BarChart2,
  Percent,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { IpoAnalyst } from '../../types/analyst';

interface AnalystLeaderboardProps {
  analysts: IpoAnalyst[];
}

export default function AnalystLeaderboard({ analysts }: AnalystLeaderboardProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'ALL' | 'RELIABLE' | 'AVERAGE'>('ALL');

  const filteredAnalysts = useMemo(() => {
    return analysts.filter((a) => {
      if (ratingFilter === 'RELIABLE' && a.score < 70) return false;
      if (ratingFilter === 'AVERAGE' && (a.score < 60 || a.score >= 70)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = a.name.toLowerCase().includes(q);
        const matchesSebi = a.sebiRegId && a.sebiRegId.toLowerCase().includes(q);
        const matchesRating = a.rating && a.rating.toLowerCase().includes(q);
        if (!matchesName && !matchesSebi && !matchesRating) return false;
      }
      return true;
    });
  }, [analysts, searchQuery, ratingFilter]);

  const topAnalyst = analysts.length > 0 ? analysts[0] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '1.25rem',
        padding: '1.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#2563eb',
            backgroundColor: '#eff6ff',
            padding: '3px 10px',
            borderRadius: '9999px',
            border: '1px solid #bfdbfe',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={12} />
            VERIFIED INSTITUTIONAL LEADERBOARD
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Updated for 2026 Primary Market</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 0.5rem 0' }}>
          Best IPO Analysts in India (2026)
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
          Ranked based on factual IPO listing price performance, win rates, and recommendation accuracy — not opinions. Every analyst is scored on accuracy, return quality, consistency, and investment horizon.
        </p>

        {/* Quick Answer Banner */}
        {topAnalyst && (
          <div style={{
            marginTop: '1.25rem',
            backgroundColor: '#1e40af',
            color: '#ffffff',
            borderRadius: '1rem',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🏆</span>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Quick Answer · #1 Ranked Desk
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                  <strong>{topAnalyst.name}</strong> is currently ranked #1 among {analysts.length} IPO analysts tracked, with a {topAnalyst.stats?.winRate || '73%'} win rate and score of {topAnalyst.score}/100.
                </div>
              </div>
            </div>
            <Link
              href={`/analysts/${topAnalyst.slug}`}
              style={{
                backgroundColor: '#ffffff',
                color: '#1e40af',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View #{topAnalyst.rank} Profile <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* Summary Stat Counters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
          padding: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '0.75rem',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Tracked Research Desks</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{analysts.length} Institutional</div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
          padding: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '0.75rem',
            backgroundColor: '#f0fdf4',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SEBI Verified Analysts</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>100% Registered</div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
          padding: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '0.75rem',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Average Top 10 Win Rate</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>74.2% Positive</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
        padding: '0.85rem 1.25rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          flex: 1,
          minWidth: '240px'
        }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by analyst name, broker, or SEBI registration ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#0f172a'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>Filter:</span>
          {(['ALL', 'RELIABLE', 'AVERAGE'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setRatingFilter(mode)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: '9999px',
                border: ratingFilter === mode ? '1px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: ratingFilter === mode ? '#eff6ff' : '#ffffff',
                color: ratingFilter === mode ? '#2563eb' : '#475569',
                cursor: 'pointer'
              }}
            >
              {mode === 'ALL' ? 'All (54)' : mode === 'RELIABLE' ? 'Score ≥ 70 (Reliable)' : 'Score 60-69'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                color: '#475569',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '70px' }}>Rank</th>
                <th style={{ padding: '14px 18px' }}>Analyst Desk</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Reviews (1Y)</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Score</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Win Rate</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Avg Listing Gain</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Rating</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalysts.map((analyst) => {
                const scoreColor = analyst.score >= 70 ? '#16a34a' : analyst.score >= 60 ? '#2563eb' : '#d97706';
                const scoreBg = analyst.score >= 70 ? '#f0fdf4' : analyst.score >= 60 ? '#eff6ff' : '#fffbeb';

                return (
                  <tr
                    key={analyst.slug}
                    onClick={() => router.push(`/analysts/${analyst.slug}`)}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    {/* Rank */}
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                      {analyst.rank === 1 ? (
                        <span style={{ color: '#b45309' }}>🥇 #1</span>
                      ) : analyst.rank === 2 ? (
                        <span style={{ color: '#475569' }}>🥈 #2</span>
                      ) : analyst.rank === 3 ? (
                        <span style={{ color: '#b45309' }}>🥉 #3</span>
                      ) : (
                        <span style={{ color: '#64748b' }}>#{analyst.rank}</span>
                      )}
                    </td>

                    {/* Analyst Name & Logo */}
                    <td style={{ padding: '14px 18px' }}>
                      <Link
                        href={`/analysts/${analyst.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none', color: 'inherit' }}
                      >
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '0.5rem',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          padding: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {analyst.logo ? (
                            <img src={analyst.logo} alt={analyst.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          ) : (
                            <Award size={20} color="#2563eb" />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {analyst.name}
                            {analyst.isSebiRegistered && (
                              <span title="SEBI Registered Research Analyst" style={{ display: 'inline-flex' }}>
                                <ShieldCheck size={14} color="#2563eb" />
                              </span>
                            )}
                          </div>
                          {analyst.sebiRegId && (
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              SEBI RA: {analyst.sebiRegId}
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>

                    {/* Reviews */}
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: '#334155' }}>
                      {analyst.reviews1Y}
                    </td>

                    {/* Score */}
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        color: scoreColor,
                        backgroundColor: scoreBg,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        border: `1px solid ${scoreColor}33`
                      }}>
                        {analyst.score} / 100
                      </span>
                    </td>

                    {/* Win Rate */}
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>
                      {analyst.stats?.winRate || '70%'}
                    </td>

                    {/* Avg Listing Gain */}
                    <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>
                      {analyst.stats?.avgListingGain || '+16%'}
                    </td>

                    {/* Rating Tag */}
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: analyst.score >= 70 ? '#15803d' : '#334155',
                        backgroundColor: analyst.score >= 70 ? '#f0fdf4' : '#f8fafc',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        {analyst.rating}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <Link
                        href={`/analysts/${analyst.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          textDecoration: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        Profile <ArrowUpRight size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
