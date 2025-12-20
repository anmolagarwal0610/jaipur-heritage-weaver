/**
 * Order Creation Hook
 * Creates orders in Firestore with generated order numbers
 */

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartItem } from '@/contexts/CartContext';
import { OrderItem, OrderStatus } from '@/lib/firebase-types';

interface ShippingData {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface CreateOrderParams {
  items: CartItem[];
  shippingData: ShippingData;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'cod' | 'online';
  userId?: string;
}

interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
}

const generateOrderNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `JT-${dateStr}-${randomStr}`;
};

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (params: CreateOrderParams): Promise<CreateOrderResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const orderNumber = generateOrderNumber();
      
      // Convert cart items to order items
      const orderItems: OrderItem[] = params.items.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.image,
        sku: '', // SKU not available in cart
        size: item.size,
        color: null,
      }));

      const orderData = {
        orderNumber,
        userId: params.userId || 'guest',
        userEmail: params.shippingData.email,
        items: orderItems,
        status: 'pending' as OrderStatus,
        subtotal: params.subtotal,
        shippingCost: params.shippingCost,
        discount: 0,
        totalAmount: params.total,
        shippingAddress: params.shippingData,
        paymentMethod: params.paymentMethod,
        paymentStatus: 'pending' as const,
        trackingNumber: null,
        shippedAt: null,
        deliveredAt: null,
        notes: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      return {
        orderId: docRef.id,
        orderNumber,
      };
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error,
  };
};
