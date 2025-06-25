'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: string;
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
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'MOVE_TO_CART'; payload: string }
  | { type: 'HYDRATE_CART'; payload: Partial<CartState> };

const initialState: CartState = {
  items: [],
  wishlist: [],
  isOpen: false,
  isLoading: false,
  total: 0,
  itemCount: 0,
};

function calculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
        JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
      );

      let newItems: CartItem[];
      
      if (existingItemIndex > -1) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(
              item.quantity + action.payload.quantity,
              item.maxStock
            );
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const { total, itemCount } = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const { total, itemCount } = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => {
        if (item.id === action.payload.id) {
          const newQuantity = Math.max(0, Math.min(action.payload.quantity, item.maxStock));
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);

      const { total, itemCount } = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'ADD_TO_WISHLIST': {
      const isAlreadyInWishlist = state.wishlist.some(item => item.id === action.payload.id);
      if (isAlreadyInWishlist) return state;
      
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    }

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };

    case 'MOVE_TO_CART': {
      const wishlistItem = state.wishlist.find(item => item.id === action.payload);
      if (!wishlistItem) return state;

      // Remove from wishlist
      const newWishlist = state.wishlist.filter(item => item.id !== action.payload);
      
      // Add to cart
      const cartItem: CartItem = {
        ...wishlistItem,
        quantity: 1,
        maxStock: 50, // Default stock
      };

      const existingCartItem = state.items.find(item => item.id === cartItem.id);
      let newItems: CartItem[];

      if (existingCartItem) {
        newItems = state.items.map(item => 
          item.id === cartItem.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, item.maxStock) }
            : item
        );
      } else {
        newItems = [...state.items, cartItem];
      }

      const { total, itemCount } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        wishlist: newWishlist,
        total,
        itemCount,
      };
    }

    case 'HYDRATE_CART':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('shopping-cart');
      const savedWishlist = localStorage.getItem('wishlist');
      
      if (savedCart || savedWishlist) {
        const cartData = savedCart ? JSON.parse(savedCart) : { items: [] };
        const wishlistData = savedWishlist ? JSON.parse(savedWishlist) : [];
        
        const { total, itemCount } = calculateTotals(cartData.items || []);
        
        dispatch({
          type: 'HYDRATE_CART',
          payload: {
            items: cartData.items || [],
            wishlist: wishlistData,
            total,
            itemCount,
          },
        });
      }
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && state.items.length >= 0) {
      localStorage.setItem('shopping-cart', JSON.stringify({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }));
    }
  }, [state.items, state.total, state.itemCount]);

  useEffect(() => {
    if (typeof window !== 'undefined' && state.wishlist.length >= 0) {
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    }
  }, [state.wishlist]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...item,
        quantity: item.quantity || 1,
      },
    });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const addToWishlist = (item: WishlistItem) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
  };

  const removeFromWishlist = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

  const moveToCart = (id: string) => {
    dispatch({ type: 'MOVE_TO_CART', payload: id });
  };

  const isInWishlist = (id: string) => {
    return state.wishlist.some(item => item.id === id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist,
    formatPrice,
  };

  return (
    <CartContext.Provider value={value}>
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