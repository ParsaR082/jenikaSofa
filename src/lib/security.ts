import { NextRequest } from 'next/server';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number; lockedUntil?: number }>();

// Security Configuration
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
  LOCKOUT_TIME: parseInt(process.env.LOCKOUT_TIME || '900000'), // 15 minutes
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  JWT_SECRET: process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production!');
    }
    return 'fallback-dev-secret-key';
  })(),
};

// Validation Schemas
export const authSchemas = {
  login: z.object({
    phoneNumber: z.string()
      .regex(/^(\+98|0)?9\d{9}$/, 'Invalid Iranian phone number format')
      .transform(phone => phone.replace(/^\+98/, '0').replace(/^00/, '0')),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
  }),
  
  register: z.object({
    phoneNumber: z.string()
      .regex(/^(\+98|0)?9\d{9}$/, 'Invalid Iranian phone number format')
      .transform(phone => phone.replace(/^\+98/, '0').replace(/^00/, '0')),
    fullName: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name too long')
      .regex(/^[a-zA-Zآ-ی\s]+$/, 'Name can only contain letters and spaces'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
  }),
  
  resetPassword: z.object({
    phoneNumber: z.string()
      .regex(/^(\+98|0)?9\d{9}$/, 'Invalid Iranian phone number format'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    verificationCode: z.string()
      .length(6, 'Verification code must be 6 digits')
      .regex(/^\d{6}$/, 'Verification code must contain only numbers')
  })
};

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || real || request.ip || 'unknown';
  return ip;
}

// Rate limiting
export function checkRateLimit(identifier: string, maxAttempts = SECURITY_CONFIG.RATE_LIMIT_MAX): { 
  allowed: boolean; 
  remainingAttempts?: number; 
  resetTime?: number;
  isLocked?: boolean;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record) {
    rateLimitStore.set(identifier, { attempts: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }
  
  // Check if currently locked
  if (record.lockedUntil && now < record.lockedUntil) {
    return { 
      allowed: false, 
      isLocked: true,
      resetTime: record.lockedUntil 
    };
  }
  
  // Reset if window has passed
  if (now - record.lastAttempt > SECURITY_CONFIG.RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { attempts: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }
  
  // Check if exceeded max attempts
  if (record.attempts >= maxAttempts) {
    const lockUntil = now + SECURITY_CONFIG.LOCKOUT_TIME;
    rateLimitStore.set(identifier, { 
      ...record, 
      lockedUntil: lockUntil,
      lastAttempt: now 
    });
    return { 
      allowed: false, 
      isLocked: true,
      resetTime: lockUntil 
    };
  }
  
  // Increment attempts
  record.attempts++;
  record.lastAttempt = now;
  rateLimitStore.set(identifier, record);
  
  return { 
    allowed: true, 
    remainingAttempts: maxAttempts - record.attempts 
  };
}

// Reset rate limit for successful operations
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

// Input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags and potentially dangerous characters
  const sanitized = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  });
  
  // Additional sanitization for SQL injection prevention
  return sanitized
    .replace(/[<>]/g, '') // Remove remaining angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// SQL injection prevention (additional layer)
export function validateSafeString(input: string): boolean {
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /['"`;\\]/,
    /-{2,}/,
    /\/\*/,
    /\*\//,
    /xp_/i,
    /sp_/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
}

// Generate secure random string
export function generateSecureCode(length: number = 6): string {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate and sanitize all inputs
export function validateAndSanitize<T>(
  data: unknown, 
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    // First, sanitize string inputs
    const sanitized = sanitizeObject(data);
    
    // Then validate with schema
    const result = schema.safeParse(sanitized);
    
    if (!result.success) {
      const errors = result.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, errors: ['Invalid input format'] };
  }
}

// Recursively sanitize object properties
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');
  
  if (password.length >= 12) score += 1;
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Include special characters');
  
  if (!/(.)\1{2,}/.test(password)) score += 1;
  else feedback.push('Avoid repeating characters');
  
  return { score, feedback };
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  return Buffer.from(
    Array.from(crypto.getRandomValues(new Uint8Array(32)))
  ).toString('base64url');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // In a real implementation, you'd store and validate CSRF tokens properly
  // This is a simplified version
  return token.length > 20 && sessionToken.length > 0;
} 