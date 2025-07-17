'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './button';
import { 
  Package, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Calendar
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

interface OrderCardProps {
  order: Order;
  locale: string;
}

function getStatusInfo(status: string) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'در انتظار تایید',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    case 'CONFIRMED':
      return {
        label: 'تایید شده',
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    case 'PROCESSING':
      return {
        label: 'در حال پردازش',
        icon: Package,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    case 'SHIPPED':
      return {
        label: 'ارسال شده',
        icon: Truck,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    case 'DELIVERED':
      return {
        label: 'تحویل داده شده',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    case 'CANCELLED':
      return {
        label: 'لغو شده',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    default:
      return {
        label: status,
        icon: Clock,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
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

export function OrderCard({ order, locale }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = getStatusInfo(order.status);
  const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
  const StatusIcon = statusInfo.icon;

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

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className={`p-2 rounded-lg ${statusInfo.bgColor} ${statusInfo.borderColor} border`}>
              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">سفارش #{order.id.slice(-8)}</h3>
              <p className="text-sm text-gray-500 flex items-center space-x-1 space-x-reverse">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(order.createdAt)}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Eye className="w-4 h-4 mr-1" />
              {isExpanded ? 'مخفی کردن' : 'مشاهده جزئیات'}
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">تعداد کالا:</span>
            <p className="font-medium">{totalItems} عدد</p>
          </div>
          <div>
            <span className="text-gray-500">مجموع:</span>
            <p className="font-medium">{formatPrice(order.totalPrice)}</p>
          </div>
          <div>
            <span className="text-gray-500">وضعیت پرداخت:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${paymentStatusInfo.bgColor} ${paymentStatusInfo.color}`}>
              {paymentStatusInfo.label}
            </span>
          </div>
          <div>
            <span className="text-gray-500">روش پرداخت:</span>
            <p className="font-medium">
              {order.paymentMethod === 'online' ? 'آنلاین' : 
               order.paymentMethod === 'cod' ? 'در محل' : 
               order.paymentMethod || 'نامشخص'}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">کالاهای سفارش</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">تصویر</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{item.product.name}</h5>
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
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">آدرس ارسال</h4>
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

          {/* Order Summary */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">خلاصه سفارش</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
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
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>مجموع نهایی:</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">اطلاعات پیگیری</h4>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">شماره پیگیری:</span> {order.trackingNumber}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">یادداشت</h4>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              asChild
            >
              <Link href={`/${locale}/orders/${order.id}`}>
                مشاهده کامل سفارش
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 