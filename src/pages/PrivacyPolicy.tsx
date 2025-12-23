import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <SEO
        title="Privacy Policy | Jaipur Touch"
        description="Learn how Jaipur Touch collects, uses, and protects your personal information. Your privacy matters to us."
      />
      
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: December 2024
          </p>

          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Jaipur Touch ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website jaipurtouch.in or make a purchase from us.
              </p>
              <p className="text-muted-foreground">
                We are based in Jaipur, Rajasthan, India, and comply with applicable Indian data protection laws including the Information Technology Act, 2000 and its associated rules.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <p className="text-muted-foreground mb-4">When you make a purchase or create an account, we collect:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-1">
                <li>Name and contact information (email, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
              <p className="text-muted-foreground mb-4">When you browse our website, we automatically collect:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and approximate location</li>
                <li>Pages visited and time spent on site</li>
                <li>Referring website information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to customer service inquiries</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Improve our website and customer experience</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">4. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li><strong>Shipping Partners:</strong> Delhivery, Bluedart, and other logistics providers to deliver your orders</li>
                <li><strong>Payment Processors:</strong> Razorpay, PayU, and other payment gateways for secure transactions</li>
                <li><strong>Analytics Providers:</strong> Google Analytics to understand website usage</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">5. Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">6. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order records are typically retained for 7 years for tax and legal compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;
