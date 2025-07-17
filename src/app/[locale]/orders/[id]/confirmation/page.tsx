'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  CheckCircle, 
  Package, 
  Mail, 
  Phone,
  ArrowRight,
  Home,
  ShoppingBag
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{
      url: string;
      alt?: string;
    }>;
  };
}

interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  totalPrice: number;
  shippingCost: number;
  tax: number;
  discount: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address?: Address;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && orderId) {
      fetchOrder();
    }
  }, [user, authLoading, orderId, router]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        console.error('Failed to fetch order');
        router.push('/account/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/account/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || isLoading) {
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

  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">سفارش یافت نشد</h1>
            <Button asChild>
              <Link href="/account/orders">
                بازگشت به سفارشات
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              سفارش شما با موفقیت ثبت شد!
            </h1>
            <p className="text-gray-600">
              شماره سفارش: <span className="font-semibold">#{order.id.slice(-8)}</span>
            </p>
            <p className="text-gray-600">
              تاریخ ثبت: {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">خلاصه سفارش</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>تعداد کالا:</span>
                <span>{order.items.length} عدد</span>
              </div>
              <div className="flex justify-between">
                <span>مجموع:</span>
                <span className="font-semibold">{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>روش پرداخت:</span>
                <span>
                  {order.paymentMethod === 'online' ? 'آنلاین' : 
                   order.paymentMethod === 'cod' ? 'در محل' : 
                   order.paymentMethod || 'نامشخص'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">کالاهای سفارش</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">تصویر</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} × {item.quantity} عدد
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">آدرس ارسال</h2>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{order.address.addressLine1}</p>
                {order.address.addressLine2 && (
                  <p className="text-gray-600">{order.address.addressLine2}</p>
                )}
                <p className="text-gray-600">
                  {order.address.city}، {order.address.state} - {order.address.postalCode}
                </p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">مراحل بعدی</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-blue-900">تایید سفارش</p>
                  <p className="text-sm text-blue-700">سفارش شما بررسی و تایید خواهد شد</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-blue-900">آماده‌سازی و ارسال</p>
                  <p className="text-sm text-blue-700">کالاهای شما آماده و ارسال می‌شود</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-blue-900">تحویل</p>
                  <p className="text-sm text-blue-700">کالاهای شما در آدرس مشخص شده تحویل داده می‌شود</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">راهنمایی و پشتیبانی</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">ایمیل: support@sofa.com</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>
              <p className="text-sm text-gray-600">
                در صورت بروز هرگونه مشکل یا سوال، با ما تماس بگیرید
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href={`/orders/${order.id}`}>
                مشاهده جزئیات سفارش
                <ArrowRight className="w-4 h-4 mr-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/account/orders">
                <Package className="w-4 h-4 mr-2" />
                سفارشات من
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                ادامه خرید
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                صفحه اصلی
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 