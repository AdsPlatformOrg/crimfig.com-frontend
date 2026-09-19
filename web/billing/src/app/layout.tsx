import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrimFig Billing — Wallets, Subscriptions & Payouts',
  description: 'Manage your CrimFig multi-app wallet, saved cards, recurring subscriptions, and withdrawal bank accounts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
