'use client';

import React, { useState, useMemo } from 'react';
import { IpoGmpDaily } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface GmpChartProps {
  history: IpoGmpDaily[];
  issuePrice: number;
  compact?: boolean;
}

export default function GmpChart({ history, issuePrice, compact = false }: GmpChartProps) {
  const [metric, setMetric] = useState<'gmp' | 'percent'>('gmp');

  // Convert to chronological order: left = oldest, right = latest (today)
  const data = useMemo(() => {
    if (!history || history.length === 0) return [];
    // If first item is 'Today' or newest, reverse it for left-to-right timeline
    const isLatestFirst = history[0]?.date?.toLowerCase().includes('today') || 
                          (history.length > 1 && history[0]?.date > history[history.length - 1]?.date);
    return isLatestFirst ? [...history].reverse() : [...history];
  }, [history]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        No historical GMP movement data available yet.
      </div>
    );
  }

  // Active point defaults to latest (last point) if not hovered
  const currentPointIndex = activeIndex !== null ? activeIndex : data.length - 1;
  const activePoint = data[currentPointIndex] || data[data.length - 1];

  // Stats calculation
  const values = data.map((d) => (metric === 'gmp' ? d.gmp : d.gainPercent));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const startVal = values[0];
  const latestVal = values[values.length - 1];
  const netChange = latestVal - startVal;
  const isPositive = latestVal >= 0;

  // Chart dimensions
  const width = compact ? 340 : 640;
  const height = compact ? 120 : 220;
  const padding = compact 
    ? { top: 15, right: 15, bottom: 24, left: 15 } 
    : { top: 25, right: 45, bottom: 35, left: 45 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Range with safe vertical margin
  const valRange = maxVal - minVal;
  const safeRange = valRange === 0 ? (maxVal === 0 ? 10 : Math.abs(maxVal) * 0.2) : valRange;
  const yMin = Math.min(minVal - safeRange * 0.15, minVal < 0 ? minVal : 0);
  const yMax = maxVal + safeRange * 0.15;
  const totalRange = yMax - yMin || 1;

  // Coordinate mapping
  const points = data.map((d, i) => {
    const val = metric === 'gmp' ? d.gmp : d.gainPercent;
    const x = padding.left + (i / (data.length - 1 || 1)) * plotWidth;
    const y = padding.top + plotHeight - ((val - yMin) / totalRange) * plotHeight;
    return { x, y, val, item: d };
  });

  // Build SVG path
  const linePath = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    // Smooth Catmull-Rom or Bezier interpolation
    const prev = arr[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p.x},${p.y}`;
  }, '');

  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const baselineY = padding.top + plotHeight;
  const areaPath = `${linePath} L ${lastPt.x},${baselineY} L ${firstPt.x},${baselineY} Z`;

  // Color theme
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const fillColorTop = isPositive ? 'rgba(16, 185, 129, 0.28)' : 'rgba(239, 68, 68, 0.28)';
  const fillColorBottom = isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(239, 68, 68, 0.0)';

  // Horizontal Grid Lines
  const gridSteps = compact ? 2 : 4;
  const gridLines = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const frac = i / gridSteps;
    const val = yMin + frac * (yMax - yMin);
    const y = padding.top + plotHeight - frac * plotHeight;
    return { val, y };
  });

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = width / rect.width;
    const svgX = clientX * scaleX;

    // Find closest data point
    let closestIdx = 0;
    let minDistance = Infinity;
    points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  };

  const handlePointerLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: compact ? 'none' : '1px solid #e2e8f0',
      padding: compact ? '0.5rem 0' : '1.5rem',
      boxShadow: compact ? 'none' : 'var(--shadow-card)',
    }}>
      {/* Chart Header (non-compact) */}
      {!compact && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <Activity size={18} color="#2563eb" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Grey Market Premium (GMP) Trend Chart
              </h4>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: isPositive ? '#15803d' : '#b91c1c',
                backgroundColor: isPositive ? '#dcfce7' : '#fee2e2',
                padding: '2px 7px',
                borderRadius: '4px',
                border: isPositive ? '1px solid #bbf7d0' : '1px solid #fecaca'
              }}>
                {isPositive ? 'BULLISH DEMAND' : 'DISCOUNT'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
              Hover over points to inspect historical day-by-day sentiment trajectory
            </p>
          </div>

          {/* Metric Switcher Controls */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setMetric('gmp')}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: '6px',
                backgroundColor: metric === 'gmp' ? '#ffffff' : 'transparent',
                color: metric === 'gmp' ? '#0f172a' : '#64748b',
                boxShadow: metric === 'gmp' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              GMP Trend (₹)
            </button>
            <button
              onClick={() => setMetric('percent')}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: '6px',
                backgroundColor: metric === 'percent' ? '#ffffff' : 'transparent',
                color: metric === 'percent' ? '#0f172a' : '#64748b',
                boxShadow: metric === 'percent' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Est. Listing Gain (%)
            </button>
          </div>
        </div>
      )}

      {/* Floating Active Inspector Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: compact ? '0.4rem 0.6rem' : '0.75rem 1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={14} color="#64748b" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
            Session: <strong style={{ color: '#0f172a' }}>{activePoint.date}</strong>
          </span>
          {currentPointIndex === data.length - 1 && (
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              padding: '1px 5px',
              borderRadius: '3px'
            }}>
              LATEST
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', marginRight: '4px' }}>GMP:</span>
            <strong className="mono" style={{ fontSize: '0.95rem', color: activePoint.gmp >= 0 ? '#15803d' : '#dc2626' }}>
              {activePoint.gmp >= 0 ? `+₹${activePoint.gmp}` : `-₹${Math.abs(activePoint.gmp)}`}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', marginRight: '4px' }}>Est. Gain:</span>
            <strong className="mono" style={{ fontSize: '0.85rem', color: activePoint.gainPercent >= 0 ? '#15803d' : '#dc2626' }}>
              {activePoint.gainPercent >= 0 ? `+${activePoint.gainPercent}%` : `${activePoint.gainPercent}%`}
            </strong>
          </div>

          {!compact && (
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginRight: '4px' }}>Est. Listing Price:</span>
              <strong className="mono" style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                ₹{activePoint.estListingPrice}
              </strong>
            </div>
          )}

          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', marginRight: '4px' }}>24h Delta:</span>
            {activePoint.dailyChange > 0 ? (
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#15803d' }}>▲ +₹{activePoint.dailyChange}</span>
            ) : activePoint.dailyChange < 0 ? (
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#dc2626' }}>▼ -₹{Math.abs(activePoint.dailyChange)}</span>
            ) : (
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>▬ Flat</span>
            )}
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            overflow: 'visible',
            touchAction: 'none'
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id={`gmpGradient-${metric}-${compact ? 'c' : 'f'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColorTop} />
              <stop offset="100%" stopColor={fillColorBottom} />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={strokeColor} floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Horizontal Grid lines and Y-axis Labels */}
          {gridLines.map((g, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={g.y}
                x2={width - padding.right}
                y2={g.y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              {!compact && (
                <text
                  x={width - padding.right + 6}
                  y={g.y + 3}
                  fontSize="9"
                  fill="#94a3b8"
                  textAnchor="start"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {metric === 'gmp' ? `₹${Math.round(g.val)}` : `${Math.round(g.val)}%`}
                </text>
              )}
            </g>
          ))}

          {/* Area Fill */}
          <path
            d={areaPath}
            fill={`url(#gmpGradient-${metric}-${compact ? 'c' : 'f'})`}
          />

          {/* Main Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={compact ? "2" : "2.8"}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Vertical Inspector Guide Line */}
          {activeIndex !== null && (
            <line
              x1={points[activeIndex].x}
              y1={padding.top}
              x2={points[activeIndex].x}
              y2={padding.top + plotHeight}
              stroke="#64748b"
              strokeDasharray="3 3"
              strokeWidth="1.2"
            />
          )}

          {/* Data Points */}
          {points.map((p, idx) => {
            const isActive = idx === currentPointIndex;
            return (
              <g key={idx}>
                {/* Active Outer Pulse Ring */}
                {isActive && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={compact ? "7" : "10"}
                    fill={strokeColor}
                    fillOpacity="0.2"
                  />
                )}

                {/* Point Core */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? (compact ? 4 : 5.5) : (compact ? 2.5 : 3.5)}
                  fill="#ffffff"
                  stroke={strokeColor}
                  strokeWidth={isActive ? "2.5" : "2"}
                  style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                />

                {/* X-axis Date Labels */}
                {!compact && (
                  <text
                    x={p.x}
                    y={height - 10}
                    fontSize="10"
                    fill={isActive ? '#0f172a' : '#64748b'}
                    fontWeight={isActive ? '700' : '500'}
                    textAnchor="middle"
                  >
                    {p.item.date}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Metrics (Non-compact) */}
      {!compact && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Period High</span>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d', marginTop: '2px' }}>
              ₹{maxVal} ({((maxVal / (issuePrice || 1)) * 100).toFixed(1)}%)
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Period Low</span>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: minVal < 0 ? '#dc2626' : '#334155', marginTop: '2px' }}>
              ₹{minVal} ({((minVal / (issuePrice || 1)) * 100).toFixed(1)}%)
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>5-Day Net Delta</span>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: netChange >= 0 ? '#15803d' : '#dc2626', marginTop: '2px' }}>
              {netChange >= 0 ? `+₹${netChange}` : `-₹${Math.abs(netChange)}`}
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Issue Price Band</span>
            <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
              ₹{issuePrice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
