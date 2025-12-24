import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Product, ProductImage, ProductColorVariant } from '@/lib/firebase-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImageUpload from '@/components/admin/ImageUpload';
import { Loader2, Plus, X, Image as ImageIcon, Palette, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
}

const BADGE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'new', label: 'New' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'sale', label: 'Sale' },
  { value: 'limited', label: 'Limited Edition' }
];

const FABRIC_OPTIONS = [
  'Cotton',
  'Silk',
  'Linen',
  'Velvet',
  'Polyester',
  'Cotton Blend',
  'Handloom Cotton',
  'Mulmul',
  'Chanderi',
  'Khadi'
];

const PATTERN_OPTIONS = [
  'Block Print',
  'Floral',
  'Geometric',
  'Paisley',
  'Stripes',
  'Solid',
  'Embroidered',
  'Tie-Dye',
  'Batik',
  'Traditional'
];

const initialFormState = {
  name: '',
  description: '',
  shortDescription: '',
  price: 0,
  compareAtPrice: null as number | null,
  sku: '',
  inStock: true,
  stockQuantity: 10,
  isFeatured: false,
  featuredOrder: null as number | null,
  fabric: '',
  material: '',
  sizes: [] as string[],
  dimensions: null as { length: number | null; width: number | null; height: number | null; unit: 'cm' | 'inch' } | null,
  color: '',
  pattern: '',
  careInstructions: '',
  tags: [] as string[],
  badge: null as 'new' | 'bestseller' | 'sale' | 'limited' | null,
  isActive: true,
  images: [] as ProductImage[],
  colorVariants: [] as ProductColorVariant[]
};

export default function ProductForm({
  open,
  onOpenChange,
  product,
  categoryId,
  categoryName,
  subCategoryId,
  subCategoryName
}: ProductFormProps) {
  const { createProduct, updateProduct } = useProducts();
  const { settings } = useStoreSettings();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [activeColorTab, setActiveColorTab] = useState<string | null>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#4B5563');

  // Get size options from store settings
  const sizeOptions = settings?.productSizeOptions || [
    'Single', 'Double', 'Queen', 'King', 'Super King', 'Standard', 'Custom'
  ];

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        sku: product.sku,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity,
        isFeatured: product.isFeatured,
        featuredOrder: product.featuredOrder,
        fabric: product.fabric || '',
        material: product.material || '',
        sizes: product.sizes || [],
        dimensions: product.dimensions,
        color: product.color || '',
        pattern: product.pattern || '',
        careInstructions: product.careInstructions || '',
        tags: product.tags || [],
        badge: product.badge,
        isActive: product.isActive,
        images: product.images || [],
        colorVariants: product.colorVariants || []
      });
      if (product.colorVariants?.length > 0) {
        setActiveColorTab(product.colorVariants[0].id);
      }
    } else {
      setFormData(initialFormState);
      setActiveColorTab(null);
    }
    setActiveTab('basic');
  }, [product, open]);

  const handleSave = async () => {
    if (!formData.name.trim() || formData.price <= 0) return;

    setSaving(true);
    try {
      const productData = {
        ...formData,
        categoryId,
        categoryName,
        subCategoryId,
        subCategoryName,
        primaryImageUrl: formData.images[0]?.url || 
          (formData.colorVariants[0]?.images[0]?.url) || ''
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag)
    });
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Default images handlers
  const handleImageUpload = (url: string) => {
    const newImage: ProductImage = {
      id: `img_${Date.now()}`,
      url,
      alt: formData.name || 'Product image',
      order: formData.images.length,
      isPrimary: formData.images.length === 0
    };
    setFormData({
      ...formData,
      images: [...formData.images, newImage]
    });
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = formData.images
      .filter((img) => img.id !== imageId)
      .map((img, index) => ({
        ...img,
        order: index,
        isPrimary: index === 0
      }));
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  const handleSetPrimaryImage = (imageId: string) => {
    const updatedImages = formData.images.map((img) => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    updatedImages.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    updatedImages.forEach((img, index) => (img.order = index));
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  // Color variant handlers
  const handleAddColorVariant = () => {
    if (!newColorName.trim()) return;
    
    const newVariant: ProductColorVariant = {
      id: `color_${Date.now()}`,
      colorName: newColorName.trim(),
      colorHex: newColorHex,
      images: []
    };
    
    setFormData(prev => ({
      ...prev,
      colorVariants: [...prev.colorVariants, newVariant]
    }));
    setActiveColorTab(newVariant.id);
    setNewColorName('');
    setNewColorHex('#4B5563');
  };

  const handleRemoveColorVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter(v => v.id !== variantId)
    }));
    if (activeColorTab === variantId) {
      setActiveColorTab(formData.colorVariants.find(v => v.id !== variantId)?.id || null);
    }
  };

  const handleColorVariantImageUpload = (variantId: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map(variant => {
        if (variant.id === variantId) {
          const newImage: ProductImage = {
            id: `img_${Date.now()}`,
            url,
            alt: `${formData.name} - ${variant.colorName}`,
            order: variant.images.length,
            isPrimary: variant.images.length === 0
          };
          return {
            ...variant,
            images: [...variant.images, newImage]
          };
        }
        return variant;
      })
    }));
  };

  const handleRemoveColorVariantImage = (variantId: string, imageId: string) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map(variant => {
        if (variant.id === variantId) {
          const updatedImages = variant.images
            .filter(img => img.id !== imageId)
            .map((img, index) => ({
              ...img,
              order: index,
              isPrimary: index === 0
            }));
          return { ...variant, images: updatedImages };
        }
        return variant;
      })
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-serif">
            {product ? 'Edit Product' : 'Add Product'}
          </DialogTitle>
          <DialogDescription>
            {product ? 'Update product details' : `Add a new product to ${categoryName}`}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh] px-6">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 py-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Block Print Cotton Bedsheet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief description for cards (max 100 chars)"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price (₹)</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    min={0}
                    value={formData.compareAtPrice || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      compareAtPrice: e.target.value ? parseFloat(e.target.value) : null 
                    })}
                    placeholder="Original price (for discounts)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Stock keeping unit (e.g., BS-001)"
                />
              </div>

              <div className="space-y-2">
                <Label>Badge</Label>
                <Select
                  value={formData.badge || 'none'}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    badge: value === 'none' ? null : value as any 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BADGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Images Tab - Default Images */}
            <TabsContent value="images" className="space-y-4 py-4 mt-0">
              <div className="space-y-4">
                <div>
                  <Label>Default Product Images</Label>
                  <p className="text-sm text-muted-foreground">
                    These images will be shown when no color is selected. If you add color variants, each color can have its own images.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((image) => (
                    <div
                      key={image.id}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden border-2',
                        image.isPrimary ? 'border-primary' : 'border-border'
                      )}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      {image.isPrimary && (
                        <Badge className="absolute top-2 left-2 text-xs">Primary</Badge>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {!image.isPrimary && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleSetPrimaryImage(image.id)}
                            title="Set as primary"
                          >
                            <ImageIcon className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRemoveImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <ImageUpload
                    storagePath={`products/${product?.id || 'new'}`}
                    onUploadComplete={handleImageUpload}
                    aspectRatio="square"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Variants Tab - Sizes and Colors */}
            <TabsContent value="variants" className="space-y-6 py-4 mt-0">
              {/* Sizes Section */}
              <div className="space-y-3">
                <Label>Available Sizes</Label>
                <p className="text-sm text-muted-foreground">
                  Select all sizes this product is available in
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <label
                      key={size}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all",
                        formData.sizes.includes(size)
                          ? "bg-gold/10 border-gold text-gold"
                          : "bg-background border-border hover:border-gold/50"
                      )}
                    >
                      <Checkbox
                        checked={formData.sizes.includes(size)}
                        onCheckedChange={() => handleSizeToggle(size)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{size}</span>
                    </label>
                  ))}
                </div>
                {formData.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-xs text-muted-foreground">Selected:</span>
                    {formData.sizes.map((size) => (
                      <Badge key={size} variant="secondary" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Variants Section */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Color Variants</Label>
                    <p className="text-sm text-muted-foreground">
                      Add different color options with separate images for each
                    </p>
                  </div>
                </div>

                {/* Add New Color */}
                <div className="flex gap-2 items-end p-4 bg-secondary/30 rounded-lg">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="newColorName" className="text-xs">Color Name</Label>
                    <Input
                      id="newColorName"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="e.g., Indigo Blue"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newColorHex" className="text-xs">Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="newColorHex"
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-9 h-9 rounded cursor-pointer border border-border"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddColorVariant}
                    disabled={!newColorName.trim()}
                    className="h-9"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Color Variant List */}
                {formData.colorVariants.length > 0 && (
                  <div className="space-y-4">
                    {/* Color Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {formData.colorVariants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setActiveColorTab(variant.id)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                            activeColorTab === variant.id
                              ? "bg-gold/10 border-gold"
                              : "bg-background border-border hover:border-gold/50"
                          )}
                        >
                          <div
                            className="w-5 h-5 rounded-full border border-border"
                            style={{ backgroundColor: variant.colorHex }}
                          />
                          <span className="text-sm font-medium">{variant.colorName}</span>
                          <span className="text-xs text-muted-foreground">
                            ({variant.images.length} imgs)
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Active Color Images */}
                    {activeColorTab && (
                      <div className="p-4 border border-border rounded-lg space-y-4">
                        {(() => {
                          const variant = formData.colorVariants.find(v => v.id === activeColorTab);
                          if (!variant) return null;

                          return (
                            <>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: variant.colorHex }}
                                  />
                                  <span className="font-medium">{variant.colorName}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveColorVariant(variant.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>

                              <div className="grid grid-cols-3 gap-3">
                                {variant.images.map((image) => (
                                  <div
                                    key={image.id}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-border"
                                  >
                                    <img
                                      src={image.url}
                                      alt={image.alt}
                                      className="w-full h-full object-cover"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2 h-6 w-6"
                                      onClick={() => handleRemoveColorVariantImage(variant.id, image.id)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}

                                <ImageUpload
                                  storagePath={`products/${product?.id || 'new'}/colors/${variant.id}`}
                                  onUploadComplete={(url) => handleColorVariantImageUpload(variant.id, url)}
                                  aspectRatio="square"
                                />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Details Tab (Home Decor Attributes) */}
            <TabsContent value="details" className="space-y-4 py-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fabric</Label>
                  <Select
                    value={formData.fabric}
                    onValueChange={(value) => setFormData({ ...formData, fabric: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fabric" />
                    </SelectTrigger>
                    <SelectContent>
                      {FABRIC_OPTIONS.map((fabric) => (
                        <SelectItem key={fabric} value={fabric}>
                          {fabric}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material Details</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g., 300 TC, 180 GSM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Primary Color (Legacy)</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Indigo Blue"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use Color Variants tab for multiple colors
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Pattern</Label>
                  <Select
                    value={formData.pattern}
                    onValueChange={(value) => setFormData({ ...formData, pattern: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {PATTERN_OPTIONS.map((pattern) => (
                        <SelectItem key={pattern} value={pattern}>
                          {pattern}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dimensions</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="number"
                    placeholder="Length"
                    value={formData.dimensions?.length || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: {
                        ...(formData.dimensions || { length: null, width: null, height: null, unit: 'cm' }),
                        length: e.target.value ? parseFloat(e.target.value) : null
                      }
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Width"
                    value={formData.dimensions?.width || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: {
                        ...(formData.dimensions || { length: null, width: null, height: null, unit: 'cm' }),
                        width: e.target.value ? parseFloat(e.target.value) : null
                      }
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Height"
                    value={formData.dimensions?.height || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: {
                        ...(formData.dimensions || { length: null, width: null, height: null, unit: 'cm' }),
                        height: e.target.value ? parseFloat(e.target.value) : null
                      }
                    })}
                  />
                  <Select
                    value={formData.dimensions?.unit || 'cm'}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      dimensions: {
                        ...(formData.dimensions || { length: null, width: null, height: null, unit: 'cm' }),
                        unit: value as 'cm' | 'inch'
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="inch">inch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="careInstructions">Care Instructions</Label>
                <Textarea
                  id="careInstructions"
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  placeholder="e.g., Machine wash cold, tumble dry low"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4 py-4 mt-0">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label>In Stock</Label>
                  <p className="text-sm text-muted-foreground">
                    Is this product available for purchase?
                  </p>
                </div>
                <Switch
                  checked={formData.inStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min={0}
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                  className="w-32"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Inactive products won't appear in the store
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !formData.name.trim() || formData.price <= 0}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : product ? (
              'Save Changes'
            ) : (
              'Add Product'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
