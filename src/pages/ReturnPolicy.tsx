import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

const ReturnPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <SEO
        title="Return & Exchange Policy | Jaipur Touch"
        description="Learn about Jaipur Touch's return and exchange policy. Easy exchanges within 7 days of delivery."
      />
      
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Return & Exchange Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: December 2024
          </p>

          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-6">
                <p className="text-foreground font-medium">
                  At Jaipur Touch, we stand behind the quality of our handcrafted products. If you're not completely satisfied, we're here to help with easy exchanges.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Exchange Window</h2>
              <p className="text-muted-foreground">
                You may request an exchange within <strong>7 days</strong> of delivery. Please ensure you initiate the exchange request within this window by contacting us via email or phone.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Eligibility for Exchange</h2>
              <p className="text-muted-foreground mb-4">To be eligible for an exchange, the item must be:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Unused and unwashed</strong> – The product should be in its original condition without any signs of use, washing, or alterations</li>
                <li><strong>With original tags</strong> – All product tags must be intact and attached</li>
                <li><strong>In original packaging</strong> – The product should be returned in its original Jaipur Touch packaging</li>
                <li><strong>Without damage</strong> – No tears, stains, or damage caused after delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Non-Eligible Items</h2>
              <p className="text-muted-foreground mb-4">The following items cannot be exchanged or returned:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Sale or discounted items</li>
                <li>Customized or personalized products</li>
                <li>Items marked as "Final Sale"</li>
                <li>Products showing signs of use, washing, or damage</li>
                <li>Items without original packaging or tags</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Quality Defects & Damage</h2>
              <p className="text-muted-foreground mb-4">
                If you receive a product with manufacturing defects or damage during transit:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Report within <strong>48 hours</strong> of delivery with photographs</li>
                <li>We will arrange for a free pickup and replacement</li>
                <li>Alternatively, you may opt for a full refund or store credit</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>Note:</strong> Minor variations in color, print, and dimensions are characteristic of handcrafted products and are not considered defects.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Exchange Process</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>
                  <strong>Initiate Request:</strong> Contact us at hello@jaipurtouch.in or call +91 98872 38849 with your order number and reason for exchange.
                </li>
                <li>
                  <strong>Approval:</strong> Our team will review your request and provide approval within 24-48 hours.
                </li>
                <li>
                  <strong>Ship the Item:</strong> Once approved, pack the item securely in its original packaging and ship it to our address. Shipping costs for exchanges are borne by the customer (unless it's a quality issue).
                </li>
                <li>
                  <strong>Quality Check:</strong> Upon receiving, we will inspect the item to ensure it meets eligibility criteria.
                </li>
                <li>
                  <strong>New Item Dispatch:</strong> Once approved, the replacement item will be shipped within 3-5 business days.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Refund Policy</h2>
              <p className="text-muted-foreground mb-4">
                We currently offer <strong>exchanges only</strong> and do not provide cash refunds. However, you may opt for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li><strong>Store Credit:</strong> A credit note valid for 6 months from the date of issue</li>
                <li><strong>Exchange:</strong> Replacement with another product of equal or higher value (you pay the difference)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>Exception:</strong> Full refunds are provided only for manufacturing defects or transit damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Return Shipping</h2>
              <div className="bg-muted/50 rounded-lg p-4 text-muted-foreground">
                <p className="mb-2"><strong>Our Return Address:</strong></p>
                <p>Jaipur Touch</p>
                <p>A-91 Singh Bhoomi, Khatipura</p>
                <p>Jaipur, Rajasthan 302012</p>
                <p className="mt-3 text-sm">
                  Please use a trackable shipping method and retain the receipt. We are not responsible for items lost in transit.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">Need Help?</h2>
              <p className="text-muted-foreground mb-4">
                Our customer support team is here to assist you with any questions about returns or exchanges:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-muted-foreground">
                <p>Email: hello@jaipurtouch.in</p>
                <p>Phone: +91 98872 38849</p>
                <p className="text-sm mt-2">Available Monday to Saturday, 10 AM to 6 PM IST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnPolicy;
