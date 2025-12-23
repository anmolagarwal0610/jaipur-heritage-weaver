import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Truck, Clock, MapPin, CreditCard, Package } from "lucide-react";

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <SEO
        title="Shipping Policy | Jaipur Touch"
        description="Learn about Jaipur Touch's shipping policy. Free shipping above ₹999, COD available across India."
      />
      
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Shipping Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: December 2024
          </p>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-gold/10 rounded-lg p-4 text-center">
              <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Free shipping</p>
              <p className="font-semibold text-foreground">Above ₹999</p>
            </div>
            <div className="bg-gold/10 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Processing</p>
              <p className="font-semibold text-foreground">1-2 Days</p>
            </div>
            <div className="bg-gold/10 rounded-lg p-4 text-center">
              <MapPin className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Delivery</p>
              <p className="font-semibold text-foreground">5-10 Days</p>
            </div>
            <div className="bg-gold/10 rounded-lg p-4 text-center">
              <CreditCard className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">COD</p>
              <p className="font-semibold text-foreground">Available</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Shipping Coverage</h2>
              <p className="text-muted-foreground">
                We ship across India to all serviceable pin codes. Currently, we do not offer international shipping. For bulk orders or international inquiries, please contact us at hello@jaipurtouch.in.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Processing Time</h2>
              <p className="text-muted-foreground mb-4">
                All orders are processed within <strong>1-2 working days</strong> (Monday to Saturday, excluding public holidays). Orders placed after 3 PM may be processed the next working day.
              </p>
              <p className="text-muted-foreground">
                <strong>Note:</strong> During festive seasons (Diwali, Holi, etc.) or sale events, processing may take an additional 1-2 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Estimated Delivery Time</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Location</th>
                      <th className="text-left py-3 px-4 font-semibold">Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Jaipur & Rajasthan</td>
                      <td className="py-3 px-4">2-4 business days</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Metro Cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad)</td>
                      <td className="py-3 px-4">5-7 business days</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Other Cities & Towns</td>
                      <td className="py-3 px-4">7-10 business days</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Remote Areas (North-East, J&K, etc.)</td>
                      <td className="py-3 px-4">10-14 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                * Delivery times are estimates and may vary due to unforeseen circumstances, weather, or courier delays.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Shipping Charges</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Free Shipping:</strong> On all prepaid orders above ₹999</li>
                <li><strong>Orders below ₹999:</strong> Flat shipping charge of ₹79</li>
                <li><strong>Cash on Delivery (COD):</strong> Additional ₹49 COD handling fee</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Cash on Delivery (COD)</h2>
              <p className="text-muted-foreground mb-4">
                COD is available for orders up to ₹10,000 to most serviceable pin codes across India. A nominal fee of ₹49 is applicable for COD orders.
              </p>
              <p className="text-muted-foreground">
                <strong>Note:</strong> COD may not be available for certain remote areas. Please check availability at checkout by entering your pin code.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Order Tracking</h2>
              <p className="text-muted-foreground">
                Once your order is shipped, you will receive an email and SMS with the tracking number and courier partner details. You can track your order using the tracking link provided or by visiting the courier's website directly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Shipping Partners</h2>
              <p className="text-muted-foreground mb-4">
                We partner with trusted logistics providers to ensure safe and timely delivery:
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                  <Package className="w-4 h-4 text-gold" />
                  <span className="text-muted-foreground">Delhivery</span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                  <Package className="w-4 h-4 text-gold" />
                  <span className="text-muted-foreground">Bluedart</span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                  <Package className="w-4 h-4 text-gold" />
                  <span className="text-muted-foreground">DTDC</span>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Delivery Instructions</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Please ensure someone is available at the delivery address to receive the package</li>
                <li>For apartments/gated communities, provide clear landmark details</li>
                <li>Inspect the package for damage before accepting; report any issues to the courier</li>
                <li>Failed delivery attempts may result in return-to-origin (RTO)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Shipping Delays</h2>
              <p className="text-muted-foreground">
                While we strive to deliver on time, delays may occur due to natural disasters, strikes, or other unforeseen events beyond our control. We appreciate your patience and will keep you informed of any significant delays.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Have questions about shipping? We're here to help:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-muted-foreground">
                <p>Email: hello@jaipurtouch.in</p>
                <p>Phone: +91 98872 38849</p>
                <p>WhatsApp: +91 98872 38849</p>
                <p className="text-sm mt-2">Available Monday to Saturday, 10 AM to 6 PM IST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPolicy;
