import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  orderBy,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  getDocs,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, ProductFormData } from '@/lib/firebase-types';
import { useToast } from '@/hooks/use-toast';

interface UseProductsOptions {
  categoryId?: string;
  featuredOnly?: boolean;
}

// Fetch products from Firestore
async function fetchProducts(options: UseProductsOptions = {}): Promise<Product[]> {
  const { categoryId, featuredOnly } = options;
  
  let q;
  
  if (featuredOnly) {
    q = query(
      collection(db, 'products'),
      where('isFeatured', '==', true),
      orderBy('featuredOrder', 'asc')
    );
  } else if (categoryId) {
    q = query(
      collection(db, 'products'),
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Product, 'id'>)
  }));
}

// Fetch single product by ID
async function fetchProductById(productId: string): Promise<Product | null> {
  const docRef = doc(db, 'products', productId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...(docSnap.data() as Omit<Product, 'id'>)
  };
}

// Fetch related products by category
async function fetchRelatedProducts(categoryId: string, excludeProductId: string): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('categoryId', '==', categoryId),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Product, 'id'>)
    }))
    .filter(p => p.id !== excludeProductId)
    .slice(0, 4);
}

export function useProducts(options: UseProductsOptions = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { categoryId, featuredOnly } = options;

  // Build query key based on options
  const queryKey = ['products', { categoryId, featuredOnly }];

  // Use React Query for caching
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey,
    queryFn: () => fetchProducts(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Invalidate all product queries
  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['product'] });
  };

  // Create product
  const createProduct = useCallback(async (data: Partial<ProductFormData>) => {
    try {
      const slug = data.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
      
      const productData = {
        ...data,
        slug,
        primaryImageUrl: data.images?.[0]?.url || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);

      // Update category product count
      if (data.categoryId) {
        const categoryRef = doc(db, 'categories', data.categoryId);
        await updateDoc(categoryRef, {
          productCount: increment(1),
          updatedAt: serverTimestamp()
        });
      }

      invalidateProducts();

      toast({
        title: 'Product created',
        description: `${data.name} has been added`
      });

      return docRef.id;
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast, queryClient]);

  // Update product
  const updateProduct = useCallback(async (productId: string, data: Partial<ProductFormData>) => {
    try {
      const productRef = doc(db, 'products', productId);
      
      const updateData: any = {
        ...data,
        updatedAt: serverTimestamp()
      };

      // Update primary image if images changed
      if (data.images && data.images.length > 0) {
        updateData.primaryImageUrl = data.images[0].url;
      }

      await updateDoc(productRef, updateData);
      invalidateProducts();

      toast({
        title: 'Product updated',
        description: 'Changes have been saved'
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast, queryClient]);

  // Delete product
  const deleteProduct = useCallback(async (productId: string, categoryId?: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));

      // Update category product count
      if (categoryId) {
        const categoryRef = doc(db, 'categories', categoryId);
        await updateDoc(categoryRef, {
          productCount: increment(-1),
          updatedAt: serverTimestamp()
        });
      }

      invalidateProducts();

      toast({
        title: 'Product deleted',
        description: 'The product has been removed'
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast, queryClient]);

  // Toggle featured status
  const toggleFeatured = useCallback(async (productId: string, currentFeatured: boolean, categoryId?: string) => {
    try {
      const productRef = doc(db, 'products', productId);
      
      if (currentFeatured) {
        // Un-feature: remove from featured
        await updateDoc(productRef, {
          isFeatured: false,
          featuredOrder: null,
          updatedAt: serverTimestamp()
        });
      } else {
        // Feature: add to end of featured list
        let maxOrder = 0;
        
        if (categoryId) {
          const featuredQuery = query(
            collection(db, 'products'),
            where('categoryId', '==', categoryId),
            where('isFeatured', '==', true)
          );
          const snapshot = await getDocs(featuredQuery);
          snapshot.forEach((doc) => {
            const order = doc.data().featuredOrder || 0;
            if (order > maxOrder) maxOrder = order;
          });
        }

        await updateDoc(productRef, {
          isFeatured: true,
          featuredOrder: maxOrder + 1,
          updatedAt: serverTimestamp()
        });
      }

      invalidateProducts();

      toast({
        title: currentFeatured ? 'Removed from featured' : 'Added to featured',
        description: currentFeatured 
          ? 'Product is no longer featured' 
          : 'Product is now featured on homepage'
      });
    } catch (error: any) {
      console.error('Error toggling featured:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update featured status',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast, queryClient]);

  // Update featured order
  const updateFeaturedOrder = useCallback(async (productId: string, newOrder: number, categoryId: string) => {
    try {
      const batch = writeBatch(db);
      
      // Get all featured products in this category
      const featuredQuery = query(
        collection(db, 'products'),
        where('categoryId', '==', categoryId),
        where('isFeatured', '==', true),
        orderBy('featuredOrder', 'asc')
      );
      
      const snapshot = await getDocs(featuredQuery);
      const featuredProducts = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Product, 'id'>)
      }));

      // Find current product and its old order
      const currentProduct = featuredProducts.find(p => p.id === productId);
      if (!currentProduct) return;
      
      const oldOrder = currentProduct.featuredOrder || 1;
      if (oldOrder === newOrder) return;

      // Reorder products
      featuredProducts.forEach((product) => {
        if (product.id === productId) {
          batch.update(doc(db, 'products', product.id), { 
            featuredOrder: newOrder,
            updatedAt: serverTimestamp()
          });
        } else {
          const order = product.featuredOrder || 1;
          let adjustedOrder = order;
          
          if (oldOrder < newOrder) {
            // Moving down: shift products between old and new positions up
            if (order > oldOrder && order <= newOrder) {
              adjustedOrder = order - 1;
            }
          } else {
            // Moving up: shift products between new and old positions down
            if (order >= newOrder && order < oldOrder) {
              adjustedOrder = order + 1;
            }
          }
          
          if (adjustedOrder !== order) {
            batch.update(doc(db, 'products', product.id), { 
              featuredOrder: adjustedOrder,
              updatedAt: serverTimestamp()
            });
          }
        }
      });

      await batch.commit();
      invalidateProducts();
    } catch (error: any) {
      console.error('Error updating featured order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive'
      });
    }
  }, [toast, queryClient]);

  // Get featured products for a category
  const featuredProducts = products.filter(p => p.isFeatured).sort((a, b) => 
    (a.featuredOrder || 999) - (b.featuredOrder || 999)
  );

  return {
    products,
    featuredProducts,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    updateFeaturedOrder
  };
}

// Hook for fetching a single product by ID
export function useProduct(productId: string | undefined) {
  const { data: product, isLoading: loading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productId ? fetchProductById(productId) : null,
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { product, loading, error };
}

// Hook for fetching related products
export function useRelatedProducts(categoryId: string | undefined, excludeProductId: string | undefined) {
  const { data: relatedProducts = [], isLoading: loading } = useQuery({
    queryKey: ['relatedProducts', categoryId, excludeProductId],
    queryFn: () => 
      categoryId && excludeProductId 
        ? fetchRelatedProducts(categoryId, excludeProductId) 
        : [],
    enabled: !!categoryId && !!excludeProductId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { relatedProducts, loading };
}
