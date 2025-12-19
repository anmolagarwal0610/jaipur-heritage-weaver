import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, Order } from '@/lib/firebase-types';

interface CustomerWithStats extends UserProfile {
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const customersData = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const userData = docSnap.data() as UserProfile;
              
              // Get orders for this customer
              const ordersRef = collection(db, 'orders');
              const ordersQuery = query(ordersRef, where('userId', '==', docSnap.id));
              const ordersSnap = await getDocs(ordersQuery);
              
              let totalSpent = 0;
              let lastOrderDate: Date | undefined;
              
              ordersSnap.docs.forEach(orderDoc => {
                const orderData = orderDoc.data();
                if (orderData.status !== 'cancelled') {
                  totalSpent += orderData.total || 0;
                }
                const orderDate = orderData.createdAt?.toDate?.();
                if (orderDate && (!lastOrderDate || orderDate > lastOrderDate)) {
                  lastOrderDate = orderDate;
                }
              });

              return {
                ...userData,
                id: docSnap.id,
                orderCount: ordersSnap.size,
                totalSpent,
                lastOrderDate,
                createdAt: userData.createdAt || new Date(),
              } as CustomerWithStats;
            })
          );
          
          setCustomers(customersData);
          setLoading(false);
        } catch (err: any) {
          console.error('Error processing customers:', err);
          setError(err.message);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching customers:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const stats = {
    total: customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.length > 0 
      ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orderCount, 0) || 0
      : 0,
  };

  return {
    customers,
    loading,
    error,
    stats,
  };
}
