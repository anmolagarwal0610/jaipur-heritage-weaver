/**
 * Product Detail Page - Etsy-inspired clean design
 * Features: Image gallery, product info, size-based pricing, color variants
 * @module ProductDetail
 */

import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Minus, Plus, ShoppingBag, MessageCircle, Check, Truck } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { ProductSizeVariant, ProductColorVariant } from "@/lib/firebase-types";

// Helper to get price range for related products
const getProductPrice = (product: any): number => {
  if (product.sizeVariants && product.sizeVariants.length > 0) {
    return Math.min(...product.sizeVariants.map((sv: ProductSizeVariant) => sv.price));
  }
  return product.price || 0;
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, loading } = useProduct(productId);
  const { relatedProducts } = useRelatedProducts(product?.categoryId, productId);
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<string>("");
  const [selectedColorId, setSelectedColorId] = useState<string>("");

  // Get size variants with fallback for legacy products
  const sizeVariants = useMemo(() => {
    if (product?.sizeVariants && product.sizeVariants.length > 0) {
      return product.sizeVariants;
    }
    // Legacy fallback
    if (product?.price) {
      return [{
        id: 'default',
        sizeName: product.sizes?.[0] || 'Standard',
        price: product.price,
        compareAtPrice: product.compareAtPrice || null
      }];
    }
    return [];
  }, [product]);

  // Get color variants with fallback
  const colorVariants = useMemo(() => {
    if (product?.colorVariants && product.colorVariants.length > 0) {
      return product.colorVariants;
    }
    // Legacy fallback - create a default color from images
    if (product?.images && product.images.length > 0) {
      return [{
        id: 'default',
        colorName: product.color || 'Default',
        colorHex: '#888888',
        images: product.images,
        sizeInventory: sizeVariants.map(sv => ({
          sizeId: sv.id,
          sizeName: sv.sizeName,
          stockQuantity: product.stockQuantity || 10
        }))
      }];
    }
    return [];
  }, [product, sizeVariants]);

  // Set default selections when product loads
  useEffect(() => {
    if (sizeVariants.length > 0) {
      setSelectedSizeId(sizeVariants[0].id);
    }
    if (colorVariants.length > 0) {
      setSelectedColorId(colorVariants[0].id);
    }
    setSelectedImage(0);
    setQuantity(1);
  }, [product?.id]);

  // Get currently selected size and color
  const selectedSize = sizeVariants.find(sv => sv.id === selectedSizeId);
  const selectedColor = colorVariants.find(cv => cv.id === selectedColorId);
  
  // Get current price based on selected size
  const currentPrice = selectedSize?.price || 0;
  const currentComparePrice = selectedSize?.compareAtPrice || null;
  const discount = currentComparePrice 
    ? Math.round((1 - currentPrice / currentComparePrice) * 100) 
    : 0;

  // Get stock for current color+size combo
  const getCurrentStock = (): number => {
    if (!selectedColor || !selectedSize) return 0;
    const inventory = selectedColor.sizeInventory?.find(
      si => si.sizeName === selectedSize.sizeName
    );
    return inventory?.stockQuantity || 0;
  };

  const currentStock = getCurrentStock();
  const isInStock = currentStock > 0;

  // Get current images based on selected color
  const getCurrentImages = () => {
    if (selectedColor?.images?.length > 0) {
      return selectedColor.images.sort((a, b) => a.order - b.order);
    }
    // Fallback to primary image
    return [{ id: '1', url: product?.primaryImageUrl || '', alt: product?.name || '', order: 0, isPrimary: true }];
  };

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor && isInStock) {
      if (quantity > currentStock) return;
      
      addToCart({
        productId: product.id,
        name: product.name,
        price: currentPrice,
        image: selectedColor.images?.[0]?.url || product.primaryImageUrl,
        size: selectedSize.sizeName,
        color: selectedColor.colorName,
        quantity,
        stockQuantity: currentStock,
      });
    }
  };

  const handleWhatsAppOrder = () => {
    if (!product || !selectedSize) return;
    const colorText = selectedColor ? ` (Color: ${selectedColor.colorName})` : '';
    const message = `Hi! I'd like to order:\n\n${product.name} - ${selectedSize.sizeName}${colorText}\nQuantity: ${quantity}\nPrice: ₹${(currentPrice * quantity).toLocaleString()}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/919887238849?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex gap-4">
              <div className="hidden sm:flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
                ))}
              </div>
              <Skeleton className="flex-1 aspect-square rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <SEO title="Product Not Found - Jaipur Touch" description="The product you're looking for could not be found." />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link to="/shop">
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const productImages = getCurrentImages();

  return (
    <Layout>
      <SEO
        title={`${product.name} | Jaipur Touch`}
        description={product.shortDescription || product.description}
        canonical={`/product/${product.id}`}
      />

      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-3">
        <div className="container mx-auto px-4">
          <nav className="text-xs md:text-sm flex flex-wrap items-center gap-1">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link>
            <span className="text-muted-foreground">/</span>
            {product.categoryName && (
              <>
                <Link 
                  to={`/shop?category=${product.categoryId}`} 
                  className="text-muted-foreground hover:text-foreground"
                >
                  {product.categoryName}
                </Link>
                <span className="text-muted-foreground">/</span>
              </>
            )}
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex gap-3 md:gap-4">
            {/* Thumbnails */}
            <div className="hidden sm:flex flex-col gap-2 md:gap-3">
              {productImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(index)}
                  className={`w-14 h-14 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-gold ring-2 ring-gold/20' 
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <img
                    src={getOptimizedImageUrl(img.url, 400)}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative">
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
                <OptimizedImage
                  src={productImages[selectedImage]?.url || product.primaryImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              {product.badge && (
                <span className="absolute top-3 left-3 bg-terracotta text-terracotta-foreground text-xs font-medium px-3 py-1 rounded">
                  {product.badge}
                </span>
              )}
              
              {/* Mobile Thumbnails */}
              <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-gold' 
                        : 'border-border'
                    }`}
                  >
                    <img
                      src={getOptimizedImageUrl(img.url, 400)}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
            {/* Price - based on selected size */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl md:text-3xl font-semibold text-foreground">
                ₹{currentPrice.toLocaleString()}
              </span>
              {currentComparePrice && currentComparePrice > currentPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{currentComparePrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-terracotta bg-terracotta/10 px-2 py-0.5 rounded">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-xl md:text-2xl lg:text-3xl font-semibold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Stock Status */}
            <div className="flex items-center gap-4 text-sm">
              {isInStock ? (
                <span className="flex items-center gap-1.5 text-olive">
                  <Check className="w-4 h-4" />
                  In Stock ({currentStock} available)
                </span>
              ) : (
                <span className="text-destructive">Out of Stock</span>
              )}
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Truck className="w-4 h-4" />
                Free Shipping above ₹999
              </span>
            </div>

            {/* Color Selector */}
            {colorVariants.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Color: <span className="text-muted-foreground font-normal">{selectedColor?.colorName}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedColorId(variant.id);
                        setSelectedImage(0);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColorId === variant.id
                          ? 'border-gold ring-2 ring-gold/30 ring-offset-2'
                          : 'border-border hover:border-gold/50'
                      }`}
                      style={{ backgroundColor: variant.colorHex }}
                      title={variant.colorName}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector with prices */}
            {sizeVariants.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizeVariants.map((sv) => {
                    // Check if this size is available in selected color
                    const colorInv = selectedColor?.sizeInventory?.find(
                      si => si.sizeName === sv.sizeName
                    );
                    const sizeStock = colorInv?.stockQuantity || 0;
                    const isAvailable = sizeStock > 0;

                    return (
                      <button
                        key={sv.id}
                        onClick={() => isAvailable && setSelectedSizeId(sv.id)}
                        disabled={!isAvailable}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          selectedSizeId === sv.id
                            ? 'bg-gold text-gold-foreground border-gold'
                            : isAvailable
                              ? 'bg-background border-border hover:border-gold/50 text-foreground'
                              : 'bg-muted border-border text-muted-foreground cursor-not-allowed line-through'
                        }`}
                      >
                        {sv.sizeName}
                        {sizeVariants.length > 1 && (
                          <span className="block text-xs opacity-75">
                            ₹{sv.price.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isInStock || quantity >= currentStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {currentStock <= 5 && currentStock > 0 && (
                <p className="text-xs text-terracotta mt-1">Only {currentStock} left in stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                className="flex-1 h-12 bg-gold text-gold-foreground hover:bg-gold/90 text-base font-medium"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 border-olive text-olive hover:bg-olive hover:text-olive-foreground"
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Order via WhatsApp
            </Button>

            {/* Collapsible Sections */}
            <Accordion type="multiple" defaultValue={["details"]} className="pt-4 border-t border-border">
              <AccordionItem value="details" className="border-b-0">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                  Item Details
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2 pb-4">
                  {product.fabric && (
                    <p><span className="text-foreground">Fabric:</span> {product.fabric}</p>
                  )}
                  {product.material && (
                    <p><span className="text-foreground">Material:</span> {product.material}</p>
                  )}
                  {product.pattern && (
                    <p><span className="text-foreground">Pattern:</span> {product.pattern}</p>
                  )}
                  {product.sku && (
                    <p><span className="text-foreground">SKU:</span> {product.sku}</p>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="description" className="border-b-0">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {product.description || product.shortDescription || 'No description available.'}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="care" className="border-b-0">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                  Care Instructions
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {product.careInstructions || (
                    <ul className="space-y-1.5 list-disc list-inside">
                      <li>Machine wash cold with like colors</li>
                      <li>Tumble dry low or hang dry</li>
                      <li>Iron on medium heat if needed</li>
                      <li>Do not bleach</li>
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-b-0">
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                  Delivery & Returns
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
                  <p>• Delivery within 5-7 business days across India</p>
                  <p>• Free shipping on orders above ₹999</p>
                  <p>• Easy returns within 7 days of delivery</p>
                  <p>• COD available on select pin codes</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-border">
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-6 md:mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {relatedProducts.map((relProduct) => {
                const minPrice = getProductPrice(relProduct);
                return (
                  <Link
                    key={relProduct.id}
                    to={`/product/${relProduct.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary mb-3">
                      <OptimizedImage
                        src={relProduct.primaryImageUrl}
                        alt={relProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {relProduct.badge && (
                        <span className="absolute top-2 left-2 bg-terracotta text-terracotta-foreground text-[10px] font-medium px-2 py-0.5 rounded">
                          {relProduct.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-sm text-foreground group-hover:text-gold transition-colors line-clamp-2">
                      {relProduct.name}
                    </h3>
                    <p className="font-semibold text-foreground mt-1">
                      {relProduct.sizeVariants && relProduct.sizeVariants.length > 1 
                        ? `From ₹${minPrice.toLocaleString()}`
                        : `₹${minPrice.toLocaleString()}`
                      }
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
