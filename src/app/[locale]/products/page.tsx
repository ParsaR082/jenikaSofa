import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { setRequestLocale } from 'next-intl/server';
import { ProductCard, ProductCardSkeleton } from '@/components/ui/product-card';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';

interface ProductsPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getProducts(searchParams: any) {
  try {
    const page = parseInt(searchParams.page as string || '1');
    const limit = parseInt(searchParams.limit as string || '12');
    const category = searchParams.category as string;
    const search = searchParams.search as string;
    const minPrice = searchParams.minPrice as string;
    const maxPrice = searchParams.maxPrice as string;
    const inStock = searchParams.inStock as string;
    const featured = searchParams.featured as string;
    const sortByParam = searchParams.sortBy as string || 'createdAt';

    // Map sortByParam to Prisma orderBy
    let orderBy: any = { createdAt: 'desc' };
    if (sortByParam === 'price-asc') orderBy = { price: 'asc' };
    else if (sortByParam === 'price-desc') orderBy = { price: 'desc' };
    else if (sortByParam === 'name-asc') orderBy = { name: 'asc' };
    else if (sortByParam === 'name-desc') orderBy = { name: 'desc' };
    else if (sortByParam === 'createdAt') orderBy = { createdAt: 'desc' };

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isPublished: true,
      isAvailable: true,
    };

    if (category) {
      where.categories = {
        some: {
          slug: category
        }
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Fetch products with related data
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          compareAtPrice: true,
          stock: true,
          slug: true,
          isAvailable: true,
          isFeatured: true,
          createdAt: true,
          updatedAt: true,
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          images: {
            where: { isMain: true },
            select: {
              url: true,
              alt: true,
            },
            take: 1,
          },
          _count: {
            select: {
              reviews: true,
            }
          },
          reviews: {
            select: {
              rating: true,
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
        mainImage: product.images[0]?.url || '/images/products/placeholder.svg',
        reviews: undefined, // Remove reviews array from response
      };
    });

    return {
      products: productsWithRating,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 12,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    };
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ params: { locale }, searchParams }: ProductsPageProps) {
  setRequestLocale(locale);
  
  const [productsData, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories()
  ]);

  const { products, pagination } = productsData;
  
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
        <form method="GET" className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <select
                name="category"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={searchParams.category as string || ''}
              >
                <option value="">همه دسته‌ها</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name} ({category._count.products})
                  </option>
                ))}
              </select>

              <select
                name="sortBy"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={searchParams.sortBy as string || 'createdAt'}
              >
                <option value="createdAt">مرتب‌سازی بر اساس</option>
                <option value="price-asc">قیمت: کم به زیاد</option>
                <option value="price-desc">قیمت: زیاد به کم</option>
                <option value="name-asc">نام: الف تا ی</option>
                <option value="name-desc">نام: ی تا الف</option>
              </select>

              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="available"
                  name="inStock"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked={searchParams.inStock === 'true'}
                  value="true"
                />
                <label htmlFor="available" className="text-sm text-gray-700">
                  فقط کالاهای موجود
                </label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked={searchParams.featured === 'true'}
                  value="true"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  فقط محصولات ویژه
                </label>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {pagination.totalCount} محصول
            </div>
          </div>
          {/* Visible submit button for filtering */}
          <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">اعمال فیلتر</button>
        </form>

        {/* Products Grid */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        }>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.compareAtPrice || undefined}
                  image={product.mainImage}
                  category={product.categories[0]?.name || 'بدون دسته'}
                  rating={product.averageRating}
                  reviewCount={product.reviewCount}
                  isAvailable={product.isAvailable}
                  isFeatured={product.isFeatured}
                  isOnSale={!!product.compareAtPrice && product.compareAtPrice > product.price}
                  stock={product.stock}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-muted rounded-lg flex items-center justify-center mb-6">
                <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">محصولی یافت نشد</h3>
              <p className="text-muted-foreground mb-6">لطفاً فیلترهای خود را تغییر دهید</p>
              <Button asChild>
                <Link href={`/${locale}/products`}>
                  مشاهده همه محصولات
                </Link>
              </Button>
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2 space-x-reverse">
              {pagination.hasPrevPage && (
                <Button variant="outline" asChild>
                  <Link href={`/${locale}/products?page=${pagination.page - 1}`}>
                    قبلی
                  </Link>
                </Button>
              )}
              
              <span className="px-4 py-2 text-sm">
                صفحه {pagination.page} از {pagination.totalPages}
              </span>
              
              {pagination.hasNextPage && (
                <Button variant="outline" asChild>
                  <Link href={`/${locale}/products?page=${pagination.page + 1}`}>
                    بعدی
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}

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
              <p className="text-gray-600">۵ سال ضمانت برای تمامی محصولات</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">پشتیبانی ۲۴/۷</h3>
              <p className="text-gray-600">پشتیبانی شبانه‌روزی برای مشتریان</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 