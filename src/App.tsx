/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - All pages should be responsive and work on mobile (375px+)
 * - Use responsive classes (sm:, md:, lg:, xl:)
 * - Ensure touch targets are at least 44x44px
 * - Test on mobile viewport before deploying
 */

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Eager-load main pages to avoid showing the full-page loader on every navigation
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

// Lazy-load auth/dashboard pages (less frequently visited)
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Eager-load admin pages to avoid lazy loading spinners inside admin console
import Admin from "./pages/Admin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoriesManager from "./pages/admin/CategoriesManager";
import SubCategoriesManager from "./pages/admin/SubCategoriesManager";
import ProductsList from "./pages/admin/ProductsList";
import OrdersList from "./pages/admin/OrdersList";
import OrderDetail from "./pages/admin/OrderDetail";
import CustomersList from "./pages/admin/CustomersList";
import Analytics from "./pages/admin/Analytics";
import SettingsPage from "./pages/admin/Settings";

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
      <CartProvider>
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
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Admin Routes - Admin.tsx wraps ALL admin routes for password protection */}
                <Route path="/dashboard/admin" element={<Admin />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<AdminDashboard />} />
                    <Route path="products" element={<CategoriesManager />} />
                    <Route path="categories/:categoryId/subcategories" element={<SubCategoriesManager />} />
                    <Route path="categories/:categoryId/subcategories/:subCategoryId/products" element={<ProductsList />} />
                    <Route path="orders" element={<OrdersList />} />
                    <Route path="orders/:orderId" element={<OrderDetail />} />
                    <Route path="customers" element={<CustomersList />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
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
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
