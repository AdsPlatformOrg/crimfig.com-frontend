import type { Metadata } from 'next';
import './globals.css';

const seoLogo = '/img/logo-seo.webp';

export const metadata: Metadata = {
  metadataBase: new URL('https://tetris.crimfig.com'),
  title: 'CrimFig Tetris — Community Arcade & Gaming',
  description: 'Classic competitive arcade gaming and community multiplayer leaderboards on CrimFig.',
  applicationName: 'CrimFig Tetris',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: seoLogo, type: 'image/webp' },
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
        url: seoLogo,
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
    images: [seoLogo],
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
