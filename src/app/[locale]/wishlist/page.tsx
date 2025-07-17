'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { ProductCard } from '@/components/ui/product-card';

export default function WishlistPage() {
  const { state } = useCart();
  const wishlistItems = state.wishlist;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">لیست علاقه‌مندی‌ها</h1>
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 max-w-xl mx-auto text-center">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-xl font-semibold mb-2">لیست علاقه‌مندی‌های شما خالی است</h2>
            <p className="text-gray-500 mb-6">محصولات مورد علاقه خود را به این لیست اضافه کنید تا بعداً راحت‌تر به آن‌ها دسترسی داشته باشید.</p>
            <Link href="/products" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">مشاهده محصولات</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                category={item.category}
                isAvailable={item.isAvailable}
                locale="fa"
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 