import type { Metadata } from 'next';
import './globals.css';

const seoLogo = '/img/logo-seo.webp';

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.crimfig.com'),
  title: 'CrimFig Chat — Realtime Messaging',
  description: 'Fast, secure realtime messaging, group channels, and media sharing across the CrimFig ecosystem.',
  applicationName: 'CrimFig Chat',
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
    title: 'CrimFig Chat — Realtime Messaging',
    description: 'Fast, secure realtime messaging, group channels, and media sharing across the CrimFig ecosystem.',
    url: 'https://chat.crimfig.com',
    siteName: 'CrimFig Ecosystem',
    images: [
      {
        url: seoLogo,
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
        <div className="chat-container">
          {children}
        </div>
      </body>
    </html>
  );
}
