'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Package, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  Printer
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

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
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
  user: User;
}

function getStatusInfo(status: string) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'در انتظار تایید',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        description: 'سفارش شما ثبت شده و در انتظار تایید است'
      };
    case 'CONFIRMED':
      return {
        label: 'تایید شده',
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        description: 'سفارش شما تایید شده و آماده پردازش است'
      };
    case 'PROCESSING':
      return {
        label: 'در حال پردازش',
        icon: Package,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        description: 'سفارش شما در حال آماده‌سازی است'
      };
    case 'SHIPPED':
      return {
        label: 'ارسال شده',
        icon: Truck,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        description: 'سفارش شما ارسال شده و در راه است'
      };
    case 'DELIVERED':
      return {
        label: 'تحویل داده شده',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        description: 'سفارش شما با موفقیت تحویل داده شده است'
      };
    case 'CANCELLED':
      return {
        label: 'لغو شده',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        description: 'سفارش شما لغو شده است'
      };
    default:
      return {
        label: status,
        icon: Clock,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        description: 'وضعیت سفارش'
      };
  }
}

function getPaymentStatusInfo(paymentStatus: string) {
  switch (paymentStatus) {
    case 'PENDING':
      return {
        label: 'در انتظار پرداخت',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      };
    case 'PAID':
      return {
        label: 'پرداخت شده',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
    case 'FAILED':
      return {
        label: 'پرداخت ناموفق',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      };
    default:
      return {
        label: paymentStatus,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      };
  }
}

export default function OrderDetailPage() {
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    alert('دانلود فاکتور در حال توسعه است');
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

  const statusInfo = getStatusInfo(order.status);
  const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/account/orders">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    بازگشت
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">سفارش #{order.id.slice(-8)}</h1>
                  <p className="text-gray-600">جزئیات کامل سفارش شما</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  چاپ
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  دانلود
                </Button>
              </div>
            </div>

            {/* Order Status */}
            <div className={`p-6 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
              <div className="flex items-center space-x-3 space-x-reverse mb-3">
                <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                <h2 className="text-lg font-semibold text-gray-900">{statusInfo.label}</h2>
              </div>
              <p className="text-gray-600">{statusInfo.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">کالاهای سفارش</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">تصویر</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
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

              {/* Order Timeline */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">وضعیت سفارش</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">سفارش ثبت شد</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  {order.status !== 'PENDING' && (
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">سفارش تایید شد</p>
                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">در حال پردازش</p>
                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {['SHIPPED', 'DELIVERED'].includes(order.status) && (
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">ارسال شده</p>
                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {order.status === 'DELIVERED' && (
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">تحویل داده شده</p>
                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">خلاصه سفارش</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>مجموع کالاها:</span>
                    <span>{formatPrice(order.totalPrice - order.shippingCost - order.tax + order.discount)}</span>
                  </div>
                  {order.shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span>هزینه ارسال:</span>
                      <span>{formatPrice(order.shippingCost)}</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between">
                      <span>مالیات:</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>تخفیف:</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>مجموع نهایی:</span>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات مشتری</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-gray-500">نام:</span>
                    <span className="font-medium">{order.user.name || order.user.username}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{order.user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{order.user.phoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.address && (
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">آدرس ارسال</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{order.address.addressLine1}</p>
                        {order.address.addressLine2 && (
                          <p className="text-gray-600">{order.address.addressLine2}</p>
                        )}
                        <p className="text-gray-600">
                          {order.address.city}، {order.address.state} - {order.address.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات پرداخت</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>وضعیت پرداخت:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${paymentStatusInfo.bgColor} ${paymentStatusInfo.color}`}>
                      {paymentStatusInfo.label}
                    </span>
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

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات پیگیری</h3>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">شماره پیگیری:</span> {order.trackingNumber}
                    </p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">یادداشت</h3>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 