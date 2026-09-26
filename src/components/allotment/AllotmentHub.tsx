'use client';

import React, { useState } from 'react';
import { IpoItem, RegistrarInfo } from '../../types';
import { REGISTRARS } from '../../data/ipoData';
import { 
  ShieldCheck, 
  ExternalLink, 
  Phone, 
  Mail, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

interface AllotmentHubProps {
  ipos: IpoItem[];
  onSelectIpo: (ipo: IpoItem) => void;
}

export default function AllotmentHub({ ipos, onSelectIpo }: AllotmentHubProps) {
  const [selectedRegistrar, setSelectedRegistrar] = useState<RegistrarInfo>(REGISTRARS[0]);

  const allotmentReadyIpos = ipos.filter(
    (ipo) => ipo.status === 'LISTED' || ipo.status === 'CLOSED' || ipo.status === 'ONGOING'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
        border: '1px solid #a7f3d0',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={20} color="#059669" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Official Registrar Gateway
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          IPO Allotment Status Hub
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: '720px', lineHeight: '1.6' }}>
          Check your IPO application and share allocation status directly through India’s certified registrars using your PAN number, Application Number, or Demat DP ID.
        </p>
      </div>

      {/* Registrar Selector Cards */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
          Select Official Registrar
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '1rem'
        }}>
          {REGISTRARS.map((reg) => {
            const isSelected = selectedRegistrar.code === reg.code;
            return (
              <div
                key={reg.code}
                onClick={() => setSelectedRegistrar(reg)}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderColor: isSelected ? '#059669' : '#e2e8f0',
                  backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  boxShadow: isSelected ? '0 4px 14px rgba(5, 150, 105, 0.12)' : 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? '#059669' : '#0f172a' }}>
                    {reg.name}
                  </h4>
                  {isSelected && <CheckCircle2 size={18} color="#059669" />}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.75rem' }}>
                  <strong>Manages: </strong>{reg.featuredIpos.join(', ')}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.72rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={12} />
                    <span>{reg.supportPhone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={12} />
                    <span>{reg.supportEmail}</span>
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9' }}>
                  <a
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-emerald"
                    style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Open {reg.name.split(' ')[0]} Portal</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Allotment Status Table */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
          Recent & Ongoing IPO Allotment Tracker
        </h3>

        <div className="table-responsive-wrapper">
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.875rem'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                color: '#64748b',
                fontSize: '0.75rem',
                textTransform: 'uppercase'
              }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>IPO Name</th>
                <th style={{ padding: '0.9rem 1rem' }}>Category</th>
                <th style={{ padding: '0.9rem 1rem' }}>Allotment Date</th>
                <th style={{ padding: '0.9rem 1rem' }}>Listing Date</th>
                <th style={{ padding: '0.9rem 1rem' }}>Registrar</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Direct Link</th>
              </tr>
            </thead>
            <tbody>
              {allotmentReadyIpos.map((ipo) => (
                <tr
                  key={ipo.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div 
                      onClick={() => onSelectIpo(ipo)}
                      style={{ fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#387ed1')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                    >
                      {ipo.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Issue: ₹{ipo.issueSizeCr.toLocaleString('en-IN')} Cr
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: ipo.category === 'SME' ? '#b45309' : '#2563eb',
                      backgroundColor: ipo.category === 'SME' ? '#fffbeb' : '#eff6ff',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: ipo.category === 'SME' ? '1px solid #fde68a' : '1px solid #bfdbfe',
                    }}>
                      {ipo.category}
                    </span>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className="mono" style={{ fontWeight: 600, color: '#0f172a' }}>
                      {ipo.timeline.allotmentFinalization}
                    </span>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className="mono" style={{ fontWeight: 600, color: '#475569' }}>
                      {ipo.timeline.listingDate}
                    </span>
                  </td>

                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#475569' }}>
                    {ipo.registrar}
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <a
                      href={ipo.registrarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      <span>Check Status</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allotment Guide 3 Steps */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} color="#387ed1" />
          <span>3 Easy Steps to Check Allotment Online</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '1.25rem'
        }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              1
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0f172a' }}>Open Registrar Portal</h4>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.5' }}>
              Click on the designated registrar button above (Link Intime, KFintech, or Bigshare) according to your IPO.
            </p>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              2
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0f172a' }}>Select Company & Mode</h4>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.5' }}>
              Select the IPO name from dropdown and choose <strong>PAN Number</strong>, Application No., or DP Client ID.
            </p>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              3
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0f172a' }}>View Share Allocation</h4>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.5' }}>
              Submit captcha to view allocated shares. If allotted, your bank UPI block will be debited; unallotted blocks are revoked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
