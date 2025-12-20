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

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const OurStory = lazy(() => import("./pages/OurStory"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

const queryClient = new QueryClient();

// Loading fallback component
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
          <Suspense fallback={<PageLoader />}>
            <Routes>
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
              
              {/* Explicit 404 for old /admin path */}
              <Route path="/admin" element={<NotFound />} />
              <Route path="/admin/*" element={<NotFound />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
