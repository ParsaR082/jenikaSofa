import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مبلمان | فروشگاه آنلاین مبلمان',
  description: 'فروشگاه آنلاین مبلمان با کیفیت',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 