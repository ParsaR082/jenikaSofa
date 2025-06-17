import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationCode, generateVerificationCode } from '@/lib/kavenegar';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();
    
    // Validate phone number (simple validation)
    if (!phoneNumber || !/^09\d{9}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'شماره موبایل نامعتبر است' },
        { status: 400 }
      );
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    console.log(`Generated verification code ${verificationCode} for ${phoneNumber}`);
    
    // Store verification code in database with expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    // Check if a user with this phone number exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber }
    });
    
    console.log('Existing user:', existingUser);
    
    // Delete old verification requests for this phone number
    await prisma.verificationRequest.deleteMany({
      where: { phoneNumber }
    });
    
    // Create a new verification request
    const verificationRequest = await prisma.verificationRequest.create({
      data: {
        phoneNumber,
        code: verificationCode,
        expires: expiresAt,
        userId: existingUser?.id // Link to user if exists
      }
    });
    
    console.log('Verification request created:', verificationRequest.id);
    
    // Send verification code via SMS
    try {
      await sendVerificationCode(phoneNumber, verificationCode);
      
      return NextResponse.json(
        { success: true, message: 'کد تایید با موفقیت ارسال شد' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error sending verification SMS:', error);
      return NextResponse.json(
        { error: 'خطا در ارسال پیامک. لطفا بعدا تلاش کنید' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
} 