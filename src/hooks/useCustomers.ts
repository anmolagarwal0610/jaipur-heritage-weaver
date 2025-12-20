import { useQuery } from '@tanstack/react-query';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/lib/firebase-types';

interface CustomerWithStats extends UserProfile {
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
}

async function fetchCustomers(): Promise<CustomerWithStats[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

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
  
  return customersData;
}

export function useCustomers() {
  const { data: customers = [], isLoading: loading, error } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: fetchCustomers,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
  });

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
    error: error ? (error as Error).message : null,
    stats,
  };
}
