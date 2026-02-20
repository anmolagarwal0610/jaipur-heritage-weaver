
## Root Cause: Confirmed — Two Duplicate "King Size" Subcategories in Firestore

The console log shows everything:

```
king-size (id: DQVcOdhceBy6qUR65Vxp)   ← .find() returns THIS (first match)
king-size (id: khe9Pny20GGxLEWVEObH)   ← products are assigned to THIS
```

At line 103 of `Shop.tsx`, `.find()` returns the **first** match in the array. The products in "Handblock Bedsheets" have `subCategoryId = khe9Pny20GGxLEWVEObH`, but the filter runs against `DQVcOdhceBy6qUR65Vxp`. Zero products match — hence "0 products found".

The three-tier matching already works perfectly. The slug match succeeds. The ID is just wrong because there are two records with the same slug.

---

### The Fix: Two Parts

**Part 1 — Code fix in `Shop.tsx` (immediate, handles duplicates gracefully):**

Instead of `.find()` (returns first match only), use `.filter()` to collect **all** subcategory IDs that match the slug. Then filter products against **any** of those IDs using a `Set`:

```typescript
// Collect ALL matching subcategory IDs (handles duplicate slugs)
const matchingSubIds = new Set(
  subCategories
    .filter(sc =>
      sc.slug === selectedSubCategorySlug ||
      normalizeSlug(sc.slug) === normTarget ||
      normalizeSlug(sc.name) === normTarget
    )
    .map(sc => sc.id)
);

if (matchingSubIds.size > 0) {
  filtered = filtered.filter(p => p.subCategoryId && matchingSubIds.has(p.subCategoryId));
}
```

This makes the filter work correctly even when duplicate subcategory records exist in Firestore. Both `DQVcOdhceBy6qUR65Vxp` and `khe9Pny20GGxLEWVEObH` will be in the set, so products assigned to either ID will show up.

**Part 2 — Admin: Expose the duplicate subcategories visually:**

In the `SubCategoriesManager.tsx` table, add a warning badge when two subcategories in the same category share the same slug. This helps you identify and clean up duplicates from the admin console directly.

Add a `duplicateSlugs` computed set:
```typescript
const duplicateSlugs = useMemo(() => {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  subCategories.forEach(sc => {
    if (seen.has(sc.slug)) dupes.add(sc.slug);
    else seen.add(sc.slug);
  });
  return dupes;
}, [subCategories]);
```

Then show a yellow "Duplicate slug" badge next to any subcategory whose slug appears more than once — so you can delete the empty duplicate (`DQVcOdhceBy6qUR65Vxp` which has 0 products).

---

### How This Happened

When you created the "King Size" subcategory the first time, a record was created with ID `DQVcOdhceBy6qUR65Vxp`. Products may have been assigned later to the second record (`khe9Pny20GGxLEWVEObH`), OR the subcategory was created twice. The `useSubCategories` hook fetches all subcategories from Firestore without deduplication — both records come back, and `.find()` always wins with the wrong one.

---

### Files to Change

| File | Change |
|------|--------|
| `src/pages/Shop.tsx` | Replace `.find()` with `.filter()` + `Set` to match ALL subcategories with same slug |
| `src/pages/admin/SubCategoriesManager.tsx` | Add duplicate slug detection + warning badge in the table |

---

### Technical Details

**`Shop.tsx` change (lines 100–113):**

Current (broken):
```typescript
const selectedSub =
  subCategories.find(sc => sc.slug === selectedSubCategorySlug) || ...

filtered = filtered.filter(p => p.subCategoryId === selectedSub.id);
```

Replacement (correct):
```typescript
const normTarget = normalizeSlug(selectedSubCategorySlug);
const matchingSubIds = new Set(
  subCategories
    .filter(sc =>
      sc.slug === selectedSubCategorySlug ||
      normalizeSlug(sc.slug) === normTarget ||
      normalizeSlug(sc.name) === normTarget
    )
    .map(sc => sc.id)
);

if (matchingSubIds.size > 0) {
  console.log('[Shop] Matched subcategory IDs:', [...matchingSubIds]);
  filtered = filtered.filter(p => p.subCategoryId && matchingSubIds.has(p.subCategoryId));
  console.log('[Shop] Products after subcat filter:', filtered.length);
} else {
  console.warn('[Shop] No subcategory found for slug:', selectedSubCategorySlug);
}
```

**`SubCategoriesManager.tsx` change:**

Add `duplicateSlugs` useMemo (described above) and in the Name cell of the table, add:
```tsx
{duplicateSlugs.has(subCategory.slug) && (
  <Badge variant="outline" className="text-amber-600 border-amber-400 text-xs ml-1">
    Duplicate slug — delete one
  </Badge>
)}
```

This visually flags the empty duplicate so you can delete it from the admin panel without touching Firestore directly.
