import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface ProductDetailPageProps {
  params: { locale: string; slug: string };
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        compareAtPrice: true,
        sku: true,
        barcode: true,
        weight: true,
        stock: true,
        slug: true,
        isAvailable: true,
        isFeatured: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
          }
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            isMain: true,
            position: true,
          },
          orderBy: {
            position: 'asc'
          }
        },
        variants: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            stock: true,
            options: true,
          }
        },
        attributes: {
          select: {
            id: true,
            name: true,
            value: true,
          }
        },
        dimensions: {
          select: {
            length: true,
            width: true,
            height: true,
            unit: true,
          }
        },
        reviews: {
          where: { isPublished: true },
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            isVerified: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                username: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            reviews: true,
            favoriteBy: true,
          }
        }
      }
    });

    if (!product || !product.isPublished || !product.isAvailable) {
      return null;
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    // Parse variant options
    const variantsWithParsedOptions = product.variants.map(variant => ({
      ...variant,
      options: JSON.parse(variant.options || '{}')
    }));

    // Group reviews by rating
    const ratingDistribution = {
      5: product.reviews.filter(r => r.rating === 5).length,
      4: product.reviews.filter(r => r.rating === 4).length,
      3: product.reviews.filter(r => r.rating === 3).length,
      2: product.reviews.filter(r => r.rating === 2).length,
      1: product.reviews.filter(r => r.rating === 1).length,
    };

    return {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      variants: variantsWithParsedOptions,
      ratingDistribution,
      mainImage: product.images.find(img => img.isMain)?.url || product.images[0]?.url || '/images/products/placeholder.svg',
      totalReviews: product._count.reviews,
      totalFavorites: product._count.favoriteBy,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(categoryIds: string[], currentProductId: string) {
  try {
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: currentProductId },
        isPublished: true,
        isAvailable: true,
        categories: {
          some: {
            id: { in: categoryIds }
          }
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        compareAtPrice: true,
        slug: true,
        images: {
          where: { isMain: true },
          select: {
            url: true,
            alt: true,
          },
          take: 1,
        }
      },
      take: 4,
      orderBy: {
        isFeatured: 'desc'
      }
    });

    return relatedProducts.map(product => ({
      ...product,
      mainImage: product.images[0]?.url || '/images/products/placeholder.svg',
      images: undefined
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params: { locale, slug } }: ProductDetailPageProps) {
  setRequestLocale(locale);
  
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categories.map(cat => cat.id),
    product.id
  );

  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

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
            {product.categories[0] && (
              <>
                <Link href={`/${locale}/products?category=${product.categories[0].slug}`} className="hover:text-accent">
                  {product.categories[0].name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={product.mainImage} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image) => (
                  <div key={image.id} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.categories.length > 0 && (
              <div className="flex items-center space-x-2 space-x-reverse">
                {product.categories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <Link 
                      href={`/${locale}/products?category=${category.slug}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {category.name}
                    </Link>
                    {index < product.categories.length - 1 && <span className="text-muted-foreground">،</span>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            {product.totalReviews > 0 && (
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.averageRating} ({product.totalReviews} نظر)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      {discountPercentage}% تخفیف
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">
                  {product.stock > 0 ? `${product.stock} عدد موجود` : 'موجود نیست'}
                </span>
              </div>
            </div>

            {/* SKU */}
            {product.sku && (
              <div className="text-sm text-muted-foreground">
                کد محصول: {product.sku}
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button className="px-3 py-2 hover:bg-gray-100">-</button>
                  <span className="px-4 py-2 border-x border-gray-300">1</span>
                  <button className="px-3 py-2 hover:bg-gray-100">+</button>
                </div>
                <Button 
                  size="lg" 
                  className="flex-1"
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'افزودن به سبد خرید' : 'موجود نیست'}
                </Button>
              </div>
              
              <Button variant="outline" size="lg" className="w-full">
                افزودن به علاقه‌مندی‌ها
              </Button>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">توضیحات</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Attributes */}
            {product.attributes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">ویژگی‌ها</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.attributes.map((attr) => (
                    <div key={attr.id} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">{attr.name}</span>
                      <span className="text-muted-foreground">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensions */}
            {product.dimensions && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">ابعاد</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">طول</div>
                    <div className="font-semibold">{product.dimensions.length} {product.dimensions.unit}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">عرض</div>
                    <div className="font-semibold">{product.dimensions.width} {product.dimensions.unit}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">ارتفاع</div>
                    <div className="font-semibold">{product.dimensions.height} {product.dimensions.unit}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">نظرات مشتریان</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold mb-2">{product.averageRating}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(product.averageRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      بر اساس {product.totalReviews} نظر
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-sm w-8">{rating} ستاره</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ 
                              width: `${product.totalReviews > 0 ? (product.ratingDistribution[rating as keyof typeof product.ratingDistribution] / product.totalReviews) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {product.ratingDistribution[rating as keyof typeof product.ratingDistribution]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="bg-card rounded-lg border p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-semibold">
                            {review.user.name || review.user.username}
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse mt-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('fa-IR')}
                        </div>
                      </div>
                      
                      {review.title && (
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                      )}
                      
                      {review.comment && (
                        <p className="text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">محصولات مشابه</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  href={`/${locale}/products/${relatedProduct.slug}`}
                  className="group"
                >
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden relative mb-4">
                    <img 
                      src={relatedProduct.mainImage} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium mb-1">{relatedProduct.name}</h3>
                  <p className="text-accent font-bold">{formatPrice(relatedProduct.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 