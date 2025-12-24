/**
 * Premium Search Bar Component
 * Animated slide-in search with real-time product filtering
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/lib/firebase-types';
import { getOptimizedImageUrl } from '@/lib/image-utils';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar = ({ isOpen, onClose }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { products } = useProducts();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Search products
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const searchTerms = debouncedQuery.toLowerCase().split(' ').filter(Boolean);
    
    const filtered = products.filter((product) => {
      if (!product.isActive) return false;
      
      const searchableFields = [
        product.name,
        product.description,
        product.shortDescription,
        product.fabric,
        product.pattern,
        product.color,
        product.categoryName,
        ...(product.tags || []),
      ].filter(Boolean).map(f => f?.toLowerCase());

      return searchTerms.every(term =>
        searchableFields.some(field => field?.includes(term))
      );
    });

    setResults(filtered.slice(0, 8));
  }, [debouncedQuery, products]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleResultClick = (productId: string) => {
    setQuery('');
    setResults([]);
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleViewAll = () => {
    setQuery('');
    setResults([]);
    onClose();
    navigate(`/shop?search=${encodeURIComponent(debouncedQuery)}`);
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute right-0 top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 ease-out z-50",
        isOpen 
          ? "w-72 sm:w-80 md:w-96 opacity-100" 
          : "w-0 opacity-0 pointer-events-none"
      )}
    >
      <div className="relative w-full">
        {/* Search Input Container */}
        <div className={cn(
          "flex items-center gap-2 bg-background border border-border rounded-full shadow-lg overflow-hidden transition-all duration-300",
          isOpen ? "px-4 py-2" : "px-0 py-0"
        )}>
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-secondary rounded-full transition-colors ml-1"
            aria-label="Close search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results Dropdown */}
        {isOpen && debouncedQuery && (
          <div className="absolute top-full right-0 left-0 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground text-sm">No products found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try different keywords
                </p>
              </div>
            ) : (
              <>
                <div className="p-2">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className="flex items-center gap-3 w-full p-2 hover:bg-secondary/50 rounded-lg transition-colors text-left"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <img
                          src={getOptimizedImageUrl(product.primaryImageUrl, 400)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ₹{product.price.toLocaleString()}
                          {product.categoryName && (
                            <span className="ml-2 text-gold">• {product.categoryName}</span>
                          )}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* View All Results */}
                <button
                  onClick={handleViewAll}
                  className="flex items-center justify-center gap-2 w-full p-3 bg-secondary/30 hover:bg-secondary/50 border-t border-border text-sm text-gold font-medium transition-colors"
                >
                  View all results
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
