import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['fa'],
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'fa',
  
  // The default locale will be used when visiting
  // a non-locale prefixed path e.g. `/hello`
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  // Apply internationalization middleware first
  const response = intlMiddleware(request);
  
  // Add comprehensive security headers
  const secureHeaders = {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Relaxed for Next.js development
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'bluetooth=()'
    ].join(', '),
    
    // Strict Transport Security (HTTPS only)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    }),
    
    // Remove server information
    'Server': '',
    'X-Powered-By': ''
  };
  
  // Apply security headers
  Object.entries(secureHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    } else {
      response.headers.delete(key);
    }
  });
  
  // Add rate limiting headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Window', '900'); // 15 minutes
  }
  
  // Block suspicious user agents
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousAgents = [
    'sqlmap',
    'nmap',
    'nikto',
    'curl',
    'wget',
    'python-requests',
    'bot',
    'spider',
    'crawler'
  ];
  
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    // Log suspicious request
    console.warn(`Blocked suspicious user agent: ${userAgent} from IP: ${request.ip}`);
    
    return new NextResponse('Access Denied', { 
      status: 403,
      headers: secureHeaders as Record<string, string>
    });
  }
  
  // Check for common attack patterns in URL
  const url = request.nextUrl.pathname + request.nextUrl.search;
  const attackPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /\.\.\//,
    /\/etc\/passwd/,
    /\/admin/i
  ];
  
  if (attackPatterns.some(pattern => pattern.test(url))) {
    console.warn(`Blocked malicious request: ${url} from IP: ${request.ip}`);
    
    return new NextResponse('Bad Request', { 
      status: 400,
      headers: secureHeaders as Record<string, string>
    });
  }
  
  return response;
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 