/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Sidebar hidden on mobile, shown via Sheet
 * - Product grid 2 columns on mobile, 3 on desktop
 * - Images use lazy loading for performance
 * - Touch targets minimum 44x44px
 * - Maintain responsive design in all future edits
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBag, Heart, Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const categories = [
  "All Products",
  "Matching Bedsheets and Quilt",
  "Handblock Bedsheets",
  "Jaipuri Bedsheets",
  "Kids",
  "Bathrobes",
  "Table Linen",
  "Curtains",
  "Apparel",
  "Quilt",
  "Dohar",
  "Bedcover",
  "Cushion and Sofa Throws",
  "Towels",
  "Bags",
  "Percale Cotton Bedsheets",
];

const products = [
  { id: 1, name: "Royal Blue Jaipuri Bedsheet Set", price: 1499, originalPrice: 2499, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80", category: "Jaipuri Bedsheets", badge: "Bestseller" },
  { id: 2, name: "Floral Block Print Quilt", price: 2999, originalPrice: 4499, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80", category: "Quilt", badge: "New" },
  { id: 3, name: "Traditional Razai - King Size", price: 3499, originalPrice: 5499, image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80", category: "Quilt" },
  { id: 4, name: "Cotton Dohar Set", price: 1999, originalPrice: 2999, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80", category: "Dohar", badge: "Limited" },
  { id: 5, name: "Handblock Print Curtains", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80", category: "Curtains" },
  { id: 6, name: "Kids Safari Bedsheet", price: 999, originalPrice: 1499, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80", category: "Kids" },
  { id: 7, name: "Premium Cotton Bathrobe", price: 1799, originalPrice: 2499, image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=80", category: "Bathrobes" },
  { id: 8, name: "Table Runner Set", price: 799, originalPrice: 1199, image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=600&q=80", category: "Table Linen" },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = selectedCategory === "All Products"
    ? products
    : products.filter(p => p.category === selectedCategory);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer group min-h-[44px]">
              <Checkbox
                checked={selectedCategory === category}
                onCheckedChange={() => setSelectedCategory(category)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
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
                {filteredProducts.length} products
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
            {selectedCategory !== "All Products" && (
              <div className="flex items-center gap-2 mb-4 md:mb-6 flex-wrap">
                <span className="text-xs md:text-sm text-muted-foreground">Active:</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCategory("All Products")}
                  className="h-7 text-xs"
                >
                  {selectedCategory}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}

            {/* Products */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden bg-secondary mb-3 md:mb-4">
                    <img
                      src={product.image}
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
                      className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                      aria-label={`Add ${product.name} to wishlist`}
                    >
                      <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-foreground" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 text-xs md:text-sm h-8 md:h-10">
                        <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-serif text-xs sm:text-sm md:text-base text-foreground group-hover:text-gold transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                    <span className="font-semibold text-foreground text-sm md:text-base">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-xs md:text-sm line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
