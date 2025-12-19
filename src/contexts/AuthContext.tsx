/**
 * Firebase Authentication Context
 * 
 * Provides auth state management across the app.
 * Uses Firebase Auth with Email/Password and Google sign-in.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDocFromServer, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import type { UserProfile } from '@/lib/firebase-types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch with retry
  const fetchWithRetry = async <T,>(
    fetchFn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 500
  ): Promise<T> => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fetchFn();
      } catch (err) {
        if (i === maxRetries) throw err;
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
    throw new Error('Max retries exceeded');
  };

  // Create or update user profile in Firestore
  const createUserProfile = async (firebaseUser: User) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await fetchWithRetry(() => getDocFromServer(userRef));
    
    if (!userSnap.exists()) {
      const newProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> & { createdAt: ReturnType<typeof serverTimestamp>; updatedAt: ReturnType<typeof serverTimestamp> } = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phone: null,
        address: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userRef, newProfile);
      return newProfile as unknown as UserProfile;
    }
    
    return userSnap.data() as UserProfile;
  };

  // Fetch user profile
  const fetchUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await fetchWithRetry(() => getDocFromServer(userRef));
      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Defer Firestore call to prevent deadlock
        setTimeout(() => {
          fetchUserProfile(firebaseUser.uid);
        }, 0);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await createUserProfile(result.user);
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
