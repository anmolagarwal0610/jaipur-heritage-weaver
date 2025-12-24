/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid is 2 columns on mobile, 4 on desktop
 * - Images use lazy loading for performance
 * - Touch targets minimum 44x44px (buttons, links)
 * - Maintain responsive design in all future edits
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import OptimizedImage from "@/components/ui/optimized-image";

const FeaturedProducts = () => {
  const { featuredProducts, loading } = useProducts({ featuredOnly: true });
  
  // Limit to 8 products for homepage display
  const displayProducts = featuredProducts.slice(0, 8);

  // Don't render anything if no featured products and not loading
  if (!loading && displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-gold font-medium tracking-widest text-xs sm:text-sm uppercase">
            Curated Selection
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mt-2">
            Featured Products
          </h2>
          <p className="text-muted-foreground mt-2 md:mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Our most loved pieces, handpicked for you.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[3/4] rounded-lg md:rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {displayProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group animate-fade-in block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden bg-secondary mb-3 md:mb-4">
                  <OptimizedImage
                    src={product.primaryImageUrl}
                    alt={`${product.name} - Handcrafted Jaipuri textile`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-terracotta text-terracotta-foreground text-[10px] md:text-xs font-medium px-2 py-0.5 md:py-1 rounded">
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
                      className="w-full bg-gold text-gold-foreground hover:bg-gold/90 text-xs md:text-sm h-9 md:h-10"
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

        <div className="text-center mt-8 md:mt-12">
          <Link to="/shop">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground h-11 md:h-12 px-6 md:px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
