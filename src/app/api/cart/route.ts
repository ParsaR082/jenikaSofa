import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/security';

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('auth-token')?.value;
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return null;
    }

    const decoded = verify(token, getJWTSecret()) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET: Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'احراز هویت الزامی است' },
        { status: 401 }
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: user.id
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            slug: true,
            images: {
              where: { isMain: true },
              select: {
                url: true,
                alt: true,
              },
              take: 1,
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform cart items to include main image
    const transformedItems = cartItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      variantData: item.variantData ? JSON.parse(item.variantData) : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: {
        ...item.product,
        mainImage: item.product.images[0]?.url || '/images/products/placeholder.svg',
        images: undefined // Remove images array
      }
    }));

    // Calculate totals
    const total = transformedItems.reduce((sum: number, item: any) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const itemCount = transformedItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

    return NextResponse.json({
      items: transformedItems,
      total,
      itemCount
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت سبد خرید' },
      { status: 500 }
    );
  }
}

// POST: Add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'احراز هویت الزامی است' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1, variantData = null } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'شناسه محصول الزامی است' },
        { status: 400 }
      );
    }

    // Check if product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        stock: true,
        isAvailable: true,
        isPublished: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'محصول یافت نشد' },
        { status: 404 }
      );
    }

    if (!product.isAvailable || !product.isPublished) {
      return NextResponse.json(
        { error: 'محصول در دسترس نیست' },
        { status: 400 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'موجودی کافی نیست' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: user.id,
        productId: productId,
        variantData: variantData ? JSON.stringify(variantData) : null
      }
    });

    let cartItem;

    if (existingItem) {
      // Update existing item
      const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
      
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              compareAtPrice: true,
              stock: true,
              slug: true,
              images: {
                where: { isMain: true },
                select: {
                  url: true,
                  alt: true,
                },
                take: 1,
              }
            }
          }
        }
      });
    } else {
      // Create new item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: productId,
          quantity: quantity,
          variantData: variantData ? JSON.stringify(variantData) : null
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              compareAtPrice: true,
              stock: true,
              slug: true,
              images: {
                where: { isMain: true },
                select: {
                  url: true,
                  alt: true,
                },
                take: 1,
              }
            }
          }
        }
      });
    }

    // Transform response
    const transformedItem = {
      id: cartItem.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      variantData: cartItem.variantData ? JSON.parse(cartItem.variantData) : null,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
      product: {
        ...cartItem.product,
        mainImage: cartItem.product.images[0]?.url || '/images/products/placeholder.svg',
        images: undefined
      }
    };

    return NextResponse.json({
      message: 'محصول به سبد خرید اضافه شد',
      item: transformedItem
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'خطا در افزودن به سبد خرید' },
      { status: 500 }
    );
  }
}

// PUT: Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'احراز هویت الزامی است' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'شناسه آیتم و تعداد الزامی است' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: {
          id: itemId,
          userId: user.id
        }
      });

      return NextResponse.json({
        message: 'آیتم از سبد خرید حذف شد'
      });
    }

    // Check if item exists and belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: user.id
      },
      include: {
        product: {
          select: {
            stock: true
          }
        }
      }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'آیتم یافت نشد' },
        { status: 404 }
      );
    }

    if (quantity > existingItem.product.stock) {
      return NextResponse.json(
        { error: 'موجودی کافی نیست' },
        { status: 400 }
      );
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            slug: true,
            images: {
              where: { isMain: true },
              select: {
                url: true,
                alt: true,
              },
              take: 1,
            }
          }
        }
      }
    });

    const transformedItem = {
      id: updatedItem.id,
      productId: updatedItem.productId,
      quantity: updatedItem.quantity,
      variantData: updatedItem.variantData ? JSON.parse(updatedItem.variantData) : null,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt,
      product: {
        ...updatedItem.product,
        mainImage: updatedItem.product.images[0]?.url || '/images/products/placeholder.svg',
        images: undefined
      }
    };

    return NextResponse.json({
      message: 'تعداد به‌روزرسانی شد',
      item: transformedItem
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی سبد خرید' },
      { status: 500 }
    );
  }
}

// DELETE: Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'احراز هویت الزامی است' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'شناسه آیتم الزامی است' },
        { status: 400 }
      );
    }

    // Delete item
    await prisma.cartItem.deleteMany({
      where: {
        id: itemId,
        userId: user.id
      }
    });

    return NextResponse.json({
      message: 'آیتم از سبد خرید حذف شد'
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'خطا در حذف از سبد خرید' },
      { status: 500 }
    );
  }
} 