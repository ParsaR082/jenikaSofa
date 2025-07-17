"use client";

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminGuard } from '@/components/auth/admin-guard';

// Sample data for dashboard
const stats = [
  { name: 'کل محصولات', value: '24' },
  { name: 'سفارشات امروز', value: '12' },
  { name: 'کاربران', value: '45' },
  { name: 'درآمد ماه جاری', value: '۱۵,۲۵۰,۰۰۰ تومان' },
];

const recentOrders = [
  { id: '1001', customer: 'علی محمدی', date: '۱۴۰۳/۰۳/۱۲', status: 'تکمیل شده', amount: '۱,۲۵۰,۰۰۰ تومان' },
  { id: '1002', customer: 'مریم احمدی', date: '۱۴۰۳/۰۳/۱۱', status: 'در حال پردازش', amount: '۸۵۰,۰۰۰ تومان' },
  { id: '1003', customer: 'رضا کریمی', date: '۱۴۰۳/۰۳/۱۰', status: 'تکمیل شده', amount: '۲,۱۵۰,۰۰۰ تومان' },
  { id: '1004', customer: 'سارا رضایی', date: '۱۴۰۳/۰۳/۰۹', status: 'ارسال شده', amount: '۱,۸۰۰,۰۰۰ تومان' },
  { id: '1005', customer: 'حسین نوری', date: '۱۴۰۳/۰۳/۰۸', status: 'تکمیل شده', amount: '۹۵۰,۰۰۰ تومان' },
];

const popularProducts = [
  { id: 1, name: 'مبل راحتی کلاسیک', sales: 12, stock: 8 },
  { id: 2, name: 'مبل ال مدرن', sales: 10, stock: 5 },
  { id: 3, name: 'میز ناهارخوری چوبی', sales: 8, stock: 15 },
  { id: 4, name: 'تخت خواب دو نفره', sales: 7, stock: 3 },
];

export default function AdminPage({ params }: { params: { locale: string } }) {
  return (
    <AdminGuard locale={params.locale}>
      <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">داشبورد</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">امروز: ۱۴۰۳/۰۳/۱۲</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-card p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">سفارشات اخیر</h2>
                <Link href={`/${params.locale}/admin/orders`} className="text-sm text-accent hover:underline">
                  مشاهده همه
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-right text-xs text-muted-foreground bg-muted/50">
                      <th className="p-3">شماره سفارش</th>
                      <th className="p-3">مشتری</th>
                      <th className="p-3">تاریخ</th>
                      <th className="p-3">وضعیت</th>
                      <th className="p-3">مبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t hover:bg-muted/20">
                        <td className="p-3 text-sm">#{order.id}</td>
                        <td className="p-3 text-sm">{order.customer}</td>
                        <td className="p-3 text-sm">{order.date}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'تکمیل شده' ? 'bg-green-100 text-green-800' : 
                            order.status === 'در حال پردازش' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Popular Products */}
          <div>
            <div className="bg-card rounded-lg border shadow-sm h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">محصولات پرفروش</h2>
                <Link href={`/${params.locale}/admin/products`} className="text-sm text-accent hover:underline">
                  مشاهده همه
                </Link>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {popularProducts.map((product) => (
                    <li key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">فروش: {product.sales} | موجودی: {product.stock}</p>
                      </div>
                      <Link href={`/${params.locale}/admin/products/${product.id}/edit`} className="text-xs text-accent hover:underline">
                        ویرایش
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <h2 className="font-semibold mb-4">دسترسی سریع</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href={`/${params.locale}/admin/products/add`} className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-muted/80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm">محصول جدید</span>
            </Link>
            <Link href={`/${params.locale}/admin/orders`} className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-muted/80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm">سفارشات</span>
            </Link>
            <Link href={`/${params.locale}/admin/users`} className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-muted/80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm">کاربران</span>
            </Link>
            <Link href={`/${params.locale}/admin/settings`} className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-muted/80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">تنظیمات</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
    </AdminGuard>
  );
} 