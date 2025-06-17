"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormProps {
  locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Format phone number as user types
  const formatPhoneNumber = (input: string) => {
    // Remove non-digits
    const digits = input.replace(/\D/g, '');
    
    // Ensure it starts with 0
    if (digits.length > 0 && digits[0] !== '0') {
      return '0' + digits.slice(0, 10);
    }
    
    return digits.slice(0, 11);
  };

  // Validate phone number format (simple Iranian mobile format)
  const isValidPhoneNumber = (phone: string) => {
    return /^09\d{9}$/.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('شماره موبایل نامعتبر است');
      return;
    }
    
    if (!password) {
      setError('رمز عبور الزامی است');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Logging in with phone:', phoneNumber);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'خطا در ورود');
      }
      
      console.log('Login successful:', data);
      
      // Redirect to dashboard
      router.push(`/${locale}`);
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'خطا در ورود');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">ورود به حساب کاربری</h2>
        <p className="text-muted-foreground mt-2">
          برای ورود، شماره موبایل و رمز عبور خود را وارد کنید
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
            شماره موبایل
          </label>
          <Input
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            placeholder="09123456789"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            className="text-left ltr"
            dir="ltr"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium">
              رمز عبور
            </label>
            <Link 
              href={`/${locale}/forgot-password`} 
              className="text-sm text-primary hover:underline"
            >
              فراموشی رمز عبور
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور خود را وارد کنید"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-destructive text-sm text-center">{error}</div>
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'در حال ورود...' : 'ورود'}
        </Button>
        
        <div className="text-center text-sm">
          حساب کاربری ندارید؟{' '}
          <Link href={`/${locale}/register`} className="text-primary hover:underline">
            ثبت نام کنید
          </Link>
        </div>
      </form>
    </div>
  );
} 