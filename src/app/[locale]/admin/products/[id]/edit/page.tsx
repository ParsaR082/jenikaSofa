import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
        _count: {
          select: {
            orderItems: true,
            reviews: true
          }
        }
      }
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function AdminProductEditPage({ 
  params 
}: { 
  params: { locale: string; id: string } 
}) {
  setRequestLocale(params.locale);
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ویرایش محصول</h1>
          <Button asChild variant="outline">
            <Link href={`/${params.locale}/admin/products`}>
              بازگشت به لیست
            </Link>
          </Button>
        </div>

        {/* Product Info */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">اطلاعات محصول</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">نام محصول</p>
              <p className="font-medium">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SKU</p>
              <p className="font-medium">{product.sku || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">قیمت</p>
              <p className="font-medium">{product.price.toLocaleString('fa-IR')} تومان</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">موجودی</p>
              <p className="font-medium">{product.stock} عدد</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">توضیحات</p>
            <p className="text-sm bg-muted p-3 rounded">{product.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted p-3 rounded">
              <p className="text-xs text-muted-foreground">فروش</p>
              <p className="text-lg font-bold">{product._count.orderItems}</p>
            </div>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs text-muted-foreground">نظرات</p>
              <p className="text-lg font-bold">{product._count.reviews}</p>
            </div>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs text-muted-foreground">وضعیت</p>
              <p className="text-lg font-bold">
                {product.isAvailable && product.isPublished ? 'فعال' : 'غیرفعال'}
              </p>
            </div>
          </div>

          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">دسته‌بندی‌ها</p>
              <div className="flex gap-2 flex-wrap">
                {product.categories.map(category => (
                  <span key={category.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {product.images.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">تصاویر</p>
              <div className="flex gap-3">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="w-16 h-16 bg-muted rounded overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {product.images.length > 4 && (
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{product.images.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <div className="flex gap-3">
              <Button className="flex-1">
                ویرایش اطلاعات محصول
              </Button>
              <Button variant="outline">
                مدیریت تصاویر
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${params.locale}/products/${product.id}`} target="_blank">
                  نمایش در سایت
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="font-medium mb-3">اطلاعات سیستم</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">شناسه:</span>
              <span className="ml-2 font-mono">{product.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">تاریخ ایجاد:</span>
              <span className="ml-2">{new Date(product.createdAt).toLocaleDateString('fa-IR')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">آخرین بروزرسانی:</span>
              <span className="ml-2">{new Date(product.updatedAt).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 