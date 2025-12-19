/**
 * Cart State Management Hook
 * Features: Add/remove/update items, localStorage persistence, totals calculation
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  updatedAt: number;
}

const CART_STORAGE_KEY = 'jaipur_touch_cart';

const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed: CartState = JSON.parse(stored);
      return parsed.items || [];
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
  return [];
};

const saveCart = (items: CartItem[]) => {
  try {
    const state: CartState = {
      items,
      updatedAt: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  // Sync to localStorage when items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback((item: CartItem) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        i => i.productId === item.productId && i.size === item.size
      );

      if (existingIndex >= 0) {
        // Update quantity if item exists
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        toast.success('Updated cart quantity');
        return updated;
      }

      // Add new item
      toast.success('Added to cart');
      return [...prevItems, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string | null) => {
    setItems(prevItems => {
      const filtered = prevItems.filter(
        i => !(i.productId === productId && i.size === size)
      );
      toast.success('Removed from cart');
      return filtered;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, size: string | null, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.productId === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.success('Cart cleared');
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getShipping = useCallback((subtotal: number) => {
    return subtotal >= 999 ? 0 : 99;
  }, []);

  const getTotal = useCallback(() => {
    const subtotal = getSubtotal();
    const shipping = getShipping(subtotal);
    return subtotal + shipping;
  }, [getSubtotal, getShipping]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
    getShipping,
    getTotal,
  };
};
