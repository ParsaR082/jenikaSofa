import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

// Sample product data (in a real app, this would come from an API or database)
const product = {
  id: 1,
  name: 'مبل راحتی کلاسیک',
  price: 1250,
  description: 'مبل راحتی کلاسیک با طراحی زیبا و منحصر به فرد، مناسب برای فضای پذیرایی شما. این مبل با پارچه مرغوب و اسفنج با کیفیت بالا تولید شده و دارای ۵ سال ضمانت می‌باشد.',
  features: [
    'جنس رویه: پارچه مخمل درجه یک',
    'جنس اسفنج: فوم سرد با تراکم بالا',
    'جنس فریم: چوب روسی',
    'قابلیت تبدیل به تخت خواب',
    'دارای ۵ سال ضمانت',
  ],
  colors: [
    { name: 'کرم', value: '#E8DCCA' },
    { name: 'قهوه‌ای', value: '#8B4513' },
    { name: 'خاکستری', value: '#808080' },
  ],
  category: 'مبلمان پذیرایی',
  images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  relatedProducts: [
    { id: 2, name: 'مبل ال مدرن', price: 1850, image: '/placeholder.svg' },
    { id: 3, name: 'میز ناهارخوری چوبی', price: 750, image: '/placeholder.svg' },
    { id: 6, name: 'میز جلو مبلی', price: 350, image: '/placeholder.svg' },
  ]
};

export default function ProductDetailPage({ params }: { params: { id: string, locale: string } }) {
  const locale = params.locale;
  
  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href={`/${locale}`} className="hover:text-accent">صفحه اصلی</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/products`} className="hover:text-accent">محصولات</Link>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                تصویر اصلی محصول
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer">
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                    تصویر {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-accent text-2xl font-bold mb-4">{formatPrice(product.price)}</p>
            <div className="border-t border-b py-4 my-6">
              <p className="text-muted-foreground mb-6">{product.description}</p>
              
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">انتخاب رنگ:</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <div key={color.name} className="flex flex-col items-center">
                      <button
                        className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                      <span className="text-xs mt-1">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">تعداد:</h3>
                <div className="flex items-center">
                  <button className="w-8 h-8 bg-muted rounded-l-md flex items-center justify-center">-</button>
                  <input
                    type="text"
                    className="w-12 h-8 text-center border-y"
                    value="1"
                    readOnly
                  />
                  <button className="w-8 h-8 bg-muted rounded-r-md flex items-center justify-center">+</button>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="flex space-x-4">
                <Button className="bg-accent hover:bg-accent/90 flex-1">
                  افزودن به سبد خرید
                </Button>
                <Button variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </Button>
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">ویژگی‌های محصول:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-accent ml-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Delivery Info */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-accent ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-1-1h-8a1 1 0 00-1 1v1H3z" />
                </svg>
                <span className="font-medium">ارسال رایگان</span>
              </div>
              <p className="text-sm text-muted-foreground">برای سفارش‌های بالای ۲ میلیون تومان در تهران و شهرستان‌ها</p>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-12">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button className="px-6 py-3 font-medium text-accent border-b-2 border-accent">توضیحات</button>
              <button className="px-6 py-3 font-medium text-muted-foreground">مشخصات فنی</button>
              <button className="px-6 py-3 font-medium text-muted-foreground">نظرات کاربران</button>
            </div>
          </div>
          <div className="py-6">
            <p className="text-muted-foreground">
              {product.description}
              <br /><br />
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
            </p>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">محصولات مرتبط</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.relatedProducts.map((item) => (
              <Link href={`/${locale}/products/${item.id}`} key={item.id} className="group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    تصویر محصول
                  </div>
                </div>
                <h3 className="font-medium mb-1">{item.name}</h3>
                <p className="text-accent font-bold">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 