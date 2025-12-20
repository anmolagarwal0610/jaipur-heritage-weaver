/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - All pages should be responsive and work on mobile (375px+)
 * - Use responsive classes (sm:, md:, lg:, xl:)
 * - Ensure touch targets are at least 44x44px
 * - Test on mobile viewport before deploying
 */

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Core pages - load immediately for fast initial render
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

// Auth and dashboard pages - lazy load (less frequently accessed)
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));

// Admin pages - lazy load (admin-only access)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoriesManager = lazy(() => import("./pages/admin/CategoriesManager"));
const ProductsList = lazy(() => import("./pages/admin/ProductsList"));
const OrdersList = lazy(() => import("./pages/admin/OrdersList"));
const OrderDetail = lazy(() => import("./pages/admin/OrderDetail"));
const CustomersList = lazy(() => import("./pages/admin/CustomersList"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const SettingsPage = lazy(() => import("./pages/admin/Settings"));

// Configure React Query with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 30, // 30 minutes - cache retention
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      retry: 1,
    },
  },
});

// Loading fallback component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Core pages - no suspense needed (directly imported) */}
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Auth and dashboard - lazy loaded with suspense */}
            <Route path="/auth" element={
              <Suspense fallback={<PageLoader />}>
                <Auth />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } />
            
            {/* Admin Routes - accessible via /dashboard/admin */}
            <Route path="/dashboard/admin" element={
              <Suspense fallback={<PageLoader />}>
                <Admin />
              </Suspense>
            } />
            <Route element={
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            }>
              <Route path="/dashboard/admin/home" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="/dashboard/admin/products" element={
                <Suspense fallback={<PageLoader />}>
                  <CategoriesManager />
                </Suspense>
              } />
              <Route path="/dashboard/admin/products/:categoryId" element={
                <Suspense fallback={<PageLoader />}>
                  <ProductsList />
                </Suspense>
              } />
              <Route path="/dashboard/admin/orders" element={
                <Suspense fallback={<PageLoader />}>
                  <OrdersList />
                </Suspense>
              } />
              <Route path="/dashboard/admin/orders/:orderId" element={
                <Suspense fallback={<PageLoader />}>
                  <OrderDetail />
                </Suspense>
              } />
              <Route path="/dashboard/admin/customers" element={
                <Suspense fallback={<PageLoader />}>
                  <CustomersList />
                </Suspense>
              } />
              <Route path="/dashboard/admin/analytics" element={
                <Suspense fallback={<PageLoader />}>
                  <Analytics />
                </Suspense>
              } />
              <Route path="/dashboard/admin/settings" element={
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              } />
            </Route>
            
            {/* Explicit 404 for old /admin path */}
            <Route path="/admin" element={<NotFound />} />
            <Route path="/admin/*" element={<NotFound />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
