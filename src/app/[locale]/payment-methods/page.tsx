import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function PaymentMethodsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">روش‌های پرداخت</h1>
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">گزینه‌های پرداخت موجود</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <span className="text-2xl">💳</span>
              <div>
                <div className="font-medium">پرداخت آنلاین (کارت بانکی)</div>
                <div className="text-gray-500 text-sm">پرداخت امن از طریق درگاه بانکی با کارت‌های عضو شتاب.</div>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="text-2xl">💵</span>
              <div>
                <div className="font-medium">پرداخت در محل</div>
                <div className="text-gray-500 text-sm">پرداخت وجه سفارش هنگام تحویل کالا درب منزل.</div>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="text-2xl">🏦</span>
              <div>
                <div className="font-medium">کارت به کارت یا واریز بانکی</div>
                <div className="text-gray-500 text-sm">امکان واریز مبلغ سفارش به حساب فروشگاه. اطلاعات حساب در مرحله پرداخت نمایش داده می‌شود.</div>
              </div>
            </li>
          </ul>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">بازگشت به صفحه اصلی</Link>
        </div>
      </div>
    </MainLayout>
  );
} 