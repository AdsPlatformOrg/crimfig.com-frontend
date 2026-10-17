import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://billing.crimfig.com'),
  title: 'CrimFig Billing — Wallets, Subscriptions & Payouts',
  description: 'Manage your CrimFig multi-app wallet, saved cards, recurring subscriptions, and withdrawal bank accounts.',
  applicationName: 'CrimFig Billing',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/img/logo-icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/img/logo-big.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/img/logo-icon.png',
    apple: [
      { url: '/img/logo-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'CrimFig Billing — Wallets, Subscriptions & Payouts',
    description: 'Manage your CrimFig multi-app wallet, saved cards, recurring subscriptions, and withdrawal bank accounts.',
    url: 'https://billing.crimfig.com',
    siteName: 'CrimFig Ecosystem',
    images: [
      {
        url: '/img/og-card.png',
        width: 1200,
        height: 630,
        alt: 'CrimFig Billing — Wallets, Subscriptions & Payouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrimFig Billing — Wallets, Subscriptions & Payouts',
    description: 'Manage your CrimFig multi-app wallet, saved cards, recurring subscriptions, and withdrawal bank accounts.',
    site: '@CrimFig',
    creator: '@CrimFig',
    images: ['/img/og-card.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} data-theme="light">
      <body>
        {children}
      </body>
    </html>
  );
}
