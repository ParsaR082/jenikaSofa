"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: (verified: boolean) => void;
  onChangePhoneNumber: () => void;
}

export function PhoneVerification({
  phoneNumber,
  onVerified,
  onChangePhoneNumber
}: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle verification code submission
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError('کد تایید باید ۶ رقم باشد');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending verification code to new endpoint:', '/api/verify-code');
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'خطا در تایید کد');
      }

      onVerified(true);
    } catch (error) {
      console.error('Verification error:', error);
      setError(error instanceof Error ? error.message : 'خطا در تایید کد');
      onVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResend = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Resending verification code to:', '/api/verify');
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      console.log('Resend response status:', response.status);
      const data = await response.json();
      console.log('Resend response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'خطا در ارسال مجدد کد');
      }

      // Reset countdown
      setCountdown(120);
      setCanResend(false);
    } catch (error) {
      console.error('Resend error:', error);
      setError(error instanceof Error ? error.message : 'خطا در ارسال مجدد کد');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">تایید شماره موبایل</h2>
        <p className="text-muted-foreground mt-2">
          کد تایید به شماره {phoneNumber} ارسال شد
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="verificationCode" className="block text-sm font-medium mb-1">
            کد تایید
          </label>
          <Input
            id="verificationCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="کد ۶ رقمی"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-widest"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-destructive text-sm text-center">{error}</div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || verificationCode.length !== 6}
        >
          {isLoading ? 'در حال تایید...' : 'تایید کد'}
        </Button>
      </form>

      <div className="flex flex-col items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>زمان باقی مانده: </span>
          <span className="font-mono">{formatTime(countdown)}</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:underline"
            disabled={!canResend || isLoading}
          >
            ارسال مجدد کد
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={onChangePhoneNumber}
            className="text-primary hover:underline"
            disabled={isLoading}
          >
            تغییر شماره موبایل
          </button>
        </div>
      </div>
    </div>
  );
} 