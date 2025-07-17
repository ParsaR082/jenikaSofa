import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/security';
import { prisma } from '@/lib/prisma';

// ویرایش آدرس
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // بررسی اینکه آدرس متعلق به کاربر است
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: decoded.id
      }
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // اگر این آدرس به عنوان پیش‌فرض تنظیم شده، سایر آدرس‌ها را غیرپیش‌فرض کن
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: decoded.id,
          id: { not: params.id },
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    const address = await prisma.address.update({
      where: { id: params.id },
      data: {
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// حذف آدرس
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, getJWTSecret()) as any;

    // بررسی اینکه آدرس متعلق به کاربر است
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: decoded.id
      }
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 