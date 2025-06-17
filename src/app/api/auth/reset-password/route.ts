import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, password } = await request.json();
    
    // Validate input
    if (!phoneNumber || !password) {
      return NextResponse.json(
        { error: 'شماره موبایل و رمز عبور جدید الزامی هستند' },
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
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword }
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'رمز عبور با موفقیت تغییر یافت'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
} 