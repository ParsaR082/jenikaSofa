import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

// Sample product data
const products = [
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
  {
    id: 5,
    name: 'مبل راحتی مدرن',
    price: 1450,
    image: '/placeholder.svg',
    category: 'مبلمان پذیرایی',
  },
  {
    id: 6,
    name: 'میز جلو مبلی',
    price: 350,
    image: '/placeholder.svg',
    category: 'مبلمان پذیرایی',
  },
  {
    id: 7,
    name: 'میز ناهارخوری گرد',
    price: 680,
    image: '/placeholder.svg',
    category: 'میز ناهارخوری',
  },
  {
    id: 8,
    name: 'کمد لباس',
    price: 850,
    image: '/placeholder.svg',
    category: 'مبلمان اتاق خواب',
  },
];

// Filter options
const categories = [
  { id: 'all', name: 'همه محصولات' },
  { id: 'living-room', name: 'مبلمان پذیرایی' },
  { id: 'dining', name: 'میز ناهارخوری' },
  { id: 'bedroom', name: 'مبلمان اتاق خواب' },
  { id: 'office', name: 'مبلمان اداری' },
];

const priceRanges = [
  { id: 'all', name: 'همه قیمت‌ها' },
  { id: 'under-500', name: 'کمتر از ۵,۰۰۰,۰۰۰ تومان' },
  { id: '500-1000', name: '۵,۰۰۰,۰۰۰ تا ۱۰,۰۰۰,۰۰۰ تومان' },
  { id: '1000-1500', name: '۱۰,۰۰۰,۰۰۰ تا ۱۵,۰۰۰,۰۰۰ تومان' },
  { id: 'over-1500', name: 'بیشتر از ۱۵,۰۰۰,۰۰۰ تومان' },
];

const colors = [
  { id: 'all', name: 'همه رنگ‌ها' },
  { id: 'beige', name: 'بژ', color: '#E8DCCA' },
  { id: 'brown', name: 'قهوه‌ای', color: '#8B4513' },
  { id: 'gray', name: 'خاکستری', color: '#808080' },
  { id: 'black', name: 'مشکی', color: '#000000' },
  { id: 'blue', name: 'آبی', color: '#1E3A8A' },
  { id: 'green', name: 'سبز', color: '#2F4F4F' },
];

export default function ProductsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-4 pb-2 border-b">دسته‌بندی</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.id}`}
                        name="category"
                        className="h-4 w-4 text-accent focus:ring-accent border-muted-foreground/30"
                        defaultChecked={category.id === 'all'}
                      />
                      <label htmlFor={`category-${category.id}`} className="mr-2 text-sm">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div>
                <h3 className="font-medium mb-4 pb-2 border-b">قیمت</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${range.id}`}
                        name="price"
                        className="h-4 w-4 text-accent focus:ring-accent border-muted-foreground/30"
                        defaultChecked={range.id === 'all'}
                      />
                      <label htmlFor={`price-${range.id}`} className="mr-2 text-sm">
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Color Filter */}
              <div>
                <h3 className="font-medium mb-4 pb-2 border-b">رنگ</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    color.id === 'all' ? (
                      <div key={color.id} className="flex items-center mb-2 w-full">
                        <input
                          type="radio"
                          id={`color-${color.id}`}
                          name="color"
                          className="h-4 w-4 text-accent focus:ring-accent border-muted-foreground/30"
                          defaultChecked
                        />
                        <label htmlFor={`color-${color.id}`} className="mr-2 text-sm">
                          {color.name}
                        </label>
                      </div>
                    ) : (
                      <div key={color.id} className="flex flex-col items-center">
                        <input
                          type="radio"
                          id={`color-${color.id}`}
                          name="color"
                          className="sr-only"
                        />
                        <label
                          htmlFor={`color-${color.id}`}
                          className="w-8 h-8 rounded-full cursor-pointer border border-muted-foreground/20 flex items-center justify-center"
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        >
                          <span className="sr-only">{color.name}</span>
                        </label>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {/* Apply Filters Button */}
              <Button className="w-full bg-accent hover:bg-accent/90">
                اعمال فیلترها
              </Button>
              
              {/* Reset Filters */}
              <Button variant="outline" className="w-full">
                حذف فیلترها
              </Button>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-muted-foreground">نمایش {products.length} محصول</span>
              </div>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm ml-2">مرتب‌سازی:</label>
                <select
                  id="sort"
                  className="text-sm border-muted rounded-md py-1 px-2 bg-background"
                  defaultValue="newest"
                >
                  <option value="newest">جدیدترین</option>
                  <option value="price-low">قیمت: کم به زیاد</option>
                  <option value="price-high">قیمت: زیاد به کم</option>
                  <option value="popular">محبوب‌ترین</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
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
            
            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                  <span className="sr-only">صفحه قبل</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-accent text-accent-foreground">1</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
                <span className="mx-1">...</span>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">8</Button>
                <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                  <span className="sr-only">صفحه بعد</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 