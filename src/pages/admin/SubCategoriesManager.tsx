import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSubCategories } from '@/hooks/useSubCategories';
import { Category, SubCategory } from '@/lib/firebase-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ImageUpload from '@/components/admin/ImageUpload';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  ArrowLeft,
  FolderOpen,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';

export default function SubCategoriesManager() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<SubCategory | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    subCategories,
    loading: subCategoriesLoading,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useSubCategories(categoryId);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true,
    showBadgeOnProducts: true
  });

  // Fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      try {
        const categoryRef = doc(db, 'categories', categoryId);
        const categorySnap = await getDoc(categoryRef);
        
        if (categorySnap.exists()) {
          setCategory({ id: categorySnap.id, ...categorySnap.data() } as Category);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      isActive: true,
      showBadgeOnProducts: true
    });
    setEditingSubCategory(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      description: subCategory.description,
      imageUrl: subCategory.imageUrl || '',
      isActive: subCategory.isActive,
      showBadgeOnProducts: subCategory.showBadgeOnProducts !== false
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (subCategory: SubCategory) => {
    setSubCategoryToDelete(subCategory);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !categoryId || !category) return;
    
    setSaving(true);
    
    if (editingSubCategory) {
      await updateSubCategory(editingSubCategory.id, formData);
    } else {
      await createSubCategory({
        ...formData,
        categoryId,
        categoryName: category.name
      });
    }
    
    setSaving(false);
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (!subCategoryToDelete || !categoryId) return;
    
    await deleteSubCategory(subCategoryToDelete.id, categoryId);
    setDeleteDialogOpen(false);
    setSubCategoryToDelete(null);
  };

  if (categoryLoading || subCategoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Category not found</p>
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
            onClick={() => navigate('/dashboard/admin/products')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              {category.name} - Sub-Categories
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {subCategories.length} sub-categories
            </p>
          </div>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Sub-Category
        </Button>
      </div>

      {/* Sub-Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No sub-categories yet</p>
                    <Button variant="link" onClick={openAddDialog} className="mt-2">
                      Create your first sub-category
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                subCategories.map((subCategory) => (
                  <TableRow 
                    key={subCategory.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/dashboard/admin/categories/${categoryId}/subcategories/${subCategory.id}/products`)}
                  >
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        {subCategory.imageUrl ? (
                          <img
                            src={subCategory.imageUrl}
                            alt={subCategory.name}
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
                        <p className="font-medium text-foreground">{subCategory.name}</p>
                        <p className="text-xs text-muted-foreground">/{subCategory.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                        {subCategory.description || '—'}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      >
                        {subCategory.productCount} <ChevronRight className="h-3 w-3 ml-1 inline" />
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={subCategory.isActive ? 'default' : 'secondary'}>
                        {subCategory.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(subCategory);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(subCategory);
                          }}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingSubCategory ? 'Edit Sub-Category' : 'Add Sub-Category'}
            </DialogTitle>
            <DialogDescription>
              {editingSubCategory 
                ? 'Update the sub-category details below' 
                : `Create a new sub-category in ${category.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Sub-Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., King Size"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this sub-category"
                rows={3}
              />
            </div>

            {/* Image */}
            <ImageUpload
              storagePath={`subcategories/${editingSubCategory?.id || 'new'}`}
              currentImageUrl={formData.imageUrl || null}
              onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
              onDelete={() => setFormData({ ...formData, imageUrl: '' })}
              label="Sub-Category Image (Optional)"
              aspectRatio="video"
            />

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Only active sub-categories are visible in the shop
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            {/* Show Badge on Products */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Badge on Products</Label>
                <p className="text-sm text-muted-foreground">
                  Display this sub-category as a badge on product cards in the shop
                </p>
              </div>
              <Switch
                checked={formData.showBadgeOnProducts}
                onCheckedChange={(checked) => setFormData({ ...formData, showBadgeOnProducts: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.name.trim() || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingSubCategory ? 'Save Changes' : 'Create Sub-Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sub-Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subCategoryToDelete?.name}"? 
              This action cannot be undone. Sub-categories with products cannot be deleted.
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
