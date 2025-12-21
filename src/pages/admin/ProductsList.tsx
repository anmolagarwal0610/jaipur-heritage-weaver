import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useProducts } from '@/hooks/useProducts';
import { Category, Product } from '@/lib/firebase-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ProductForm from './ProductForm';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Star, 
  StarOff, 
  Loader2,
  ArrowLeft,
  Package,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductsList() {
  const { categoryId, subCategoryId } = useParams<{ categoryId: string; subCategoryId: string }>();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<{ id: string; name: string } | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const {
    products: allProducts,
    featuredProducts,
    loading: productsLoading,
    deleteProduct,
    toggleFeatured,
    updateFeaturedOrder
  } = useProducts({ categoryId });

  // Filter products by subcategory
  const products = subCategoryId 
    ? allProducts.filter(p => p.subCategoryId === subCategoryId)
    : allProducts;

  // Fetch category and subcategory details
  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      try {
        const categoryRef = doc(db, 'categories', categoryId);
        const categorySnap = await getDoc(categoryRef);
        
        if (categorySnap.exists()) {
          setCategory({ id: categorySnap.id, ...categorySnap.data() } as Category);
        }

        if (subCategoryId) {
          const subCategoryRef = doc(db, 'subcategories', subCategoryId);
          const subCategorySnap = await getDoc(subCategoryRef);
          
          if (subCategorySnap.exists()) {
            const data = subCategorySnap.data();
            setSubCategory({ id: subCategorySnap.id, name: data.name });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchData();
  }, [categoryId, subCategoryId]);

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id, categoryId);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleToggleFeatured = async (product: Product) => {
    await toggleFeatured(product.id, product.isFeatured, categoryId);
  };

  const handleFeaturedOrderChange = async (product: Product, newOrder: number) => {
    if (categoryId && newOrder >= 1 && newOrder <= featuredProducts.length) {
      await updateFeaturedOrder(product.id, newOrder, categoryId);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (categoryLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category || !subCategory) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Category or Sub-category not found</p>
        <Button variant="link" onClick={() => navigate('/dashboard/admin/products')}>
          Go back to categories
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/dashboard/admin/categories/${categoryId}/subcategories`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              {subCategory.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {category.name} • {products.length} products • {featuredProducts.filter(p => p.subCategoryId === subCategoryId).length}/{category.featuredProductLimit} featured
            </p>
          </div>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Featured Products Summary */}
      {featuredProducts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-gold" />
              Featured Products ({featuredProducts.length}/{category.featuredProductLimit})
            </h3>
            <div className="flex flex-wrap gap-2">
              {featuredProducts.map((product, index) => (
                <Badge key={product.id} variant="secondary" className="gap-1">
                  #{index + 1} {product.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center hidden md:table-cell">Stock</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-center hidden md:table-cell">Badge</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No products in this category</p>
                    <Button variant="link" onClick={openAddDialog} className="mt-2">
                      Add your first product
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        {product.primaryImageUrl ? (
                          <img
                            src={product.primaryImageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="font-medium">{formatPrice(product.price)}</p>
                        {product.compareAtPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.compareAtPrice)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <Badge variant={product.inStock ? 'outline' : 'destructive'}>
                        {product.inStock ? product.stockQuantity : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {product.isFeatured ? (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gold"
                            onClick={() => handleToggleFeatured(product)}
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            max={featuredProducts.length}
                            value={product.featuredOrder || 1}
                            onChange={(e) => handleFeaturedOrderChange(product, parseInt(e.target.value))}
                            className="w-14 h-8 text-center text-sm"
                          />
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-gold"
                          onClick={() => handleToggleFeatured(product)}
                          disabled={featuredProducts.length >= category.featuredProductLimit}
                          title={
                            featuredProducts.length >= category.featuredProductLimit
                              ? `Maximum ${category.featuredProductLimit} featured products`
                              : 'Make featured'
                          }
                        >
                          <StarOff className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      {product.badge ? (
                        <Badge variant="secondary" className="capitalize">
                          {product.badge}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        categoryId={categoryId!}
        categoryName={category.name}
        subCategoryId={subCategoryId!}
        subCategoryName={subCategory.name}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
