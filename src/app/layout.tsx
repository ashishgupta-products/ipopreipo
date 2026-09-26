import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IPO & PreIPO India | Live GMP, Subscription, Allotment & Unlisted Shares',
  description: 'India\'s comprehensive portal for Mainboard & SME IPOs, real-time Grey Market Premium (GMP) tracking, live subscription status, registrar allotment checks, and institutional Pre-IPO unlisted shares.',
  keywords: 'IPO India, Live GMP, SME IPO, Pre-IPO shares, Unlisted shares, Allotment status, Link Intime, KFintech, NSE IPO, BSE IPO, Listing Gain Calculator',
  openGraph: {
    title: 'IPO & PreIPO India | Live GMP & Unlisted Shares Terminal',
    description: 'Track real-time Grey Market Premiums, SME IPO subscriptions, and invest in Pre-IPO unlisted equity.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#060911" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
