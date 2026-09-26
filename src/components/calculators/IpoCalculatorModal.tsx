'use client';

import React, { useState } from 'react';
import { IpoItem } from '../../types';
import { X, Calculator, Plus, Minus, Info } from 'lucide-react';

interface IpoCalculatorModalProps {
  initialIpo: IpoItem | null;
  allIpos: IpoItem[];
  onClose: () => void;
}

export default function IpoCalculatorModal({ initialIpo, allIpos, onClose }: IpoCalculatorModalProps) {
  const [selectedIpoId, setSelectedIpoId] = useState<string>(initialIpo ? initialIpo.id : allIpos[0]?.id || '');
  const [cutoffPrice, setCutoffPrice] = useState<number>(initialIpo ? initialIpo.priceBandHigh : 500);
  const [lotSize, setLotSize] = useState<number>(initialIpo ? initialIpo.lotSize : 30);
  const [numLots, setNumLots] = useState<number>(1);
  const [gmpAmount, setGmpAmount] = useState<number>(initialIpo ? initialIpo.gmp : 50);

  const handleIpoChange = (id: string) => {
    setSelectedIpoId(id);
    const ipo = allIpos.find((item) => item.id === id);
    if (ipo) {
      setCutoffPrice(ipo.priceBandHigh);
      setLotSize(ipo.lotSize);
      setGmpAmount(ipo.gmp);
      setNumLots(1);
    }
  };

  const totalShares = lotSize * numLots;
  const totalInvestment = cutoffPrice * totalShares;
  const estListingPrice = cutoffPrice + gmpAmount;
  const profitPerLot = gmpAmount * lotSize;
  const totalProfit = profitPerLot * numLots;
  const roiPercent = ((gmpAmount / cutoffPrice) * 100);
  const totalRealizedValue = totalInvestment + totalProfit;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '1.75rem', backgroundColor: '#ffffff' }}
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

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb'
          }}>
            <Calculator size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              IPO Listing Gain & Profit Calculator
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Estimate your multi-lot listing returns based on Grey Market Premium (GMP)
            </p>
          </div>
        </div>

        {/* IPO Quick Dropdown */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
            Select Active / Recent IPO
          </label>
          <select
            value={selectedIpoId}
            onChange={(e) => handleIpoChange(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              fontSize: '0.9rem',
              color: '#0f172a'
            }}
          >
            {allIpos.map((ipo) => (
              <option key={ipo.id} value={ipo.id}>
                {ipo.name} (Cutoff: ₹{ipo.priceBandHigh} | GMP: +₹{ipo.gmp})
              </option>
            ))}
          </select>
        </div>

        {/* Input Parameters Grid */}
        <div className="form-two-col" style={{ marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
              Cutoff Issue Price (₹)
            </label>
            <input
              type="number"
              value={cutoffPrice}
              onChange={(e) => setCutoffPrice(Number(e.target.value) || 0)}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 0.75rem',
                fontSize: '0.95rem',
                color: '#0f172a'
              }}
              className="mono"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
              Lot Size (Shares / Lot)
            </label>
            <input
              type="number"
              value={lotSize}
              onChange={(e) => setLotSize(Number(e.target.value) || 0)}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 0.75rem',
                fontSize: '0.95rem',
                color: '#0f172a'
              }}
              className="mono"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
              Expected GMP Premium (₹)
            </label>
            <input
              type="number"
              value={gmpAmount}
              onChange={(e) => setGmpAmount(Number(e.target.value) || 0)}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 0.75rem',
                fontSize: '0.95rem',
                color: '#0f172a'
              }}
              className="mono"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
              Applied Lots ({numLots} Lot{numLots > 1 ? 's' : ''})
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={numLots <= 1}
                onClick={() => setNumLots(Math.max(1, numLots - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: numLots <= 1 ? '#94a3b8' : '#0f172a'
                }}
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                min="1"
                max="100"
                value={numLots}
                onChange={(e) => setNumLots(Math.max(1, Number(e.target.value) || 1))}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem',
                  fontSize: '0.95rem',
                  color: '#0f172a'
                }}
                className="mono"
              />
              <button
                type="button"
                onClick={() => setNumLots(numLots + 1)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
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

        {/* Results Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Capital Invested
              </div>
              <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                ₹{totalInvestment.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {totalShares} total shares
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                Estimated Listing Net Profit
              </div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: totalProfit >= 0 ? '#059669' : '#dc2626' }}>
                {totalProfit >= 0 ? `+₹${totalProfit.toLocaleString('en-IN')}` : `-₹${Math.abs(totalProfit).toLocaleString('en-IN')}`}
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                {roiPercent >= 0 ? `+${roiPercent.toFixed(1)}%` : `${roiPercent.toFixed(1)}%`} Listing ROI
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.75rem',
            borderTop: '1px solid #d1fae5',
            fontSize: '0.82rem'
          }}>
            <span style={{ color: '#475569' }}>
              Est. Listing Price: <strong className="mono" style={{ color: '#0f172a' }}>₹{estListingPrice} / share</strong>
            </span>
            <span style={{ color: '#475569' }}>
              Gross Value: <strong className="mono" style={{ color: '#0284c7' }}>₹{totalRealizedValue.toLocaleString('en-IN')}</strong>
            </span>
          </div>
        </div>

        {/* Tax Note */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: '#64748b',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#387ed1' }} />
          <span>
            <strong style={{ color: '#0f172a' }}>Indian Tax Note: </strong>
            Short Term Capital Gains (STCG) on equity shares sold on listing day are taxed at 20% (plus surcharge and cess) under Section 111A as per the latest Union Budget.
          </span>
        </div>
      </div>
    </div>
  );
}
