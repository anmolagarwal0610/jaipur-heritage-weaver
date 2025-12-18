import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const categories = [
    "Handblock Bedsheets",
    "Jaipuri Bedsheets",
    "Quilts",
    "Dohar",
    "Bedcovers",
    "Curtains",
  ];

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
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl mb-3">
              Join the Jaipur Touch Family
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Subscribe to receive exclusive offers, new arrivals, and heritage stories.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90 whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Logo variant="light" showTagline className="mb-6" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Bringing the rich heritage of Jaipur's handcrafted textiles to your home. 
              Each piece tells a story of tradition, artistry, and timeless elegance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/shop?category=${category.toLowerCase().replace(/ /g, "-")}`}
                    className="text-primary-foreground/70 hover:text-gold text-sm transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-serif text-lg mt-6 mb-4">Policies</h4>
            <ul className="space-y-2">
              {policies.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  A-91 Singh Bhoomi, Khatipura,<br />
                  Jaipur, Rajasthan 302012
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0" />
                <a href="tel:+919887238849" className="text-primary-foreground/70 hover:text-gold text-sm transition-colors">
                  +91 98872 38849
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold shrink-0" />
                <a href="mailto:hello@jaipurtouch.in" className="text-primary-foreground/70 hover:text-gold text-sm transition-colors">
                  hello@jaipurtouch.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 Jaipur Touch. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <img src="https://cdn.shopify.com/s/files/1/0558/7599/3647/files/visa.svg" alt="Visa" className="h-6 opacity-70" />
              <img src="https://cdn.shopify.com/s/files/1/0558/7599/3647/files/mastercard.svg" alt="Mastercard" className="h-6 opacity-70" />
              <img src="https://cdn.shopify.com/s/files/1/0558/7599/3647/files/upi.svg" alt="UPI" className="h-6 opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
