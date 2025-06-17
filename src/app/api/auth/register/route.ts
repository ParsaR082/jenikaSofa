import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// In a real app, you would use a database to store users
// This is just for demonstration
const users: Record<string, { username: string, fullName: string, phoneNumber: string }> = {};

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, fullName, password } = await request.json();
    
    // Validate input
    if (!phoneNumber || !fullName || !password) {
      return NextResponse.json(
        { error: 'تمامی فیلدها الزامی هستند' },
        { status: 400 }
      );
    }
    
    // Check if phone number is already registered
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'این شماره موبایل قبلا ثبت شده است' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        name: fullName,
        hashedPassword,
        phoneVerified: true // Phone is already verified at this point
      }
    });
    
    // Remove sensitive data
    const { hashedPassword: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'ثبت نام با موفقیت انجام شد',
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
} 