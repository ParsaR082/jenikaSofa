import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

// Sample featured products
const featuredProducts = [
  {
    id: 1,
    name: 'مبل راحتی کلاسیک',
    price: 1250,
    image: '/placeholder.svg',
    category: 'مبلمان پذیرایی',
  },
  {
    id: 2,
    name: 'مبل ال مدرن',
    price: 1850,
    image: '/placeholder.svg',
    category: 'مبلمان پذیرایی',
  },
  {
    id: 3,
    name: 'میز ناهارخوری چوبی',
    price: 750,
    image: '/placeholder.svg',
    category: 'میز ناهارخوری',
  },
  {
    id: 4,
    name: 'تخت خواب دو نفره',
    price: 950,
    image: '/placeholder.svg',
    category: 'مبلمان اتاق خواب',
  },
];

// Categories
const categories = [
  { id: 'living-room', name: 'مبلمان پذیرایی', image: '/placeholder.svg' },
  { id: 'dining', name: 'میز ناهارخوری', image: '/placeholder.svg' },
  { id: 'bedroom', name: 'مبلمان اتاق خواب', image: '/placeholder.svg' },
  { id: 'office', name: 'مبلمان اداری', image: '/placeholder.svg' },
];

// Features
const features = [
  {
    title: 'طراحی منحصر به فرد',
    description: 'محصولات ما با بهترین طراحی‌های روز دنیا و با توجه به سلیقه ایرانی تولید می‌شوند.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    title: 'کیفیت برتر',
    description: 'تمامی محصولات ما با استفاده از بهترین مواد اولیه و توسط ماهرترین استادکاران تولید می‌شوند.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'ارسال سریع',
    description: 'با استفاده از ناوگان حمل و نقل اختصاصی، محصولات در کوتاه‌ترین زمان به دست شما می‌رسند.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    title: '۵ سال ضمانت',
    description: 'تمامی محصولات ما دارای ۵ سال ضمانت هستند تا با خیال راحت خرید کنید.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

// Testimonials
const testimonials = [
  {
    id: 1,
    content: 'کیفیت محصولات فوق‌العاده است. من مبل راحتی کلاسیک را خریدم و بسیار راضی هستم. طراحی زیبا و کیفیت ساخت عالی!',
    author: 'علی محمدی',
    role: 'مشتری',
  },
  {
    id: 2,
    content: 'سرویس خواب دو نفره را از این فروشگاه خریدم. هم کیفیت محصول عالی بود و هم نحوه برخورد پرسنل. حتما باز هم خرید خواهم کرد.',
    author: 'مریم احمدی',
    role: 'مشتری',
  },
  {
    id: 3,
    content: 'بهترین خرید زندگیم بود! میز ناهارخوری که خریدم کیفیت بسیار بالایی داره و دقیقا همون چیزی هست که توی سایت دیده بودم.',
    author: 'رضا کریمی',
    role: 'مشتری',
  },
];

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  
  const locale = params.locale;

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                زیبایی و راحتی را به خانه خود بیاورید
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                مبلمان با کیفیت و طراحی منحصر به فرد برای خانه و محل کار شما
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <Link href={`/${locale}/products`}>
                    مشاهده محصولات
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/${locale}/about`}>
                    درباره ما
                  </Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] bg-muted-foreground/10 rounded-lg flex items-center justify-center text-muted-foreground">
                تصویر هیرو
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">چرا ما را انتخاب کنید؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ما با تکیه بر سال‌ها تجربه و استفاده از بهترین مواد اولیه، محصولاتی با کیفیت و زیبا تولید می‌کنیم.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-card rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">دسته‌بندی محصولات</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              محصولات ما در دسته‌بندی‌های مختلف برای پاسخگویی به نیازهای متنوع شما
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
                  تصویر دسته‌بندی
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h3 className="text-white text-xl font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">محصولات ویژه</h2>
            <Link href={`/${locale}/products`} className="text-accent hover:underline">
              مشاهده همه محصولات
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link href={`/${locale}/products/${product.id}`} key={product.id} className="group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    تصویر محصول
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-2">{product.category}</p>
                <p className="text-accent font-bold">{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">تخفیف ویژه تابستانه</h2>
              <p className="text-lg opacity-90">
                تا ۳۰٪ تخفیف روی تمامی محصولات مبلمان پذیرایی
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/${locale}/products?discount=true`}>
                مشاهده محصولات
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">نظرات مشتریان</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              آنچه مشتریان ما درباره محصولات و خدمات ما می‌گویند
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="inline-block h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    <span className="text-sm">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">عضویت در خبرنامه</h2>
            <p className="text-muted-foreground mb-6">
              برای اطلاع از آخرین محصولات و تخفیف‌های ویژه، در خبرنامه ما عضو شوید.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-4 py-2 rounded-md border bg-background"
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                عضویت
              </Button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 