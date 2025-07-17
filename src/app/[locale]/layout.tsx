import type { Metadata } from 'next';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { AuthProvider } from '@/contexts/auth-context';
import { CartProvider } from '@/contexts/cart-context';

export function generateStaticParams() {
  return [{ locale: 'fa' }];
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: 'جنیکا | فروشگاه آنلاین اکسسوری',
    description: 'فروشگاه آنلاین اکسسوری با کیفیت',
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir="rtl">
      <body className="font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 