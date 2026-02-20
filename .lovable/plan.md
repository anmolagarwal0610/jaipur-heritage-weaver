
## Plan: Fix Subcategory Filter (Root Cause) + Admin Price/Stock Display

---

### Issue 1: Subcategory Filter — Full Root Cause Analysis

**7 possible causes investigated:**

1. **[ELIMINATED] Race condition / loading guard** — Already fixed. The `subCategoriesLoading` guard prevents filtering before data arrives.

2. **[ELIMINATED] Slug mismatch** — `useSubCategories()` with no `categoryId` fetches all subcategories, so "king-size" slug will be found after loading.

3. **[ELIMINATED] isActive filter** — Already fixed with `p.isActive !== false`.

4. **[CONFIRMED — PRIMARY CAUSE] Products have `subCategoryId: null`** — The admin screenshot shows "King Size" has 10 products, but they were all created before subcategory assignment was a standard workflow. Looking at the type definition: `subCategoryId: string | null`. These legacy products have `subCategoryId = null`. The filter `p.subCategoryId === selectedSub.id` will never match `null === "some-firestore-id"`. The products DO exist in "Handblock Bedsheets" category (shown without subcategory filter), but they were never assigned to "King Size" subcategory in Firestore.

5. **[CONFIRMED — SECONDARY CAUSE] Admin ProductsList does not write `subCategoryId` back to products** — When products show up in the "King Size" admin view, it is because `ProductsList.tsx` filters client-side: `allProducts.filter(p => p.subCategoryId === subCategoryId)`. But the admin screenshot shows 10 products listed under King Size — this means those products DO have the `subCategoryId` set in Firestore (they show up in the admin). So the filter should work.

6. **[RE-CONFIRMED — ACTUAL CAUSE] Products shown in admin King Size view ARE filtered client-side correctly, meaning `p.subCategoryId` IS set on those products.** The Shop filter bug is therefore elsewhere. Looking again at the Shop filter code at line 92-95:
   ```
   if (subCategoriesLoading) return [];
   const selectedSub = subCategories.find(sc => sc.slug === selectedSubCategorySlug);
   if (selectedSub) {
     filtered = filtered.filter(p => p.subCategoryId === selectedSub.id);
   ```
   The `selectedSub` lookup must be returning `undefined` even after loading. Why? Because `useSubCategories()` in Shop is called with **no argument** — its React Query key is `['subcategories', undefined]`. On first load this fetches all subcategories correctly. BUT if the React Query cache already has `['subcategories', undefined]` from a previous visit, and during that previous visit the fetch returned before all subcategories were saved, the stale cache (5 minutes) might serve incorrect data. More likely: **the `selectedSubCategorySlug` state is being set BEFORE `subCategories` data arrives**, and since both `subCategoriesLoading` and then `!subCategoriesLoading` transitions happen, the filter runs once with `selectedSub = undefined` and then the component never re-computes because the deps haven't actually changed between the two renders.

7. **[CONFIRMED — ROOT CAUSE] The `subCategoriesLoading` guard returns `[]` (empty array) while loading — but this empty array becomes the `filteredProducts` value cached by `useMemo`. When `subCategoriesLoading` flips to `false`, `subCategories` is populated. However, the `useMemo` will only re-run if its dependencies change. `subCategories` IS a dependency, so this should work. The actual problem is simpler: looking at the `console.warn` on line 98 — `Subcategory slug "${selectedSubCategorySlug}" not found in loaded subcategories`. This warn fires when `selectedSub` is `undefined` after loading. The slug from the URL (`king-size`) doesn't match any subcategory slug in Firestore.** This means the subcategory was created with a different slug (e.g., `king-size-bedsheets`, or `kingsize`, or the slug was manually edited). The fix is to add a debug log to expose the actual slugs, AND add a fallback that matches by name if slug fails.

**Definitive Fix Strategy:**

Since we cannot see the actual Firestore data from here, we need two parallel fixes:

**Fix A — Slug-based fallback (in Shop.tsx):** If the exact slug lookup fails, try matching by normalizing both slugs (lowercase, strip spaces/special chars). Also add a name-based fallback search.

**Fix B — Debug logging:** Add a temporary `console.log` that prints all loaded subcategory slugs so the mismatch is immediately visible in the browser console.

**Fix C — Admin ProductsList: Show correct Price and Stock from `sizeVariants`:** The `₹NaN` in admin is because `product.price` is the deprecated legacy field (undefined for new products). The fix reads `product.sizeVariants?.[0]?.price` as the display price, and the first color variant's total stock from `sizeInventory`.

---

### Issue 2: Admin ProductsList — Price ₹NaN and Empty Stock

**Root Cause:** `ProductsList.tsx` at line 259 calls `formatPrice(product.price)`. The `Product` type shows `price?: number` is **deprecated** — new products built with the variant system store pricing in `sizeVariants[0].price`, not in the root `price` field. Since `product.price` is `undefined`, `formatPrice(undefined)` results in `₹NaN`.

Similarly, `product.stockQuantity` at line 269 is deprecated — actual stock lives in `colorVariants[0].sizeInventory`.

**Fix in `src/pages/admin/ProductsList.tsx`:**

Price display logic:
```
const displayPrice = product.sizeVariants?.[0]?.price ?? product.price;
const displayCompareAt = product.sizeVariants?.[0]?.compareAtPrice ?? product.compareAtPrice;
const sizeName = product.sizeVariants?.[0]?.sizeName;
```

Show as: `₹1,899 (King)` — so admins know which size the price corresponds to.

Stock display logic:
```
const firstColor = product.colorVariants?.[0];
const totalStock = firstColor?.sizeInventory?.reduce((sum, si) => sum + si.stockQuantity, 0) 
  ?? product.stockQuantity;
```

Show total stock across all sizes for the first color variant.

---

### Summary of File Changes

| File | Change | Why |
|------|--------|-----|
| `src/pages/Shop.tsx` | Add slug normalization fallback + name-based lookup + debug logging | Handles slug mismatch between URL param and Firestore data |
| `src/pages/admin/ProductsList.tsx` | Read `sizeVariants[0].price` for price, compute stock from `colorVariants[0].sizeInventory` | Fix ₹NaN and empty stock for variant-based products |

---

### Technical Details

**Shop.tsx — Subcategory slug matching with fallback:**

Replace the single `.find(sc => sc.slug === selectedSubCategorySlug)` with a three-tier lookup:
1. Exact slug match: `sc.slug === selectedSubCategorySlug`
2. Normalized match: `normalize(sc.slug) === normalize(selectedSubCategorySlug)` where normalize strips hyphens/spaces and lowercases
3. Name-based match: `normalize(sc.name) === normalize(selectedSubCategorySlug)`

Also add: `console.log('[Shop] Loaded subcategory slugs:', subCategories.map(sc => sc.slug))` — this will instantly reveal the mismatch in the browser console.

**ProductsList.tsx — Variant-aware price and stock:**

```typescript
// Price: use first sizeVariant price, fall back to legacy price field
const getDisplayPrice = (product: Product) => {
  if (product.sizeVariants?.length > 0) {
    const firstVariant = product.sizeVariants[0];
    return { price: firstVariant.price, label: firstVariant.sizeName };
  }
  return { price: product.price || 0, label: null };
};

// Stock: sum all size inventories for first color, or fall back to legacy
const getDisplayStock = (product: Product) => {
  const firstColor = product.colorVariants?.[0];
  if (firstColor?.sizeInventory?.length > 0) {
    return firstColor.sizeInventory.reduce((sum, si) => sum + (si.stockQuantity || 0), 0);
  }
  return product.stockQuantity;
};
```
