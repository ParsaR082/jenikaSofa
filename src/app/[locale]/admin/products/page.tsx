import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

        {/* Products Grid */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold">لیست محصولات</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                فیلتر
              </Button>
              <Button variant="outline" size="sm">
                مرتب‌سازی
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-xs text-muted-foreground bg-muted/50">
                  <th className="p-3">تصویر</th>
                  <th className="p-3">نام محصول</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">قیمت</th>
                  <th className="p-3">موجودی</th>
                  <th className="p-3">دسته‌بندی</th>
                  <th className="p-3">فروش</th>
                  <th className="p-3">وضعیت</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-muted/20">
                    <td className="p-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">بدون تصویر</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <div className="flex gap-1 mt-1">
                          {product.isFeatured && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-1 rounded">
                              ویژه
                            </span>
                          )}
                          {!product.isPublished && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-1 rounded">
                              پیش‌نویس
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {product.sku || '-'}
                    </td>
                    <td className="p-3 text-sm">
                      <div>
                        <p className="font-medium">{product.price.toLocaleString('fa-IR')} تومان</p>
                        {product.compareAtPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {product.compareAtPrice.toLocaleString('fa-IR')} تومان
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock === 0 ? 'bg-red-100 text-red-800' :
                        product.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} عدد
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {product.categories.map(category => category.name).join(', ') || '-'}
                    </td>
                    <td className="p-3 text-sm">
                      {product._count.orderItems} فروش
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.isAvailable && product.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isAvailable && product.isPublished ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/${params.locale}/products/${product.id}`} target="_blank">
                            نمایش
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/${params.locale}/admin/products/${product.id}/edit`}>
                            ویرایش
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('آیا از حذف این محصول مطمئن هستید؟')) {
                              // Handle delete
                            }
                          }}
                        >
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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