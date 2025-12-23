import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';
import { useSubCategories } from '@/hooks/useSubCategories';
import { Button } from "@/components/ui/button"; // FIXED: Added this import
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const ShopMegaMenu = ({ isActive }: { isActive?: boolean }) => {
  const { categories } = useCategories();
  const { subCategories } = useSubCategories();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // --- NEW: PRELOADING LOGIC ---
  useEffect(() => {
    if (subCategories.length > 0) {
      subCategories.forEach((sub) => {
        if (sub.imageUrl) {
          const img = new Image();
          img.src = sub.imageUrl; // This forces the browser to download and cache it immediately
        }
      });
    }
  }, [subCategories]); 
  // ------------------------------

  const taskbarCategories = categories.filter(
    (cat) => cat.visibleOnTaskbar !== false && cat.isActive
  );

  const subCategoriesByCategory = subCategories
    .filter((sub) => sub.visibleOnTaskbar !== false && sub.isActive)
    .reduce((acc, sub) => {
      if (!acc[sub.categoryId]) {
        acc[sub.categoryId] = [];
      }
      acc[sub.categoryId].push(sub);
      return acc;
    }, {} as Record<string, typeof subCategories>);

  useEffect(() => {
    if (taskbarCategories.length > 0 && !hoveredCategory) {
      setHoveredCategory(taskbarCategories[0].id);
    }
  }, [taskbarCategories, hoveredCategory]);

  const currentCategory = taskbarCategories.find(c => c.id === hoveredCategory);
  const currentSubCategories = hoveredCategory
    ? subCategoriesByCategory[hoveredCategory] || []
    : [];

  if (taskbarCategories.length === 0) {
    return (
      <Link
        to="/shop"
        className={cn(
          "text-sm font-medium transition-colors hover:text-gold relative group h-[44px] flex items-center",
          isActive ? "text-gold" : "text-foreground"
        )}
      >
        Shop
        <span className={cn(
          "absolute -bottom-1 left-0 w-full h-0.5 bg-gold transition-transform origin-left",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )} />
      </Link>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
              "text-sm font-medium transition-colors hover:text-gold relative group h-[44px] flex items-center px-0 py-0 [&>svg]:hidden",
              isActive ? "text-gold" : "text-foreground"
            )}
          >
            Shop
            <span className={cn(
              "absolute -bottom-1 left-0 w-full h-0.5 bg-gold transition-transform origin-left",
              isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            )} />
          </NavigationMenuTrigger>

          <NavigationMenuContent className="bg-background/95 backdrop-blur-xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-xl overflow-hidden">
            <div className="flex w-[850px] min-h-[450px]">
              
              {/* 1. Left Sidebar: Collections */}
              <div className="w-[240px] bg-muted/30 p-6 border-r border-border/50">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-6">Collections</h3>
                <nav className="space-y-1.5">
                  {taskbarCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/shop?category=${category.slug}`}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      className={cn(
                        "group flex items-center justify-between px-4 py-3 rounded-full text-sm transition-all duration-300",
                        hoveredCategory === category.id 
                          ? "bg-gold text-white shadow-[0_4px_12px_rgba(212,175,55,0.2)]" 
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <span className="tracking-tight">{category.name}</span>
                      <ChevronRight className={cn("h-3 w-3 transition-transform duration-300", hoveredCategory === category.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} />
                    </Link>
                  ))}
                </nav>
              </div>


              {/* 2. Middle: Subcategories Grid with Thumbnails */}
              <div className="flex-1 p-8 overflow-y-auto max-h-[500px]">
                <div className="mb-8">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-1">Explore</h3>
                  <p className="text-2xl font-serif text-foreground">{currentCategory?.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  {currentSubCategories.map((sub) => (
                    <Link 
                      key={sub.id} 
                      to={`/shop?category=${currentCategory?.slug}&subcategory=${sub.slug}`}
                      className="group flex items-center gap-4"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-border/50 bg-muted transition-transform duration-500 group-hover:scale-110 shadow-sm">
                        {sub.imageUrl ? (
                          <img
                            src={sub.imageUrl}
                            alt={sub.name}
                            loading="eager" // Tells browser to prioritize this image
                            decoding="async" // Prevents the image decoding from blocking the UI thread
                            className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                            <Store className="h-5 w-5 text-muted-foreground/40" />
                          </div>
                        )}
                        {/* Subtle Outer Glow on Hover */}
                        <div className="absolute inset-0 rounded-full group-hover:ring-2 ring-gold/30 transition-all duration-500" />
                      </div>

                      {/* Text Content */}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium group-hover:text-gold transition-colors duration-300">
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          View Collection
                        </span>
                        {/* Decorative underline that expands from center */}
                        <div className="h-[1px] w-0 bg-gold/40 group-hover:w-full transition-all duration-700 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3. Right: Promo Card */}
              {/*<div className="w-[280px] p-4 bg-muted/10">
                <div className="relative h-full w-full rounded-lg overflow-hidden group/card border border-border/50">
                  <img 
                    src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80" 
                    className="h-full w-full object-cover transition-transform duration-10000 group-hover/card:scale-110" 
                    alt="Featured Collection" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-center">
                    <p className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Seasonal</p>
                    <h4 className="text-white text-lg font-serif mb-4 italic">The Gold Edition</h4>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-black transition-all rounded-none text-[10px] uppercase tracking-widest backdrop-blur-sm">
                      View Lookbook
                    </Button>
                  </div>
                </div>
              </div>*/}

            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ShopMegaMenu;
