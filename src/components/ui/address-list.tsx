'use client';

import { useState } from 'react';
import { Button } from './button';
import { AddressForm } from './address-form';

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

interface AddressListProps {
  addresses: Address[];
  onAddressUpdate: () => void;
}

export function AddressList({ addresses, onAddressUpdate }: AddressListProps) {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/address/${addressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onAddressUpdate();
      } else {
        const error = await response.json();
        alert(`خطا در حذف آدرس: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('خطا در حذف آدرس');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const url = editingAddress 
        ? `/api/address/${editingAddress.id}`
        : '/api/address';
      
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        setEditingAddress(null);
        onAddressUpdate();
      } else {
        const error = await response.json();
        alert(`خطا در ذخیره آدرس: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('خطا در ذخیره آدرس');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingAddress(null);
  };

  if (editingAddress) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
        </h3>
        <AddressForm
          address={editingAddress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>هنوز آدرسی اضافه نکرده‌اید</p>
        </div>
      ) : (
        addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">
                    {address.addressLine1}
                  </h4>
                  {address.isDefault && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      پیش‌فرض
                    </span>
                  )}
                </div>
                
                {address.addressLine2 && (
                  <p className="text-gray-600 text-sm mb-1">
                    {address.addressLine2}
                  </p>
                )}
                
                <p className="text-gray-600 text-sm">
                  {address.city}، {address.state} - {address.postalCode}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(address)}
                  disabled={isLoading}
                >
                  ویرایش
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(address.id)}
                  disabled={isLoading}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  حذف
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 