import React from 'react';
import { Metadata } from 'next';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AnalystLeaderboard from '../../components/analysts/AnalystLeaderboard';
import { getAllAnalysts } from '../../lib/analystService';
import { getAllAnalystsFromDb } from '../../lib/db';

export const metadata: Metadata = {
  title: 'Best IPO Analysts in India (2026) | Performance, Win Rate & Accuracy Rankings',
  description: 'Compare India\'s top SEBI-registered IPO research desks and analysts ranked by actual listing price outcomes, win rates, and recommendation accuracy.',
};

export default async function AnalystsPage() {
  const dbAnalysts = await getAllAnalystsFromDb();
  const analysts = (dbAnalysts && dbAnalysts.length > 0) ? dbAnalysts : getAllAnalysts();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <AnalystLeaderboard analysts={analysts} />
      </main>

      <Footer />
    </div>
  );
}
