/**
 * Firebase Image Optimization Utilities
 * Uses the Firebase resizeImage HTTPS function for responsive images
 */

const FIREBASE_RESIZE_URL = 'https://us-central1-jaipur-touch-d8a54.cloudfunctions.net/resizeImage';

/**
 * Converts a Firebase Storage URL or any image URL to an optimized version
 * @param originalUrl - The original image URL
 * @param size - The target size (400 for mobile, 800 for desktop)
 * @returns The optimized image URL
 */
export function getOptimizedImageUrl(originalUrl: string | null | undefined, size: 400 | 800 = 800): string {
  if (!originalUrl) return '/placeholder.svg';
  
  // Skip optimization for placeholder images or local assets
  if (originalUrl.startsWith('/') || originalUrl.startsWith('data:')) {
    return originalUrl;
  }

  // Encode the original URL for the resize function
  const encodedPath = encodeURIComponent(originalUrl);
  return `${FIREBASE_RESIZE_URL}/images/${size}/${encodedPath}`;
}

/**
 * Generate srcSet for responsive images
 * @param originalUrl - The original image URL
 * @returns Object with mobile and desktop URLs
 */
export function getResponsiveImageUrls(originalUrl: string | null | undefined): {
  mobile: string;
  desktop: string;
  srcSet: string;
} {
  const mobile = getOptimizedImageUrl(originalUrl, 400);
  const desktop = getOptimizedImageUrl(originalUrl, 800);
  
  return {
    mobile,
    desktop,
    srcSet: `${mobile} 400w, ${desktop} 800w`,
  };
}
