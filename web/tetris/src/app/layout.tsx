import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://tetris.crimfig.com'),
  title: 'CrimFig Tetris — Community Arcade & Gaming',
  description: 'Classic competitive arcade gaming and community multiplayer leaderboards on CrimFig.',
  applicationName: 'CrimFig Tetris',
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
    title: 'CrimFig Tetris — Community Arcade & Gaming',
    description: 'Classic competitive arcade gaming and community multiplayer leaderboards on CrimFig.',
    url: 'https://tetris.crimfig.com',
    siteName: 'CrimFig Ecosystem',
    images: [
      {
        url: '/img/og-card.png',
        width: 1200,
        height: 630,
        alt: 'CrimFig Tetris — Community Arcade & Gaming',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrimFig Tetris — Community Arcade & Gaming',
    description: 'Classic competitive arcade gaming and community multiplayer leaderboards on CrimFig.',
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
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
