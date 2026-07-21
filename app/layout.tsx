import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Sprint 0: wire serif + mono from design tokens.
// STIX Two Text — confirmed on Google Fonts (fonts.google.com/specimen/STIX+Two+Text).
// import { STIX_Two_Text } from 'next/font/google';
// const stixTwoText = STIX_Two_Text({
//   subsets: ['latin'],
//   variable: '--font-stix-two-text',
// });
//
// IBM Plex Mono — confirmed on Google Fonts.
// import { IBM_Plex_Mono } from 'next/font/google';
// const ibmPlexMono = IBM_Plex_Mono({
//   subsets: ['latin'],
//   weight: ['400', '500', '600'],
//   variable: '--font-ibm-plex-mono',
// });
//
// Local fallback (only if Google Fonts unavailable at build time):
// import localFont from 'next/font/local';
// const stixTwoText = localFont({
//   src: '../public/fonts/STIXTwoText-Regular.woff2',
//   variable: '--font-stix-two-text',
// });

export const metadata: Metadata = {
  title: 'Northbook',
  description: 'Northbook — on-chain prop trading firm (scaffold)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
