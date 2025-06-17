import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AddProductPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-l bg-muted/40">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold">
            مبلمان
          </Link>
          <p className="text-sm text-muted-foreground mt-2">پنل مدیریت</p>
        </div>
        <nav className="px-3 py-2">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
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
                className="h-4 w-4"
              >
                <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                <rect width="7" height="5" x="3" y="16" rx="1"></rect>
              </svg>
              داشبورد
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-primary text-primary-foreground"
            >
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
                className="h-4 w-4"
              >
                <path d="m7.5 4.27 9 5.15"></path>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <path d="m3.3 7 8.7 5 8.7-5"></path>
                <path d="M12 22V12"></path>
              </svg>
              محصولات
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
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
                className="h-4 w-4"
              >
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              سفارش‌ها
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
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
                className="h-4 w-4"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              مشتریان
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
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
                className="h-4 w-4"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              تنظیمات
            </Link>
          </div>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-6">
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
                <label className="text-sm font-medium">ویژگی‌ها</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="feature-1"
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="ویژگی ۱"
                    />
                    <Button variant="ghost" size="sm" className="mr-2">
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
                        className="h-4 w-4"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="feature-2"
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="ویژگی ۲"
                    />
                    <Button variant="ghost" size="sm" className="mr-2">
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
                        className="h-4 w-4"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
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
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  افزودن ویژگی
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">تصاویر محصول</label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
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
                    برای آپلود تصاویر کلیک کنید یا فایل‌ها را به اینجا بکشید
                  </p>
                  <Button variant="outline" className="mt-4">
                    انتخاب فایل
                  </Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="min-w-[150px]">ذخیره محصول</Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 