"use client";

import { LoginForm } from '@/components/auth/login-form';
import { useParams } from 'next/navigation';

export default function LoginPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
      <LoginForm locale={locale} />
    </div>
  );
} 