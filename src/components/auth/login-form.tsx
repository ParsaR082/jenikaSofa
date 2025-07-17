"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

interface LoginFormProps {
  locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('نام کاربری الزامی است');
      return;
    }
    
    if (!password) {
      setError('رمز عبور الزامی است');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Logging in with username:', username);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'خطا در ورود');
      }
      
      console.log('Login successful:', data);
      
      // Update authentication context
      login(data.user);
      
      // Redirect based on user role
      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}/account`);
      }
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
          برای ورود، نام کاربری و رمز عبور خود را وارد کنید
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
            placeholder="نام کاربری خود را وارد کنید"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
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