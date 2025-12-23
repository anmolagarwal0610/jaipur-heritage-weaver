import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';
import { useSubCategories } from '@/hooks/useSubCategories';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const ShopMegaMenu = () => {
  const { categories } = useCategories();
  const { subCategories } = useSubCategories();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Filter categories visible on taskbar
  const taskbarCategories = categories.filter(
    (cat) => cat.visibleOnTaskbar !== false && cat.isActive
  );

  // Group subcategories by category and filter visible ones
  const subCategoriesByCategory = subCategories
    .filter((sub) => sub.visibleOnTaskbar !== false && sub.isActive)
    .reduce((acc, sub) => {
      if (!acc[sub.categoryId]) {
        acc[sub.categoryId] = [];
      }
      acc[sub.categoryId].push(sub);
      return acc;
    }, {} as Record<string, typeof subCategories>);

  // Set initial hovered category
  useEffect(() => {
    if (taskbarCategories.length > 0 && !hoveredCategory) {
      setHoveredCategory(taskbarCategories[0].id);
    }
  }, [taskbarCategories, hoveredCategory]);

  const currentSubCategories = hoveredCategory
    ? subCategoriesByCategory[hoveredCategory] || []
    : [];

  if (taskbarCategories.length === 0) {
    return (
      <Link
        to="/shop"
        className="text-sm font-medium transition-colors hover:text-gold relative group min-h-[44px] flex items-center text-foreground"
      >
        Shop
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Link>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-sm font-medium text-foreground hover:text-gold transition-colors h-auto px-0 py-0 [&>svg]:hidden">
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-background border border-border shadow-xl">
            <div className="w-[600px] lg:w-[750px] p-0">
              <div className="flex">
                {/* Categories Column */}
                <div className="w-1/3 bg-secondary/30 p-4 border-r border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Categories
                  </p>
                  <nav className="space-y-1">
                    {taskbarCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/shop?category=${category.slug}`}
                        className={cn(
                          'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                          hoveredCategory === category.id
                            ? 'bg-gold/10 text-gold font-medium'
                            : 'text-foreground hover:bg-muted/50'
                        )}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                      >
                        <span>{category.name}</span>
                        {subCategoriesByCategory[category.id]?.length > 0 && (
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Sub-categories Column */}
                <div className="w-2/3 p-4">
                  {hoveredCategory && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                          {taskbarCategories.find((c) => c.id === hoveredCategory)?.name || 'Sub-Categories'}
                        </p>
                        <Link
                          to={`/shop?category=${taskbarCategories.find((c) => c.id === hoveredCategory)?.slug}`}
                          className="text-xs text-gold hover:underline"
                        >
                          View All →
                        </Link>
                      </div>

                      {currentSubCategories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {currentSubCategories.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/shop?category=${taskbarCategories.find((c) => c.id === hoveredCategory)?.slug}&subcategory=${sub.slug}`}
                              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              {sub.imageUrl ? (
                                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                                  <img
                                    src={sub.imageUrl}
                                    alt={sub.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-md bg-muted shrink-0 flex items-center justify-center">
                                  <Store className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                                  {sub.name}
                                </p>
                                {sub.productCount > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    {sub.productCount} products
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                          <p>Browse all products in this category</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-3 bg-muted/30">
                <Link
                  to="/shop"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-gold hover:text-gold/80 transition-colors py-1"
                >
                  <Store className="h-4 w-4" />
                  View All Products
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ShopMegaMenu;
