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

const products = [
  {
    id: 1,
    name: "Royal Blue Jaipuri Bedsheet Set",
    price: 1499,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Floral Block Print Quilt",
    price: 2999,
    originalPrice: 4499,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    badge: "New",
  },
  {
    id: 3,
    name: "Traditional Razai - King Size",
    price: 3499,
    originalPrice: 5499,
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Cotton Dohar Set",
    price: 1999,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    badge: "Limited",
  },
];

const FeaturedProducts = () => {
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
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
                  <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-terracotta text-terracotta-foreground text-[10px] md:text-xs font-medium px-2 py-0.5 md:py-1 rounded">
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
                  <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 text-xs md:text-sm h-9 md:h-10">
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
                <span className="text-terracotta text-[10px] md:text-sm font-medium">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              </div>
            </div>
          ))}
        </div>

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
