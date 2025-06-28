import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        totalPrice: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
            name: true
          }
        },
        items: {
          select: {
            quantity: true,
            price: true,
            product: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

const paymentStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  PENDING: 'در انتظار',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل داده شده',
  CANCELLED: 'لغو شده',
  RETURNED: 'مرجوع شده',
};

const paymentStatusLabels = {
  PENDING: 'در انتظار پرداخت',
  PAID: 'پرداخت شده',
  FAILED: 'پرداخت ناموفق',
  REFUNDED: 'بازگردانده شده',
};

export default async function AdminOrdersPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const orders = await getOrders();

  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'PAID')
    .reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">مدیریت سفارشات</h1>
          <div className="flex gap-2">
            <Input
              placeholder="جستجو سفارشات..."
              className="w-64"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">کل سفارشات</p>
            <p className="text-2xl font-bold mt-1">{orders.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">سفارشات پرداخت شده</p>
            <p className="text-2xl font-bold mt-1">
              {orders.filter(order => order.paymentStatus === 'PAID').length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">در انتظار پردازش</p>
            <p className="text-2xl font-bold mt-1">
              {orders.filter(order => order.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">کل درآمد</p>
            <p className="text-2xl font-bold mt-1">
              {totalRevenue.toLocaleString('fa-IR')} تومان
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold">لیست سفارشات</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-xs text-muted-foreground bg-muted/50">
                  <th className="p-3">شماره سفارش</th>
                  <th className="p-3">مشتری</th>
                  <th className="p-3">تعداد اقلام</th>
                  <th className="p-3">مبلغ کل</th>
                  <th className="p-3">وضعیت سفارش</th>
                  <th className="p-3">وضعیت پرداخت</th>
                  <th className="p-3">تاریخ ثبت</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-muted/20">
                    <td className="p-3 text-sm font-medium">#{order.id.slice(-8)}</td>
                    <td className="p-3 text-sm">
                      <div>
                        <p className="font-medium">{order.user.name || order.user.username}</p>
                        <p className="text-muted-foreground text-xs">@{order.user.username}</p>
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} قلم
                    </td>
                    <td className="p-3 text-sm font-medium">
                      {order.totalPrice.toLocaleString('fa-IR')} تومان
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${paymentStatusColors[order.paymentStatus]}`}>
                        {paymentStatusLabels[order.paymentStatus]}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/${params.locale}/admin/orders/${order.id}`}>
                            مشاهده
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">هیچ سفارشی یافت نشد</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 