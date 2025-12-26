import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Product, ProductImage, ProductColorVariant, ProductSizeVariant, ColorSizeInventory } from '@/lib/firebase-types';
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
import { Loader2, Plus, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  'Cotton', 'Silk', 'Linen', 'Velvet', 'Polyester', 'Cotton Blend',
  'Handloom Cotton', 'Mulmul', 'Chanderi', 'Khadi'
];

const PATTERN_OPTIONS = [
  'Block Print', 'Floral', 'Geometric', 'Paisley', 'Stripes',
  'Solid', 'Embroidered', 'Tie-Dye', 'Batik', 'Traditional'
];

interface FormState {
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  inStock: boolean;
  isFeatured: boolean;
  featuredOrder: number | null;
  fabric: string;
  material: string;
  pattern: string;
  careInstructions: string;
  tags: string[];
  badge: 'new' | 'bestseller' | 'sale' | 'limited' | null;
  isActive: boolean;
  sizeVariants: ProductSizeVariant[];
  colorVariants: ProductColorVariant[];
}

const initialFormState: FormState = {
  name: '',
  description: '',
  shortDescription: '',
  sku: '',
  inStock: true,
  isFeatured: false,
  featuredOrder: null,
  fabric: '',
  material: '',
  pattern: '',
  careInstructions: '',
  tags: [],
  badge: null,
  isActive: true,
  sizeVariants: [],
  colorVariants: []
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
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [expandedColorId, setExpandedColorId] = useState<string | null>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#4B5563');

  // Get size options from store settings
  const sizeOptions = settings?.productSizeOptions || [
    'Single', 'Double', 'Queen', 'King', 'Super King', 'Standard'
  ];

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      // Migrate legacy data to new structure
      let sizeVariants = product.sizeVariants || [];
      let colorVariants = product.colorVariants || [];

      // If no size variants but has legacy sizes/price, migrate
      if (sizeVariants.length === 0 && product.sizes && product.sizes.length > 0) {
        sizeVariants = product.sizes.map((size, idx) => ({
          id: `size_${idx}`,
          sizeName: size,
          price: product.price || 0,
          compareAtPrice: product.compareAtPrice || null
        }));
      } else if (sizeVariants.length === 0 && product.price) {
        // No sizes but has price - create a default "Standard" size
        sizeVariants = [{
          id: 'size_default',
          sizeName: 'Standard',
          price: product.price,
          compareAtPrice: product.compareAtPrice || null
        }];
      }

      // Migrate legacy color variants without sizeInventory
      colorVariants = colorVariants.map(cv => ({
        ...cv,
        sizeInventory: cv.sizeInventory || sizeVariants.map(sv => ({
          sizeId: sv.id,
          sizeName: sv.sizeName,
          stockQuantity: product.stockQuantity || 10
        }))
      }));

      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        sku: product.sku,
        inStock: product.inStock,
        isFeatured: product.isFeatured,
        featuredOrder: product.featuredOrder,
        fabric: product.fabric || '',
        material: product.material || '',
        pattern: product.pattern || '',
        careInstructions: product.careInstructions || '',
        tags: product.tags || [],
        badge: product.badge,
        isActive: product.isActive,
        sizeVariants,
        colorVariants
      });
      
      if (colorVariants.length > 0) {
        setExpandedColorId(colorVariants[0].id);
      }
    } else {
      setFormData(initialFormState);
      setExpandedColorId(null);
    }
    setActiveTab('basic');
  }, [product, open]);

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    if (formData.sizeVariants.length === 0) return;
    if (formData.colorVariants.length === 0) return;

    setSaving(true);
    try {
      // Get primary image from first color variant
      const primaryImageUrl = formData.colorVariants[0]?.images?.[0]?.url || '';
      
      // Calculate total stock
      const totalStock = formData.colorVariants.reduce((acc, cv) => {
        return acc + cv.sizeInventory.reduce((sum, si) => sum + si.stockQuantity, 0);
      }, 0);

      const productData = {
        ...formData,
        categoryId,
        categoryName,
        subCategoryId,
        subCategoryName,
        primaryImageUrl,
        inStock: totalStock > 0
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

  // Tag handlers
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // Size variant handlers
  const handleSizeToggle = (sizeName: string) => {
    setFormData(prev => {
      const exists = prev.sizeVariants.find(sv => sv.sizeName === sizeName);
      let newSizeVariants: ProductSizeVariant[];
      
      if (exists) {
        // Remove size
        newSizeVariants = prev.sizeVariants.filter(sv => sv.sizeName !== sizeName);
      } else {
        // Add size with default price
        const newSize: ProductSizeVariant = {
          id: `size_${Date.now()}`,
          sizeName,
          price: 0,
          compareAtPrice: null
        };
        newSizeVariants = [...prev.sizeVariants, newSize];
      }

      // Update color variants to add/remove size inventory
      const newColorVariants = prev.colorVariants.map(cv => {
        if (exists) {
          // Remove from sizeInventory
          return {
            ...cv,
            sizeInventory: cv.sizeInventory.filter(si => si.sizeName !== sizeName)
          };
        } else {
          // Add to sizeInventory
          const newSizeInv: ColorSizeInventory = {
            sizeId: `size_${Date.now()}`,
            sizeName,
            stockQuantity: 10
          };
          return {
            ...cv,
            sizeInventory: [...cv.sizeInventory, newSizeInv]
          };
        }
      });

      return { ...prev, sizeVariants: newSizeVariants, colorVariants: newColorVariants };
    });
  };

  const handleSizePriceChange = (sizeName: string, field: 'price' | 'compareAtPrice', value: number | null) => {
    setFormData(prev => ({
      ...prev,
      sizeVariants: prev.sizeVariants.map(sv => 
        sv.sizeName === sizeName ? { ...sv, [field]: value } : sv
      )
    }));
  };

  // Color variant handlers
  const handleAddColorVariant = () => {
    if (!newColorName.trim()) return;
    
    const newVariant: ProductColorVariant = {
      id: `color_${Date.now()}`,
      colorName: newColorName.trim(),
      colorHex: newColorHex,
      images: [],
      sizeInventory: formData.sizeVariants.map(sv => ({
        sizeId: sv.id,
        sizeName: sv.sizeName,
        stockQuantity: 10
      }))
    };
    
    setFormData(prev => ({
      ...prev,
      colorVariants: [...prev.colorVariants, newVariant]
    }));
    setExpandedColorId(newVariant.id);
    setNewColorName('');
    setNewColorHex('#4B5563');
  };

  const handleRemoveColorVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter(v => v.id !== variantId)
    }));
    if (expandedColorId === variantId) {
      setExpandedColorId(formData.colorVariants.find(v => v.id !== variantId)?.id || null);
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
          return { ...variant, images: [...variant.images, newImage] };
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
            .map((img, index) => ({ ...img, order: index, isPrimary: index === 0 }));
          return { ...variant, images: updatedImages };
        }
        return variant;
      })
    }));
  };

  const handleSizeInventoryChange = (colorId: string, sizeName: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map(cv => {
        if (cv.id === colorId) {
          return {
            ...cv,
            sizeInventory: cv.sizeInventory.map(si =>
              si.sizeName === sizeName ? { ...si, stockQuantity: quantity } : si
            )
          };
        }
        return cv;
      })
    }));
  };

  const canSave = formData.name.trim() && 
    formData.sizeVariants.length > 0 && 
    formData.sizeVariants.every(sv => sv.price > 0) &&
    formData.colorVariants.length > 0;

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
            <TabsTrigger value="sizes">Variant Size</TabsTrigger>
            <TabsTrigger value="colors">Variant Colour</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh] px-6">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 py-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Block Print Cotton Bedsheet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for cards (max 100 chars)"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Stock keeping unit (e.g., BS-001)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Select
                    value={formData.badge || 'none'}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      badge: value === 'none' ? null : value as any 
                    }))}
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
              </div>
            </TabsContent>

            {/* Variant Size Tab */}
            <TabsContent value="sizes" className="space-y-6 py-4 mt-0">
              <div className="space-y-3">
                <div>
                  <Label>Select Available Sizes *</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose sizes and set individual prices for each
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => {
                    const isSelected = formData.sizeVariants.some(sv => sv.sizeName === size);
                    return (
                      <label
                        key={size}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "bg-gold/10 border-gold text-gold"
                            : "bg-background border-border hover:border-gold/50"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSizeToggle(size)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{size}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {formData.sizeVariants.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <Label>Size Pricing *</Label>
                  <div className="space-y-3">
                    {formData.sizeVariants.map((sv) => (
                      <div key={sv.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <div className="w-24 font-medium text-foreground">{sv.sizeName}</div>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Price (₹) *</Label>
                            <Input
                              type="number"
                              min={0}
                              value={sv.price || ''}
                              onChange={(e) => handleSizePriceChange(sv.sizeName, 'price', parseFloat(e.target.value) || 0)}
                              placeholder="Price"
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Compare at (₹)</Label>
                            <Input
                              type="number"
                              min={0}
                              value={sv.compareAtPrice || ''}
                              onChange={(e) => handleSizePriceChange(sv.sizeName, 'compareAtPrice', e.target.value ? parseFloat(e.target.value) : null)}
                              placeholder="Original price"
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.sizeVariants.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  Select at least one size to continue
                </div>
              )}
            </TabsContent>

            {/* Variant Colour Tab */}
            <TabsContent value="colors" className="space-y-6 py-4 mt-0">
              {formData.sizeVariants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  Please add sizes in "Variant Size" tab first
                </div>
              ) : (
                <>
                  {/* Add New Color */}
                  <div className="flex gap-2 items-end p-4 bg-secondary/30 rounded-lg">
                    <div className="flex-1 space-y-1.5">
                      <Label htmlFor="newColorName" className="text-xs">Colour Name *</Label>
                      <Input
                        id="newColorName"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="e.g., Indigo Blue"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="newColorHex" className="text-xs">Colour</Label>
                      <input
                        id="newColorHex"
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-9 h-9 rounded cursor-pointer border border-border"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddColorVariant}
                      disabled={!newColorName.trim()}
                      className="h-9"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Colour
                    </Button>
                  </div>

                  {/* Color Variant List */}
                  {formData.colorVariants.length > 0 ? (
                    <div className="space-y-3">
                      {formData.colorVariants.map((variant, index) => (
                        <Collapsible
                          key={variant.id}
                          open={expandedColorId === variant.id}
                          onOpenChange={(open) => setExpandedColorId(open ? variant.id : null)}
                        >
                          <div className="border border-border rounded-lg overflow-hidden">
                            <CollapsibleTrigger asChild>
                              <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-6 h-6 rounded-full border border-border"
                                    style={{ backgroundColor: variant.colorHex }}
                                  />
                                  <span className="font-medium">{variant.colorName}</span>
                                  {index === 0 && (
                                    <Badge variant="secondary" className="text-xs">Base Variant</Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {variant.images.length} images
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveColorVariant(variant.id);
                                    }}
                                    className="text-destructive hover:text-destructive h-8"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  {expandedColorId === variant.id ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </button>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <div className="px-4 pb-4 space-y-4 border-t">
                                {/* Size Inventory */}
                                <div className="pt-4 space-y-3">
                                  <Label className="text-sm">Stock per Size</Label>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {variant.sizeInventory.map((si) => (
                                      <div key={si.sizeName} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                                        <span className="text-sm font-medium min-w-16">{si.sizeName}</span>
                                        <Input
                                          type="number"
                                          min={0}
                                          value={si.stockQuantity}
                                          onChange={(e) => handleSizeInventoryChange(variant.id, si.sizeName, parseInt(e.target.value) || 0)}
                                          className="h-8 w-20"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Images */}
                                <div className="space-y-3">
                                  <Label className="text-sm">Images</Label>
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
                                </div>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                      Add at least one colour variant
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 py-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fabric</Label>
                  <Select
                    value={formData.fabric}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fabric: value }))}
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
                  <Label>Pattern</Label>
                  <Select
                    value={formData.pattern}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, pattern: value }))}
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
                <Label htmlFor="material">Material Details</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                  placeholder="e.g., 300 TC, 180 GSM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="careInstructions">Care Instructions</Label>
                <Textarea
                  id="careInstructions"
                  value={formData.careInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))}
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

              {/* Active Switch moved here */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border mt-6">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Inactive products won't appear in the store
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !canSave}>
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
