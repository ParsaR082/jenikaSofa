"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

interface AdminGuardProps {
  children: React.ReactNode;
  locale: string;
}

export function AdminGuard({ children, locale }: AdminGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push(`/${locale}/login`);
      } else if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        // Not admin, redirect to account page
        router.push(`/${locale}/account`);
      }
    }
  }, [user, isLoading, router, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null; // Will redirect
  }

  return <>{children}</>;
} 