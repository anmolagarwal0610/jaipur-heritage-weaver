/**
 * OptimizedImage Component
 * Responsive image component using Firebase resizeImage function
 * Falls back to original URL if optimization fails, then placeholder
 */

import { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { getResponsiveImageUrls } from '@/lib/image-utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      className,
      sizes = '(max-width: 640px) 400px, 800px',
      loading = 'lazy',
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [fallbackToOriginal, setFallbackToOriginal] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { desktop, srcSet } = getResponsiveImageUrls(src);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (!fallbackToOriginal) {
        // Optimized URL failed — try original src
        setFallbackToOriginal(true);
      } else {
        // Original also failed — show placeholder
        setHasError(true);
        onError?.(e);
      }
    };

    // If no src or both attempts failed, show placeholder
    if (!src || hasError) {
      return (
        <img
          ref={ref}
          src="/placeholder.svg"
          alt={alt}
          className={className}
          loading={loading}
          {...props}
        />
      );
    }

    // If optimized failed, render original src directly (no srcSet)
    if (fallbackToOriginal) {
      return (
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={cn(className)}
          loading={loading}
          decoding="async"
          onLoad={onLoad}
          onError={handleError}
          {...props}
        />
      );
    }

    return (
      <img
        ref={ref}
        src={desktop}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={cn(className)}
        loading={loading}
        decoding="async"
        onLoad={onLoad}
        onError={handleError}
        {...props}
      />
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
