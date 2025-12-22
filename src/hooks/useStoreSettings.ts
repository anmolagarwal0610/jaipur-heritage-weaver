import { useState, useEffect } from 'react';
import { 
  doc, 
  onSnapshot,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StoreSettings } from '@/lib/firebase-types';

const defaultSettings = {
  storeName: 'Jaipur Touch',
  storeEmail: 'info@jaipurtouch.com',
  storePhone: '+91 98765 43210',
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: 999,
  defaultShippingCost: 99,
  maxRockstarCategories: 6,
  maxFeaturedProducts: 4,
  whatsappEnabled: true,
  whatsappNumber: '919887238849',
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<typeof defaultSettings & { id: string }>(
    { id: 'config', ...defaultSettings }
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const settingsRef = doc(db, 'store_settings', 'config');

    const unsubscribe = onSnapshot(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setSettings({
            id: snapshot.id,
            ...defaultSettings,
            ...data,
          });
        } else {
          setSettings({ id: 'config', ...defaultSettings });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching store settings:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateSettings = async (updates: Partial<typeof defaultSettings>) => {
    try {
      const settingsRef = doc(db, 'store_settings', 'config');
      await setDoc(settingsRef, {
        ...settings,
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err: any) {
      console.error('Error updating store settings:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
  };
}
