import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrimFig Ads — Campaign & Publisher Portal',
  description: 'Manage ecosystem advertising campaigns and monetization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
