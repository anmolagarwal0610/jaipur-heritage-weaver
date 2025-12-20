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
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Eager-load main pages to avoid showing the full-page loader on every navigation
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

// Lazy-load heavier/rarely-visited areas
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));

// Admin pages
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

// Minimal loading fallback - just a subtle spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Admin Routes - accessible via /dashboard/admin */}
              <Route path="/dashboard/admin" element={<Admin />} />
              <Route element={<AdminLayout />}>
                <Route path="/dashboard/admin/home" element={<AdminDashboard />} />
                <Route path="/dashboard/admin/products" element={<CategoriesManager />} />
                <Route path="/dashboard/admin/products/:categoryId" element={<ProductsList />} />
                <Route path="/dashboard/admin/orders" element={<OrdersList />} />
                <Route path="/dashboard/admin/orders/:orderId" element={<OrderDetail />} />
                <Route path="/dashboard/admin/customers" element={<CustomersList />} />
                <Route path="/dashboard/admin/analytics" element={<Analytics />} />
                <Route path="/dashboard/admin/settings" element={<SettingsPage />} />
              </Route>
              
              {/* Admin URL compatibility redirects */}
              <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
              <Route path="/admin/dashboard" element={<Navigate to="/dashboard/admin/home" replace />} />
              <Route path="/admin/*" element={<Navigate to="/dashboard/admin" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
