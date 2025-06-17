import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const vazirmatn = Vazirmatn({ 
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

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
  const messages = await getMessages();

  return (
    <html lang={locale} dir="rtl">
      <body className={`${vazirmatn.className} font-sans`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 