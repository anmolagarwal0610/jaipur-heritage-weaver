/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid stacks on mobile (single column)
 * - Form fields full width on mobile
 * - Touch targets minimum 44x44px
 * - Maintain responsive design in all future edits
 */

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Layout>
      <SEO 
        title="Contact Jaipur Touch - Get in Touch With Us"
        description="Have questions about our handcrafted Jaipuri textiles? Contact Jaipur Touch via phone, WhatsApp, or email. Located in Jaipur, Rajasthan."
        canonical="/contact"
      />

      {/* Hero */}
      <section className="py-12 md:py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold font-medium tracking-widest text-xs sm:text-sm uppercase">
              Contact Us
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mt-3 md:mt-4 mb-4 md:mb-6">
              We'd Love to Hear From You
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg">
              Have questions about our products, orders, or artisan collaborations? 
              Reach out and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-6 md:mb-8">
                Get in Touch
              </h2>

              <div className="space-y-4 md:space-y-6">
                <a href="tel:+919887238849" className="flex gap-3 md:gap-4 group min-h-[44px] items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">Phone</h3>
                    <span className="text-muted-foreground group-hover:text-gold transition-colors text-sm md:text-base">
                      +91 98872 38849
                    </span>
                  </div>
                </a>

                <a 
                  href="https://wa.me/919887238849" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex gap-3 md:gap-4 group min-h-[44px] items-start"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">WhatsApp</h3>
                    <span className="text-muted-foreground group-hover:text-gold transition-colors text-sm md:text-base">
                      +91 98872 38849
                    </span>
                  </div>
                </a>

                <a href="mailto:hello@jaipurtouch.in" className="flex gap-3 md:gap-4 group min-h-[44px] items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">Email</h3>
                    <span className="text-muted-foreground group-hover:text-gold transition-colors text-sm md:text-base">
                      hello@jaipurtouch.in
                    </span>
                  </div>
                </a>

                <div className="flex gap-3 md:gap-4 min-h-[44px] items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">Address</h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                      A-91 Singh Bhoomi, Khatipura,<br />
                      Jaipur, Rajasthan 302012
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4 min-h-[44px] items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">Business Hours</h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                      Monday - Saturday: 10:00 AM - 7:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border border-border rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8">
              <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-5 md:mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" required className="h-11" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                      Phone
                    </label>
                    <Input id="phone" placeholder="Your phone number" required className="h-11" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your email" required className="h-11" />
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help?" required className="h-11" />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more..." 
                    rows={5} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 md:h-12">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-64 md:h-96 bg-secondary relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-10 h-10 md:w-12 md:h-12 text-gold mx-auto mb-3 md:mb-4" />
            <p className="text-muted-foreground text-sm md:text-base">Map integration available</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
