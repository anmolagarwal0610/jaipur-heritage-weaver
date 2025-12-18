/**
 * Admin Role Hook
 * 
 * Checks if the current user has admin role in Firestore.
 * Admin roles are stored in user_roles collection with format: {userId}_admin
 */

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface UseAdminRoleResult {
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
}

export function useAdminRole(): UseAdminRoleResult {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Check for admin role document: {userId}_admin
        const roleRef = doc(db, 'user_roles', `${user.uid}_admin`);
        const roleSnap = await getDoc(roleRef);
        
        if (roleSnap.exists()) {
          const data = roleSnap.data();
          setIsAdmin(data.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error checking admin role:', err);
        setError(err instanceof Error ? err : new Error('Failed to check admin role'));
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading, error };
}
