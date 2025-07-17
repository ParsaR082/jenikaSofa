import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  Send
} from 'lucide-react';

interface ContactPageProps {
  params: { locale: string };
}

export default function ContactPage({ params: { locale } }: ContactPageProps) {
  setRequestLocale(locale);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">تماس با ما</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ما آماده پاسخگویی به سوالات شما هستیم. از طریق راه‌های زیر می‌توانید با ما در ارتباط باشید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">اطلاعات تماس</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">آدرس</h3>
                    <p className="text-muted-foreground">تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه دوم</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">تلفن</h3>
                    <p className="text-muted-foreground">۰۲۱-۱۲۳۴۵۶۷۸</p>
                    <p className="text-muted-foreground">۰۹۱۲۳۴۵۶۷۸۹</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ایمیل</h3>
                    <p className="text-muted-foreground">info@jenika.com</p>
                    <p className="text-muted-foreground">support@jenika.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ساعات کاری</h3>
                    <p className="text-muted-foreground">شنبه تا چهارشنبه: ۹:۰۰ - ۱۸:۰۰</p>
                    <p className="text-muted-foreground">پنج‌شنبه: ۹:۰۰ - ۱۳:۰۰</p>
                    <p className="text-muted-foreground">جمعه: تعطیل</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">شبکه‌های اجتماعی</h2>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-pink-600" />
                  </div>
                  <span>اینستاگرام</span>
                </a>
                <a href="#" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Send className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>تلگرام</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">فرم تماس</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                      نام و نام خانوادگی *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="نام کامل خود را وارد کنید"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                      شماره تلفن *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    ایمیل
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                    موضوع *
                  </label>
                  <select 
                    id="subject"
                    className="w-full p-3 border border-input bg-background rounded-md"
                    required
                  >
                    <option value="">موضوع را انتخاب کنید</option>
                    <option value="product-inquiry">استعلام محصول</option>
                    <option value="order-status">وضعیت سفارش</option>
                    <option value="complaint">شکایت</option>
                    <option value="suggestion">پیشنهاد</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    پیام *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full p-3 border border-input bg-background rounded-md resize-none"
                    placeholder="پیام خود را اینجا بنویسید..."
                    required
                  ></textarea>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  ارسال پیام
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">موقعیت ما روی نقشه</h2>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">نقشه اینجا نمایش داده می‌شود</p>
                <p className="text-sm">تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">سوالات متداول</h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-4 bg-muted rounded-lg">
                  <span className="font-medium">چگونه سفارش دهم؟</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-muted-foreground">
                  شما می‌توانید از طریق سایت ما محصولات مورد نظر را انتخاب کرده و به سبد خرید اضافه کنید. سپس مراحل پرداخت را تکمیل کنید.
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-4 bg-muted rounded-lg">
                  <span className="font-medium">زمان ارسال چقدر است؟</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-muted-foreground">
                  ارسال محصولات در تهران ۲-۳ روز کاری و در سایر شهرها ۵-۷ روز کاری زمان می‌برد.
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-4 bg-muted rounded-lg">
                  <span className="font-medium">آیا امکان مرجوع کردن محصول وجود دارد؟</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-muted-foreground">
                  بله، تا ۷ روز پس از تحویل محصول، امکان مرجوع کردن و بازگرداندن وجه پرداختی وجود دارد.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 