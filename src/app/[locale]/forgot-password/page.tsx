"use client";

import { ForgotPassword } from '@/components/auth/forgot-password';
import { useParams } from 'next/navigation';

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
      <ForgotPassword locale={locale} />
    </div>
  );
} 