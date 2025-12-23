import { useEffect } from 'react';
import { useSubCategories } from './useSubCategories';

/**
 * Preloads subcategory thumbnail images after page load
 * Uses requestIdleCallback to avoid blocking main thread
 */
export const usePreloadSubcategoryImages = () => {
  const { subCategories } = useSubCategories();

  useEffect(() => {
    // Only run on homepage
    if (window.location.pathname !== '/') return;

    const preloadImages = () => {
      const visibleSubCategories = subCategories.filter(
        (sub) => sub.visibleOnTaskbar !== false && sub.isActive && sub.imageUrl
      );

      visibleSubCategories.forEach((sub) => {
        if (sub.imageUrl) {
          const img = new Image();
          img.src = sub.imageUrl;
        }
      });
    };

    // Delay preloading to prioritize critical content
    const timeoutId = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadImages, { timeout: 5000 });
      } else {
        // Fallback for Safari
        preloadImages();
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [subCategories]);
};
