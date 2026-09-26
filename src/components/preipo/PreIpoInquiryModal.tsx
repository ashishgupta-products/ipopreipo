'use client';

import React, { useState } from 'react';
import { PreIpoItem } from '../../types';
import { 
  X, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Send 
} from 'lucide-react';

interface PreIpoInquiryModalProps {
  item: PreIpoItem | null;
  initialType: 'BUY' | 'SELL';
  onClose: () => void;
}

export default function PreIpoInquiryModal({ item, initialType, onClose }: PreIpoInquiryModalProps) {
  if (!item) return null;

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>(initialType);
  const [multiplier, setMultiplier] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [depository, setDepository] = useState<'CDSL' | 'NSDL'>('CDSL');
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  const totalShares = item.lotSize * multiplier;
  const grossAmount = totalShares * item.sharePrice;
  const stampDuty = Math.round(grossAmount * 0.00015);
  const totalPayable = grossAmount + stampDuty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const ref = `UNL-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(ref);
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', padding: '1.75rem', backgroundColor: '#ffffff' }}
      >
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
          }}
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="glass-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                  Unlisted Shares Desk
                </span>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  ISIN: {item.isin}
                </span>
              </div>

              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                {item.name}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Direct Demat Transfer (CDSL / NSDL) with institutional escrow guarantee.
              </p>
            </div>

            {/* Buy / Sell Toggle Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              backgroundColor: '#f1f5f9',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              border: '1px solid #e2e8f0'
            }}>
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                style={{
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: tradeType === 'BUY' ? '#ffffff' : '#64748b',
                  backgroundColor: tradeType === 'BUY' ? '#0284c7' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                I Want to Buy Shares
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                style={{
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: tradeType === 'SELL' ? '#ffffff' : '#64748b',
                  backgroundColor: tradeType === 'SELL' ? '#475569' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                I Want to Sell Shares
              </button>
            </div>

            {/* Lot & Price Calculation */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Indicative Price / Share
                  </div>
                  <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{item.sharePrice.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Multiplier Stepper */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'right', marginBottom: '4px' }}>
                    Lots (Lot size: {item.lotSize})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      disabled={multiplier <= 1}
                      onClick={() => setMultiplier(Math.max(1, multiplier - 1))}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: multiplier <= 1 ? '#94a3b8' : '#0f172a'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="mono" style={{ minWidth: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                      {multiplier}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMultiplier(multiplier + 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0f172a'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary line */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: '#475569' }}>
                  Total Shares: <strong style={{ color: '#0f172a' }}>{totalShares} units</strong>
                </span>
                <span className="mono" style={{ fontWeight: 800, color: '#0284c7', fontSize: '1.05rem' }}>
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-two-col" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#0f172a'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              <div className="form-two-col" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                    Email ID
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#0f172a'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                    Demat Depository
                  </label>
                  <select
                    value={depository}
                    onChange={(e) => setDepository(e.target.value as 'CDSL' | 'NSDL')}
                    style={{
                      width: '100%',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#0f172a'
                    }}
                  >
                    <option value="CDSL">CDSL (Zerodha, Groww, AngelOne)</option>
                    <option value="NSDL">NSDL (ICICI, HDFC Sec, Kotak)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '0.95rem',
                  backgroundColor: tradeType === 'BUY' ? '#0284c7' : '#475569'
                }}
              >
                <Send size={16} />
                <span>Submit {tradeType === 'BUY' ? 'Buy Order Inquiry' : 'Sell Inquiry'} (₹{totalPayable.toLocaleString('en-IN')})</span>
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              color: '#059669'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              Inquiry Dispatched Successfully!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
              Your {tradeType} order request for <strong>{totalShares} shares</strong> of <strong>{item.name}</strong> has been logged.
            </p>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'inline-block',
              textAlign: 'left',
              width: '100%',
              marginBottom: '1.5rem',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Reference ID:</span>
                <span className="mono" style={{ fontWeight: 700, color: '#0284c7' }}>{orderRef}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Estimated Value:</span>
                <span className="mono" style={{ fontWeight: 700, color: '#0f172a' }}>₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Settlement:</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>T+1 Direct Demat Delivery</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Our institutional unlisted equity desk will contact you at <strong>{phone}</strong> to confirm contract note and escrow bank account details.
            </p>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.65rem 1.5rem' }}
              onClick={onClose}
            >
              Done & Return to Market
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
