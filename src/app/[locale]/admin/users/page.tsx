"use client";

import React from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminGuard } from '@/components/auth/admin-guard';
import { AdminDebug } from '@/components/debug/admin-debug';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AdminUsersPage({ params }: { params: { locale: string } }) {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingUsers, setDeletingUsers] = React.useState<Set<string>>(new Set());

  const fetchUsers = React.useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`آیا از حذف کاربر "${username}" مطمئن هستید؟`)) {
      return;
    }

    setDeletingUsers(prev => new Set(prev).add(userId));

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok) {
        alert('کاربر با موفقیت حذف شد');
        await fetchUsers(); // Refresh the users list
      } else {
        alert(result.error || 'خطا در حذف کاربر');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('خطا در ارتباط با سرور');
    } finally {
      setDeletingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <AdminGuard locale={params.locale}>
        <AdminLayout>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard locale={params.locale}>
      <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
          <div className="flex gap-2">
            <Input
              placeholder="جستجو کاربران..."
              className="w-64"
            />
            <Button asChild>
              <Link href={`/${params.locale}/admin/users/add`}>
                افزودن کاربر
              </Link>
            </Button>
          </div>
        </div>

        {/* Debug Panel */}
        <AdminDebug />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">کل کاربران</p>
            <p className="text-2xl font-bold mt-1">{users.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">ادمین‌ها</p>
            <p className="text-2xl font-bold mt-1">
              {users.filter(user => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN').length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground">کاربران عادی</p>
            <p className="text-2xl font-bold mt-1">
              {users.filter(user => user.role === 'USER').length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold">لیست کاربران</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-xs text-muted-foreground bg-muted/50">
                  <th className="p-3">نام کاربری</th>
                  <th className="p-3">نام کامل</th>
                  <th className="p-3">ایمیل</th>
                  <th className="p-3">شماره تلفن</th>
                  <th className="p-3">نقش</th>
                  <th className="p-3">تعداد سفارشات</th>
                  <th className="p-3">تاریخ عضویت</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-muted/20">
                    <td className="p-3 text-sm font-medium">{user.username}</td>
                    <td className="p-3 text-sm">{user.name || '-'}</td>
                    <td className="p-3 text-sm">{user.email || '-'}</td>
                    <td className="p-3 text-sm">{user.phoneNumber || '-'}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                        user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'SUPER_ADMIN' ? 'سوپر ادمین' :
                         user.role === 'ADMIN' ? 'ادمین' : 'کاربر'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{user._count?.orders || 0}</td>
                    <td className="p-3 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/${params.locale}/admin/users/${user.id}`}>
                            ویرایش
                          </Link>
                        </Button>
                        {user.role !== 'SUPER_ADMIN' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            disabled={deletingUsers.has(user.id)}
                          >
                            {deletingUsers.has(user.id) ? 'در حال حذف...' : 'حذف'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">هیچ کاربری یافت نشد</p>
          </div>
        )}
      </div>
    </AdminLayout>
    </AdminGuard>
  );
} 