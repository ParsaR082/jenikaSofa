"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';

export default function AccountPage({ params }: { params: { locale: string } }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.locale}/login`);
    }
  }, [user, isLoading, router, params.locale]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">در حال بارگیری...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {user.name ? user.name.charAt(0) : user.username.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-lg">حساب کاربری</h2>
                  <p className="text-sm text-muted-foreground">{user.name || user.username}</p>
                </div>
              </div>
              <nav className="space-y-2">
                <a href="#profile" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg bg-accent/10 text-accent">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">اطلاعات شخصی</span>
                </a>
                <Link href={`/${params.locale}/account/orders`} className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="font-medium">سفارشات من</span>
                </Link>
                <Link href={`/${params.locale}/account/addresses`} className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted transition-colors">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">آدرس‌ها</span>
                </Link>
                <a href="#favorites" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted transition-colors">
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">علاقه‌مندی‌ها</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center font-bold text-2xl">
                  {user.name ? user.name.charAt(0) : user.username.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">خوش آمدید، {user.name || user.username}</h1>
                  <p className="text-blue-100">مدیریت اطلاعات حساب کاربری و سفارشات شما</p>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div id="profile" className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-xl font-bold">اطلاعات شخصی</h3>
                <p className="text-muted-foreground">مدیریت اطلاعات حساب کاربری شما</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">نام کاربری</label>
                    <div className="p-3 bg-muted rounded-lg border">
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">نام کامل</label>
                    <div className="p-3 bg-muted rounded-lg border">
                      <span className="font-medium">{user.name || 'تنظیم نشده'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">ایمیل</label>
                    <div className="p-3 bg-muted rounded-lg border">
                      <span className="font-medium">{user.email || 'تنظیم نشده'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">شماره تلفن</label>
                    <div className="p-3 bg-muted rounded-lg border">
                      <span className="font-medium">{user.phoneNumber || 'تنظیم نشده'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button>
                    ویرایش اطلاعات
                  </Button>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div id="orders" className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-xl font-bold">سفارشات اخیر</h3>
                <p className="text-muted-foreground">مشاهده و پیگیری سفارشات شما</p>
              </div>
              <div className="p-8">
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto bg-muted rounded-lg flex items-center justify-center mb-6">
                    <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-2">هنوز سفارشی ندارید</h4>
                  <p className="text-muted-foreground mb-6">اولین خرید خود را شروع کنید و از محصولات باکیفیت ما لذت ببرید</p>
                  <Link href={`/${params.locale}/products`}>
                    <Button>
                      مشاهده محصولات
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold mb-2">0</p>
                <p className="text-sm font-medium text-muted-foreground">سفارشات</p>
              </div>
              <div className="bg-card rounded-lg border shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold mb-2">0</p>
                <p className="text-sm font-medium text-muted-foreground">علاقه‌مندی‌ها</p>
              </div>
              <div className="bg-card rounded-lg border shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold mb-2">0</p>
                <p className="text-sm font-medium text-muted-foreground">آدرس‌ها</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 