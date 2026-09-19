import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrimFig Stream — Live Broadcasting & Media Network',
  description: 'Ultra-low latency live broadcasting, interactive web streams, and creator broadcasts on CrimFig.',
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
