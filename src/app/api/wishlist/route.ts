import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/security';

// Helper: get user from JWT
async function getUserFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    if (!token) return null;
    const decoded = verify(token, getJWTSecret()) as any;
    return decoded;
  } catch {
    return null;
  }
}

// GET: Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'احراز هویت الزامی است' }, { status: 401 });
    }
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            isAvailable: true,
            images: {
              where: { isMain: true },
              select: { url: true },
              take: 1,
            },
            categories: {
              select: { name: true },
              take: 1,
            },
          }
        }
      }
    });
    return NextResponse.json({
      items: wishlist.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images[0]?.url || '/images/products/placeholder.svg',
        category: item.product.categories[0]?.name || 'بدون دسته',
        isAvailable: item.product.isAvailable,
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت لیست علاقه‌مندی‌ها' }, { status: 500 });
  }
}

// POST: Add product to wishlist
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'احراز هویت الزامی است' }, { status: 401 });
    }
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'شناسه محصول الزامی است' }, { status: 400 });
    }
    // Check if already in wishlist
    const exists = await prisma.wishlistItem.findFirst({ where: { userId: user.id, productId } });
    if (exists) {
      return NextResponse.json({ message: 'قبلاً به علاقه‌مندی‌ها اضافه شده است' }, { status: 200 });
    }
    await prisma.wishlistItem.create({ data: { userId: user.id, productId } });
    return NextResponse.json({ message: 'محصول به علاقه‌مندی‌ها اضافه شد' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در افزودن به علاقه‌مندی‌ها' }, { status: 500 });
  }
}

// DELETE: Remove product from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'احراز هویت الزامی است' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'شناسه محصول الزامی است' }, { status: 400 });
    }
    await prisma.wishlistItem.deleteMany({ where: { userId: user.id, productId } });
    return NextResponse.json({ message: 'محصول از علاقه‌مندی‌ها حذف شد' });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در حذف از علاقه‌مندی‌ها' }, { status: 500 });
  }
} 