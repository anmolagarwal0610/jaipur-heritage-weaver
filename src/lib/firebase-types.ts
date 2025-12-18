/**
 * Firebase/Firestore Type Definitions
 * 
 * Firestore Collections Structure:
 * - users/{userId} - User profiles
 * - orders/{orderId} - Order documents
 * - products/{productId} - Product catalog
 * - categories/{categoryId} - Product categories
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

// Product category
export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  order: number;
}

// Product document
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  images: string[];
  inStock: boolean;
  sku: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
}

// Order document
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'cod' | 'online';
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
