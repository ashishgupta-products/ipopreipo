import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getIpoById, getMergedIpos } from '../../../lib/ipoService';
import { getIpoByIdFromDb, getAllIposFromDb } from '../../../lib/db';
import IpoDetailView from '../../../components/ipo/IpoDetailView';

export const dynamicParams = true;

export async function generateStaticParams() {
  const dbIpos = await getAllIposFromDb();
  const ipos = (dbIpos && dbIpos.length > 0) ? dbIpos : getMergedIpos();
  return ipos.map((ipo) => ({
    id: ipo.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dbIpo = await getIpoByIdFromDb(id);
  const ipo = dbIpo || getIpoById(id);

  if (!ipo) {
    return {
      title: 'IPO Details Not Found | IPO & Pre-IPO India',
      description: 'The requested IPO could not be located in current market listings.',
    };
  }

  const gmpPercent = ((ipo.gmp / ipo.priceBandHigh) * 100).toFixed(1);

  return {
    title: `${ipo.name} IPO GMP Today, Price Band, Review & Allotment Date | IPO PreIPO India`,
    description: `Complete insights for ${ipo.name} (${ipo.symbol}) IPO. Current GMP ₹${ipo.gmp} (+${gmpPercent}%), price band ₹${ipo.priceBandLow}-₹${ipo.priceBandHigh}, issue size ₹${ipo.issueSizeCr} Cr, registrar ${ipo.registrar}, allotment date ${ipo.timeline.allotmentFinalization}.`,
    openGraph: {
      title: `${ipo.name} IPO Live GMP: ₹${ipo.gmp} (+${gmpPercent}%) - Complete Breakdown`,
      description: `Track real-time GMP, timeline, subscription status, and check direct allotment for ${ipo.name}.`,
      type: 'article',
    },
  };
}

export default async function IpoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbIpo = await getIpoByIdFromDb(id);
  const ipo = dbIpo || getIpoById(id);

  if (!ipo) {
    notFound();
  }

  const dbAllIpos = await getAllIposFromDb();
  const allIpos = (dbAllIpos && dbAllIpos.length > 0) ? dbAllIpos : getMergedIpos();
  const relatedIpos = allIpos.filter((item) => item.id !== ipo.id && (item.category === ipo.category || item.status === ipo.status));

  return <IpoDetailView ipo={ipo} relatedIpos={relatedIpos} />;
}
