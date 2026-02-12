

## Plan: Fix Subcategory Filter, Image Loading, and Mobile Thumbnails

### Issue 1: Subcategory Filter Broken + Infinite Loop

**Root Cause Analysis - 6 potential causes investigated:**

1. **[CONFIRMED - INFINITE LOOP] Circular useEffect dependency between URL sync and state sync.** Lines 56-61 and 64-69 in `Shop.tsx` create a loop: state changes trigger URL update (effect 1), URL change triggers state update (effect 2), which triggers URL update again. This causes the "vibrating text" symptom -- rapid re-renders as both effects fire alternately.

2. **[CONFIRMED - NO PRODUCTS] Subcategory slug mismatch.** When clicking from the mega menu, the URL contains `subcategory=king-size`. The filtering at line 97 looks up `subCategories.find(sc => sc.slug === selectedSubCategorySlug)`. If the subcategory's `slug` field in Firestore doesn't exactly match `king-size` (e.g., it could be `king_size` or `King Size`), the lookup fails and no products match.

3. **[CONFIRMED - NO PRODUCTS] Category slug not passed correctly from mega menu.** The mega menu links to `/shop?category=${currentCategory?.slug}&subcategory=${sub.slug}`. If `currentCategory?.slug` is the Firestore slug but the Shop page compares against `categories.find(c => c.slug === selectedCategorySlug)`, any mismatch means no category match and therefore no products.

4. **[INVESTIGATED] Products might not have `isActive` set.** The filter at line 87 does `products.filter(p => p.isActive)`. If a product doesn't have `isActive` field at all, `p.isActive` would be `undefined` (falsy), hiding the product. This is possible but less likely since products are being created through the admin form.

5. **[INVESTIGATED] Firestore index missing for products query.** The network logs show a `code: 9` error requiring a composite index for `categoryId + isActive + createdAt`. This affects `fetchRelatedProducts` but not the main `useProducts()` call in Shop (which fetches all products with just `orderBy('createdAt', 'desc')`).

6. **[INVESTIGATED] `useSubCategories()` called without categoryId.** Shop.tsx calls `useSubCategories()` with no argument, which fetches ALL subcategories. This is correct for the lookup logic.

**Fix:**

**File: `src/pages/Shop.tsx`**
- **Remove the dual useEffect loop.** Replace the two competing effects with a single `useEffect` that reads from URL params on mount/URL change and sets state, plus use `setSearchParams` directly inside the handler functions (not in a separate effect). This eliminates the circular dependency.
- The `handleCategorySelect` and `handleSubCategorySelect` functions will directly call `setSearchParams` in addition to setting state, removing the need for the state-to-URL sync effect entirely.

---

### Issue 2: Desktop Hover Image Loading Delay (2-3 seconds per hover)

**Root Cause:**
The desktop main image (line 474) uses a raw `<img>` tag with `src={mainImageSrc}`. The `mainImageSrc` is computed from `getOptimizedImageUrl()` which points to the Firebase resize function. This function returns 500 errors, triggering the `handleMainImageError` fallback to the original URL. The problem:

1. On each hover, `selectedImage` changes
2. `mainImageFallback` is reset to `false` (line 227)
3. The component first tries the optimized URL (which returns 500)
4. Only after the 500 error does it fallback to original
5. This 500 request + fallback happens on EVERY hover, even for previously viewed images

The `loadedImages` Set tracks preload completion, but the main image still goes through the optimized-then-fallback cycle each time because `mainImageFallback` resets per image index.

**Fix in `src/pages/ProductDetail.tsx`:**
- Change `mainImageFallback` from a single boolean to a `Set<number>` tracking which image indices have already failed optimization
- When image at index N fails, add N to the set
- On subsequent hovers to index N, immediately use the original URL (skip the failed optimized attempt)
- This means: first view = try optimized, fail, fallback; subsequent views = instant original URL

---

### Issue 3: Mobile Thumbnails Overflow Page Width

**Root Cause:** The thumbnail strip at line 403-430 uses `overflow-x-auto` which should scroll, but the container has no `max-width` constraint. The `flex-shrink-0` on each thumbnail prevents them from shrinking, and the parent container may not be constraining width properly.

**Fix in `src/pages/ProductDetail.tsx`:**
- Add `max-w-full` and `w-full` to the thumbnail strip container
- Ensure the parent `<div>` constrains width properly
- The key fix: the thumbnail container needs an explicit width constraint so `overflow-x-auto` activates. Add `overflow-hidden` to the parent container wrapping the entire mobile gallery section.

---

### Summary of File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Shop.tsx` | Modify | Fix infinite loop by removing dual useEffect, sync URL directly in handlers |
| `src/pages/ProductDetail.tsx` | Modify | Fix per-image fallback tracking, constrain mobile thumbnail width |

### Technical Details

**Shop.tsx infinite loop fix:**
- Remove the effect at lines 56-61 (state-to-URL sync)
- Keep only the URL-to-state sync effect (lines 64-69) for handling external navigation (mega menu clicks)
- Move `setSearchParams` calls into `handleCategorySelect` and `handleSubCategorySelect` directly
- This breaks the circular dependency: URL changes set state (one-way), and user actions set both state and URL (direct)

**ProductDetail.tsx fallback tracking:**
- Replace `const [mainImageFallback, setMainImageFallback] = useState(false)` with `const [failedOptimized, setFailedOptimized] = useState<Set<number>>(new Set())`
- Reset the set when `selectedColorId` changes (not on every image switch)
- `mainImageSrc` becomes: `failedOptimized.has(safeSelectedImage) ? imageData[safeSelectedImage]?.original : imageData[safeSelectedImage]?.full`
- On error: `setFailedOptimized(prev => new Set(prev).add(safeSelectedImage))`

**Mobile thumbnail width fix:**
- Wrap the mobile gallery in a container with `overflow-hidden w-full`
- The thumbnail strip already has `overflow-x-auto` which will now correctly activate since the parent constrains width

