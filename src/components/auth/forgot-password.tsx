"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from './phone-input';
import { PhoneVerification } from './phone-verification';
import { useRouter } from 'next/navigation';

interface ForgotPasswordProps {
  locale: string;
}

export function ForgotPassword({ locale }: ForgotPasswordProps) {
  const [step, setStep] = useState<'phone' | 'verify' | 'reset'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setStep('verify');
  };

  const handleVerified = (verified: boolean) => {
    if (verified) {
      setStep('reset');
    }
  };

  const handleChangePhoneNumber = () => {
    setStep('phone');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      console.log('Resetting password for phone:', phoneNumber);
      
      const response = await fetch('/api/auth/reset-password', {
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
        throw new Error(data.error || 'خطا در بازنشانی رمز عبور');
      }
      
      console.log('Password reset successful:', data);
      
      // Redirect to login page
      router.push(`/${locale}/login?reset=true`);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error instanceof Error ? error.message : 'خطا در بازنشانی رمز عبور');
    } finally {
      setIsLoading(false);
    }
  };

  // Render different steps
  if (step === 'phone') {
    return <PhoneInput onSubmit={handlePhoneSubmit} isRegistration={false} />;
  }

  if (step === 'verify') {
    return (
      <PhoneVerification
        phoneNumber={phoneNumber}
        onVerified={handleVerified}
        onChangePhoneNumber={handleChangePhoneNumber}
      />
    );
  }

  // Reset password step
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">تغییر رمز عبور</h2>
        <p className="text-muted-foreground mt-2">
          رمز عبور جدید خود را وارد کنید
        </p>
      </div>
      
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            رمز عبور جدید
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور جدید (حداقل ۸ کاراکتر)"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            تکرار رمز عبور جدید
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="تکرار رمز عبور جدید"
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
          {isLoading ? 'در حال ذخیره...' : 'ذخیره رمز عبور جدید'}
        </Button>
      </form>
    </div>
  );
} 