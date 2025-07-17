import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
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

// PATCH: Update a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await checkAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { username, name, email, role, phoneNumber, phoneVerified, emailVerified, password } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه کاربر الزامی است' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    const updateData: any = {
      username,
      name,
      email,
      phoneNumber,
      role,
      phoneVerified,
    };

    // Handle emailVerified (convert boolean to Date or null)
    if (emailVerified === true) {
      updateData.emailVerified = new Date();
    } else if (emailVerified === false) {
      updateData.emailVerified = null;
    }

    // Only update password if provided
    if (password && password.trim()) {
      updateData.hashedPassword = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        phoneVerified: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(
      { 
        message: 'کاربر با موفقیت به‌روزرسانی شد',
        user 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      if (error.message.includes('username')) {
        return NextResponse.json(
          { error: 'این نام کاربری قبلا استفاده شده است' },
          { status: 409 }
        );
      }
      if (error.message.includes('email')) {
        return NextResponse.json(
          { error: 'این ایمیل قبلا استفاده شده است' },
          { status: 409 }
        );
      }
      if (error.message.includes('phoneNumber')) {
        return NextResponse.json(
          { error: 'این شماره تلفن قبلا استفاده شده است' },
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

// DELETE: Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await checkAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه کاربر الزامی است' },
        { status: 400 }
      );
    }

    // Check if user exists and is not a super admin
    const user = await prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, 
        role: true, 
        username: true,
        _count: {
          select: {
            orders: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    if (user.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'نمی‌توان سوپر ادمین را حذف کرد' },
        { status: 403 }
      );
    }

    // Check if user has orders
    if (user._count.orders > 0) {
      return NextResponse.json(
        { error: 'این کاربر سفارشات دارد و نمی‌توان آن را حذف کرد' },
        { status: 409 }
      );
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'کاربر با موفقیت حذف شد' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
} 