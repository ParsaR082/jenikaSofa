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

// GET: Fetch all users
export async function GET(request: NextRequest) {
  const authResult = await checkAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}

// POST: Create a new user
export async function POST(request: NextRequest) {
  const authResult = await checkAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const { username, name, email, password, role, phoneNumber } = body;

    // Validation
    if (!username || !name || !password) {
      return NextResponse.json(
        { error: 'نام کاربری، نام و رمز عبور الزامی هستند' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'این نام کاربری قبلا استفاده شده است' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        phoneNumber,
        hashedPassword,
        role: role || 'USER',
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(
      { 
        message: 'کاربر با موفقیت ایجاد شد',
        user 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}

// PUT: Update a user
export async function PUT(request: NextRequest) {
  const authResult = await checkAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const { id, username, name, email, role, phoneNumber, password } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه کاربر الزامی است' },
        { status: 400 }
      );
    }

    const updateData: any = {
      username,
      name,
      email,
      phoneNumber,
      role,
    };

    // Only update password if provided
    if (password) {
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
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a user
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
        { error: 'شناسه کاربر الزامی است' },
        { status: 400 }
      );
    }

    // Check if user exists and is not a super admin
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
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