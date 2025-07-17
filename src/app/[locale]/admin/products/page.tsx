import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductsTable } from '@/components/admin/products-table';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        compareAtPrice: true,
        stock: true,
        sku: true,
        isAvailable: true,
        isFeatured: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        categories: {
          select: {
            id: true,
            name: true
          }
        },
        images: {
          where: {
            isMain: true
          },
          select: {
            url: true,
            alt: true
          },
          take: 1
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function AdminProductsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const products = await getProducts();

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
          <div className="flex gap-2">
            <Input
              placeholder="جستجو محصولات..."
              className="w-64"
            />
            <Button asChild>
              <Link href={`/${params.locale}/admin/products/add`}>
                افزودن محصول
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">کل محصولات</p>
            <p className="text-2xl font-bold mt-1">{products.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">محصولات فعال</p>
            <p className="text-2xl font-bold mt-1">
              {products.filter(product => product.isAvailable && product.isPublished).length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">ناموجود</p>
            <p className="text-2xl font-bold mt-1">
              {products.filter(product => product.stock === 0).length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">ارزش موجودی</p>
            <p className="text-2xl font-bold mt-1">
              {totalValue.toLocaleString('fa-IR')} تومان
            </p>
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable products={products} locale={params.locale} />

        {products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">هیچ محصولی یافت نشد</p>
            <Button asChild className="mt-4">
              <Link href={`/${params.locale}/admin/products/add`}>
                اولین محصول خود را اضافه کنید
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 