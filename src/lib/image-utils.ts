/**
 * Firebase Image Optimization Utilities
 * Uses the Firebase resizeImage HTTPS function for responsive images
 */

const FIREBASE_RESIZE_URL = 'https://us-central1-jaipur-touch-d8a54.cloudfunctions.net/resizeImage';

/**
 * Extracts the storage path from a Firebase Storage download URL
 * Input:  https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile.jpg?alt=media&token=xxx
 * Output: path/to/file.jpg
 */
function extractFirebaseStoragePath(url: string): string | null {
  try {
    // Check if it's a Firebase Storage URL
    if (!url.includes('firebasestorage.googleapis.com')) {
      // Not a Firebase URL - might be already a path or external URL
      return null;
    }

    // Extract the path between /o/ and ?alt=media (or end of string)
    const match = url.match(/\/o\/([^?]+)/);
    if (!match || !match[1]) {
      return null;
    }

    // Decode the URL-encoded path (e.g., %2F -> /)
    const decodedPath = decodeURIComponent(match[1]);
    return decodedPath;
  } catch (error) {
    console.error('Error extracting Firebase storage path:', error);
    return null;
  }
}

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

  // Extract storage path from Firebase Storage download URL
  const storagePath = extractFirebaseStoragePath(originalUrl);
  
  if (!storagePath) {
    // If we can't extract path, return original URL as fallback
    return originalUrl;
  }

  // Construct the resize function URL with clean storage path
  return `${FIREBASE_RESIZE_URL}/images/${size}/${storagePath}`;
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
