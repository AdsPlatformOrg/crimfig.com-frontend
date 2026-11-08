import { themeBootstrap } from '../lib/theme';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import '../../../../shared/ui/styles/marketing.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const seoLogo = '/img/logo-seo.webp';

export const metadata: Metadata = {
  metadataBase: new URL('https://ads.crimfig.com'),
  title: 'CrimFig Ads — Ecosystem Advertising & Promoter Network',
  description: 'Launch targeted ad campaigns across websites, mobile apps, and individual creators, or monetize your audience as a verified promoter.',
  applicationName: 'CrimFig Ads',
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
    title: 'CrimFig Ads — Ecosystem Advertising & Promoter Network',
    description: 'Launch targeted ad campaigns across websites, mobile apps, and individual creators, or monetize your audience as a verified promoter.',
    url: 'https://ads.crimfig.com',
    siteName: 'CrimFig Ecosystem',
    images: [
      {
        url: seoLogo,
        alt: 'CrimFig Ads — Ecosystem Advertising & Promoter Network',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrimFig Ads — Ecosystem Advertising & Promoter Network',
    description: 'Launch targeted ad campaigns across websites, mobile apps, and individual creators, or monetize your audience as a verified promoter.',
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
    <html lang="en" className={`${poppins.className} ${poppins.variable}`} data-theme="light" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body>
        {children}
      </body>
    </html>
  );
}
