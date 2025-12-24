/**
 * OptimizedImage Component
 * Responsive image component using Firebase resizeImage function
 * Automatically serves 400px for mobile and 800px for desktop
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getResponsiveImageUrls } from '@/lib/image-utils';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  sizes = '(max-width: 640px) 400px, 800px',
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [hasError, setHasError] = useState(false);
  const { mobile, desktop, srcSet } = getResponsiveImageUrls(src);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // If no src or error, show placeholder
  if (!src || hasError) {
    return (
      <img
        src="/placeholder.svg"
        alt={alt}
        className={className}
        loading={loading}
      />
    );
  }

  return (
    <img
      src={desktop}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={cn(className)}
      loading={loading}
      decoding="async"
      onLoad={onLoad}
      onError={handleError}
    />
  );
};

export default OptimizedImage;
