import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {
  SECURITY_CONFIG,
  authSchemas,
  getClientIP,
  checkRateLimit,
  validateAndSanitize,
  checkPasswordStrength
} from '@/lib/security';

// In a real app, you would use a database to store users
// This is just for demonstration
const users: Record<string, { username: string, fullName: string, phoneNumber: string }> = {};

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  const rateLimitKey = `register:${clientIP}`;
  
  try {
    // Check rate limiting
    const rateLimit = checkRateLimit(rateLimitKey, 10); // Allow more attempts for registration
    
    if (!rateLimit.allowed) {
      const retryAfter = rateLimit.resetTime ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000) : 900;
      
      return NextResponse.json(
        { 
          error: 'تعداد تلاش‌های ثبت نام بیش از حد مجاز است. لطفا کمی صبر کنید.',
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString()
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateAndSanitize(body, authSchemas.register);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'اطلاعات ورودی نامعتبر است',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const { phoneNumber, fullName, password } = validation.data;
    
    // Additional password strength check
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength.score < 4) {
      return NextResponse.json(
        { 
          error: 'رمز عبور به اندازه کافی قوی نیست',
          suggestions: passwordStrength.feedback 
        },
        { status: 400 }
      );
    }
    
    // Check if phone number is already registered
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
      select: { id: true, phoneVerified: true }
    });
    
    if (existingUser) {
      // Don't reveal whether phone is verified or not for security
      return NextResponse.json(
        { error: 'این شماره موبایل قبلا ثبت شده است' },
        { status: 409 }
      );
    }
    
    // Hash password with secure rounds
    const hashedPassword = await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_ROUNDS);
    
    // Create user with transaction for data consistency
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          phoneNumber,
          name: fullName,
          hashedPassword,
          phoneVerified: false, // Require phone verification
          role: 'USER'
        },
        select: {
          id: true,
          phoneNumber: true,
          name: true,
          role: true,
          phoneVerified: true,
          createdAt: true
        }
      });
      
      // Log user creation for audit trail
      console.log(`New user registered: ${newUser.id} from IP: ${clientIP}`);
      
      return newUser;
    });
    
    // TODO: Send verification SMS
    // In a real implementation, you'd send a verification code here
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'ثبت نام با موفقیت انجام شد. لطفا شماره موبایل خود را تایید کنید.',
        user,
        requiresVerification: true,
        timestamp: new Date().toISOString()
      },
      { 
        status: 201,
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
    
  } catch (error) {
    // Log error for monitoring
    console.error('Registration error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: clientIP,
      timestamp: new Date().toISOString()
    });
    
    // Check for specific database errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'این شماره موبایل قبلا ثبت شده است' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطای داخلی سرور. لطفا بعدا تلاش کنید.' },
      { status: 500 }
    );
  }
} 