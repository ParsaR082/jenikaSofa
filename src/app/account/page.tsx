import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock user data
const user = {
  name: 'علی محمدی',
  email: 'ali@example.com',
  image: '/images/avatar.jpg',
};

// Mock orders data
const orders = [
  {
    id: 'ORD-001',
    date: '۱۴۰۲/۰۸/۱۵',
    status: 'تحویل داده شده',
    total: 12000000,
    items: [
      {
        id: '1',
        name: 'مبل راحتی سه نفره',
        price: 12000000,
        quantity: 1,
      },
    ],
  },
  {
    id: 'ORD-002',
    date: '۱۴۰۲/۰۷/۲۰',
    status: 'تحویل داده شده',
    total: 9500000,
    items: [
      {
        id: '2',
        name: 'مبل راحتی دو نفره',
        price: 9500000,
        quantity: 1,
      },
    ],
  },
];

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold">
            مبلمان
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:underline">
              محصولات
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              درباره ما
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              تماس با ما
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/account">
              <Button variant="ghost" size="icon">
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
                  className="h-5 w-5"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="sr-only">حساب کاربری</span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
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
                  className="h-5 w-5"
                >
                  <circle cx="8" cy="21" r="1"></circle>
                  <circle cx="19" cy="21" r="1"></circle>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                <span className="sr-only">سبد خرید</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-6">حساب کاربری</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64">
              <div className="border rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
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
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-medium">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
              <nav className="space-y-1">
                <Link
                  href="/account"
                  className="block w-full py-2 px-3 rounded-md bg-primary text-primary-foreground"
                >
                  داشبورد
                </Link>
                <Link
                  href="/account/orders"
                  className="block w-full py-2 px-3 rounded-md hover:bg-muted"
                >
                  سفارش‌ها
                </Link>
                <Link
                  href="/account/profile"
                  className="block w-full py-2 px-3 rounded-md hover:bg-muted"
                >
                  ویرایش پروفایل
                </Link>
                <Link
                  href="/account/addresses"
                  className="block w-full py-2 px-3 rounded-md hover:bg-muted"
                >
                  آدرس‌ها
                </Link>
                <Link
                  href="/account/wishlist"
                  className="block w-full py-2 px-3 rounded-md hover:bg-muted"
                >
                  علاقه‌مندی‌ها
                </Link>
                <button className="block w-full text-right py-2 px-3 rounded-md hover:bg-muted text-destructive">
                  خروج
                </button>
              </nav>
            </aside>
            <div className="flex-1">
              <div className="grid gap-6">
                <div className="border rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4">سفارش‌های اخیر</h2>
                  {orders.length === 0 ? (
                    <p className="text-muted-foreground">هنوز سفارشی ثبت نکرده‌اید.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-md p-4">
                          <div className="flex flex-wrap gap-4 justify-between mb-4">
                            <div>
                              <div className="text-sm text-muted-foreground">شماره سفارش</div>
                              <div>{order.id}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">تاریخ</div>
                              <div>{order.date}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">وضعیت</div>
                              <div>
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">مبلغ کل</div>
                              <div className="font-medium">{order.total.toLocaleString('fa-IR')} تومان</div>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <div className="text-sm text-muted-foreground mb-2">محصولات</div>
                            <ul className="space-y-2">
                              {order.items.map((item) => (
                                <li key={item.id} className="flex justify-between">
                                  <span>
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span>{item.price.toLocaleString('fa-IR')} تومان</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-4 text-right">
                            <Link href={`/account/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                مشاهده جزئیات
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <Link href="/account/orders">
                      <Button variant="outline">مشاهده همه سفارش‌ها</Button>
                    </Link>
                  </div>
                </div>
                <div className="border rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4">اطلاعات شخصی</h2>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">نام</div>
                        <div>{user.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">ایمیل</div>
                        <div>{user.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/account/profile">
                      <Button variant="outline">ویرایش اطلاعات</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="container py-6">
          <p className="text-sm text-muted-foreground text-center">
            © ۱۴۰۳ مبلمان. تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
} 