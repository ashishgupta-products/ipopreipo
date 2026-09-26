'use client';

import React from 'react';
import Link from 'next/link';
import { IpoItem } from '../../types';
import { 
  X, 
  Flame, 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  Building2, 
  FileText, 
  Calculator,
  ShieldCheck
} from 'lucide-react';

interface IpoDetailModalProps {
  ipo: IpoItem | null;
  onClose: () => void;
  onOpenCalculator: (ipo: IpoItem) => void;
}

export default function IpoDetailModal({ ipo, onClose, onOpenCalculator }: IpoDetailModalProps) {
  if (!ipo) return null;

  const minRetailInvestment = ipo.priceBandHigh * ipo.lotSize;
  const maxRetailLots = Math.floor(200000 / minRetailInvestment);
  const maxRetailShares = maxRetailLots * ipo.lotSize;
  const maxRetailInvestment = maxRetailShares * ipo.priceBandHigh;

  const sHniMinLots = maxRetailLots + 1;
  const sHniMinInvestment = sHniMinLots * ipo.lotSize * ipo.priceBandHigh;

  const gmpPercent = ((ipo.gmp / ipo.priceBandHigh) * 100);
  const estListingPrice = ipo.priceBandHigh + ipo.gmp;
  const estProfitPerLot = ipo.gmp * ipo.lotSize;

  const timelineSteps = [
    { label: 'Issue Opens', date: ipo.timeline.biddingStarts, isCompleted: true },
    { label: 'Issue Closes', date: ipo.timeline.biddingEnds, isCompleted: ipo.status !== 'UPCOMING' },
    { label: 'Allotment Finalized', date: ipo.timeline.allotmentFinalization, isCompleted: ipo.status === 'LISTED' || ipo.status === 'CLOSED' },
    { label: 'Refunds / Demat Credit', date: ipo.timeline.refundInitiation, isCompleted: ipo.status === 'LISTED' },
    { label: 'Listing on Exchange', date: ipo.timeline.listingDate, isCompleted: ipo.status === 'LISTED' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', padding: '1.75rem', backgroundColor: '#ffffff' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: ipo.category === 'SME' ? '#b45309' : '#2563eb',
              backgroundColor: ipo.category === 'SME' ? '#fffbeb' : '#eff6ff',
              padding: '2px 8px',
              borderRadius: '4px',
              border: ipo.category === 'SME' ? '1px solid #fde68a' : '1px solid #bfdbfe',
            }}>
              {ipo.category} IPO
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {ipo.exchange} • {ipo.symbol}
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}>
            {ipo.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem', lineHeight: '1.5' }}>
            {ipo.about}
          </p>
        </div>

        {/* Key Metrics Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
          gap: '0.75rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Price Band</div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              ₹{ipo.priceBandLow} - ₹{ipo.priceBandHigh}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Lot: {ipo.lotSize} Shares</div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Live GMP</div>
            <div className="mono" style={{ 
              fontSize: '1.1rem', 
              fontWeight: 800, 
              color: ipo.gmp >= 0 ? '#059669' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {ipo.gmp > 0 && <Flame size={14} color="#d97706" />}
              {ipo.gmp >= 0 ? `+₹${ipo.gmp}` : `-₹${Math.abs(ipo.gmp)}`}
            </div>
            <div style={{ fontSize: '0.7rem', color: ipo.gmp >= 0 ? '#059669' : '#dc2626', fontWeight: 600 }}>
              {gmpPercent >= 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`} Est. Gain
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Profit / Lot</div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              {estProfitPerLot >= 0 ? `₹${estProfitPerLot.toLocaleString('en-IN')}` : `-₹${Math.abs(estProfitPerLot).toLocaleString('en-IN')}`}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Est. Price: ₹{estListingPrice}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Issue Size</div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>
              ₹{ipo.issueSizeCr.toLocaleString('en-IN')} Cr
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {ipo.freshIssueCr ? `Fresh ₹${ipo.freshIssueCr} Cr` : '100% OFS'}
            </div>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="#387ed1" />
            <span>Official Issue Timeline</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 100px), 1fr))',
            gap: '0.5rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem'
          }}>
            {timelineSteps.map((step, idx) => (
              <div key={idx} style={{ textAlign: 'center', padding: '0.35rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step.isCompleted ? '#ecfdf5' : '#e2e8f0',
                  color: step.isCompleted ? '#059669' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.4rem auto',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {step.isCompleted ? '✓' : idx + 1}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{step.label}</div>
                <div className="mono" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                  {step.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Lots Breakdown */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={16} color="#059669" />
            <span>Application Lot Sizing (ASBA / UPI)</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '0.75rem'
          }}>
            {/* Retail Minimum */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Retail (Minimum)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>1 Lot ({ipo.lotSize} shares)</span>
                <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>
                  ₹{minRetailInvestment.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Retail Maximum */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Retail (Max ≤ ₹2 Lakh)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{maxRetailLots} Lots ({maxRetailShares} sh)</span>
                <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  ₹{maxRetailInvestment.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Small HNI */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Small HNI (sHNI &gt; ₹2L)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{sHniMinLots} Lots ({sHniMinLots * ipo.lotSize} sh)</span>
                <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb' }}>
                  ₹{sHniMinInvestment.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Subscription Status */}
        {ipo.subscription && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="#0284c7" />
              <span>Bidding Subscription Status</span>
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 90px), 1fr))',
              gap: '0.5rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>QIB</div>
                <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#0284c7' }}>
                  {ipo.subscription.qib}x
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>NII (HNI)</div>
                <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#387ed1' }}>
                  {ipo.subscription.nii}x
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Retail</div>
                <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>
                  {ipo.subscription.retail}x
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Total Subscribed</div>
                <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {ipo.subscription.total}x
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Highlights */}
        {ipo.financialHighlights && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={16} color="#d97706" />
              <span>Financial Snapshot (₹ Crores)</span>
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 95px), 1fr))',
              gap: '0.5rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Revenue</div>
                <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  ₹{ipo.financialHighlights.revenueCr.toLocaleString('en-IN')} Cr
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>PAT (Profit)</div>
                <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: ipo.financialHighlights.patCr >= 0 ? '#059669' : '#dc2626' }}>
                  ₹{ipo.financialHighlights.patCr.toLocaleString('en-IN')} Cr
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>EPS (₹)</div>
                <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  ₹{ipo.financialHighlights.eps}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>P/E Ratio</div>
                <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  {ipo.financialHighlights.peRatio > 0 ? `${ipo.financialHighlights.peRatio}x` : 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>RoNW (%)</div>
                <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  {ipo.financialHighlights.ronw}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <a
            href={ipo.registrarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <ShieldCheck size={16} color="#059669" />
            <span>Check Allotment on {ipo.registrar.split(' ')[0]}</span>
            <ExternalLink size={13} />
          </a>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              href={`/ipo/${ipo.id}`}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', borderColor: '#bfdbfe', backgroundColor: '#eff6ff' }}
              onClick={onClose}
            >
              <span>View Full Insights Page</span>
              <ExternalLink size={13} />
            </Link>

            <button
              className="btn-primary"
              onClick={() => {
                onClose();
                onOpenCalculator(ipo);
              }}
            >
              <Calculator size={16} />
              <span>Calculate Listing Gains</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
