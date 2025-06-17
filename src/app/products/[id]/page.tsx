import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

// Mock data for products
const products = [
  {
    id: '1',
    name: 'مبل راحتی سه نفره',
    description: 'مبل راحتی سه نفره با پارچه مخمل و پایه چوبی. این مبل با طراحی ارگونومیک و استفاده از فوم سرد با دانسیته بالا، راحتی فوق العاده‌ای را برای شما به ارمغان می‌آورد. پارچه مخمل با دوام بالا و مقاوم در برابر سایش، عمر طولانی محصول را تضمین می‌کند. پایه‌های چوبی از جنس چوب راش با رنگ گردویی، زیبایی خاصی به این مبل بخشیده است.',
    price: 1200,
    images: ['/images/sofa1.jpg', '/images/sofa1-2.jpg', '/images/sofa1-3.jpg'],
    isAvailable: true,
    features: [
      'پارچه مخمل با دوام بالا',
      'فوم سرد با دانسیته بالا',
      'پایه چوبی از جنس چوب راش',
      'قابل شستشو',
      'ضد آب و لک',
      'گارانتی ۱۸ ماهه',
    ],
    dimensions: {
      width: 220,
      height: 85,
      depth: 90,
    },
    colors: ['آبی نفتی', 'طوسی', 'کرم'],
  },
  {
    id: '2',
    name: 'مبل راحتی دو نفره',
    description: 'مبل راحتی دو نفره با پارچه کتان و پایه فلزی',
    price: 950,
    images: ['/images/sofa2.jpg'],
    isAvailable: true,
    features: [
      'پارچه کتان با دوام بالا',
      'فوم سرد با دانسیته بالا',
      'پایه فلزی',
      'قابل شستشو',
      'گارانتی ۱۲ ماهه',
    ],
    dimensions: {
      width: 180,
      height: 85,
      depth: 90,
    },
    colors: ['طوسی', 'کرم', 'قهوه‌ای'],
  },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id) || products[0];

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
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-muted-foreground">تصویر اصلی محصول</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <div className="text-muted-foreground text-xs">تصویر {index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="text-2xl font-semibold">{formatPrice(product.price)}</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={star <= 4 ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-yellow-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  <span className="text-sm text-muted-foreground mr-2">(۱۲ نظر)</span>
                </div>
                <p className="text-muted-foreground">{product.description}</p>
                <div className="space-y-2">
                  <h3 className="font-medium">رنگ</h3>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`border rounded-md px-3 py-1 text-sm cursor-pointer ${
                          index === 0 ? 'border-primary' : ''
                        }`}
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">ابعاد</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="border rounded-md p-2 text-center">
                      <div className="text-muted-foreground">عرض</div>
                      <div className="font-medium">{product.dimensions.width} سانتی‌متر</div>
                    </div>
                    <div className="border rounded-md p-2 text-center">
                      <div className="text-muted-foreground">ارتفاع</div>
                      <div className="font-medium">{product.dimensions.height} سانتی‌متر</div>
                    </div>
                    <div className="border rounded-md p-2 text-center">
                      <div className="text-muted-foreground">عمق</div>
                      <div className="font-medium">{product.dimensions.depth} سانتی‌متر</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">تعداد</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      -
                    </Button>
                    <span className="w-12 text-center">۱</span>
                    <Button variant="outline" size="icon">
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1" size="lg">
                    افزودن به سبد خرید
                  </Button>
                  <Button variant="outline" size="lg">
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
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className="mr-2">افزودن به علاقه‌مندی‌ها</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">ویژگی‌های محصول</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
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
                    className="h-5 w-5 text-primary"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">محصولات مشابه</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((relatedProduct) => (
                <Link
                  href={`/products/${relatedProduct.id}`}
                  key={relatedProduct.id}
                  className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground">تصویر محصول</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{relatedProduct.name}</h3>
                    <div className="mt-2 font-semibold">{formatPrice(relatedProduct.price)}</div>
                  </div>
                </Link>
              ))}
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