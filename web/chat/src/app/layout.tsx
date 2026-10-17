import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.crimfig.com'),
  title: 'CrimFig Chat — Realtime Messaging',
  description: 'Fast, secure realtime messaging, group channels, and media sharing across the CrimFig ecosystem.',
  applicationName: 'CrimFig Chat',
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
    title: 'CrimFig Chat — Realtime Messaging',
    description: 'Fast, secure realtime messaging, group channels, and media sharing across the CrimFig ecosystem.',
    url: 'https://chat.crimfig.com',
    siteName: 'CrimFig Ecosystem',
    images: [
      {
        url: '/img/og-card.png',
        width: 1200,
        height: 630,
        alt: 'CrimFig Chat — Realtime Messaging',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrimFig Chat — Realtime Messaging',
    description: 'Fast, secure realtime messaging, group channels, and media sharing across the CrimFig ecosystem.',
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
        <div className="chat-container">
          {children}
        </div>
      </body>
    </html>
  );
}
