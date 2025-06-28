"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RegisterFormProps {
  locale: string;
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const validateUsername = (username: string) => {
    if (username.length < 3) return 'نام کاربری باید حداقل ۳ کاراکتر باشد';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و _ باشد';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    
    if (!fullName.trim()) {
      setError('نام و نام خانوادگی الزامی است');
      return;
    }
    
    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن باید یکسان باشند');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Registering user with username:', username);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          fullName,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'خطا در ثبت نام');
      }
      
      console.log('Registration successful:', data);
      
      // Redirect to login page
      router.push(`/${locale}/login?registered=true`);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'خطا در ثبت نام');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">ثبت نام</h2>
        <p className="text-muted-foreground mt-2">
          برای ایجاد حساب کاربری، اطلاعات زیر را وارد کنید
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            نام کاربری
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
            placeholder="نام کاربری منحصر به فرد خود را وارد کنید"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            فقط حروف انگلیسی، اعداد و _ مجاز است
          </p>
        </div>
        
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            نام و نام خانوادگی
          </label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="نام و نام خانوادگی خود را وارد کنید"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            رمز عبور
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور (حداقل ۸ کاراکتر)"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            تکرار رمز عبور
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="تکرار رمز عبور"
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
          {isLoading ? 'در حال ثبت نام...' : 'ثبت نام'}
        </Button>
        
        <div className="text-center text-sm">
          قبلا ثبت نام کرده‌اید؟{' '}
          <Link href={`/${locale}/login`} className="text-primary hover:underline">
            وارد شوید
          </Link>
        </div>
      </form>
    </div>
  );
} 