import React from 'react';
import Link from 'next/link';
import { IpoItem, StockQuote } from '../../types';
import { Flame, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import IpoLogo from './IpoLogo';
import { getIpoDailyGmpChange } from '../../lib/ipoEnricher';

interface IpoTableProps {
  ipos: IpoItem[];
  onSelect: (ipo: IpoItem) => void;
  statusFilter?: 'LIVE' | 'UPCOMING' | 'LISTED';
  quotes?: Record<string, StockQuote>;
}

export default function IpoTable({ ipos, onSelect, statusFilter, quotes = {} }: IpoTableProps) {
  const isListedView = statusFilter === 'LISTED' || (ipos.length > 0 && ipos.every(i => i.status === 'LISTED'));

  return (
    <div className="table-responsive-wrapper">
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.84rem'
      }}>
        <thead>
          <tr style={{
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            color: '#64748b',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            position: 'sticky',
            top: 0,
            zIndex: 5
          }}>
            <th style={{ padding: '0.65rem 0.85rem' }}>Company / Exchange</th>
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
              {isListedView ? 'Issue Price' : 'Price Band'}
            </th>
            {isListedView ? (
              <>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#1d4ed8' }}>Listing Price</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#15803d' }}>Current Price (CMP)</th>
              </>
            ) : (
              <>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Issue Size</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Live GMP</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Est. Gain</th>
              </>
            )}
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Subscription</th>
            {!isListedView && (
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                Timeline
              </th>
            )}
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {ipos.map((ipo) => {
            const isListed = ipo.status === 'LISTED' || (typeof ipo.listingPrice === 'number' && ipo.listingPrice > 0);
            const listingPrice = ipo.listingPrice ?? (isListed && ipo.priceBandHigh ? ipo.priceBandHigh + (ipo.gmp || 0) : undefined);
            const listingGain = ipo.listingGainPercent ?? (isListed && ipo.priceBandHigh && listingPrice ? ((listingPrice - ipo.priceBandHigh) / ipo.priceBandHigh) * 100 : undefined);

            const quote = quotes[ipo.symbol] || quotes[ipo.id];
            const cmp = quote?.currentPrice ?? listingPrice;
            const cmpChange = quote?.change;
            const cmpChangePercent = quote?.changePercent;

            const gmpPercent = ((ipo.gmp / (ipo.priceBandHigh || 100)) * 100);
            const dailyChange = ipo.dailyGmpChange ?? getIpoDailyGmpChange(ipo);

            return (
              <tr
                key={ipo.id}
                onClick={() => onSelect(ipo)}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                {/* 1. Company Name, Symbol, Exchange, Category */}
                <td style={{ padding: '0.55rem 0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <IpoLogo name={ipo.name} symbol={ipo.symbol} logoUrl={ipo.logoUrl} size={28} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontWeight: 700,
                        color: '#0f172a',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '240px'
                      }}>
                        {ipo.name}
                      </div>
                      {isListed ? (
                        <div style={{
                          fontSize: '0.68rem',
                          color: '#64748b',
                          marginTop: '1px'
                        }}>
                          Listed on {ipo.timeline?.listingDate || ipo.listingDate || 'Completed'}
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '0.68rem',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginTop: '1px'
                        }}>
                          <span className="mono" style={{ fontWeight: 600, color: '#475569' }}>{ipo.symbol}</span>
                          <span>•</span>
                          <span>{ipo.exchange}</span>
                          {ipo.category === 'SME' ? (
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              color: '#b45309',
                              backgroundColor: '#fffbeb',
                              padding: '0px 4px',
                              borderRadius: '3px',
                              border: '1px solid #fde68a',
                              lineHeight: '1.2'
                            }}>
                              SME
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 600,
                              color: '#2563eb',
                              backgroundColor: '#eff6ff',
                              padding: '0px 4px',
                              borderRadius: '3px',
                              border: '1px solid #bfdbfe',
                              lineHeight: '1.2'
                            }}>
                              MAIN
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* 2. Issue Price / Price Band */}
                <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>
                  <div className="mono" style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}>
                    {isListedView
                      ? (ipo.priceBandHigh ? `₹${ipo.priceBandHigh}` : '₹100')
                      : (ipo.priceBandLow && ipo.priceBandHigh ? `₹${ipo.priceBandLow} - ₹${ipo.priceBandHigh}` : 'TBA')}
                  </div>
                  {!isListedView && (
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>
                      {ipo.lotSize && ipo.lotSize > 0 ? `Lot: ${ipo.lotSize}` : 'Lot: TBA'}
                    </div>
                  )}
                </td>

                {isListedView ? (
                  <>
                    {/* 3. Official Listing Price */}
                    <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>
                      <div className="mono" style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.86rem' }}>
                        ₹{listingPrice ?? '—'}
                      </div>
                      <div style={{
                        fontSize: '0.66rem',
                        color: (listingGain ?? 0) >= 0 ? '#15803d' : '#b91c1c',
                        fontWeight: 600,
                        marginTop: '1px'
                      }}>
                        Day 1: {(listingGain ?? 0) >= 0 ? `+${(listingGain ?? 0).toFixed(1)}%` : `${(listingGain ?? 0).toFixed(1)}%`}
                      </div>
                    </td>

                    {/* 4. Current Market Price (CMP) */}
                    <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>
                      <div className="mono" style={{
                        fontWeight: 800,
                        color: '#0f172a',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '4px'
                      }}>
                        <span className="pulse-indicator" style={{ width: '5px', height: '5px', backgroundColor: '#16a34a' }}></span>
                        <span>₹{cmp ?? '—'}</span>
                      </div>
                      {quote && cmpChange !== undefined ? (
                        <div style={{
                          fontSize: '0.66rem',
                          color: cmpChange >= 0 ? '#15803d' : '#b91c1c',
                          fontWeight: 700,
                          marginTop: '1px'
                        }}>
                          {cmpChange >= 0 ? `▲ +₹${cmpChange}` : `▼ -₹${Math.abs(cmpChange)}`} ({cmpChangePercent ? (cmpChangePercent >= 0 ? `+${cmpChangePercent.toFixed(1)}%` : `${cmpChangePercent.toFixed(1)}%`) : ''})
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '1px' }}>
                          Live Quote
                        </div>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    {/* 3. Issue Size */}
                    <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>
                      <div className="mono" style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem' }}>
                        {ipo.issueSizeCr && ipo.issueSizeCr > 0 ? `₹${ipo.issueSizeCr.toLocaleString('en-IN')} Cr` : 'TBA'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>
                        {ipo.freshIssueCr && ipo.freshIssueCr > 0 ? `Fresh ₹${ipo.freshIssueCr} Cr` : (ipo.issueSizeCr && ipo.issueSizeCr > 0 ? 'Pure OFS' : 'Unannounced')}
                      </div>
                    </td>

                    {/* 4. Live GMP & 24h Trend */}
                    <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>
                      <div className="mono" style={{
                        fontWeight: 800,
                        color: ipo.gmp >= 0 ? '#059669' : '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '3px',
                        fontSize: '0.86rem'
                      }}>
                        {ipo.gmp > 0 && <Flame size={12} color="#d97706" />}
                        {ipo.gmp >= 0 ? `+₹${ipo.gmp}` : `-₹${Math.abs(ipo.gmp)}`}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', marginTop: '2px' }}>
                        {dailyChange > 0 ? (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            color: '#15803d',
                            backgroundColor: '#dcfce7',
                            padding: '0px 4px',
                            borderRadius: '3px'
                          }}>
                            ▲ +₹{dailyChange}
                          </span>
                        ) : dailyChange < 0 ? (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            color: '#b91c1c',
                            backgroundColor: '#fee2e2',
                            padding: '0px 4px',
                            borderRadius: '3px'
                          }}>
                            ▼ -₹{Math.abs(dailyChange)}
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 600,
                            color: '#64748b',
                            backgroundColor: '#f1f5f9',
                            padding: '0px 4px',
                            borderRadius: '3px'
                          }}>
                            Flat
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Est. Listing Gain */}
                    <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>
                      <span className="mono" style={{
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        color: ipo.gmp >= 0 ? '#059669' : '#dc2626',
                        backgroundColor: ipo.gmp >= 0 ? '#ecfdf5' : '#fef2f2',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: ipo.gmp >= 0 ? '1px solid #a7f3d0' : '1px solid #fecaca',
                        display: 'inline-block'
                      }}>
                        {gmpPercent >= 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`}
                      </span>
                    </td>
                  </>
                )}

                {/* 6. Subscription */}
                <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>
                  {ipo.subscription ? (
                    <div>
                      <div className="mono" style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                        {ipo.subscription.total}x
                      </div>
                      {!isListedView && (
                        <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                          Ret: {ipo.subscription.retail}x
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>—</span>
                  )}
                </td>

                {/* 7. Dates (Live & Upcoming only) */}
                {!isListedView && (
                  <td style={{ padding: '0.55rem 0.85rem', textAlign: 'center' }}>
                    {ipo.status === 'CLOSED' ? (
                      <div>
                        <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.78rem' }}>
                          Allot: {ipo.timeline?.allotmentFinalization || 'In Progress'}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                          Close: {ipo.timeline?.biddingEnds || 'Closed'}
                        </div>
                      </div>
                    ) : ipo.status === 'UPCOMING' ? (
                      <div>
                        <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.78rem' }}>
                          {ipo.timeline?.biddingStarts || 'TBA'}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                          Opens
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.78rem' }}>
                          {ipo.timeline?.biddingEnds || 'Live'}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 600, marginTop: '1px' }}>
                          Closes
                        </div>
                      </div>
                    )}
                  </td>
                )}

                {/* 8. Action */}
                <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    {ipo.status === 'CLOSED' && ipo.registrarUrl && (
                      <a
                        href={ipo.registrarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#059669',
                          backgroundColor: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Allotment
                      </a>
                    )}
                    <Link
                      href={`/ipo/${ipo.id}`}
                      style={{
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#2563eb',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Details</span>
                      <ChevronRight size={11} />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
