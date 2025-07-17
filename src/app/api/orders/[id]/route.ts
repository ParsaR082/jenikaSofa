import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/security';
import { prisma } from '@/lib/prisma';

// دریافت جزئیات سفارش خاص
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, getJWTSecret()) as any;
    
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
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
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phoneNumber: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 