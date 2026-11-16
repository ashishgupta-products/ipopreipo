import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '../components/providers/AuthProvider';
import DevAuthHelper from '../components/dev/DevAuthHelper';

export const metadata: Metadata = {
  title: 'ipopreipo | Live GMP, Subscription, Allotment & Pre-IPO Terminal',
  description: 'Comprehensive portal for Mainboard & SME IPOs, Pre-IPO intelligence, real-time Grey Market Premium (GMP) tracking, live subscription status, and official registrar allotment checks.',
  keywords: 'ipopreipo, IPO, Pre-IPO, Live GMP, SME IPO, Allotment status, Link Intime, KFintech, Bigshare, NSE IPO, BSE IPO',
  openGraph: {
    title: 'ipopreipo | Live GMP, Subscription & Pre-IPO Terminal',
    description: 'Track real-time Grey Market Premiums, Mainboard & SME IPO subscriptions, and official registrar allotment results.',
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
        <AuthProvider>
          {children}
          <DevAuthHelper />
        </AuthProvider>
      </body>
    </html>
  );
}
