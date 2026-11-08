import type { Metadata } from 'next';
import './globals.css';

const seoLogo = '/img/logo-seo.webp';

export const metadata: Metadata = {
  metadataBase: new URL('https://stream.crimfig.com'),
  title: 'CrimFig Stream — Live Broadcasting & Media Network',
  description: 'Ultra-low latency live broadcasting, interactive web streams, and creator broadcasts on CrimFig.',
  applicationName: 'CrimFig Stream',
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
    title: 'CrimFig Stream — Live Broadcasting & Media Network',
    description: 'Ultra-low latency live broadcasting, interactive web streams, and creator broadcasts on CrimFig.',
    url: 'https://stream.crimfig.com',
    siteName: 'CrimFig Ecosystem',
    images: [
      {
        url: seoLogo,
        alt: 'CrimFig Stream — Live Broadcasting & Media Network',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrimFig Stream — Live Broadcasting & Media Network',
    description: 'Ultra-low latency live broadcasting, interactive web streams, and creator broadcasts on CrimFig.',
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
