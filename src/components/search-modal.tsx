"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Filter, TrendingUp, Clock, Star } from 'lucide-react';
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
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isPopular?: boolean;
}

interface SearchSuggestion {
  text: string;
  type: 'category' | 'product' | 'brand';
  count?: number;
}

// Mock data - in real app, this would come from your API
const mockProducts: SearchResult[] = [
  {
    id: '1',
    name: 'مبل راحتی کلاسیک',
    price: 12500000,
    image: '/placeholder.svg',
    category: 'مبلمان پذیرایی',
    rating: 4.8,
    isPopular: true
  },
  {
    id: '2',
    name: 'میز ناهارخوری چوبی',
    price: 7500000,
    image: '/placeholder.svg',
    category: 'میز ناهارخوری',
    rating: 4.6
  },
  {
    id: '3',
    name: 'کاناپه ال شکل مدرن',
    price: 18500000,
    image: '/placeholder.svg',
    category: 'مبلمان پذیرایی',
    rating: 4.9,
    isPopular: true
  }
];

export function SearchModal({ isOpen, onClose, locale = 'fa' }: SearchModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search function with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm);
      } else {
        setResults([]);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const performSearch = async (term: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Filter mock products
    const filteredProducts = mockProducts.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase())
    );
    
    // Generate suggestions
    const categoryMatches = categories
      .filter(cat => cat.name.toLowerCase().includes(term.toLowerCase()))
      .map(cat => ({ text: cat.name, type: 'category' as const, count: cat.count }));
    
    setResults(filteredProducts);
    setSuggestions(categoryMatches);
    setIsLoading(false);
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Save to recent searches
      const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      // Navigate to search results page
      window.location.href = `/${locale}/products?search=${encodeURIComponent(term)}`;
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">جستجوی محصولات</DialogTitle>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              placeholder="نام محصول، دسته‌بندی یا برند مورد نظر را جستجو کنید..."
              className="w-full pr-12 pl-12 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <Filter className="w-4 h-4" />
                <span>فیلترها</span>
              </Button>
            </div>
            {isLoading && (
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>در حال جستجو...</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {!searchTerm ? (
            // Default state - show popular searches and categories
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="flex items-center space-x-2 space-x-reverse text-sm font-medium text-gray-700 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>جستجوهای اخیر</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="flex items-center space-x-2 space-x-reverse text-sm font-medium text-gray-700 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>جستجوهای محبوب</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">دسته‌بندی‌ها</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/${locale}/products?category=${encodeURIComponent(category.name)}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-xs text-gray-500">{category.count} محصول</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Search results
            <div className="space-y-4">
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">پیشنهادات</h3>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(suggestion.text)}
                        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-right transition-colors"
                      >
                        <span className="text-sm">{suggestion.text}</span>
                        {suggestion.count && (
                          <span className="text-xs text-gray-500">{suggestion.count} محصول</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {results.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">محصولات</h3>
                  <div className="space-y-2">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/${locale}/products/${product.id}`}
                        onClick={onClose}
                        className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs text-gray-500">تصویر</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </h4>
                            {product.isPopular && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                محبوب
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{product.category}</p>
                          <div className="flex items-center space-x-2 space-x-reverse mt-1">
                            <span className="text-sm font-bold text-green-600">
                              {formatPrice(product.price)}
                            </span>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {!isLoading && searchTerm && results.length === 0 && suggestions.length === 0 && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">نتیجه‌ای یافت نشد</h3>
                  <p className="text-gray-500 mb-4">
                    متاسفانه محصولی با عبارت "{searchTerm}" پیدا نکردیم
                  </p>
                  <Button
                    onClick={() => handleSearch(searchTerm)}
                    variant="outline"
                  >
                    جستجو در تمام محصولات
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 