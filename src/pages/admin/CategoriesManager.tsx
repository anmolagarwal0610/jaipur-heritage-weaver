import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/lib/firebase-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Star, 
  StarOff, 
  Loader2,
  FolderOpen,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CategoriesManager() {
  const navigate = useNavigate();
  const {
    categories,
    rockstarCategories,
    loading,
    canAddRockstar,
    maxRockstarCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateRockstarOrder
  } = useCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isRockstar: false,
    rockstarImageUrl: '',
    featuredProductLimit: 4,
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      isRockstar: false,
      rockstarImageUrl: '',
      featuredProductLimit: 4,
      isActive: true
    });
    setEditingCategory(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      isRockstar: category.isRockstar,
      rockstarImageUrl: category.rockstarImageUrl || '',
      featuredProductLimit: category.featuredProductLimit,
      isActive: category.isActive
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    
    setSaving(true);
    
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await createCategory(formData);
    }
    
    setSaving(false);
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    await deleteCategory(categoryToDelete.id);
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleToggleRockstar = async (category: Category) => {
    if (!category.isRockstar && !canAddRockstar) {
      return;
    }
    
    await updateCategory(category.id, {
      isRockstar: !category.isRockstar
    });
  };

  const handleRockstarOrderChange = async (category: Category, newOrder: number) => {
    if (newOrder >= 1 && newOrder <= rockstarCategories.length) {
      await updateRockstarOrder(category.id, newOrder);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage product categories and Rockstar categories for homepage
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Rockstar Categories Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-gold" />
            Rockstar Categories
            <Badge variant="secondary" className="ml-2">
              {rockstarCategories.length}/{maxRockstarCategories}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rockstarCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No Rockstar categories yet. Mark categories as Rockstar to feature them on the homepage.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {rockstarCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                >
                  {cat.rockstarImageUrl || cat.imageUrl ? (
                    <img
                      src={cat.rockstarImageUrl || cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-xs font-medium text-white truncate">{cat.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs h-5">
                        #{cat.rockstarOrder}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="text-center">Sub-Categories</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Featured Limit</TableHead>
                <TableHead className="text-center">Rockstar</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No categories yet</p>
                    <Button variant="link" onClick={openAddDialog} className="mt-2">
                      Create your first category
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow 
                    key={category.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/dashboard/admin/categories/${category.id}/subcategories`)}
                  >
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
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
                        <p className="font-medium text-foreground">{category.name}</p>
                        <p className="text-xs text-muted-foreground">/{category.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                        {category.description || '—'}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/admin/categories/${category.id}/subcategories`);
                        }}
                      >
                        {category.subCategoryCount || 0} subs <ChevronRight className="h-3 w-3 ml-1 inline" />
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {category.productCount} products
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{category.featuredProductLimit}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {category.isRockstar ? (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gold"
                            onClick={() => handleToggleRockstar(category)}
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            max={rockstarCategories.length}
                            value={category.rockstarOrder || 1}
                            onChange={(e) => handleRockstarOrderChange(category, parseInt(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="w-14 h-8 text-center text-sm"
                          />
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-gold"
                          onClick={() => handleToggleRockstar(category)}
                          disabled={!canAddRockstar}
                          title={!canAddRockstar ? `Maximum ${maxRockstarCategories} Rockstar categories` : 'Make Rockstar'}
                        >
                          <StarOff className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={category.isActive ? 'default' : 'secondary'}>
                        {category.isActive ? 'Active' : 'Inactive'}
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
                            openEditDialog(category);
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
                            openDeleteDialog(category);
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the category details below' 
                : 'Create a new product category'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bedsheets"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>

            {/* Category Image */}
            <ImageUpload
              storagePath={`categories/${editingCategory?.id || 'new'}`}
              currentImageUrl={formData.imageUrl || null}
              onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
              onDelete={() => setFormData({ ...formData, imageUrl: '' })}
              label="Category Image"
              aspectRatio="video"
            />

            {/* Rockstar Settings */}
            <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gold" />
                    Rockstar Category
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Feature this category on the homepage
                  </p>
                </div>
                <Switch
                  checked={formData.isRockstar}
                  onCheckedChange={(checked) => setFormData({ ...formData, isRockstar: checked })}
                  disabled={!editingCategory?.isRockstar && !canAddRockstar}
                />
              </div>

              {formData.isRockstar && (
                <ImageUpload
                  storagePath={`categories/${editingCategory?.id || 'new'}/rockstar`}
                  currentImageUrl={formData.rockstarImageUrl || null}
                  onUploadComplete={(url) => setFormData({ ...formData, rockstarImageUrl: url })}
                  onDelete={() => setFormData({ ...formData, rockstarImageUrl: '' })}
                  label="Rockstar Cover Image (for homepage display)"
                  aspectRatio="square"
                />
              )}
            </div>

            {/* Featured Product Limit */}
            <div className="space-y-2">
              <Label htmlFor="featuredLimit">Featured Products Limit</Label>
              <p className="text-sm text-muted-foreground">
                Maximum number of featured products from this category
              </p>
              <Input
                id="featuredLimit"
                type="number"
                min={1}
                max={12}
                value={formData.featuredProductLimit}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  featuredProductLimit: parseInt(e.target.value) || 4 
                })}
                className="w-24"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Inactive categories won't appear on the store
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !formData.name.trim()}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? 
              This action cannot be undone.
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
