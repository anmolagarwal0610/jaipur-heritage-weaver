

## Plan: Admin Form Scrollability, Product Form Enhancements, and Storefront Product Page Improvements

This plan covers three major areas of improvement across the admin console and storefront.

---

### Issue 1: Add Scroll Capability to Sub-Category Dialog and All Admin Forms

**Current State:**
- The Category form dialog (`CategoriesManager.tsx` line 396) uses `overflow-y-auto` on `DialogContent` -- this works.
- The Sub-Category form dialog (`SubCategoriesManager.tsx` line 321) uses `max-w-lg` on `DialogContent` with **no scroll handling** -- if the form content exceeds viewport height, it gets cut off.
- The Product form (`ProductForm.tsx` line 389) already uses a `ScrollArea` component (line 407) -- this works.
- The Order Detail page and Settings page are full pages (not dialogs), so they scroll naturally.

**Changes:**

**File: `src/pages/admin/SubCategoriesManager.tsx`**
- Update the `DialogContent` at line 321 to add `max-h-[90vh] overflow-y-auto` classes (matching the Category dialog pattern)
- Change: `max-w-lg` to `max-w-lg max-h-[90vh] overflow-y-auto`

**File: `src/pages/admin/CategoriesManager.tsx`**
- Already has `max-h-[90vh] overflow-y-auto` on line 396 -- no changes needed, this is the reference pattern.

---

### Issue 2: Product Form Enhancements

#### 2a: Multi-Image Upload

**Current State:**
- The `ImageUpload` component (`src/components/admin/ImageUpload.tsx`) only accepts a single file at a time (`e.target.files?.[0]`)
- In the Product Form color variant section (line 690), only one `ImageUpload` slot is shown for adding images

**Changes:**

**File: `src/components/admin/MultiImageUpload.tsx`** (NEW)
- Create a new component specifically for uploading multiple images at once
- Accept `multiple` on the file input
- Process all selected files sequentially (to show progress for each)
- Support drag-and-drop of multiple files
- Show progress for each uploading file
- Call `onUploadComplete(url)` for each successfully uploaded file
- Props: `storagePath`, `onUploadComplete(url: string)`, `className`

**File: `src/pages/admin/ProductForm.tsx`**
- Replace the single `ImageUpload` component in the color variant images section (line 690-694) with the new `MultiImageUpload` component
- The existing uploaded images grid remains the same, but the upload slot now accepts multiple files

#### 2b: Remove Color Gradient Picker from Admin

**Current State:**
- In `ProductForm.tsx` lines 575-583, there's an `<input type="color">` picker that shows a color gradient/picker popup
- Admin enters both a color name AND picks a hex color from the gradient

**Changes:**

**File: `src/pages/admin/ProductForm.tsx`**
- Remove the color picker input (`<input type="color">`) entirely from the "Add New Color" section (lines 574-583)
- Remove the `newColorHex` state variable (line 117)
- When creating a color variant, set `colorHex` to a default neutral value (e.g., `'#888888'`) since it's no longer user-selected
- The "Add Colour" flow becomes: admin types color name, clicks "Add Colour" -- that's it
- In the collapsible variant list, remove the colored circle swatch display (line 610-613) since there's no meaningful hex anymore -- replace with just the color name text

#### 2c: Remove Color Gradient Swatch from Storefront

**Current State:**
- In `ProductDetail.tsx` lines 338-362, color variants are shown as circular swatches using `variant.colorHex` as `backgroundColor`
- When no meaningful hex is stored, these swatches will all look the same (grey circles)

**Changes:**

**File: `src/pages/ProductDetail.tsx`**
- Replace the colored circle swatches with text-based color selector buttons (e.g., pill/chip buttons showing the color name like "Indigo Blue", "Dusty Rose")
- When a color is selected, highlight the pill with the brand gold color
- This is more informative and doesn't rely on hex codes

#### 2d: Drag-and-Drop Image Reordering in Admin

**Current State:**
- Images are shown in a grid (line 668-695) with no reordering capability
- Image order is set by upload order (`order: variant.images.length`)
- The `order` field on `ProductImage` determines display order on storefront

**Changes:**

**File: `src/pages/admin/ProductForm.tsx`**
- Add drag-and-drop reordering to the image grid within each color variant
- Use native HTML5 drag-and-drop (no additional library needed)
- Each image thumbnail gets `draggable="true"` with `onDragStart`, `onDragOver`, `onDrop` handlers
- On drop, reorder the images array and update the `order` field on each image
- Add a visual drag handle indicator (grip icon) on each image
- The reordered images array is saved with the product, ensuring storefront displays images in the admin-defined order

---

### Issue 3: Storefront Product Page -- Performance and UX Improvements

**Root Cause Analysis of "Downloading" Behavior:**
The product detail page uses `OptimizedImage` for the main image (line 261), which generates URLs through the `resizeImage` Firebase function. Every time you click a thumbnail:
1. `selectedImage` state changes
2. The `OptimizedImage` component re-renders with a new `src`
3. A new HTTP request goes to the Firebase resize function
4. The function checks if a cached resized version exists -- if not, it downloads the original, resizes it, saves it, and returns it
5. This causes a noticeable delay/loading state each time

**Changes:**

**File: `src/pages/ProductDetail.tsx`**

1. **Pre-cache all image URLs**: Instead of constructing optimized URLs on every render, compute all optimized URLs once when color variant changes using `useMemo`. Use the 800px desktop URL for the main image.

2. **Replace OptimizedImage with direct img + preloading**: For the main product image, use a standard `<img>` tag with the pre-computed optimized URL. Add `<link rel="preload">` tags in a `useEffect` to preload ALL images for the selected color variant as soon as the page loads.

3. **Instant image switching with preloaded images**: Since images are preloaded in the browser cache, clicking thumbnails will switch instantly without any network delay.

4. **Add smooth transition animation**: Add a CSS transition/fade when switching between images (opacity crossfade) for a polished feel.

5. **Use thumbnail-size images for thumbnails**: Thumbnails (lines 249-254 and 286-289) already use `getOptimizedImageUrl(img.url, 400)` which is good. Keep this.

6. **Add keyboard navigation**: Allow left/right arrow keys to navigate between images when the gallery is focused.

7. **Handle image loading state gracefully**: Show a subtle skeleton/shimmer placeholder while the main image loads, not a blank area.

8. **Fix selectedImage index out of bounds**: When switching colors, the `selectedImage` is reset to 0 (line 349), which is correct. But add a safety check: if `selectedImage >= productImages.length`, clamp it to 0.

9. **Add pinch-to-zoom on mobile**: Currently the main image has no zoom capability mentioned. Add a simple tap-to-zoom or modal view on the main image for mobile users.

10. **Improve mobile thumbnail scroll**: The mobile thumbnail row (lines 275-293) uses `overflow-x-auto` but has no scroll indicators. Add scroll snap behavior for smoother swiping.

---

### Summary of All Files

| File | Action | Description |
|------|--------|-------------|
| `src/pages/admin/SubCategoriesManager.tsx` | Modify | Add `max-h-[90vh] overflow-y-auto` to dialog |
| `src/components/admin/MultiImageUpload.tsx` | Create | New multi-file upload component |
| `src/pages/admin/ProductForm.tsx` | Modify | Use MultiImageUpload, remove color picker, add drag-drop reorder |
| `src/pages/ProductDetail.tsx` | Modify | Preload images, instant switching, text color selector, transitions, keyboard nav |

---

### Technical Details

**Drag-and-drop reordering approach:**
- Uses native HTML5 Drag and Drop API (no extra dependencies)
- `onDragStart`: Store the dragged image index
- `onDragOver`: `e.preventDefault()` to allow drop, add visual indicator
- `onDrop`: Splice the image from old position to new position, update all `order` fields
- Visual feedback: dragged item gets reduced opacity, drop target gets a border highlight

**Image preloading approach:**
```text
1. On page load / color change:
   - Compute all optimized URLs for current color's images
   - Create Image() objects to trigger browser caching
   
2. On thumbnail click:
   - Change selectedImage index
   - Image loads instantly from browser cache
   - Crossfade transition plays (150ms opacity)
```

**Text-based color selector (replacing hex swatches):**
- Render as pill-shaped buttons with the color name
- Selected state: gold background with white text
- Unselected state: outlined border, hover effect
- Accessible: proper `aria-label` with color name

