'use client';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch('/api/orders', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">سفارش‌های من</h1>
        {loading ? (
          <div className="text-center text-gray-500">در حال بارگذاری...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 max-w-xl mx-auto text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold mb-2">شما هنوز سفارشی ثبت نکرده‌اید</h2>
            <p className="text-gray-500 mb-6">برای ثبت سفارش، ابتدا محصولی را به سبد خرید خود اضافه کنید.</p>
            <Link href="/products" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">مشاهده محصولات</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-lg mb-2">سفارش #{order.id.slice(-6)}</div>
                  <div className="text-gray-600 text-sm mb-1">تاریخ: {new Date(order.createdAt).toLocaleDateString('fa-IR')}</div>
                  <div className="text-gray-600 text-sm mb-1">وضعیت: {order.status}</div>
                  <div className="text-gray-600 text-sm mb-1">مبلغ کل: {order.totalPrice.toLocaleString('fa-IR')} تومان</div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href={`/orders/${order.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">مشاهده جزئیات</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 