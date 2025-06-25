'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  stock?: number;
  locale?: string;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  isAvailable = true,
  isFeatured = false,
  isOnSale = false,
  stock = 50,
  locale = 'fa'
}: ProductCardProps) {
  const { addItem, isInWishlist, addToWishlist, removeFromWishlist, formatPrice } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isWishlisted = isInWishlist(id);
  const isLowStock = stock < 10;

  const handleAddToCart = async () => {
    if (!isAvailable || isAdding) return;
    
    setIsAdding(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addItem({
      id,
      name,
      price,
      image,
      maxStock: stock
    });
    
    setIsAdding(false);
    setJustAdded(true);
    
    // Reset the "just added" state after 2 seconds
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    const wishlistItem = {
      id,
      name,
      price,
      image,
      category,
      isAvailable
    };

    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {isFeatured && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            ویژه
          </span>
        )}
        {isOnSale && discountPercentage > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {discountPercentage}٪ تخفیف
          </span>
        )}
        {isLowStock && isAvailable && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            آخرین موجودی
          </span>
        )}
        {!isAvailable && (
          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            ناموجود
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 left-3 z-10 p-2 rounded-full transition-all duration-200 ${
          isWishlisted 
            ? 'bg-red-100 text-red-500 scale-110' 
            : 'bg-white/80 text-gray-400 hover:bg-red-100 hover:text-red-500'
        } ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/${locale}/products/${id}`}>
          {!imageError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">تصویر موجود نیست</span>
              </div>
            </div>
          )}
        </Link>

        {/* Quick View Button */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Link href={`/${locale}/products/${id}`}>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/90 text-gray-800 hover:bg-white"
            >
              <Eye className="w-4 h-4 ml-2" />
              مشاهده سریع
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1">{category}</p>
        
        {/* Product Name */}
        <Link href={`/${locale}/products/${id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-3 h-3 ${
                    index < Math.floor(rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {isAvailable && (
          <div className="flex items-center gap-1 mb-3">
            <div className={`w-2 h-2 rounded-full ${isLowStock ? 'bg-orange-400' : 'bg-green-400'}`} />
            <span className="text-xs text-gray-600">
              {isLowStock ? `تنها ${stock} عدد در انبار` : 'موجود در انبار'}
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          className={`w-full transition-all duration-200 ${
            justAdded 
              ? 'bg-green-500 hover:bg-green-600' 
              : isAdding 
                ? 'bg-blue-400' 
                : 'bg-blue-600 hover:bg-blue-700'
          } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {!isAvailable ? (
            'ناموجود'
          ) : justAdded ? (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <Check className="w-4 h-4" />
              <span>اضافه شد</span>
            </div>
          ) : isAdding ? (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>در حال افزودن...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <ShoppingCart className="w-4 h-4" />
              <span>افزودن به سبد</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

// Product card skeleton for loading states
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
} 