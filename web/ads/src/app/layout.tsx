import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
