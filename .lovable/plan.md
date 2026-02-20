
## Plan: Fix Subcategory Filtering + resizeImage 500 Error Resolution

---

### Issue 1: Subcategory Filter Shows 0 Products — Root Cause Analysis

**Confirmed Root Cause (two separate bugs working together):**

**Bug A — isActive silent filter:** `filteredProducts` at line 79 runs `products.filter(p => p.isActive)`. Products created before the `isActive` field was added to the form (or products where it was never explicitly set) will have `isActive === undefined`, which is falsy. These products vanish silently. This is why removing the subcategory filter (which shows the category) shows products — the category filter path is less strict.

**Bug B — Race condition on subCategories data:** When arriving from the mega menu (direct URL navigation), the URL params are immediately available, but `subCategories` from the Firestore query may not be loaded yet. The `filteredProducts` useMemo runs when `searchParams` changes (triggering `selectedSubCategorySlug` state update), but `subCategories` is still empty `[]`. So `subCategories.find(sc => sc.slug === "king-size")` returns `undefined`, the subcategory filter is skipped/empty, and 0 products show. Once subCategories loads, the useMemo should re-run — but because `selectedSubCategorySlug` hasn't changed, if `products` and `categories` also haven't changed, React may not re-run the memoization.

**Fix in `src/pages/Shop.tsx`:**

1. **Fix Bug A:** Change `products.filter(p => p.isActive)` to `products.filter(p => p.isActive !== false)` — this treats `undefined` as active (safe default), only explicitly deactivated products are hidden.

2. **Fix Bug B:** Add `subCategoriesLoading` awareness — show products only when all data is ready. The filteredProducts useMemo already depends on `subCategories`, so it will re-run when subcategories load. However, the issue is the loading state — we show "No products found" while data is loading. Fix: add a combined `loading` check that includes subcategories, and during loading show skeletons instead of the empty state. The `loading` variable already includes `subCategoriesLoading` (line 140), so we need to make sure the "No products" empty state only shows when `!loading && sortedProducts.length === 0`.

3. **Add defensive fallback:** If `selectedSubCategorySlug` is set but the subcategory object isn't found yet (still loading), don't filter — wait for data.

---

### Issue 2: resizeImage 500 Error — Root Cause & Fix Steps

**Root Cause (confirmed from logs):**
```
Error: Permission 'iam.serviceAccounts.signBlob' denied on resource
```
The Cloud Function is trying to generate a **signed URL** for the resized image in Firebase Storage. To generate signed URLs, the service account running the function needs the `iam.serviceAccounts.signBlob` IAM permission. The default App Engine/Cloud Functions service account (`PROJECT_ID@appspot.gserviceaccount.com`) does NOT have this permission by default on newer Firebase projects.

**This is a Google Cloud IAM configuration issue — not a code bug.** It requires a one-time fix in the Google Cloud Console.

**Steps to fix (you need to do this in Firebase/Google Cloud Console):**

Step 1 — Go to [Google Cloud Console IAM](https://console.cloud.google.com/iam-admin/iam) and select your project `jaipur-touch-d8a54`.

Step 2 — Find the service account used by your Cloud Function. It will be named `jaipur-touch-d8a54@appspot.gserviceaccount.com` (App Engine default service account).

Step 3 — Click the pencil (Edit) icon next to that service account.

Step 4 — Click "Add another role" and search for **"Service Account Token Creator"** (role ID: `roles/iam.serviceAccountTokenCreator`). Add it.

Step 5 — Click Save. The permission propagates within 1-2 minutes.

Step 6 — Test by opening any product page — images should now load via the resizeImage function without 500 errors.

**Alternative fix (if the above doesn't work):** In your Cloud Function code, instead of generating a signed URL, make the resized images publicly accessible by setting their metadata to `public: true` and returning the direct storage URL instead. But the IAM role fix above is the correct solution.

**Code-side fix (already done, no change needed):** The `failedOptimized` Set in `ProductDetail.tsx` already handles the 500 errors gracefully — if the optimize call fails, it instantly falls back to the original URL without retrying. So the frontend already handles this correctly once the IAM permission is granted.

---

### Summary of Code Changes

| File | Change | Reason |
|------|--------|--------|
| `src/pages/Shop.tsx` | Change `p.isActive` to `p.isActive !== false` | Fix silent product hiding for older products |
| `src/pages/Shop.tsx` | Only show empty state when `!loading` (already partially done, verify line 329) | Fix race condition showing "0 products" while subcategories load |
| `src/pages/Shop.tsx` | Add `subCategoriesLoading` guard in filteredProducts | Prevent filtering before data is ready |

**No Firebase Cloud Function code changes needed** — the IAM role grant resolves the resizeImage issue completely.
