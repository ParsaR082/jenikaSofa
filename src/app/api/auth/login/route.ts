import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import {
  SECURITY_CONFIG,
  authSchemas,
  getClientIP,
  checkRateLimit,
  resetRateLimit,
  validateAndSanitize,
  getJWTSecret
} from '@/lib/security';

// In a real app, you would use a database to retrieve users
// This is just for demonstration
declare const users: Record<string, { username: string, fullName: string, phoneNumber: string }>;

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  const rateLimitKey = `login:${clientIP}`;
  
  try {
    // Check rate limiting
    const rateLimit = checkRateLimit(rateLimitKey, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS);
    
    if (!rateLimit.allowed) {
      const retryAfter = rateLimit.resetTime ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000) : 900;
      
      return NextResponse.json(
        { 
          error: rateLimit.isLocked 
            ? 'حساب کاربری به دلیل تلاش‌های ناموفق زیاد قفل شده است. لطفا بعدا تلاش کنید.'
            : 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفا کمی صبر کنید.',
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS.toString(),
            'X-RateLimit-Remaining': (rateLimit.remainingAttempts || 0).toString(),
            'X-RateLimit-Reset': (rateLimit.resetTime || Date.now() + 900000).toString()
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateAndSanitize(body, authSchemas.login);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'اطلاعات ورودی نامعتبر است',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const { phoneNumber, password } = validation.data;
    
    // Find user by phone number with account status
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        hashedPassword: true,
        role: true,
        phoneVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    // Generic error message to prevent user enumeration
    const genericError = 'شماره موبایل یا رمز عبور نادرست است';
    
    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: genericError },
        { status: 401 }
      );
    }
    
    // Verify password with timing attack protection
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    
    if (!passwordMatch) {
      // Log failed attempt for monitoring
      console.warn(`Failed login attempt for phone: ${phoneNumber} from IP: ${clientIP}`);
      
      return NextResponse.json(
        { error: genericError },
        { status: 401 }
      );
    }

    // Check if phone is verified
    if (!user.phoneVerified) {
      return NextResponse.json(
        { 
          error: 'لطفا ابتدا شماره موبایل خود را تایید کنید',
          requiresVerification: true 
        },
        { status: 403 }
      );
    }

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey);
    
    // Create JWT token with secure settings
    const tokenPayload = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      verified: user.phoneVerified,
      iat: Math.floor(Date.now() / 1000),
    };
    
    const token = sign(tokenPayload, getJWTSecret(), { 
      expiresIn: '7d',
      algorithm: 'HS256',
      issuer: 'mobleman-app',
      audience: 'mobleman-users'
    });
    
    // Set secure cookie
    cookies().set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    // Log successful login for audit trail
    console.log(`Successful login for user: ${user.id} from IP: ${clientIP}`);
    
    // Return user data without sensitive information
    const { hashedPassword: _, ...userResponse } = user;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'ورود با موفقیت انجام شد',
        user: userResponse,
        timestamp: new Date().toISOString()
      },
      { 
        status: 200,
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
    
  } catch (error) {
    // Log error for monitoring without exposing details
    console.error('Login error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: clientIP,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { error: 'خطای داخلی سرور. لطفا بعدا تلاش کنید.' },
      { status: 500 }
    );
  }
} 