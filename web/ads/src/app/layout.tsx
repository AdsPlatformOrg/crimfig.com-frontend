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
  title: 'CrimFig Ads — Ecosystem Advertising & Promoter Network',
  description: 'Launch targeted ad campaigns across websites, mobile apps, and individual creators, or monetize your audience as a verified promoter.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
