import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, STIX_Two_Text } from 'next/font/google';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { SITE_URL } from '@/lib/site-url';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const stixTwoText = STIX_Two_Text({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-stix',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const siteDescription =
  'Trade up to $100,000 of crypto perpetual capital on real exchange liquidity. Published pass rates, on-chain USDC payouts, rules you can read in five minutes.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Northbook — the prop firm that pays by smart contract',
  description: siteDescription,
  openGraph: {
    title: 'Northbook — the prop firm that pays by smart contract',
    description: siteDescription,
    type: 'website',
    // PENDING: confirm with CTO — final OG asset
    images: [{ url: '/images/hero-markets.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Northbook — the prop firm that pays by smart contract',
    description: siteDescription,
    images: ['/images/hero-markets.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${stixTwoText.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased">
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
