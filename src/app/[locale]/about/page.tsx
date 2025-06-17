import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">درباره ما</h1>
          
          <div className="prose prose-lg">
            <p className="text-muted-foreground mb-6">
              به فروشگاه آنلاین مبلمان جنیکا خوش آمدید. ما با بیش از ۱۵ سال تجربه در صنعت مبلمان، همواره تلاش کرده‌ایم تا بهترین محصولات را با کیفیت‌ترین متریال و طراحی منحصر به فرد به مشتریان خود ارائه دهیم.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">داستان ما</h2>
            <p className="text-muted-foreground mb-6">
              مبلمان جنیکا در سال ۱۳۸۷ با هدف ارائه محصولات با کیفیت و طراحی مدرن به بازار ایران وارد شد. ما کار خود را با یک کارگاه کوچک در تهران آغاز کردیم و امروز به یکی از بزرگترین تولیدکنندگان مبلمان در کشور تبدیل شده‌ایم.
            </p>
            <p className="text-muted-foreground mb-6">
              فلسفه ما ساده است: ارائه محصولات با کیفیت، طراحی زیبا و قیمت مناسب. ما معتقدیم که هر خانه‌ای شایسته مبلمان زیبا و با کیفیت است و تلاش می‌کنیم تا این امکان را برای همه فراهم کنیم.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">ارزش‌های ما</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
              <li><strong>کیفیت:</strong> ما تنها از بهترین متریال‌ها استفاده می‌کنیم و تمام محصولات ما دارای ۵ سال ضمانت هستند.</li>
              <li><strong>طراحی:</strong> طراحی محصولات ما ترکیبی از سبک مدرن و کلاسیک است که با سلیقه ایرانی هماهنگی دارد.</li>
              <li><strong>خدمات مشتری:</strong> رضایت مشتری برای ما در اولویت است و تیم پشتیبانی ما همواره آماده پاسخگویی به سوالات و نیازهای شماست.</li>
              <li><strong>پایداری:</strong> ما متعهد به حفظ محیط زیست هستیم و تلاش می‌کنیم تا فرآیند تولید ما تا حد امکان سازگار با محیط زیست باشد.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">تیم ما</h2>
            <p className="text-muted-foreground mb-6">
              تیم ما متشکل از طراحان، صنعتگران و متخصصان با تجربه است که با عشق و علاقه در تلاش هستند تا بهترین محصولات را برای شما تولید کنند. هر یک از اعضای تیم ما متخصص در زمینه خود هستند و با همکاری یکدیگر، محصولاتی با کیفیت و طراحی منحصر به فرد خلق می‌کنند.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">تماس با ما</h2>
            <p className="text-muted-foreground">
              ما همیشه مشتاق شنیدن نظرات و پیشنهادات شما هستیم. برای تماس با ما می‌توانید از طریق فرم تماس در وبسایت یا از طریق اطلاعات زیر با ما در ارتباط باشید:
            </p>
            <address className="not-italic text-muted-foreground mt-4">
              <p>آدرس: تهران، خیابان ولیعصر، خیابان فتحی شقاقی، پلاک ۴</p>
              <p>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
              <p>ایمیل: info@jenika.com</p>
            </address>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 