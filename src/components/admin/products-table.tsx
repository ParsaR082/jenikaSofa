'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  categories: Array<{ id: string; name: string }>;
  images: Array<{ url: string; alt: string | null }>;
  _count: { orderItems: number; reviews: number };
};

interface ProductsTableProps {
  products: Product[];
  locale: string;
}

export function ProductsTable({ products, locale }: ProductsTableProps) {
  const router = useRouter();
  const [deletingProducts, setDeletingProducts] = useState<Set<string>>(new Set());

  const handleDelete = async (productId: string, productName: string) => {
    if (confirm(`آیا از حذف محصول "${productName}" مطمئن هستید؟`)) {
      setDeletingProducts(prev => new Set(prev).add(productId));
      
      try {
        const response = await fetch(`/api/admin/products?id=${productId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
          alert('محصول با موفقیت حذف شد');
          router.refresh(); // Refresh the page to update the product list
        } else {
          alert(result.error || 'خطا در حذف محصول');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('خطا در ارتباط با سرور');
      } finally {
        setDeletingProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    }
  };

  return (
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
                      <Link href={`/${locale}/products/${product.id}`} target="_blank">
                        نمایش
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/${locale}/admin/products/${product.id}/edit`}>
                        ویرایش
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingProducts.has(product.id)}
                    >
                      {deletingProducts.has(product.id) ? 'در حال حذف...' : 'حذف'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 