'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { CheckoutForm } from '@/components/ui/checkout-form';
import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function CheckoutPage({ params }: { params: { locale: string } }) {
  const { user, isLoading: authLoading } = useAuth();
  const { state } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${params.locale}/login`);
    }
  }, [authLoading, user, params.locale, router]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (!authLoading && user && state.items.length === 0) {
      router.push(`/${params.locale}/products`);
    }
  }, [authLoading, user, state.items.length, params.locale, router]);

  // Prevent rendering if redirecting
  if (!authLoading && !user) {
    return null;
  }
  if (!authLoading && user && state.items.length === 0) {
    return null;
  }

  const handleCheckout = async (data: { addressId: string; paymentMethod: string; notes?: string }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const order = await response.json();
        // Redirect to order confirmation page
        router.push(`/${params.locale}/orders/${order.id}/confirmation`);
      } else {
        const error = await response.json();
        alert(`خطا در ایجاد سفارش: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('خطا در ایجاد سفارش');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تکمیل سفارش</h1>
            <p className="text-gray-600">
              اطلاعات ارسال و پرداخت خود را تکمیل کنید
            </p>
          </div>

          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
              <li>
                <Link href={`/${params.locale}/products`} className="hover:text-gray-700">
                  محصولات
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/${params.locale}/cart`} className="hover:text-gray-700">
                  سبد خرید
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">تکمیل سفارش</li>
            </ol>
          </nav>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <CheckoutForm
              onSubmit={handleCheckout}
              isLoading={isSubmitting}
            />
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              اطلاعات مهم
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>سفارش شما پس از تایید پرداخت پردازش خواهد شد</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>زمان تحویل معمولاً ۲-۳ روز کاری است</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>در صورت بروز مشکل، با پشتیبانی تماس بگیرید</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 