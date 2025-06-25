import React from 'react';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/layout/admin-layout';

export default function AddProductPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">افزودن محصول جدید</h1>
        <Link href={`/${params.locale}/admin/products`}>
          <Button variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 ml-2"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            بازگشت به لیست محصولات
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  نام محصول
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="نام محصول را وارد کنید"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  قیمت (تومان)
                </label>
                <input
                  id="price"
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="قیمت را وارد کنید"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                توضیحات
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                placeholder="توضیحات محصول را وارد کنید"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-primary text-primary-foreground">
                ذخیره محصول
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
} 