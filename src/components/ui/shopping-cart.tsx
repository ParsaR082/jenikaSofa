'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart as CartIcon, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface ShoppingCartProps {
  locale?: string;
}

export function ShoppingCart({ locale = 'fa' }: ShoppingCartProps) {
  const { state, removeItem, updateQuantity, clearCart, toggleCart, formatPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Redirect to checkout page
    window.location.href = `/${locale}/checkout`;
  };

  const shippingThreshold = 5000000; // 5M Toman for free shipping
  const remainingForFreeShipping = Math.max(0, shippingThreshold - state.total);
  const hasDiscounts = state.items.length >= 3; // 10% discount for 3+ items
  const discountAmount = hasDiscounts ? state.total * 0.1 : 0;
  const finalTotal = state.total - discountAmount;

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Cart Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        state.isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 pb-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-semibold">سبد خرید</h2>
              {state.itemCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {state.itemCount} کالا
                </span>
              )}
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {state.items.length === 0 ? (
          // Empty cart state
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <CartIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              سبد خرید شما خالی است
            </h3>
            <p className="text-gray-500 mb-6">
              برای شروع خرید، محصولی را به سبد اضافه کنید
            </p>
            <Button
              onClick={toggleCart}
              className="w-full"
              asChild
            >
              <Link href={`/${locale}/products`}>
                مشاهده محصولات
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Free shipping progress */}
              {remainingForFreeShipping > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      ارسال رایگان
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mb-2">
                    {formatPrice(remainingForFreeShipping)} تومان تا ارسال رایگان
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((state.total / shippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Discount notification */}
              {hasDiscounts && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-green-600">🎉</span>
                    <span className="text-sm font-medium text-green-800">
                      ۱۰٪ تخفیف برای ۳ کالا یا بیشتر اعمال شد!
                    </span>
                  </div>
                </div>
              )}

              {/* Cart items list */}
              {state.items.map((item) => (
                <div
                  key={`${item.id}-${JSON.stringify(item.variant)}`}
                  className="flex items-start space-x-3 space-x-reverse p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">تصویر</span>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    
                    {/* Variant info */}
                    {item.variant && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.variant).map(([key, value]) => (
                          <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {value}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price and quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1 space-x-reverse bg-gray-50 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-left">
                        <div className="text-sm font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-500">
                            {formatPrice(item.price)} × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stock warning */}
                    {item.quantity >= item.maxStock * 0.8 && (
                      <div className="text-xs text-orange-600 mt-1">
                        تنها {item.maxStock - item.quantity} عدد در انبار باقی مانده
                      </div>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Clear cart button */}
              <button
                onClick={clearCart}
                className="w-full text-sm text-red-600 hover:text-red-800 py-2 border border-red-200 hover:border-red-300 rounded-lg transition-colors"
              >
                پاک کردن سبد خرید
              </button>
            </div>

            {/* Cart summary and checkout */}
            <div className="border-t bg-gray-50 p-6 space-y-4 flex-shrink-0">
              {/* Order summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>مجموع کالاها</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                
                {hasDiscounts && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>تخفیف (۱۰٪)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>هزینه ارسال</span>
                  <span>
                    {state.total >= shippingThreshold 
                      ? <span className="text-green-600">رایگان</span>
                      : formatPrice(200000)
                    }
                  </span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>مجموع نهایی</span>
                    <span className="text-green-600">
                      {formatPrice(finalTotal + (state.total >= shippingThreshold ? 0 : 200000))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex items-center justify-center space-x-4 space-x-reverse text-xs text-gray-500">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Shield className="w-3 h-3" />
                  <span>پرداخت امن</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Truck className="w-3 h-3" />
                  <span>ارسال سریع</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Heart className="w-3 h-3" />
                  <span>ضمانت اصالت</span>
                </div>
              </div>

              {/* Checkout button */}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
              >
                {isCheckingOut ? (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>در حال انتقال...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <CreditCard className="w-5 h-5" />
                    <span>ادامه خرید</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>

              {/* Continue shopping */}
              <Button
                variant="outline"
                onClick={toggleCart}
                className="w-full"
                asChild
              >
                <Link href={`/${locale}/products`}>
                  ادامه خرید
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
} 