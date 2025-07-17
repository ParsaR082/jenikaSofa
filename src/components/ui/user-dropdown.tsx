"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { User, Settings, ShoppingBag, Heart, LogOut, CreditCard, MapPin } from 'lucide-react';
import Link from 'next/link';

interface UserDropdownProps {
  locale: string;
}

export function UserDropdown({ locale }: UserDropdownProps) {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-muted rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Link href={`/${locale}/login`}>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent/10">
          <User className="h-5 w-5" />
          <span className="sr-only">ورود به حساب کاربری</span>
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 space-x-reverse p-2 rounded-full hover:bg-accent/10 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {user.name ? user.name.charAt(0) : user.username.charAt(0)}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {user.name || user.username}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                {user.name ? user.name.charAt(0) : user.username.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user.name || user.username}</h3>
                <p className="text-blue-100 text-sm">{user.email || 'کاربر'}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
              <Link 
                href={`/${locale}/admin`}
                className="flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-red-600" />
                </div>
                <span className="font-medium">پنل مدیریت</span>
              </Link>
            ) : (
              <Link 
                href={`/${locale}/account`}
                className="flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">حساب کاربری</span>
              </Link>
            )}

            <Link 
              href={`/${locale}/orders`}
              className="flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <span className="font-medium">سفارشات من</span>
                <span className="block text-xs text-gray-500">مشاهده سفارشات</span>
              </div>
            </Link>

            <Link 
              href={`/${locale}/wishlist`}
              className="flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-pink-600" />
              </div>
              <span className="font-medium">علاقه‌مندی‌ها</span>
            </Link>

            <Link 
              href={`/${locale}/addresses`}
              className="flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-orange-600" />
              </div>
              <span className="font-medium">آدرس‌ها</span>
            </Link>

            <Link 
              href={`/${locale}/payment-methods`}
              className="flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="font-medium">روش‌های پرداخت</span>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-200 py-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <span className="font-medium text-red-600">خروج از حساب</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 