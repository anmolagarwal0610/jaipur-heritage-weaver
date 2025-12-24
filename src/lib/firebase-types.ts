/**
 * Firebase/Firestore Type Definitions
 * 
 * Firestore Collections Structure:
 * - users/{userId} - User profiles
 * - orders/{orderId} - Order documents
 * - products/{productId} - Product catalog
 * - categories/{categoryId} - Product categories
 * - store_settings/{settingId} - Store configuration
 * - user_roles/{roleId} - User role assignments
 */

import { Timestamp } from 'firebase/firestore';

// User profile stored in Firestore
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  phone: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User roles stored separately for security
export type UserRole = 'admin' | 'moderator' | 'user';

export interface UserRoleDocument {
  userId: string;
  role: UserRole;
  assignedAt: Timestamp;
}

// Product category with Rockstar support
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string; // Main category image
  
  // Rockstar category settings (featured on homepage)
  isRockstar: boolean;
  rockstarOrder: number | null; // 1-6 position, null if not rockstar
  rockstarImageUrl: string | null; // Cover image for homepage display
  
  // Taskbar visibility (mega menu in header)
  visibleOnTaskbar: boolean;
  
  // Featured products limit for this category
  featuredProductLimit: number; // Default 4
  
  // Metadata
  order: number; // Display order in category list
  productCount: number;
  subCategoryCount: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Sub-category within a category
export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  
  // Parent category reference
  categoryId: string;
  categoryName: string;
  
  // Display settings
  showBadgeOnProducts: boolean; // Controls if badge shows in shop
  visibleOnTaskbar: boolean; // Controls visibility in header mega menu
  
  // Metadata
  order: number;
  productCount: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Product color variant with its own images
export interface ProductColorVariant {
  id: string;
  colorName: string;
  colorHex: string; // Hex code for the swatch
  images: ProductImage[];
}

// Product document with home decor specific fields
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string; // For card displays
  
  // Pricing
  price: number;
  compareAtPrice: number | null; // Original price for showing discount
  
  // Category
  categoryId: string;
  categoryName: string; // Denormalized for display
  
  // Sub-category
  subCategoryId: string | null;
  subCategoryName: string | null;
  
  // Images (default/no-color images)
  images: ProductImage[];
  primaryImageUrl: string; // Main display image
  
  // Color Variants (each has its own images)
  colorVariants: ProductColorVariant[];
  
  // Inventory
  sku: string;
  inStock: boolean;
  stockQuantity: number;
  
  // Featured product settings
  isFeatured: boolean;
  featuredOrder: number | null; // Position on homepage, null if not featured
  
  // Home decor specific attributes
  fabric: string | null; // Cotton, Silk, Linen, etc.
  material: string | null; // Thread count, GSM, etc.
  sizes: string[]; // Multiple sizes: King, Queen, Standard, etc.
  dimensions: {
    length: number | null;
    width: number | null;
    height: number | null;
    unit: 'cm' | 'inch';
  } | null;
  color: string | null; // Legacy single color field
  pattern: string | null; // Block print, Floral, Geometric, etc.
  careInstructions: string | null;
  
  // Additional info
  tags: string[];
  badge: 'new' | 'bestseller' | 'sale' | 'limited' | null;
  
  // Metadata
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Product image with ordering
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

// Order status
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order item
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
  sku: string;
  size: string | null;
  color: string | null;
}

// Order document
export interface Order {
  id: string;
  orderNumber: string; // Human-readable order number
  userId: string;
  userEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  
  // Pricing
  subtotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  
  // Shipping
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Payment
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  
  // Tracking
  trackingNumber: string | null;
  shippedAt: Timestamp | null;
  deliveredAt: Timestamp | null;
  
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Store settings
export interface StoreSettings {
  id: string;
  
  // General
  storeName: string;
  storeEmail: string;
  storePhone: string;
  
  // Homepage settings
  maxRockstarCategories: number; // Default 6
  maxFeaturedProducts: number; // Default featured per category
  
  // Product settings
  productSizeOptions: string[]; // Configurable size options
  
  // Shipping
  freeShippingThreshold: number;
  defaultShippingCost: number;
  
  // Currency
  currency: string;
  currencySymbol: string;
  
  // WhatsApp settings
  whatsappEnabled: boolean;
  whatsappNumber: string;
  
  updatedAt: Timestamp;
}

// Form types for creating/editing (without Firestore-specific fields)
export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount' | 'subCategoryCount'>;
export type SubCategoryFormData = Omit<SubCategory, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>;
export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type OrderFormData = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>;
