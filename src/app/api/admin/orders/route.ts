import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/security';
import { prisma } from '@/lib/prisma';

// بررسی نقش ادمین
async function isAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return false;
  try {
    const decoded = verify(token, getJWTSecret()) as any;
    return decoded.role === 'ADMIN';
  } catch {
    return false;
  }
}

// دریافت همه سفارشات
export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phoneNumber: true
          }
        },
        address: true,
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// تغییر وضعیت سفارش
export async function PATCH(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { orderId, status, paymentStatus, trackingNumber } = body;
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        paymentStatus,
        trackingNumber
      }
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 