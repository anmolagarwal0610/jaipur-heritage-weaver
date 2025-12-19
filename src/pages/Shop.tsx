/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Sidebar hidden on mobile, shown via Sheet
 * - Product grid 2 columns on mobile, 3 on desktop
 * - Images use lazy loading for performance
 * - Touch targets minimum 44x44px
 * - Maintain responsive design in all future edits
 */

import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBag, Heart, Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
    searchParams.get("category")
  );
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts();

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategorySlug) {
      setSearchParams({ category: selectedCategorySlug });
    } else {
      setSearchParams({});
    }
  }, [selectedCategorySlug, setSearchParams]);

  // Get active categories for the filter sidebar
  const activeCategories = useMemo(() => 
    categories.filter(c => c.isActive),
    [categories]
  );

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!selectedCategorySlug) return products.filter(p => p.isActive);
    
    const selectedCategory = categories.find(c => c.slug === selectedCategorySlug);
    if (!selectedCategory) return products.filter(p => p.isActive);
    
    return products.filter(p => p.isActive && p.categoryId === selectedCategory.id);
  }, [products, categories, selectedCategorySlug]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.sort((a, b) => 
          (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
        );
      case "featured":
      default:
        return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const selectedCategoryName = selectedCategorySlug
    ? categories.find(c => c.slug === selectedCategorySlug)?.name || selectedCategorySlug
    : null;

  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategorySlug(slug);
    setMobileFiltersOpen(false);
  };

  const loading = categoriesLoading || productsLoading;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-lg font-semibold mb-4">Categories</h3>
        {categoriesLoading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group min-h-[44px]">
              <Checkbox
                checked={selectedCategorySlug === null}
                onCheckedChange={() => handleCategorySelect(null)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                All Products
              </span>
            </label>
            {activeCategories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer group min-h-[44px]">
                <Checkbox
                  checked={selectedCategorySlug === category.slug}
                  onCheckedChange={() => handleCategorySelect(category.slug)}
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <SEO 
        title="Shop Handcrafted Jaipuri Bedsheets & Home Textiles | Jaipur Touch"
        description="Browse our collection of authentic handblock printed bedsheets, quilts, curtains, and home decor. Premium Jaipuri textiles delivered across India."
        canonical="/shop"
      />

      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-3 md:py-4">
        <div className="container mx-auto px-4">
          <nav className="text-xs md:text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">Shop</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-secondary/30 py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
            Shop Our Collection
          </h1>
          <p className="text-muted-foreground mt-2 md:mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Handcrafted textiles from the heart of Jaipur, made with love and tradition.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
              <p className="text-muted-foreground text-xs md:text-sm">
                {loading ? "Loading..." : `${sortedProducts.length} products`}
              </p>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden h-9 min-w-[44px]">
                      <Filter className="w-4 h-4 mr-1.5 md:mr-2" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] sm:w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-28 sm:w-40 h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {selectedCategoryName && (
              <div className="flex items-center gap-2 mb-4 md:mb-6 flex-wrap">
                <span className="text-xs md:text-sm text-muted-foreground">Active:</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCategorySelect(null)}
                  className="h-7 text-xs"
                >
                  {selectedCategoryName}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="aspect-[3/4] rounded-lg md:rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found in this category.</p>
                <Button variant="outline" onClick={() => handleCategorySelect(null)}>
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {sortedProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group animate-fade-in block"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden bg-secondary mb-3 md:mb-4">
                      <img
                        src={product.primaryImageUrl || '/placeholder.svg'}
                        alt={`${product.name} - Handcrafted Jaipuri textile`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-terracotta text-terracotta-foreground text-[10px] md:text-xs font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                          {product.badge}
                        </span>
                      )}
                      <button 
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                        aria-label={`Add ${product.name} to wishlist`}
                      >
                        <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-foreground" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                        <Button 
                          onClick={(e) => e.preventDefault()}
                          className="w-full bg-gold text-gold-foreground hover:bg-gold/90 text-xs md:text-sm h-8 md:h-10"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-serif text-xs sm:text-sm md:text-base text-foreground group-hover:text-gold transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                      <span className="font-semibold text-foreground text-sm md:text-base">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <>
                          <span className="text-muted-foreground text-xs md:text-sm line-through">
                            ₹{product.compareAtPrice.toLocaleString()}
                          </span>
                          <span className="text-terracotta text-[10px] md:text-sm font-medium">
                            {Math.round((1 - product.price / product.compareAtPrice) * 100)}% off
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
