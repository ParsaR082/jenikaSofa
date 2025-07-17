import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/security';

// Middleware to check admin authentication
async function checkAdminAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('auth-token')?.value;
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    const decoded = verify(token, getJWTSecret()) as any;
    
    if (!decoded.role || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return { error: 'Forbidden', status: 403 };
    }

    return { user: decoded };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

// POST: Create a new product
export async function POST(request: NextRequest) {
  const authResult = await checkAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      compareAtPrice,
      sku,
      stock = 0,
      weight,
      isAvailable = true,
      isFeatured = false,
      isPublished = true,
      categoryIds = [],
      images = [],
      dimensions,
      attributes = []
    } = body;

    // Validation
    if (!name || !description || !price) {
      return NextResponse.json(
        { error: 'نام، توضیحات و قیمت محصول الزامی هستند' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'محصولی با این نام قبلا وجود دارد' },
        { status: 409 }
      );
    }

    // Create product with related data
    const productData: any = {
      name,
      description,
      price: parseFloat(price),
      slug,
      stock: parseInt(stock) || 0,
      isAvailable,
      isFeatured,
      isPublished
    };

    if (compareAtPrice) {
      productData.compareAtPrice = parseFloat(compareAtPrice);
    }

    if (sku) {
      productData.sku = sku;
    }

    if (weight) {
      productData.weight = parseFloat(weight);
    }

    // Connect categories if provided
    if (categoryIds.length > 0) {
      productData.categories = {
        connect: categoryIds.map((id: string) => ({ id }))
      };
    }

    // Add images if provided
    if (images.length > 0) {
      productData.images = {
        create: images.map((img: any, index: number) => ({
          url: img.url,
          alt: img.alt || name,
          isMain: index === 0,
          position: index
        }))
      };
    }

    // Add dimensions if provided
    if (dimensions) {
      productData.dimensions = {
        create: {
          length: parseFloat(dimensions.length),
          width: parseFloat(dimensions.width),
          height: parseFloat(dimensions.height),
          unit: dimensions.unit || 'cm'
        }
      };
    }

    // Add attributes if provided
    if (attributes.length > 0) {
      productData.attributes = {
        create: attributes.map((attr: any) => ({
          name: attr.name,
          value: attr.value
        }))
      };
    }

    const product = await prisma.product.create({
      data: productData,
      include: {
        categories: true,
        images: true,
        dimensions: true,
        attributes: true
      }
    });

    return NextResponse.json(
      { 
        message: 'محصول با موفقیت ایجاد شد',
        product 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      if (error.message.includes('sku')) {
        return NextResponse.json(
          { error: 'این SKU قبلا استفاده شده است' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(request: NextRequest) {
  const authResult = await checkAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه محصول الزامی است' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      select: { 
        id: true, 
        name: true,
        _count: {
          select: {
            orderItems: true
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

    // Check if product has been ordered
    if (product._count.orderItems > 0) {
      return NextResponse.json(
        { error: 'این محصول در سفارشات استفاده شده و نمی‌توان آن را حذف کرد' },
        { status: 409 }
      );
    }

    // Delete product (this will cascade delete related records like images, attributes, etc.)
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'محصول با موفقیت حذف شد' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
} 