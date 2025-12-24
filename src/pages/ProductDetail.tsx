/**
 * Product Detail Page - Etsy-inspired clean design
 * Features: Image gallery, product info, collapsible sections, related products
 * @module ProductDetail
 */

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Minus, Plus, ShoppingBag, MessageCircle, Check, Truck } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, loading } = useProduct(productId);
  const { relatedProducts } = useRelatedProducts(product?.categoryId, productId);
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Set default size and color when product loads
  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product?.colorVariants?.length > 0) {
      setSelectedColor(product.colorVariants[0].colorName);
    }
  }, [product?.sizes, product?.colorVariants]);

  const handleAddToCart = () => {
    if (product) {
      // Check stock before adding
      if (quantity > product.stockQuantity) {
        return;
      }
      // Get the correct image based on selected color
      let displayImage = product.primaryImageUrl;
      if (selectedColor && product.colorVariants?.length > 0) {
        const colorVariant = product.colorVariants.find(c => c.colorName === selectedColor);
        if (colorVariant?.images?.length > 0) {
          displayImage = colorVariant.images[0].url;
        }
      }
      
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: displayImage,
        size: selectedSize || null,
        color: selectedColor,
        quantity,
        stockQuantity: product.stockQuantity,
      });
    }
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const sizeText = selectedSize ? ` (Size: ${selectedSize})` : '';
    const colorText = selectedColor ? ` (Color: ${selectedColor})` : '';
    const message = `Hi! I'd like to order:\n\n${product.name}${sizeText}${colorText}\nQuantity: ${quantity}\nPrice: ₹${(product.price * quantity).toLocaleString()}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/919887238849?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  // Get current images based on selected color
  const getCurrentImages = () => {
    if (selectedColor && product?.colorVariants?.length > 0) {
      const colorVariant = product.colorVariants.find(c => c.colorName === selectedColor);
      if (colorVariant?.images?.length > 0) {
        return colorVariant.images.sort((a, b) => a.order - b.order);
      }
    }
    // Fallback to default images
    return product?.images?.length > 0 
      ? product.images.sort((a, b) => a.order - b.order) 
      : [{ id: '1', url: product?.primaryImageUrl || '', alt: product?.name || '', order: 0, isPrimary: true }];
  };

  const discount = product?.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100) 
    : 0;

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
            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl md:text-3xl font-semibold text-foreground">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.compareAtPrice.toLocaleString()}
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
              {product.inStock ? (
                <span className="flex items-center gap-1.5 text-olive">
                  <Check className="w-4 h-4" />
                  In Stock
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
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Color: <span className="text-muted-foreground font-normal">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedColor(variant.colorName);
                        setSelectedImage(0);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === variant.colorName
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

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-gold text-gold-foreground border-gold'
                          : 'bg-background border-border hover:border-gold/50 text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
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
                  disabled={!product.inStock || quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                <p className="text-xs text-terracotta mt-1">Only {product.stockQuantity} left in stock</p>
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
                disabled={!product.inStock}
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
                  {product.dimensions && (
                    <p>
                      <span className="text-foreground">Dimensions:</span>{' '}
                      {product.dimensions.length && product.dimensions.width 
                        ? `${product.dimensions.length} x ${product.dimensions.width} ${product.dimensions.unit}`
                        : 'Standard'}
                    </p>
                  )}
                  {product.color && (
                    <p><span className="text-foreground">Color:</span> {product.color}</p>
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
              {relatedProducts.map((relProduct) => (
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
                    ₹{relProduct.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
