"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useParams } from 'next/navigation';
import { SearchModal } from '@/components/search-modal';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center">
              <span className="text-2xl font-bold text-primary">مبلمان جنیکا</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 mr-6">
              <Link href={`/${locale}`} className="text-foreground hover:text-accent transition-colors">
                صفحه اصلی
              </Link>
              <Link href={`/${locale}/products`} className="text-foreground hover:text-accent transition-colors">
                محصولات
              </Link>
              <Link href={`/${locale}/about`} className="text-foreground hover:text-accent transition-colors">
                درباره ما
              </Link>
              <Link href={`/${locale}/contact`} className="text-foreground hover:text-accent transition-colors">
                تماس با ما
              </Link>
            </nav>
            
            {/* Search, User, Cart */}
            <div className="flex items-center space-x-4">
              <SearchModal locale={locale} />
              
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <User className="h-5 w-5" />
                  <span className="sr-only">حساب کاربری</span>
                </Button>
              </Link>
              
              <Link href={`/${locale}/cart`}>
                <Button variant="ghost" size="icon" className="text-foreground relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                  <span className="sr-only">سبد خرید</span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">منو</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-background">
        {children}
      </main>
      
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">مبلمان جنیکا</h3>
              <p className="text-primary-foreground/80">
                فروشگاه آنلاین مبلمان با کیفیت برای خانه شما با ضمانت اصالت و کیفیت
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">دسترسی سریع</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}`} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    صفحه اصلی
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/products`} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    محصولات
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/about`} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    درباره ما
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/contact`} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    تماس با ما
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">خدمات مشتریان</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/terms`} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    قوانین و مقررات
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/privacy`} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    حریم خصوصی
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/faq`} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    سوالات متداول
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/shipping`} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    شرایط ارسال
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">تماس با ما</h3>
              <address className="not-italic text-primary-foreground/80">
                <p>تهران - خیابان ولیعصر</p>
                <p>شماره تماس: ۰۲۱-۱۲۳۴۵۶۷۸</p>
                <p>ایمیل: info@jenika.com</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/80">
              © ۱۴۰۳ مبلمان جنیکا. تمامی حقوق محفوظ است.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {/* Social Media Icons */}
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <span className="sr-only">اینستاگرام</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <span className="sr-only">تلگرام</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10z"/>
                  <path d="M9.74 15.96l.71-3.38 6.26-5.66c.28-.25-.06-.39-.43-.16l-7.73 4.86-3.32-1.05c-.71-.23-.72-.71.16-.95l12.97-5c.59-.24 1.16.14.95.95l-2.21 10.47c-.16.72-.61.89-1.24.56l-3.41-2.52-1.64 1.58c-.18.18-.33.33-.67.33-.35 0-.28-.15-.4-.53z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 