/**
 * Admin Role Hook
 * 
 * Checks if the current user has admin role in Firestore.
 * Admin roles are stored in user_roles collection with format: {userId}_admin
 */

import { useState, useEffect } from 'react';
import { doc, getDoc, enableNetwork } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface UseAdminRoleResult {
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
}

export function useAdminRole(): UseAdminRoleResult {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      // Wait for auth to complete first
      if (authLoading) {
        setLoading(true);
        return;
      }

      // Auth complete, but no user
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Auth complete, user exists - check Firestore
      try {
        setLoading(true);
        // Ensure Firestore is online before querying
        await enableNetwork(db);
        const roleRef = doc(db, 'user_roles', user.uid);
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
  }, [user, authLoading]);

  return { isAdmin, loading, error };
}
