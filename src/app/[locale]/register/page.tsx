"use client";

import { useState } from 'react';
import { PhoneInput } from '@/components/auth/phone-input';
import { PhoneVerification } from '@/components/auth/phone-verification';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  const [step, setStep] = useState<'phone' | 'verify' | 'register'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setStep('verify');
  };

  const handleVerified = (verified: boolean) => {
    if (verified) {
      setStep('register');
    }
  };

  const handleChangePhoneNumber = () => {
    setStep('phone');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
      {step === 'phone' && (
        <PhoneInput onSubmit={handlePhoneSubmit} isRegistration={true} />
      )}
      
      {step === 'verify' && (
        <PhoneVerification
          phoneNumber={phoneNumber}
          onVerified={handleVerified}
          onChangePhoneNumber={handleChangePhoneNumber}
        />
      )}
      
      {step === 'register' && (
        <RegisterForm phoneNumber={phoneNumber} />
      )}
    </div>
  );
} 