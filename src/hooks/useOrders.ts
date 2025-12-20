import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus } from '@/lib/firebase-types';

interface UseOrdersOptions {
  status?: OrderStatus;
  limit?: number;
}

async function fetchOrders(status?: OrderStatus): Promise<Order[]> {
  const ordersRef = collection(db, 'orders');
  let q = query(ordersRef, orderBy('createdAt', 'desc'));

  if (status) {
    q = query(ordersRef, where('status', '==', status), orderBy('createdAt', 'desc'));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
  })) as Order[];
}

export function useOrders(options: UseOrdersOptions = {}) {
  const queryClient = useQueryClient();
  
  const { data: orders = [], isLoading: loading, error } = useQuery({
    queryKey: ['admin', 'orders', options.status],
    queryFn: () => fetchOrders(options.status),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
  });

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      // Invalidate cache to refetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
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
    error: error ? (error as Error).message : null,
    stats,
    updateOrderStatus,
    updateTrackingNumber,
    addOrderNote,
  };
}

async function fetchOrder(orderId: string): Promise<Order | null> {
  const orderRef = doc(db, 'orders', orderId);
  const snapshot = await getDoc(orderRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  } as Order;
}

export function useOrder(orderId: string | undefined) {
  const { data: order = null, isLoading: loading, error } = useQuery({
    queryKey: ['admin', 'order', orderId],
    queryFn: () => fetchOrder(orderId!),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });

  return { 
    order, 
    loading, 
    error: error ? (error as Error).message : null 
  };
}
