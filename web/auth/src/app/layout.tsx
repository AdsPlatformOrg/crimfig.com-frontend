import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrimFig — Central Identity & SSO',
  description: 'Single Sign-On for all CrimFig Ecosystem Applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0a0b10 80%)',
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}
