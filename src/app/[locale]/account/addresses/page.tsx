'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AddressList } from '@/components/ui/address-list';
import { AddressForm } from '@/components/ui/address-form';

interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/address');
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        setShowAddForm(false);
        fetchAddresses();
      } else {
        const error = await response.json();
        alert(`خطا در افزودن آدرس: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('خطا در افزودن آدرس');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مدیریت آدرس‌ها</h1>
        <p className="text-gray-600">
          آدرس‌های خود را مدیریت کنید تا در زمان خرید سریع‌تر باشید
        </p>
      </div>

      {showAddForm ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">افزودن آدرس جدید</h2>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={handleCancelAdd}
            isLoading={isSubmitting}
          />
        </div>
      ) : (
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(true)}
            className="mb-4"
          >
            افزودن آدرس جدید
          </Button>
        </div>
      )}

      <AddressList
        addresses={addresses}
        onAddressUpdate={fetchAddresses}
      />
    </div>
  );
} 