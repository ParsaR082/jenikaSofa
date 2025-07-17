import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/security';
import { prisma } from '@/lib/prisma';

// دریافت لیست سفارشات کاربر
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, getJWTSecret()) as any;
    
    const orders = await prisma.order.findMany({
      where: {
        userId: decoded.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  where: { isMain: true },
                  take: 1
                }
              }
            }
          }
        },
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ایجاد سفارش جدید
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, getJWTSecret()) as any;
    const body = await request.json();
    const { addressId, paymentMethod, notes } = body;

    // دریافت سبد خرید کاربر
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: decoded.id
      },
      include: {
        product: true
      }
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // محاسبه مجموع قیمت
    const totalPrice = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // ایجاد سفارش
    const order = await prisma.order.create({
      data: {
        userId: decoded.id,
        addressId,
        paymentMethod,
        notes,
        totalPrice,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            totalPrice: item.product.price * item.quantity
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  where: { isMain: true },
                  take: 1
                }
              }
            }
          }
        },
        address: true
      }
    });

    // پاک کردن سبد خرید
    await prisma.cartItem.deleteMany({
      where: {
        userId: decoded.id
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 