import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { setRequestLocale } from 'next-intl/server';
import { ProductCard, ProductCardSkeleton } from '@/components/ui/product-card';
import { Suspense } from 'react';

// Mock product data for demonstration
const mockProducts = [
  {
    id: '1',
    name: 'مبل راحتی مدرن سه نفره',
    price: 12500000,
    originalPrice: 15000000,
    image: '/api/placeholder/400/400',
    category: 'مبل',
    rating: 4.5,
    reviewCount: 24,
    isAvailable: true,
    isFeatured: true,
    isOnSale: true,
    stock: 5
  },
  {
    id: '2',
    name: 'میز عسلی چوبی کلاسیک',
    price: 3200000,
    image: '/api/placeholder/400/400',
    category: 'میز',
    rating: 4.2,
    reviewCount: 18,
    isAvailable: true,
    isFeatured: false,
    isOnSale: false,
    stock: 25
  },
  {
    id: '3',
    name: 'صندلی اداری ارگونومیک',
    price: 2800000,
    originalPrice: 3500000,
    image: '/api/placeholder/400/400',
    category: 'صندلی',
    rating: 4.8,
    reviewCount: 42,
    isAvailable: true,
    isFeatured: false,
    isOnSale: true,
    stock: 3
  },
  {
    id: '4',
    name: 'کمد لباس دو درب آینه‌ای',
    price: 8900000,
    image: '/api/placeholder/400/400',
    category: 'کمد',
    rating: 4.1,
    reviewCount: 12,
    isAvailable: true,
    isFeatured: false,
    isOnSale: false,
    stock: 15
  },
  {
    id: '5',
    name: 'تخت خواب دو نفره مدرن',
    price: 18500000,
    originalPrice: 22000000,
    image: '/api/placeholder/400/400',
    category: 'تخت',
    rating: 4.6,
    reviewCount: 31,
    isAvailable: false,
    isFeatured: true,
    isOnSale: true,
    stock: 0
  },
  {
    id: '6',
    name: 'قفسه کتاب پنج طبقه',
    price: 4200000,
    image: '/api/placeholder/400/400',
    category: 'قفسه',
    rating: 4.3,
    reviewCount: 19,
    isAvailable: true,
    isFeatured: false,
    isOnSale: false,
    stock: 12
  },
  {
    id: '7',
    name: 'میز تحریر چوبی با کشو',
    price: 5500000,
    originalPrice: 6800000,
    image: '/api/placeholder/400/400',
    category: 'میز',
    rating: 4.4,
    reviewCount: 27,
    isAvailable: true,
    isFeatured: false,
    isOnSale: true,
    stock: 8
  },
  {
    id: '8',
    name: 'مبل راحتی تک نفره',
    price: 7200000,
    image: '/api/placeholder/400/400',
    category: 'مبل',
    rating: 4.7,
    reviewCount: 35,
    isAvailable: true,
    isFeatured: true,
    isOnSale: false,
    stock: 6
  }
];

interface ProductsPageProps {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export default function ProductsPage({ params: { locale } }: ProductsPageProps) {
  setRequestLocale(locale);
  
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">محصولات</h1>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Link href={`/${locale}`} className="hover:text-accent">صفحه اصلی</Link>
            <span className="mx-2">/</span>
            <span>محصولات</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            محصولات ما
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            مجموعه‌ای منتخب از بهترین مبلمان خانگی و اداری با کیفیت برتر و قیمت مناسب
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">همه دسته‌ها</option>
                <option value="sofa">مبل</option>
                <option value="table">میز</option>
                <option value="chair">صندلی</option>
                <option value="wardrobe">کمد</option>
                <option value="bed">تخت</option>
                <option value="shelf">قفسه</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">مرتب‌سازی بر اساس</option>
                <option value="price-low">قیمت: کم به زیاد</option>
                <option value="price-high">قیمت: زیاد به کم</option>
                <option value="rating">بالاترین امتیاز</option>
                <option value="newest">جدیدترین</option>
              </select>

              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="available"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="available" className="text-sm text-gray-700">
                  فقط کالاهای موجود
                </label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="sale"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sale" className="text-sm text-gray-700">
                  فقط تخفیف‌دار
                </label>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {mockProducts.length} محصول
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                locale={locale}
              />
            ))}
          </div>
        </Suspense>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            مشاهده محصولات بیشتر
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ارسال رایگان</h3>
              <p className="text-gray-600">برای خریدهای بالای ۵ میلیون تومان</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ضمانت کیفیت</h3>
              <p className="text-gray-600">ضمانت ۲ ساله برای تمام محصولات</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">پشتیبانی ۲۴/۷</h3>
              <p className="text-gray-600">آماده پاسخگویی در تمام ساعات شبانه‌روز</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 