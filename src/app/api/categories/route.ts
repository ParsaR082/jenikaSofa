import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const parentId = searchParams.get('parentId');

    const where: any = {};
    if (parentId === 'null' || parentId === '') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    const categories = await prisma.category.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        image: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        children: {
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
          }
        },
        _count: {
          select: {
            products: true
          }
        },
        ...(includeProducts && {
          products: {
            where: {
              isPublished: true,
              isAvailable: true,
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
            take: 8, // Limit products per category
            orderBy: {
              isFeatured: 'desc'
            }
          }
        })
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform categories to include main image for products
    const transformedCategories = categories.map(category => ({
      ...category,
      products: category.products?.map((product: any) => ({
        ...product,
        mainImage: product.images?.[0]?.url || '/images/products/placeholder.svg',
        images: undefined // Remove images array from response
      }))
    }));

    return NextResponse.json({
      categories: transformedCategories,
      total: categories.length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت دسته‌بندی‌ها' },
      { status: 500 }
    );
  }
} 