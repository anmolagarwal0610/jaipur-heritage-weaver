/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid stacks on mobile (single column)
 * - Cart items responsive with smaller images on mobile
 * - Touch targets minimum 44x44px
 * - Images use lazy loading
 * - Maintain responsive design in all future edits
 */

import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";

const cartItems = [
  {
    id: 1,
    name: "Royal Blue Jaipuri Bedsheet Set",
    price: 1499,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80",
    size: "King Size",
  },
  {
    id: 2,
    name: "Floral Block Print Quilt",
    price: 2999,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80",
    size: "Double Bed",
  },
];

const Cart = () => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'd like to place an order:\n\n${cartItems.map(item => 
      `• ${item.name} (${item.size}) x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
    ).join('\n')}\n\nSubtotal: ₹${subtotal.toLocaleString()}\nShipping: ${shipping === 0 ? 'Free' : `₹${shipping}`}\nTotal: ₹${total.toLocaleString()}`;
    
    window.open(`https://wa.me/919887238849?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <SEO 
          title="Shopping Cart - Jaipur Touch"
          description="View your shopping cart and proceed to checkout for handcrafted Jaipuri textiles."
          canonical="/cart"
        />
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4 md:mb-6" />
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3 md:mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/shop">
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90 h-11">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Shopping Cart - Jaipur Touch"
        description="Review your selected handcrafted Jaipuri textiles and place your order via WhatsApp."
        canonical="/cart"
      />

      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-3 md:py-4">
        <div className="container mx-auto px-4">
          <nav className="text-xs md:text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">Cart</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-6 md:mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 md:gap-4 p-3 md:p-4 bg-card border border-border rounded-lg md:rounded-xl"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-md md:rounded-lg overflow-hidden bg-secondary shrink-0">
                  <img
                    src={item.image}
                    alt={`${item.name} - Handcrafted Jaipuri textile`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-serif font-semibold text-foreground hover:text-gold transition-colors text-sm md:text-base line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-xs md:text-sm mt-0.5 md:mt-1">{item.size}</p>
                  <p className="font-semibold text-foreground mt-1 md:mt-2 text-sm md:text-base">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-2 md:mt-4">
                    <div className="flex items-center gap-1 md:gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 md:h-9 md:w-9" aria-label="Decrease quantity">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 md:w-8 text-center text-sm md:text-base">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8 md:h-9 md:w-9" aria-label="Increase quantity">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-9 w-9" aria-label="Remove item">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg md:rounded-xl p-4 md:p-6 sticky top-24">
              <h2 className="font-serif text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">
                Order Summary
              </h2>

              <div className="space-y-2 md:space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? (
                      <span className="text-olive">Free</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-olive text-xs">✓ Free shipping on orders above ₹999</p>
                )}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-base md:text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6 space-y-3">
                <Button 
                  className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 md:h-12"
                  onClick={handleWhatsAppOrder}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Order via WhatsApp
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  COD & Online Payment Available
                </p>
              </div>

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
                <Link to="/shop">
                  <Button variant="outline" className="w-full h-10 md:h-11">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
