import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

// Mock data for products
const products = [
  {
    id: '1',
    name: 'مبل راحتی سه نفره',
    description: 'مبل راحتی سه نفره با پارچه مخمل و پایه چوبی',
    price: 1200,
    images: ['/images/sofa1.jpg'],
    isAvailable: true,
  },
  {
    id: '2',
    name: 'مبل راحتی دو نفره',
    description: 'مبل راحتی دو نفره با پارچه کتان و پایه فلزی',
    price: 950,
    images: ['/images/sofa2.jpg'],
    isAvailable: true,
  },
  {
    id: '3',
    name: 'مبل ال شکل',
    description: 'مبل ال شکل بزرگ مناسب برای خانواده های پر جمعیت',
    price: 2500,
    images: ['/images/sofa3.jpg'],
    isAvailable: true,
  },
  {
    id: '4',
    name: 'مبل تختخواب شو',
    description: 'مبل راحتی که به تختخواب تبدیل می‌شود',
    price: 1800,
    images: ['/images/sofa4.jpg'],
    isAvailable: true,
  },
  {
    id: '5',
    name: 'مبل استیل',
    description: 'مبل استیل کلاسیک با چوب گردو و پارچه مخمل',
    price: 3200,
    images: ['/images/sofa5.jpg'],
    isAvailable: true,
  },
  {
    id: '6',
    name: 'مبل راحتی چرمی',
    description: 'مبل راحتی با روکش چرم طبیعی و پایه چوبی',
    price: 2800,
    images: ['/images/sofa6.jpg'],
    isAvailable: true,
  },
];

export default function ProductsPage() {
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
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 space-y-6">
              <div>
                <h3 className="font-medium mb-2">دسته بندی</h3>
                <ul className="space-y-1">
                  <li>
                    <button className="text-sm hover:underline text-primary">مبل راحتی</button>
                  </li>
                  <li>
                    <button className="text-sm hover:underline">مبل استیل</button>
                  </li>
                  <li>
                    <button className="text-sm hover:underline">مبل ال</button>
                  </li>
                  <li>
                    <button className="text-sm hover:underline">مبل تختخواب شو</button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">قیمت</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="price-1"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="price-1" className="mr-2 text-sm">
                      کمتر از ۱۰,۰۰۰,۰۰۰ تومان
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="price-2"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="price-2" className="mr-2 text-sm">
                      ۱۰,۰۰۰,۰۰۰ تا ۲۰,۰۰۰,۰۰۰ تومان
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="price-3"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="price-3" className="mr-2 text-sm">
                      ۲۰,۰۰۰,۰۰۰ تا ۳۰,۰۰۰,۰۰۰ تومان
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="price-4"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="price-4" className="mr-2 text-sm">
                      بیشتر از ۳۰,۰۰۰,۰۰۰ تومان
                    </label>
                  </div>
                </div>
              </div>
            </aside>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">محصولات</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">مرتب سازی:</span>
                  <select className="text-sm border rounded p-1">
                    <option>جدیدترین</option>
                    <option>قیمت: کم به زیاد</option>
                    <option>قیمت: زیاد به کم</option>
                    <option>محبوب ترین</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <div className="text-muted-foreground">تصویر محصول</div>
                    </div>
                    <div className="p-4">
                      <h2 className="font-medium">{product.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-2 font-semibold">{formatPrice(product.price)}</div>
                      <Button className="w-full mt-4">افزودن به سبد خرید</Button>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" disabled>
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
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline" size="icon">
                    2
                  </Button>
                  <Button variant="outline" size="icon">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
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
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
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