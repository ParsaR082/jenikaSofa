import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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

    if (!product) {
      return NextResponse.json(
        { error: 'محصول یافت نشد' },
        { status: 404 }
      );
    }

    if (!product.isPublished || !product.isAvailable) {
      return NextResponse.json(
        { error: 'محصول در دسترس نیست' },
        { status: 404 }
      );
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

    const response = {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      variants: variantsWithParsedOptions,
      ratingDistribution,
      mainImage: product.images.find(img => img.isMain)?.url || product.images[0]?.url || '/images/products/placeholder.svg',
      totalReviews: product._count.reviews,
      totalFavorites: product._count.favoriteBy,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات محصول' },
      { status: 500 }
    );
  }
} 