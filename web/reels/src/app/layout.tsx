import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrimFig Reels — Short-form Video & Creator Platform',
  description: 'Next-generation short-form video streaming, reels discovery and creator monetization on CrimFig.',
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
