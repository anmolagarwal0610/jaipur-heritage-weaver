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
import { Category, CategoryFormData } from '@/lib/firebase-types';
import { useToast } from '@/hooks/use-toast';

const COLLECTION_NAME = 'categories';
const MAX_ROCKSTAR_CATEGORIES = 6;

// Fetch categories from Firestore
async function fetchCategories(): Promise<Category[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Category, 'id'>)
  }));
}

export function useCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query for caching and instant back navigation
  const { data: categories = [], isLoading: loading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get rockstar categories (sorted by rockstarOrder)
  const rockstarCategories = categories
    .filter((cat) => cat.isRockstar && cat.isActive)
    .sort((a, b) => (a.rockstarOrder || 0) - (b.rockstarOrder || 0));

  // Check if can add more rockstar categories
  const canAddRockstar = rockstarCategories.length < MAX_ROCKSTAR_CATEGORIES;

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Invalidate cache to refresh data
  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  // Create category
  const createCategory = useCallback(async (data: Partial<CategoryFormData>) => {
    try {
      const slug = data.slug || generateSlug(data.name || '');
      const order = categories.length + 1;
      
      const categoryData: Omit<Category, 'id'> = {
        name: data.name || '',
        slug,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        isRockstar: data.isRockstar || false,
        rockstarOrder: data.isRockstar ? (rockstarCategories.length + 1) : null,
        rockstarImageUrl: data.rockstarImageUrl || null,
        featuredProductLimit: data.featuredProductLimit || 4,
        order,
        productCount: 0,
        isActive: data.isActive !== false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, COLLECTION_NAME), categoryData);
      invalidateCategories();
      
      toast({
        title: 'Category created',
        description: `${data.name} has been added successfully`
      });

      return true;
    } catch (err: any) {
      console.error('Error creating category:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to create category',
        variant: 'destructive'
      });
      return false;
    }
  }, [categories.length, rockstarCategories.length, toast, queryClient]);

  // Update category
  const updateCategory = useCallback(async (id: string, data: Partial<CategoryFormData>) => {
    try {
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      };

      // If slug needs to be regenerated
      if (data.name && !data.slug) {
        updateData.slug = generateSlug(data.name);
      }

      // Handle rockstar order when toggling
      if (data.isRockstar === false) {
        updateData.rockstarOrder = null;
        updateData.rockstarImageUrl = null;
      } else if (data.isRockstar === true) {
        // Assign next available order
        const currentCategory = categories.find(c => c.id === id);
        if (!currentCategory?.isRockstar) {
          updateData.rockstarOrder = rockstarCategories.length + 1;
        }
      }

      await updateDoc(doc(db, COLLECTION_NAME, id), updateData);
      invalidateCategories();
      
      toast({
        title: 'Category updated',
        description: 'Changes have been saved'
      });

      return true;
    } catch (err: any) {
      console.error('Error updating category:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update category',
        variant: 'destructive'
      });
      return false;
    }
  }, [categories, rockstarCategories.length, toast, queryClient]);

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      // Check if category has products
      const productsQuery = query(
        collection(db, 'products'),
        where('categoryId', '==', id)
      );
      const productsSnapshot = await getDocs(productsQuery);
      
      if (!productsSnapshot.empty) {
        toast({
          title: 'Cannot delete',
          description: 'This category has products. Remove or reassign products first.',
          variant: 'destructive'
        });
        return false;
      }

      await deleteDoc(doc(db, COLLECTION_NAME, id));
      invalidateCategories();
      
      toast({
        title: 'Category deleted',
        description: 'The category has been removed'
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting category:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete category',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast, queryClient]);

  // Update rockstar order
  const updateRockstarOrder = useCallback(async (categoryId: string, newOrder: number) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      if (!category?.isRockstar) return false;

      const currentOrder = category.rockstarOrder || 0;
      if (newOrder === currentOrder) return true;

      // Validate order range
      if (newOrder < 1 || newOrder > rockstarCategories.length) {
        toast({
          title: 'Invalid order',
          description: `Order must be between 1 and ${rockstarCategories.length}`,
          variant: 'destructive'
        });
        return false;
      }

      // Shift other categories
      const updates: Promise<void>[] = [];
      
      rockstarCategories.forEach((cat) => {
        if (cat.id === categoryId) return;
        
        const catOrder = cat.rockstarOrder || 0;
        let newCatOrder = catOrder;

        if (currentOrder < newOrder) {
          // Moving down: shift categories up
          if (catOrder > currentOrder && catOrder <= newOrder) {
            newCatOrder = catOrder - 1;
          }
        } else {
          // Moving up: shift categories down
          if (catOrder >= newOrder && catOrder < currentOrder) {
            newCatOrder = catOrder + 1;
          }
        }

        if (newCatOrder !== catOrder) {
          updates.push(
            updateDoc(doc(db, COLLECTION_NAME, cat.id), {
              rockstarOrder: newCatOrder,
              updatedAt: Timestamp.now()
            })
          );
        }
      });

      // Update the target category
      updates.push(
        updateDoc(doc(db, COLLECTION_NAME, categoryId), {
          rockstarOrder: newOrder,
          updatedAt: Timestamp.now()
        })
      );

      await Promise.all(updates);
      invalidateCategories();
      
      toast({
        title: 'Order updated',
        description: 'Rockstar category order has been changed'
      });

      return true;
    } catch (err: any) {
      console.error('Error updating rockstar order:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update order',
        variant: 'destructive'
      });
      return false;
    }
  }, [categories, rockstarCategories, toast, queryClient]);

  return {
    categories,
    rockstarCategories,
    loading,
    error: error?.message || null,
    canAddRockstar,
    maxRockstarCategories: MAX_ROCKSTAR_CATEGORIES,
    createCategory,
    updateCategory,
    deleteCategory,
    updateRockstarOrder
  };
}
