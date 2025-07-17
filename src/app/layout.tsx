import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مبلمان | فروشگاه آنلاین مبلمان',
  description: 'فروشگاه آنلاین مبلمان با کیفیت',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 