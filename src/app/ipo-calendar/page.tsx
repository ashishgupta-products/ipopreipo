'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import MarketTicker from '../../components/layout/MarketTicker';
import Footer from '../../components/layout/Footer';
import IpoCalendar from '../../components/ipo/IpoCalendar';
import IpoDetailModal from '../../components/ipo/IpoDetailModal';
import { IpoItem } from '../../types';
import { getMergedIpos } from '../../lib/ipoService';

export default function IpoCalendarPage() {
  const [iposList, setIposList] = useState<IpoItem[]>(getMergedIpos());
  const [selectedIpo, setSelectedIpo] = useState<IpoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live IPOs from Neon DB
  useEffect(() => {
    let isMounted = true;
    fetch('/api/ipos')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.ipos && data.ipos.length > 0) {
          setIposList(data.ipos);
        }
      })
      .catch((err) => console.error('Failed to load IPO data for calendar:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MarketTicker />

      <main className="container" style={{ flex: 1, paddingTop: '1.75rem', paddingBottom: '3rem' }}>
        <IpoCalendar 
          ipos={iposList} 
          onSelectIpo={(ipo) => setSelectedIpo(ipo)} 
        />
      </main>

      {selectedIpo && (
        <IpoDetailModal
          ipo={selectedIpo}
          onClose={() => setSelectedIpo(null)}
        />
      )}

      <Footer />
    </div>
  );
}
