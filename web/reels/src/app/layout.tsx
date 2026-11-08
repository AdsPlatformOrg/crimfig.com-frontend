import type { Metadata } from 'next';
import './globals.css';

const seoLogo = '/img/logo-seo.webp';

export const metadata: Metadata = {
  metadataBase: new URL('https://reels.crimfig.com'),
  title: 'CrimFig Reels — Short-form Video & Creator Platform',
  description: 'Next-generation short-form video streaming, reels discovery and creator monetization on CrimFig.',
  applicationName: 'CrimFig Reels',
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
    title: 'CrimFig Reels — Short-form Video & Creator Platform',
    description: 'Next-generation short-form video streaming, reels discovery and creator monetization on CrimFig.',
    url: 'https://reels.crimfig.com',
    siteName: 'CrimFig Ecosystem',
    images: [
      {
        url: seoLogo,
        alt: 'CrimFig Reels — Short-form Video & Creator Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrimFig Reels — Short-form Video & Creator Platform',
    description: 'Next-generation short-form video streaming, reels discovery and creator monetization on CrimFig.',
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
