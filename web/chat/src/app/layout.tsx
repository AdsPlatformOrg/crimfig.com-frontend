import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrimFig Chat — Realtime Messaging',
  description: 'Ecosystem Messaging & WebSockets Client',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="chat-container">
          {children}
        </div>
      </body>
    </html>
  );
}
