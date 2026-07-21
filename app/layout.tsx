import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, STIX_Two_Text } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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

export const metadata: Metadata = {
  title: 'Northbook',
  description: 'Northbook — on-chain prop trading firm',
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
