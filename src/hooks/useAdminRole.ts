/**
 * Admin Role Hook
 *
 * Checks if the current user has admin role in Firestore.
 * Admin roles are stored in user_roles collection with format: {userId}_admin
 */

import { useState, useEffect } from "react";
import { doc, getDocFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface UseAdminRoleResult {
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
}

///TEST
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function testFirestore() {
  await addDoc(collection(db, "categories"), {
    name: "firestore-test",
    createdAt: serverTimestamp(),
  });

  console.log("Firestore write OK");
}

///TEST

// Helper function to fetch with retry
const fetchWithRetry = async <T,>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 500,
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (err) {
      if (i === maxRetries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
};

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

      // Auth complete, user exists - check Firestore with retry
      try {
        setLoading(true);
        const roleRef = doc(db, "user_roles", user.uid);
        const roleSnap = await fetchWithRetry(() => getDocFromServer(roleRef));

        if (roleSnap.exists()) {
          const data = roleSnap.data();
          setIsAdmin(data.role === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error checking admin role:", err);
        setError(err instanceof Error ? err : new Error("Failed to check admin role"));
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, authLoading]);

  return { isAdmin, loading, error };
}
