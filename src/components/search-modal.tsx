"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import Link from 'next/link';

// Mock popular searches and categories
const popularSearches = ['مبل راحتی', 'میز ناهارخوری', 'کمد لباس', 'تخت خواب', 'مبلمان اداری'];
const categories = [
  { name: 'مبلمان راحتی', href: '/products?category=living-room' },
  { name: 'میز و صندلی', href: '/products?category=tables' },
  { name: 'مبلمان اتاق خواب', href: '/products?category=bedroom' },
  { name: 'دکوراسیون', href: '/products?category=decor' },
  { name: 'مبلمان اداری', href: '/products?category=office' },
];

// Mock suggested products
const suggestedProducts = [
  { id: 1, name: 'مبل راحتی سه نفره مدل ونیز', category: 'مبلمان راحتی', image: '/products/sofa-1.jpg' },
  { id: 2, name: 'میز جلو مبلی چوبی مدل آرتا', category: 'میز و صندلی', image: '/products/table-1.jpg' },
  { id: 3, name: 'تخت خواب دو نفره مدل رویال', category: 'مبلمان اتاق خواب', image: '/products/bed-1.jpg' },
];

interface SearchModalProps {
  locale: string;
}

export function SearchModal({ locale }: SearchModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setOpen(false);
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setIsSearching(true);
  };
  
  const handleCategoryClick = (href: string) => {
    setOpen(false);
    router.push(`/${locale}${href}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Search className="h-5 w-5" />
          <span className="sr-only">جستجو</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">جستجو در محصولات</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="relative mt-4">
          <Input
            type="search"
            placeholder="نام محصول، دسته‌بندی یا کلمه کلیدی..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(e.target.value.length > 0);
            }}
            autoFocus
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute left-1 top-1 h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        {!isSearching && (
          <>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">جستجوهای محبوب</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePopularSearch(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">دسته‌بندی‌ها</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant="outline"
                    className="justify-between"
                    onClick={() => handleCategoryClick(category.href)}
                  >
                    {category.name}
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
        
        {isSearching && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">نتایج پیشنهادی</h3>
            <div className="space-y-4">
              {suggestedProducts
                .filter(product => 
                  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  product.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/${locale}/products/${product.id}`);
                    }}
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                        تصویر
                      </div>
                    </div>
                    <div className="mr-3">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                ))}
              
              {searchQuery && (
                <Button 
                  className="w-full mt-2" 
                  onClick={handleSearch}
                >
                  مشاهده همه نتایج برای "{searchQuery}"
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 