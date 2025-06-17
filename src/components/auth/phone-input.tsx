"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
  isRegistration?: boolean;
}

export function PhoneInput({ onSubmit, isRegistration = false }: PhoneInputProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate phone number format (simple Iranian mobile format)
  const isValidPhoneNumber = (phone: string) => {
    return /^09\d{9}$/.test(phone);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('شماره موبایل نامعتبر است');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در ارسال کد تایید');
      }

      onSubmit(phoneNumber);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطا در ارسال کد تایید');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {isRegistration ? 'ثبت نام با شماره موبایل' : 'ورود با شماره موبایل'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {isRegistration 
            ? 'برای ثبت نام، شماره موبایل خود را وارد کنید' 
            : 'برای ورود، شماره موبایل خود را وارد کنید'}
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
          <p className="text-xs text-muted-foreground mt-1">
            شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد
          </p>
        </div>

        {error && (
          <div className="text-destructive text-sm text-center">{error}</div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !phoneNumber || phoneNumber.length !== 11}
        >
          {isLoading ? 'در حال ارسال کد...' : 'دریافت کد تایید'}
        </Button>
      </form>
    </div>
  );
} 