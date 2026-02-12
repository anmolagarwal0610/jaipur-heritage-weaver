

## Plan: Product Page UX Fixes + Subcategory Filtering

This plan addresses 5 specific issues plus overall polish improvements.

---

### Issue 1: Mobile Carousel Skips Images on Fast Swipe

**Root Cause:** The carousel uses CSS `scroll-snap-x` with `scroll-smooth`, which allows momentum scrolling to jump multiple snap points.

**Fix in `src/pages/ProductDetail.tsx`:**
- Remove `scroll-smooth` from the carousel container (it interferes with snap behavior during fast swipes)
- Add `-webkit-overflow-scrolling: touch` is already set; the key fix is removing `scroll-smooth`
- Change snap type from `snap-x snap-mandatory` to ensure each child uses `snap-start` instead of `snap-center` (more predictable single-step behavior)
- Add `will-change: scroll-position` for GPU-accelerated scrolling
- The `scroll-snap-stop: always` CSS property on each child prevents skipping -- this is the critical fix. Add inline style `scrollSnapStop: 'always'` to each slide

---

### Issue 2: Subcategory Filtering in Shop Page

**Root Cause:** The Shop page only reads `category` from the URL query params and completely ignores the `subcategory` param, even though the mega menu and mobile menu both link to `/shop?category=X&subcategory=Y`.

**Changes to `src/pages/Shop.tsx`:**

1. Add `selectedSubCategorySlug` state initialized from `searchParams.get("subcategory")`
2. Update `useEffect` to sync both `category` and `subcategory` params to the URL
3. Compute `activeSubCategories` -- subcategories that belong to the selected category
4. Update `filteredProducts` to filter by subcategory when one is selected
5. Add subcategory filter UI:
   - **Desktop sidebar:** Below the Categories section, show a "Subcategories" section (only when a category is selected) with checkbox-style filters matching the existing category pattern
   - **Mobile filter sheet:** Same subcategory section appears below categories
6. Show active subcategory filter as a removable chip in the active filters bar
7. Add a `handleSubCategorySelect` function that sets the slug and closes mobile filters

---

### Issue 3: Zoom Modal Shows Oversized Image with No Close

**Root Cause:** The zoom modal renders the image at `max-w-[200%] max-h-[200%]` which makes it appear zoomed-in. The close button exists but is small and hard to notice against the dark background.

**Fix in `src/pages/ProductDetail.tsx`:**
- Change the fullscreen modal to a **simple fullscreen image viewer** (not a zoom):
  - Set image to `max-w-full max-h-full object-contain` (fits the screen, no zoom)
  - Remove `touch-pinch-zoom` and `overflow-auto` from the container
  - Make the close button larger and more prominent (top-right, white X on semi-transparent circle, larger hit target)
  - Keep navigation arrows and dot indicators
  - Tapping the image itself closes the modal (intuitive mobile behavior)

---

### Issue 4: Add Mobile Thumbnail Strip Below Carousel

**Changes to `src/pages/ProductDetail.tsx`:**
- Below the dot indicators on mobile, add a horizontally scrollable thumbnail strip
- Each thumbnail: small image (48x48px), rounded, with active border highlight
- Use `overflow-x-auto` with `snap-x` for smooth horizontal scrolling
- Tapping a thumbnail scrolls the main carousel to that image
- Hide scrollbar with `scrollbar-width: none`
- Only show when there are 2+ images

---

### Issue 5: Desktop Hover Delay on Thumbnails (2-3 seconds)

**Root Cause:** Although images are preloaded via `new Image()`, the `imageLoaded` state is set to `false` on every hover (line 161), triggering a fade-out/skeleton. The image then needs to fire its `onLoad` event to show again. This creates a perceived 2-3 second delay even though the image may already be cached.

**Fix in `src/pages/ProductDetail.tsx`:**
- Track which images have been loaded in a `Set<number>` (e.g., `loadedImages` state)
- On first load of each image, add its index to the set
- On subsequent hovers, if the image is already in `loadedImages`, skip the fade transition entirely (set `imageLoaded` to `true` immediately)
- This means: first hover = brief fade transition; subsequent hovers = instant switch
- Additionally, in the preload `useEffect`, mark images as loaded when the `Image()` object fires `onload`

---

### Summary of File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/ProductDetail.tsx` | Modify | Fix carousel snap-stop, simplify zoom modal, add mobile thumbnails, fix hover delay |
| `src/pages/Shop.tsx` | Modify | Add subcategory filtering with URL sync and sidebar UI |

