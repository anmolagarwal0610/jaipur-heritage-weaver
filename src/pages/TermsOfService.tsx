import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <SEO
        title="Terms of Service | Jaipur Touch"
        description="Read the terms and conditions governing your use of Jaipur Touch website and services."
      />
      
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: December 2024
          </p>

          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using the Jaipur Touch website (jaipurtouch.in) and making purchases from us, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">2. Eligibility</h2>
              <p className="text-muted-foreground">
                You must be at least 18 years of age or have parental/guardian consent to use our website and make purchases. By placing an order, you represent that you meet these requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">3. Account Responsibilities</h2>
              <p className="text-muted-foreground mb-4">If you create an account with us, you are responsible for:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">4. Products and Pricing</h2>
              <p className="text-muted-foreground mb-4">
                All products are handcrafted and may have slight variations in color, pattern, and dimensions. This is a characteristic of handmade products and not a defect.
              </p>
              <p className="text-muted-foreground mb-4">
                Prices are displayed in Indian Rupees (₹) and include applicable taxes. We reserve the right to modify prices at any time without prior notice.
              </p>
              <p className="text-muted-foreground">
                We strive to display accurate product images, but actual colors may vary slightly due to monitor settings and photography.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">5. Orders and Payment</h2>
              <p className="text-muted-foreground mb-4">
                By placing an order, you are making an offer to purchase. We reserve the right to accept or decline your order for any reason, including product availability, pricing errors, or suspected fraud.
              </p>
              <p className="text-muted-foreground mb-4">We accept the following payment methods:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
                <li>UPI (Google Pay, PhonePe, Paytm)</li>
                <li>Net Banking</li>
                <li>Cash on Delivery (COD) - Available on orders up to ₹10,000</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">6. Order Cancellation</h2>
              <p className="text-muted-foreground mb-4">
                <strong>By Customer:</strong> Orders can be cancelled within 24 hours of placement, provided they have not been shipped. Contact us at hello@jaipurtouch.in for cancellation requests.
              </p>
              <p className="text-muted-foreground">
                <strong>By Jaipur Touch:</strong> We reserve the right to cancel orders due to stock unavailability, pricing errors, or suspected fraud. A full refund will be issued in such cases.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this website, including text, images, logos, designs, and product photographs, is the property of Jaipur Touch and protected by Indian copyright and trademark laws. You may not reproduce, distribute, or use our content without written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">8. User Conduct</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Submit false or misleading information</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                To the fullest extent permitted by Indian law, Jaipur Touch shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.
              </p>
              <p className="text-muted-foreground">
                Our total liability for any claim shall not exceed the amount paid by you for the specific product giving rise to the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">10. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless Jaipur Touch, its owners, employees, and partners from any claims, damages, or expenses arising from your violation of these terms or misuse of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">11. Governing Law & Jurisdiction</h2>
              <p className="text-muted-foreground">
                These Terms of Service are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan, India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">12. Modifications</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-muted-foreground">
                <p><strong>Jaipur Touch</strong></p>
                <p>A-91 Singh Bhoomi, Khatipura</p>
                <p>Jaipur, Rajasthan 302012, India</p>
                <p className="mt-2">Email: hello@jaipurtouch.in</p>
                <p>Phone: +91 98872 38849</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
