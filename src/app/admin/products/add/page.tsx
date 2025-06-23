import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/layout/admin-layout';

export default function AdminProductsAddPage() {
  // Redirect to default locale admin products add page
  redirect('/fa/admin/products/add');
}

export function AddProductPage() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">افزودن محصول جدید</h1>
        <Link href="/admin/products">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="width" className="text-sm font-medium">
                  عرض (سانتی‌متر)
                </label>
                <input
                  id="width"
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="عرض را وارد کنید"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="height" className="text-sm font-medium">
                  ارتفاع (سانتی‌متر)
                </label>
                <input
                  id="height"
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="ارتفاع را وارد کنید"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="depth" className="text-sm font-medium">
                  عمق (سانتی‌متر)
                </label>
                <input
                  id="depth"
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="عمق را وارد کنید"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">وضعیت موجودی</label>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      className="ml-2"
                      defaultChecked
                    />
                    موجود
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="unavailable"
                      className="ml-2"
                    />
                    ناموجود
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">تصاویر محصول</label>
              <div className="border-2 border-dashed rounded-md p-8 text-center">
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
                  className="h-8 w-8 mx-auto text-muted-foreground"
                >
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                  <line x1="16" x2="22" y1="5" y2="5"></line>
                  <line x1="19" x2="19" y1="2" y2="8"></line>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                <p className="mt-2 text-sm text-muted-foreground">
                  برای آپلود تصویر کلیک کنید یا فایل را اینجا رها کنید
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="product-images"
                  multiple
                />
                <Button variant="outline" className="mt-4">
                  انتخاب فایل
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ویژگی‌های محصول</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="ویژگی را وارد کنید"
                  />
                  <Button variant="outline" className="mr-2">
                    +
                  </Button>
                </div>
                <ul className="space-y-2 mt-2">
                  <li className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>جنس رویه: پارچه مخمل درجه یک</span>
                    <Button variant="ghost" size="sm">
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
                        className="h-4 w-4 text-destructive"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </li>
                </ul>
              </div>
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