import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, ProductFormData } from '@/lib/firebase-types';
import { useToast } from '@/hooks/use-toast';

interface UseProductsOptions {
  categoryId?: string;
  featuredOnly?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { categoryId, featuredOnly } = options;

  // Real-time subscription to products
  useEffect(() => {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    if (categoryId) {
      q = query(
        collection(db, 'products'),
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
    }

    if (featuredOnly) {
      q = query(
        collection(db, 'products'),
        where('isFeatured', '==', true),
        orderBy('featuredOrder', 'asc')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive'
        });
      }
    );

    return () => unsubscribe();
  }, [categoryId, featuredOnly, toast]);

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
  }, [toast]);

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
  }, [toast]);

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
  }, [toast]);

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
  }, [toast]);

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
      const featuredProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

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
    } catch (error: any) {
      console.error('Error updating featured order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive'
      });
    }
  }, [toast]);

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
