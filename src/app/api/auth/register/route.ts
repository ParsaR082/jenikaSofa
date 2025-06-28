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
    
    // Simple validation for registration
    if (!body.username || !body.fullName || !body.password) {
      return NextResponse.json(
        { error: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }
    
    const { username, fullName, password } = body;
    
    // Validate username format
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'نام کاربری باید حداقل ۳ کاراکتر باشد' },
        { status: 400 }
      );
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و _ باشد' },
        { status: 400 }
      );
    }
    
    // Additional password strength check
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'رمز عبور باید حداقل ۸ کاراکتر باشد' },
        { status: 400 }
      );
    }
    
    // Check if username is already registered
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'این نام کاربری قبلا استفاده شده است' },
        { status: 409 }
      );
    }
    
    // Hash password with secure rounds
    const hashedPassword = await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_ROUNDS);
    
    // Create user with transaction for data consistency
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username,
          name: fullName,
          hashedPassword,
          role: 'USER'
        },
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          createdAt: true
        }
      });
      
      // Log user creation for audit trail
      console.log(`New user registered: ${newUser.id} (${newUser.username}) from IP: ${clientIP}`);
      
      return newUser;
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'ثبت نام با موفقیت انجام شد. می‌توانید وارد شوید.',
        user,
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
        { error: 'این نام کاربری قبلا استفاده شده است' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطای داخلی سرور. لطفا بعدا تلاش کنید.' },
      { status: 500 }
    );
  }
} 