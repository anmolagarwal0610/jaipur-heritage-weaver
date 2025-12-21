/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid stacks on mobile (single column)
 * - Touch targets minimum 44x44px
 * - Newsletter form responsive
 * - Maintain responsive design in all future edits
 */

import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCategories } from "@/hooks/useCategories";

const Footer = () => {
  const { rockstarCategories, loading: categoriesLoading } = useCategories();

  const quickLinks = [
    { name: "Shop All", href: "/shop" },
    { name: "Our Story", href: "/our-story" },
    { name: "Contact", href: "/contact" },
    { name: "Track Order", href: "/track-order" },
  ];

  const policies = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Shipping Policy", href: "/shipping" },
    { name: "Return Policy", href: "/returns" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl mb-2 md:mb-3">
              Join the Jaipur Touch Family
            </h3>
            <p className="text-primary-foreground/80 mb-4 md:mb-6 text-sm md:text-base">
              Subscribe to receive exclusive offers, new arrivals, and heritage stories.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-11"
              />
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90 whitespace-nowrap h-11 px-6">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Logo variant="light" showTagline className="mb-4 md:mb-6" />
            <p className="text-primary-foreground/80 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              Bringing the rich heritage of Jaipur's handcrafted textiles to your home. 
              Each piece tells a story of tradition, artistry, and timeless elegance.
            </p>
            <div className="flex gap-3 md:gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors p-1" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors p-1" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors p-1" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors p-1" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-base md:text-lg mb-3 md:mb-4">Categories</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {categoriesLoading ? (
                <li className="text-primary-foreground/70 text-xs md:text-sm">Loading...</li>
              ) : rockstarCategories.length === 0 ? (
                <li className="text-primary-foreground/70 text-xs md:text-sm">No categories</li>
              ) : (
                rockstarCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/shop?category=${category.slug}`}
                      className="text-primary-foreground/70 hover:text-gold text-xs md:text-sm transition-colors inline-block py-0.5"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base md:text-lg mb-3 md:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold text-xs md:text-sm transition-colors inline-block py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-serif text-base md:text-lg mt-4 md:mt-6 mb-3 md:mb-4">Policies</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {policies.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold text-xs md:text-sm transition-colors inline-block py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-serif text-base md:text-lg mb-3 md:mb-4">Contact Us</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-xs md:text-sm">
                  A-91 Singh Bhoomi, Khatipura,<br />
                  Jaipur, Rajasthan 302012
                </span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-gold shrink-0" />
                <a href="tel:+919887238849" className="text-primary-foreground/70 hover:text-gold text-xs md:text-sm transition-colors">
                  +91 98872 38849
                </a>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-gold shrink-0" />
                <a href="mailto:hello@jaipurtouch.in" className="text-primary-foreground/70 hover:text-gold text-xs md:text-sm transition-colors">
                  hello@jaipurtouch.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-primary-foreground/60">
            <p>© 2024 Jaipur Touch. All rights reserved.</p>
            <div className="flex items-center gap-3 md:gap-4">
              <img 
                src="https://cdn.shopify.com/s/files/1/0558/7599/3647/files/visa.svg" 
                alt="Visa payment accepted" 
                className="h-5 md:h-6 opacity-70" 
                loading="lazy"
              />
              <img 
                src="https://cdn.shopify.com/s/files/1/0558/7599/3647/files/mastercard.svg" 
                alt="Mastercard payment accepted" 
                className="h-5 md:h-6 opacity-70" 
                loading="lazy"
              />
              <img 
                src="https://cdn.shopify.com/s/files/1/0558/7599/3647/files/upi.svg" 
                alt="UPI payment accepted" 
                className="h-5 md:h-6 opacity-70" 
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
