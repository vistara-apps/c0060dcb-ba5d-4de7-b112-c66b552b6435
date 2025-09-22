import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'HabitFlow - Build habits that stick',
  description: 'Gamified habit tracking for Base. Build streaks, earn rewards, stay accountable.',
  openGraph: {
    title: 'HabitFlow - Build habits that stick',
    description: 'Gamified habit tracking for Base. Build streaks, earn rewards, stay accountable.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HabitFlow - Build habits that stick',
    description: 'Gamified habit tracking for Base. Build streaks, earn rewards, stay accountable.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-bg text-dark-text">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
