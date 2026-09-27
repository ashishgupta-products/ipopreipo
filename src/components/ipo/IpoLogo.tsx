'use client';

import React, { useState } from 'react';
import { getIpoLogoUrl } from '../../lib/ipoEnricher';

interface IpoLogoProps {
  name: string;
  symbol?: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

// Brand color themes for recognizable Indian companies
const BRAND_PRESETS: Record<string, { bg: string; text: string; iconSymbol?: string; border?: string }> = {
  'swiggy': { bg: 'linear-gradient(135deg, #fc8019 0%, #e26e0b 100%)', text: '#ffffff', iconSymbol: 'SW' },
  'hyundai': { bg: 'linear-gradient(135deg, #002c5f 0%, #001938 100%)', text: '#ffffff', iconSymbol: 'H' },
  'waaree': { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: '#ffffff', iconSymbol: 'WE' },
  'bajaj': { bg: 'linear-gradient(135deg, #003366 0%, #002244 100%)', text: '#ffffff', iconSymbol: 'BH' },
  'premier': { bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', text: '#ffffff', iconSymbol: 'PE' },
  'ntpc': { bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)', text: '#ffffff', iconSymbol: 'NG' },
  'ola': { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', text: '#10b981', iconSymbol: 'OLA' },
  'firstcry': { bg: 'linear-gradient(135deg, #ff6b81 0%, #f43f5e 100%)', text: '#ffffff', iconSymbol: 'FC' },
  'brainbees': { bg: 'linear-gradient(135deg, #ff6b81 0%, #f43f5e 100%)', text: '#ffffff', iconSymbol: 'FC' },
  'afcons': { bg: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)', text: '#ffffff', iconSymbol: 'AF' },
  'krn': { bg: 'linear-gradient(135deg, #0284c7 0%, #0891b2 100%)', text: '#ffffff', iconSymbol: 'KRN' },
  'acme': { bg: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', text: '#ffffff', iconSymbol: 'AC' },
  'sagility': { bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', text: '#ffffff', iconSymbol: 'SG' },
  'niva': { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: '#ffffff', iconSymbol: 'NB' },
  'bupa': { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: '#ffffff', iconSymbol: 'NB' },
  'northern': { bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', text: '#ffffff', iconSymbol: 'NA' },
  'western': { bg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', text: '#ffffff', iconSymbol: 'WC' },
  'manba': { bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', text: '#ffffff', iconSymbol: 'MF' },
  'mobikwik': { bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', text: '#ffffff', iconSymbol: 'MB' },
  'vishal': { bg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', text: '#ffffff', iconSymbol: 'VM' },
  'danish': { bg: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)', text: '#ffffff', iconSymbol: 'DP' },
  'techera': { bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', text: '#ffffff', iconSymbol: 'TE' },
};

// Deterministic pastel palette generator for unlisted / scraped companies
const FALLBACK_PALETTES = [
  { bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)', text: '#ffffff' },
];

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string, symbol?: string): string {
  if (symbol && symbol.length <= 4) {
    return symbol.toUpperCase();
  }
  const clean = name.replace(/ Limited| Ltd| Private| Pvt| India|\(India\)/gi, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export default function IpoLogo({ name, symbol, logoUrl, size = 40, className = '' }: IpoLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Automatically resolve corporate logo image if not explicitly passed
  const resolvedLogoUrl = logoUrl || getIpoLogoUrl(name, symbol);

  // Check if matches known brand preset
  const nameLower = name.toLowerCase();
  let matchedPreset: { bg: string; text: string; iconSymbol?: string } | null = null;

  for (const key of Object.keys(BRAND_PRESETS)) {
    if (nameLower.includes(key)) {
      matchedPreset = BRAND_PRESETS[key];
      break;
    }
  }

  const initials = matchedPreset?.iconSymbol || getInitials(name, symbol);
  const palette = matchedPreset || FALLBACK_PALETTES[getHash(name) % FALLBACK_PALETTES.length];

  const fontSize = Math.max(10, Math.floor(size * 0.38));
  const borderRadius = Math.max(6, Math.floor(size * 0.24));

  if (resolvedLogoUrl && !imgError) {
    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          position: 'relative',
          padding: Math.max(2, Math.floor(size * 0.08)) + 'px',
          flexShrink: 0
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedLogoUrl}
          alt={`${name} logo`}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: `${borderRadius}px`,
        background: palette.bg,
        color: palette.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: `${fontSize}px`,
        letterSpacing: '-0.02em',
        fontFamily: 'var(--font-outfit, sans-serif)',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        userSelect: 'none',
        flexShrink: 0
      }}
      title={name}
      aria-label={`${name} brand icon`}
    >
      {initials}
    </div>
  );
}
