/**
 * Mobile Shop Menu Component
 * Expandable category/subcategory navigation for mobile sidebar
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useSubCategories } from '@/hooks/useSubCategories';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';

interface MobileShopMenuProps {
  onClose: () => void;
  onBack: () => void;
}

const MobileShopMenu = ({ onClose, onBack }: MobileShopMenuProps) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { subCategories, loading: subCategoriesLoading } = useSubCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const activeCategories = categories.filter(c => c.isActive);
  const loading = categoriesLoading || subCategoriesLoading;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const getCategorySubCategories = (categoryId: string) => {
    return subCategories.filter(
      sc => sc.categoryId === categoryId && sc.isActive && sc.visibleOnTaskbar !== false
    ).sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-foreground hover:text-gold p-4 border-b border-border"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-3 text-foreground hover:text-gold p-4 border-b border-border min-h-[56px] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-serif text-lg font-medium">Shop</span>
      </button>

      {/* View All Products Link */}
      <Link
        to="/shop"
        onClick={onClose}
        className="flex items-center justify-between px-4 py-4 text-gold hover:bg-secondary/50 transition-colors border-b border-border/50"
      >
        <span className="font-medium">View All Products</span>
        <ChevronRight className="w-4 h-4" />
      </Link>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {activeCategories.map((category) => {
            const categorySubCategories = getCategorySubCategories(category.id);
            const hasSubCategories = categorySubCategories.length > 0;
            const isExpanded = expandedCategories.has(category.id);

            if (!hasSubCategories) {
              return (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-4 text-foreground hover:text-gold hover:bg-secondary/30 transition-colors"
                >
                  <span className="font-serif text-base">{category.name}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              );
            }

            return (
              <Collapsible
                key={category.id}
                open={isExpanded}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-4 text-foreground hover:text-gold hover:bg-secondary/30 transition-colors">
                  <span className="font-serif text-base">{category.name}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="bg-secondary/20 border-y border-border/30">
                    {/* View All in Category */}
                    <Link
                      to={`/shop?category=${category.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-6 py-3 text-sm text-gold hover:bg-secondary/50 transition-colors"
                    >
                      <span>View All {category.name}</span>
                    </Link>
                    
                    {/* Subcategories */}
                    {categorySubCategories.map((subCategory) => (
                      <Link
                        key={subCategory.id}
                        to={`/shop?category=${category.slug}&subcategory=${subCategory.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-border" />
                        <span>{subCategory.name}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileShopMenu;
