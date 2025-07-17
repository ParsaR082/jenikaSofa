import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AdminLayout } from '@/components/layout/admin-layout';
import { UserEditForm } from '@/components/admin/user-edit-form';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        phoneVerified: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true
          }
        }
      }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function AdminUserEditPage({ 
  params 
}: { 
  params: { locale: string; id: string } 
}) {
  setRequestLocale(params.locale);
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ویرایش کاربر</h1>
          <div className="text-sm text-muted-foreground">
            آخرین بروزرسانی: {new Date(user.updatedAt).toLocaleDateString('fa-IR')}
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">سفارشات</p>
            <p className="text-2xl font-bold mt-1">{user._count.orders}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">نظرات</p>
            <p className="text-2xl font-bold mt-1">{user._count.reviews}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">عضویت</p>
            <p className="text-2xl font-bold mt-1">
              {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} روز
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <UserEditForm user={user} locale={params.locale} />
      </div>
    </AdminLayout>
  );
} 