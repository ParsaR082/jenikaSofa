"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { useAuth } from './auth-context';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
    material?: string;
  };
  maxStock: number;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

interface CartState {
  items: CartItem[];
  wishlist: WishlistItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'SET_CART'; payload: { items: CartItem[]; total: number; itemCount: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_WISHLIST'; payload: WishlistItem[] };

const initialState: CartState = {
  items: [],
  wishlist: [],
  isOpen: false,
  isLoading: false,
  error: null,
  total: 0,
  itemCount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0, error: null };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number, variantData?: any) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

async function fetchWishlistFromAPI() {
  const res = await fetch('/api/wishlist', { credentials: 'include' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

async function addToWishlistAPI(productId: string) {
  await fetch('/api/wishlist', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
}

async function removeFromWishlistAPI(productId: string) {
  await fetch(`/api/wishlist?productId=${productId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isLoading: authLoading } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // Load wishlist from backend or localStorage on mount/login
  useEffect(() => {
    async function loadWishlist() {
      if (user) {
        const items = await fetchWishlistFromAPI();
        dispatch({ type: 'SET_WISHLIST', payload: items });
      } else {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
          try {
            const wishlist = JSON.parse(storedWishlist);
            if (Array.isArray(wishlist)) {
              dispatch({ type: 'SET_WISHLIST', payload: wishlist });
            }
          } catch {}
        } else {
          dispatch({ type: 'SET_WISHLIST', payload: [] });
        }
      }
    }
    loadWishlist();
  }, [user]);

  // Save wishlist to localStorage for guests only
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    }
  }, [state.wishlist, user]);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user) {
      dispatch({ type: 'SET_CART', payload: { items: [], total: 0, itemCount: 0 } });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      const items: CartItem[] = data.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.mainImage,
        quantity: item.quantity,
        variant: item.variantData,
        maxStock: item.product.stock,
      }));
      dispatch({ type: 'SET_CART', payload: { items, total: data.total, itemCount: data.itemCount } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error loading cart' });
    }
  }, [user]);

  // Add item to cart
  const addItem = useCallback(async (productId: string, quantity = 1, variantData?: any) => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, variantData }),
      });
      if (!res.ok) throw new Error('Failed to add item');
      await fetchCart();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error adding item' });
    }
  }, [user, fetchCart]);

  // Update item quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      await fetchCart();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error updating quantity' });
    }
  }, [user, fetchCart]);

  // Remove item from cart
  const removeItem = useCallback(async (itemId: string) => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to remove item');
      await fetchCart();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error removing item' });
    }
  }, [user, fetchCart]);

  // Clear cart (remove all items)
  const clearCart = useCallback(async () => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Remove all items one by one
      await Promise.all(state.items.map(item => removeItem(item.id)));
      await fetchCart();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error clearing cart' });
    }
  }, [user, state.items, removeItem, fetchCart]);

  // Toggle cart modal
  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  // تابع بررسی وجود محصول در لیست علاقه‌مندی‌ها
  const isInWishlist = useCallback(
    (productId: string) => {
      return state.wishlist.some(item => item.id === productId);
    },
    [state.wishlist]
  );

  // Add to wishlist
  const addToWishlist = useCallback(async (item: WishlistItem) => {
    if (user) {
      await addToWishlistAPI(item.id);
      const items = await fetchWishlistFromAPI();
      dispatch({ type: 'SET_WISHLIST', payload: items });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
    }
  }, [user]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    if (user) {
      await removeFromWishlistAPI(productId);
      const items = await fetchWishlistFromAPI();
      dispatch({ type: 'SET_WISHLIST', payload: items });
    } else {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    }
  }, [user]);

  // Fetch cart on login
  useEffect(() => {
    if (!authLoading && user && !initialized) {
      fetchCart();
      setInitialized(true);
    }
    if (!user && initialized) {
      dispatch({ type: 'CLEAR_CART' });
      setInitialized(false);
    }
  }, [user, authLoading, fetchCart, initialized]);

  return (
    <CartContext.Provider
      value={{
        state,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        toggleCart,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 