'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { useCart } from '@/contexts/cart-context';

interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface CheckoutFormProps {
  onSubmit: (data: { addressId: string; paymentMethod: string; notes?: string }) => void;
  isLoading?: boolean;
}

export function CheckoutForm({ onSubmit, isLoading = false }: CheckoutFormProps) {
  const { state } = useCart();
  const { items: cartItems, total: totalPrice } = state;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('online');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    // دریافت آدرس‌های کاربر
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/address');
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
          // انتخاب آدرس پیش‌فرض
          const defaultAddress = data.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (data.length > 0) {
            setSelectedAddressId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddressId) {
      alert('لطفاً یک آدرس انتخاب کنید');
      return;
    }

    onSubmit({
      addressId: selectedAddressId,
      paymentMethod,
      notes: notes.trim() || undefined
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">سبد خرید شما خالی است</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* انتخاب آدرس */}
      <div>
        <h3 className="text-lg font-semibold mb-4">انتخاب آدرس ارسال</h3>
        {addresses.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              شما هنوز آدرسی اضافه نکرده‌اید. لطفاً ابتدا آدرس خود را در 
              <a href="/account/addresses" className="text-blue-600 underline mx-1">
                بخش آدرس‌ها
              </a>
              اضافه کنید.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAddressId === address.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{address.addressLine1}</span>
                    {address.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        پیش‌فرض
                      </span>
                    )}
                  </div>
                  {address.addressLine2 && (
                    <p className="text-gray-600 text-sm mb-1">{address.addressLine2}</p>
                  )}
                  <p className="text-gray-600 text-sm">
                    {address.city}، {address.state} - {address.postalCode}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* روش پرداخت */}
      <div>
        <h3 className="text-lg font-semibold mb-4">روش پرداخت</h3>
        <div className="space-y-3">
          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div>
              <span className="font-medium">پرداخت آنلاین</span>
              <p className="text-sm text-gray-600">پرداخت با کارت بانکی</p>
            </div>
          </label>
          
          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div>
              <span className="font-medium">پرداخت در محل</span>
              <p className="text-sm text-gray-600">پرداخت نقدی هنگام تحویل</p>
            </div>
          </label>
        </div>
      </div>

      {/* یادداشت */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          یادداشت (اختیاری)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="توضیحات اضافی برای سفارش..."
        />
      </div>

      {/* خلاصه سفارش */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">خلاصه سفارش</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>تعداد محصولات:</span>
            <span>{cartItems.length} عدد</span>
          </div>
          <div className="flex justify-between">
            <span>مجموع:</span>
            <span className="font-semibold">{totalPrice.toLocaleString()} تومان</span>
          </div>
        </div>
      </div>

      {/* دکمه تکمیل سفارش */}
      <Button
        type="submit"
        disabled={isLoading || addresses.length === 0 || !selectedAddressId}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'در حال پردازش...' : 'تکمیل سفارش'}
      </Button>
    </form>
  );
} 