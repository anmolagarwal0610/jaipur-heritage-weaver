

## Plan: Product Page UX Overhaul + Image Fallback + Shop Button Fix

### Issue 3 (Critical - Images Not Visible): resizeImage Returns 500

**Root Cause:**
The URL path extraction fix from the last change is working correctly -- URLs are now clean (e.g., `/images/800/products/xxx/image.webp`). However, the Firebase `resizeImage` function itself is returning **500 Internal Server Error** for all images. This is a server-side issue (possibly sharp failing on certain file types, or a permissions/quota issue in Cloud Functions).

**Fix Strategy: Add fallback to original Firebase Storage URL**

Since we cannot fix the Firebase function from the frontend, we must add error handling so images still display when the resize function fails.

**File: `src/components/ui/optimized-image.tsx`**
- When the optimized URL fails (onError), instead of immediately showing placeholder, **retry with the original `src` URL** (the raw Firebase Storage download URL)
- Flow: Try optimized URL -> if 500 error -> fallback to original URL -> if that also fails -> show placeholder

**File: `src/pages/ProductDetail.tsx`**
- Store both optimized and original URLs in the precomputed data
- Main image: try optimized first, fallback to original on error
- Thumbnails: same fallback pattern

**File: `src/lib/image-utils.ts`**
- No changes needed -- the path extraction is working correctly now

---

### Issue 1: Mobile Scrollable Image Gallery (Etsy-inspired)

**Current State:** On mobile, the main image is shown with small thumbnail buttons below. Tapping thumbnails changes the image. No swipe/scroll behavior.

**Changes to `src/pages/ProductDetail.tsx`:**

1. **Replace single main image with horizontal swipeable carousel on mobile:**
   - Use CSS scroll-snap with `overflow-x-auto` for a native-feeling horizontal swipe
   - Each image takes full viewport width (`w-full flex-shrink-0 snap-center`)
   - Dot indicators below showing current position
   - Sync scroll position with `selectedImage` state

2. **Tap-to-enlarge fullscreen modal:**
   - Tapping the main image opens a fullscreen overlay/dialog
   - In the modal: pinch-to-zoom using CSS `touch-action: pinch-zoom` and `overflow: auto` with a scaled image
   - Swipe left/right to navigate between images in fullscreen
   - Close button (X) in top-right corner
   - Dark backdrop for focus

3. **Remove thumbnail strip on mobile** -- the swipeable carousel with dots replaces it

---

### Issue 2: Hover-to-Open Thumbnails on Desktop

**Current State:** Desktop thumbnails require a click to change the main image.

**Changes to `src/pages/ProductDetail.tsx`:**
- Change thumbnail `onClick` to `onMouseEnter` for desktop
- Keep `onClick` as well for accessibility (keyboard/touch fallback)
- The existing crossfade transition will apply automatically

---

### Issue 4: Shop Button Click Closing Dropdown

**Root Cause:** Radix UI's `NavigationMenuTrigger` toggles on click by default. When hovering opens it, clicking immediately toggles it closed.

**Fix in `src/components/layout/ShopMegaMenu.tsx`:**
- Add `onClick={(e) => e.preventDefault()}` to the `NavigationMenuTrigger` component
- This prevents the click from toggling the menu state
- Hover will still open/close the menu naturally (Radix NavigationMenu is hover-based by default)

---

### Technical Implementation Details

**File changes summary:**

| File | Action | Description |
|------|--------|-------------|
| `src/components/ui/optimized-image.tsx` | Modify | Add fallback from optimized URL to original URL before placeholder |
| `src/pages/ProductDetail.tsx` | Modify | Mobile swipe carousel, fullscreen zoom modal, hover thumbnails on desktop, image URL fallback |
| `src/components/layout/ShopMegaMenu.tsx` | Modify | Prevent click from closing the dropdown |

**Mobile carousel approach:**
- A scrollable container with `overflow-x-auto snap-x snap-mandatory` containing full-width image slides
- `IntersectionObserver` or `onScroll` to detect which image is visible and update dot indicators
- No external carousel library needed -- CSS scroll-snap provides native-quality scrolling

**Fullscreen zoom modal approach:**
- Radix Dialog component (already installed) for the overlay
- Image rendered at full resolution (original URL, not resized)
- CSS `object-fit: contain` to fit the screen
- Pinch-to-zoom via setting a large image size and allowing native scroll/zoom
- Swipe navigation between images within the modal

**Image fallback approach (OptimizedImage):**
```text
State machine:
1. hasError = false -> render optimized URL
2. optimized fails (onError) -> set fallbackToOriginal = true -> render original src
3. original also fails (onError) -> set hasError = true -> render placeholder
```

