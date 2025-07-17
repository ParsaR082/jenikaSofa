'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: string;
  phoneVerified: boolean;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    orders: number;
    reviews: number;
  };
};

interface UserEditFormProps {
  user: User;
  locale: string;
}

export function UserEditForm({ user, locale }: UserEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    role: user.role,
    phoneVerified: user.phoneVerified,
    emailVerified: !!user.emailVerified,
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Prepare form data - only include password if it's not empty
      const { password, ...baseData } = formData;
      const submitData = password?.trim() ? { ...baseData, password } : baseData;

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('کاربر با موفقیت بروزرسانی شد');
        // Clear password field after successful update
        setFormData(prev => ({ ...prev, password: '' }));
        router.refresh();
      } else {
        setMessage(result.error || 'خطا در بروزرسانی کاربر');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm(`آیا از حذف کاربر "${user.name || user.username}" مطمئن هستید؟`)) {
      return;
    }

    setIsDeleting(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('کاربر با موفقیت حذف شد. در حال انتقال...');
        setTimeout(() => {
          router.push(`/${locale}/admin/users`);
        }, 1500);
      } else {
        setMessage(result.error || 'خطا در حذف کاربر');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('خطا در ارتباط با سرور');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">اطلاعات کاربر</h2>
        <Button asChild variant="outline">
          <Link href={`/${locale}/admin/users`}>
            بازگشت به لیست
          </Link>
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded mb-4 text-sm ${
          message.includes('موفقیت') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">نام کاربری</label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ایمیل</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">نام کامل</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">شماره تلفن</label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="09xxxxxxxxx"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">نقش</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USER">کاربر عادی</option>
              <option value="ADMIN">ادمین</option>
              <option value="SUPER_ADMIN">سوپر ادمین</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">رمز عبور جدید (اختیاری)</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="برای تغییر رمز عبور وارد کنید"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.phoneVerified}
              onChange={(e) => setFormData({ ...formData, phoneVerified: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">تلفن تایید شده</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.emailVerified}
              onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">ایمیل تایید شده</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
          
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={isLoading || isDeleting}
          >
            {isDeleting ? 'در حال حذف...' : 'حذف کاربر'}
          </Button>
        </div>
      </form>

      {/* User Info */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-medium mb-3">اطلاعات سیستم</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">شناسه:</span>
            <span className="ml-2 font-mono">{user.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">تاریخ عضویت:</span>
            <span className="ml-2">{new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}