/**
 * Cart Context Provider
 * Provides shared cart state across the application
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string | null;
  color: string | null; // Color variant name
  quantity: number;
  stockQuantity: number; // Track available stock for validation
}

interface CartState {
  items: CartItem[];
  updatedAt: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string | null, color: string | null) => void;
  updateQuantity: (productId: string, size: string | null, quantity: number, color: string | null) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: (subtotal: number) => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  // Sync to localStorage when items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback((item: CartItem) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        i => i.productId === item.productId && i.size === item.size && i.color === item.color
      );

      if (existingIndex >= 0) {
        const existingItem = prevItems[existingIndex];
        const newQuantity = existingItem.quantity + item.quantity;
        
        // Check stock limit
        if (newQuantity > item.stockQuantity) {
          toast.error(`Only ${item.stockQuantity} available in stock`);
          return prevItems;
        }
        
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
          stockQuantity: item.stockQuantity, // Update stock info
        };
        toast.success('Updated cart quantity');
        return updated;
      }

      // Check stock limit for new item
      if (item.quantity > item.stockQuantity) {
        toast.error(`Only ${item.stockQuantity} available in stock`);
        return prevItems;
      }

      toast.success('Added to cart');
      return [...prevItems, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string | null, color: string | null) => {
    setItems(prevItems => {
      const filtered = prevItems.filter(
        i => !(i.productId === productId && i.size === size && i.color === color)
      );
      if (filtered.length < prevItems.length) {
        toast.success('Removed from cart');
      }
      return filtered;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, size: string | null, quantity: number, color: string | null) => {
    if (quantity < 1) return;
    
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.productId === productId && item.size === size && item.color === color) {
          // Check stock limit
          if (quantity > item.stockQuantity) {
            toast.error(`Only ${item.stockQuantity} available in stock`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
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

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getShipping,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Safe hook that returns defaults if context not available (handles HMR edge cases)
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // Return safe defaults instead of throwing - handles HMR and initial render edge cases
    return {
      items: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getItemCount: () => 0,
      getSubtotal: () => 0,
      getShipping: () => 99,
      getTotal: () => 0,
    };
  }
  return context;
};
