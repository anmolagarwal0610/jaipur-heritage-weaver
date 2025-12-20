/**
 * Order Confirmation Page
 * Displays order success message and details
 */

import { useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, MessageCircle, Home, Package } from "lucide-react";
import { useOrder } from "@/hooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const { order, loading } = useOrder(orderId);
  
  // Get order number from navigation state or from fetched order
  const orderNumber = location.state?.orderNumber || order?.orderNumber;

  // Send WhatsApp confirmation
  const handleWhatsAppConfirmation = () => {
    if (!order) return;
    
    const message = `Hi! I just placed an order.\n\n` +
      `Order Number: ${order.orderNumber}\n` +
      `Total Amount: ₹${order.totalAmount.toLocaleString()}\n` +
      `Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}\n\n` +
      `Please confirm my order. Thank you!`;
    
    window.open(`https://wa.me/919887238849?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <Skeleton className="w-20 h-20 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Order Confirmed - Jaipur Touch" 
        description="Your order has been successfully placed"
        canonical={`/order-confirmation/${orderId}`}
      />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon with Animation */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-olive/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-olive" />
            </div>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Order Confirmed!
          </h1>
          
          <p className="text-muted-foreground mb-2">
            Thank you for your order. We've received it and will process it shortly.
          </p>

          {orderNumber && (
            <div className="bg-secondary/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-mono text-lg font-semibold text-foreground">{orderNumber}</p>
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className="bg-card border border-border rounded-xl p-6 text-left mb-8">
              <h2 className="font-serif font-semibold text-foreground mb-4">Order Details</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4 pb-4 border-b border-border">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.productName} {item.size && `(${item.size})`} × {item.quantity}
                    </span>
                    <span className="text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Shipping to:</p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              {/* Payment Info */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm">
                  <span className="text-muted-foreground">Payment Method: </span>
                  <span className="text-foreground font-medium">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleWhatsAppConfirmation}
              className="w-full bg-olive text-olive-foreground hover:bg-olive/90 h-12"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Confirm via WhatsApp
            </Button>

            {user && (
              <Link to="/dashboard?tab=orders" className="block">
                <Button variant="outline" className="w-full h-11">
                  <Package className="w-4 h-4 mr-2" />
                  View My Orders
                </Button>
              </Link>
            )}

            <Link to="/shop" className="block">
              <Button variant="ghost" className="w-full h-11">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground mt-6">
            Questions about your order? Contact us on WhatsApp or email us at jaipurtouch@gmail.com
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
