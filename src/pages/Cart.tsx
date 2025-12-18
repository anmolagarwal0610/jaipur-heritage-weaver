import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
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
    
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/shop">
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
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
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">Cart</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-card border border-border rounded-xl"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-secondary shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-serif font-semibold text-foreground hover:text-gold transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1">{item.size}</p>
                  <p className="font-semibold text-foreground mt-2">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
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
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                  onClick={handleWhatsAppOrder}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Order via WhatsApp
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  COD & Online Payment Available
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Link to="/shop">
                  <Button variant="outline" className="w-full">
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
