import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// Secret key for JWT - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In a real app, you would use a database to retrieve users
// This is just for demonstration
declare const users: Record<string, { username: string, fullName: string, phoneNumber: string }>;

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, password } = await request.json();
    
    // Validate input
    if (!phoneNumber || !password) {
      return NextResponse.json(
        { error: 'شماره موبایل و رمز عبور الزامی هستند' },
        { status: 400 }
      );
    }
    
    // Find user by phone number
    const user = await prisma.user.findUnique({
      where: { phoneNumber }
    });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'کاربری با این شماره موبایل یافت نشد' },
        { status: 404 }
      );
    }
    
    // Check if user has a password (they might have registered via other methods)
    if (!user.hashedPassword) {
      return NextResponse.json(
        { error: 'روش احراز هویت نامعتبر است' },
        { status: 400 }
      );
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'رمز عبور نادرست است' },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = sign(
      { 
        id: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    cookies().set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    // Remove sensitive data
    const { hashedPassword: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'ورود با موفقیت انجام شد',
        user: userWithoutPassword
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
} 