import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus } from '@/lib/firebase-types';

interface UseOrdersOptions {
  status?: OrderStatus;
  limit?: number;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    let q = query(ordersRef, orderBy('createdAt', 'desc'));

    if (options.status) {
      q = query(ordersRef, where('status', '==', options.status), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
        })) as Order[];
        setOrders(ordersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching orders:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [options.status]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        trackingNumber,
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.error('Error updating tracking number:', err);
      throw err;
    }
  };

  const addOrderNote = async (orderId: string, note: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const order = orders.find(o => o.id === orderId);
      const existingNotes = order?.notes || '';
      const timestamp = new Date().toLocaleDateString();
      const newNotes = existingNotes 
        ? `${existingNotes}\n[${timestamp}] ${note}`
        : `[${timestamp}] ${note}`;
      await updateDoc(orderRef, {
        notes: newNotes,
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.error('Error adding order note:', err);
      throw err;
    }
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };

  return {
    orders,
    loading,
    error,
    stats,
    updateOrderStatus,
    updateTrackingNumber,
    addOrderNote,
  };
}

export function useOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const orderRef = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(
      orderRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setOrder({
            id: snapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
          } as Order);
        } else {
          setOrder(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching order:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  return { order, loading, error };
}
