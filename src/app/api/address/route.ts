import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/security';
import { prisma } from '@/lib/prisma';

// دریافت تمام آدرس‌های کاربر
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, getJWTSecret()) as any;
    
    const addresses = await prisma.address.findMany({
      where: {
        userId: decoded.id
      },
      orderBy: {
        isDefault: 'desc'
      }
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ایجاد آدرس جدید
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, getJWTSecret()) as any;
    const body = await request.json();
    const { addressLine1, addressLine2, city, state, postalCode, isDefault } = body;

    // اعتبارسنجی فیلدهای اجباری
    if (!addressLine1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // اگر این آدرس به عنوان پیش‌فرض تنظیم شده، سایر آدرس‌ها را غیرپیش‌فرض کن
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: decoded.id,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: decoded.id,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 