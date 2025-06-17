import { NextRequest, NextResponse } from 'next/server';

// Use the same in-memory storage as in send-verification route
// In a real app, you would use a database
declare const verificationCodes: Record<string, { code: string, expiresAt: number }>;

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();
    
    // Validate input
    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'شماره موبایل و کد تایید الزامی است' },
        { status: 400 }
      );
    }
    
    // Check if verification code exists and is valid
    const storedVerification = verificationCodes[phoneNumber];
    if (!storedVerification) {
      return NextResponse.json(
        { error: 'کد تایید برای این شماره ارسال نشده است' },
        { status: 400 }
      );
    }
    
    // Check if code has expired
    if (storedVerification.expiresAt < Date.now()) {
      // Remove expired code
      delete verificationCodes[phoneNumber];
      
      return NextResponse.json(
        { error: 'کد تایید منقضی شده است. لطفا دوباره درخواست کنید' },
        { status: 400 }
      );
    }
    
    // Check if code matches
    if (storedVerification.code !== code) {
      return NextResponse.json(
        { error: 'کد تایید نادرست است' },
        { status: 400 }
      );
    }
    
    // Code is valid - remove it to prevent reuse
    delete verificationCodes[phoneNumber];
    
    return NextResponse.json(
      { success: true, message: 'کد تایید صحیح است', verified: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing verification:', error);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
} 