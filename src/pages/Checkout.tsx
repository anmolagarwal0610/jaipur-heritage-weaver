/**
 * Checkout Page
 * Collects shipping information and creates orders
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { ShoppingBag, ArrowLeft, CreditCard, Truck, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email address").max(255),
  street: z.string().min(5, "Street address is required").max(200),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  paymentMethod: z.enum(["cod", "online"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getShipping, getTotal, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const { createOrder, loading: creatingOrder } = useCreateOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShipping(subtotal);
  const total = getTotal();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: userProfile?.displayName || "",
      email: user?.email || "",
      phone: userProfile?.phone || "",
      street: userProfile?.address?.street || "",
      city: userProfile?.address?.city || "",
      state: userProfile?.address?.state || "",
      pincode: userProfile?.address?.pincode || "",
      paymentMethod: "cod",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");

  const handleWhatsAppOrder = (data: CheckoutFormData) => {
    const message = `Hi! I'd like to place an order:\n\n` +
      `*Customer Details*\n` +
      `Name: ${data.name}\n` +
      `Phone: ${data.phone}\n` +
      `Email: ${data.email}\n\n` +
      `*Delivery Address*\n` +
      `${data.street}\n` +
      `${data.city}, ${data.state} - ${data.pincode}\n\n` +
      `*Order Items*\n` +
      items.map(item => 
        `• ${item.name}${item.size ? ` (${item.size})` : ''} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
      ).join('\n') +
      `\n\n` +
      `Subtotal: ₹${subtotal.toLocaleString()}\n` +
      `Shipping: ${shipping === 0 ? 'Free' : `₹${shipping}`}\n` +
      `*Total: ₹${total.toLocaleString()}*\n\n` +
      `Payment Method: ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`;

    window.open(`https://wa.me/919887238849?text=${encodeURIComponent(message)}`, '_blank');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createOrder({
        items,
        shippingData: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
        subtotal,
        shippingCost: shipping,
        total,
        paymentMethod: data.paymentMethod,
        userId: user?.uid,
      });

      if (result) {
        // Send WhatsApp message for online payment
        if (data.paymentMethod === 'online') {
          handleWhatsAppOrder(data);
        }
        
        clearCart();
        navigate(`/order-confirmation/${result.orderId}`, {
          state: { orderNumber: result.orderNumber },
        });
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <Layout>
        <SEO title="Checkout - Jaipur Touch" description="Complete your order" canonical="/checkout" />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-8">Add some products to checkout.</p>
          <Link to="/shop">
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Checkout - Jaipur Touch" description="Complete your order for handcrafted Jaipuri textiles" canonical="/checkout" />

      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-3">
        <div className="container mx-auto px-4">
          <nav className="text-xs md:text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link to="/cart" className="text-muted-foreground hover:text-foreground">Cart</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter your full name"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="10-digit mobile number"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      {...register("street")}
                      placeholder="House/Flat no., Building, Street"
                      className={errors.street ? "border-destructive" : ""}
                    />
                    {errors.street && (
                      <p className="text-xs text-destructive">{errors.street.message}</p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="City"
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive">{errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="State"
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && (
                        <p className="text-xs text-destructive">{errors.state.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        {...register("pincode")}
                        placeholder="6-digit pincode"
                        className={errors.pincode ? "border-destructive" : ""}
                      />
                      {errors.pincode && (
                        <p className="text-xs text-destructive">{errors.pincode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Payment Method
                </h2>
                <RadioGroup
                  defaultValue="cod"
                  onValueChange={(value) => setValue("paymentMethod", value as "cod" | "online")}
                  className="space-y-3"
                >
                  <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === "cod" ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                  }`}>
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-olive" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === "online" ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                  }`}>
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gold" />
                        <div>
                          <p className="font-medium">Pay via WhatsApp</p>
                          <p className="text-xs text-muted-foreground">Complete payment via UPI/Bank Transfer</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-secondary shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size && `${item.size} • `}Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? <span className="text-olive">Free</span> : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-gold text-gold-foreground hover:bg-gold/90 h-12"
                  disabled={isSubmitting || creatingOrder}
                >
                  {isSubmitting || creatingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === "online" ? (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Place Order & Pay via WhatsApp
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
