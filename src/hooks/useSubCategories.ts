import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  collection, 
  query, 
  orderBy, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubCategory, SubCategoryFormData } from '@/lib/firebase-types';
import { useToast } from '@/hooks/use-toast';

const COLLECTION_NAME = 'subcategories';

// Fetch subcategories from Firestore
async function fetchSubCategories(categoryId?: string): Promise<SubCategory[]> {
  try {
    let q;
    if (categoryId) {
      // Simple query without orderBy to avoid composite index requirement
      q = query(
        collection(db, COLLECTION_NAME), 
        where('categoryId', '==', categoryId)
      );
    } else {
      q = query(collection(db, COLLECTION_NAME));
    }
    const snapshot = await getDocs(q);
    const subcategories = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<SubCategory, 'id'>)
    }));
    // Sort client-side to avoid index requirement
    return subcategories.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
}

export function useSubCategories(categoryId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query for caching
  const { data: subCategories = [], isLoading: loading, error } = useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => fetchSubCategories(categoryId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Invalidate cache to refresh data
  const invalidateSubCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['subcategories'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  // Create subcategory
  const createSubCategory = useCallback(async (data: Partial<SubCategoryFormData>) => {
    try {
      const slug = data.slug || generateSlug(data.name || '');
      
      // Query current count BEFORE adding new document
      let currentCount = 0;
      if (data.categoryId) {
        const currentCountSnapshot = await getDocs(query(
          collection(db, COLLECTION_NAME),
          where('categoryId', '==', data.categoryId)
        ));
        currentCount = currentCountSnapshot.size;
      }
      
      const subCategoryData: Omit<SubCategory, 'id'> = {
        name: data.name || '',
        slug,
        description: data.description || '',
        imageUrl: data.imageUrl || null,
        categoryId: data.categoryId || '',
        categoryName: data.categoryName || '',
        showBadgeOnProducts: data.showBadgeOnProducts !== false,
        order: currentCount + 1,
        productCount: 0,
        isActive: data.isActive !== false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, COLLECTION_NAME), subCategoryData);

      // Update parent category subCategoryCount with correct value
      if (data.categoryId) {
        const categoryRef = doc(db, 'categories', data.categoryId);
        await updateDoc(categoryRef, {
          subCategoryCount: currentCount + 1,
          updatedAt: Timestamp.now()
        });
      }

      invalidateSubCategories();
      
      toast({
        title: 'Sub-category created',
        description: `${data.name} has been added successfully`
      });

      return true;
    } catch (err: any) {
      console.error('Error creating subcategory:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to create sub-category',
        variant: 'destructive'
      });
      return false;
    }
  }, [subCategories.length, toast, queryClient]);

  // Update subcategory
  const updateSubCategory = useCallback(async (id: string, data: Partial<SubCategoryFormData>) => {
    try {
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      };

      // If slug needs to be regenerated
      if (data.name && !data.slug) {
        updateData.slug = generateSlug(data.name);
      }

      await updateDoc(doc(db, COLLECTION_NAME, id), updateData);
      invalidateSubCategories();
      
      toast({
        title: 'Sub-category updated',
        description: 'Changes have been saved'
      });

      return true;
    } catch (err: any) {
      console.error('Error updating subcategory:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update sub-category',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast, queryClient]);

  // Delete subcategory
  const deleteSubCategory = useCallback(async (id: string, categoryId: string) => {
    try {
      // Check if subcategory has products
      const productsQuery = query(
        collection(db, 'products'),
        where('subCategoryId', '==', id)
      );
      const productsSnapshot = await getDocs(productsQuery);
      
      if (!productsSnapshot.empty) {
        toast({
          title: 'Cannot delete',
          description: 'This sub-category has products. Remove or reassign products first.',
          variant: 'destructive'
        });
        return false;
      }

      // Get current count BEFORE deleting
      let currentCount = 0;
      if (categoryId) {
        const currentCountSnapshot = await getDocs(query(
          collection(db, COLLECTION_NAME),
          where('categoryId', '==', categoryId)
        ));
        currentCount = currentCountSnapshot.size;
      }

      await deleteDoc(doc(db, COLLECTION_NAME, id));

      // Update parent category subCategoryCount with correct value
      if (categoryId) {
        const categoryRef = doc(db, 'categories', categoryId);
        await updateDoc(categoryRef, {
          subCategoryCount: Math.max(0, currentCount - 1),
          updatedAt: Timestamp.now()
        });
      }

      invalidateSubCategories();
      
      toast({
        title: 'Sub-category deleted',
        description: 'The sub-category has been removed'
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting subcategory:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete sub-category',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast, queryClient]);

  return {
    subCategories,
    loading,
    error: error?.message || null,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
  };
}
