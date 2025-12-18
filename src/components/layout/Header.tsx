import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Our Story", href: "/our-story" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2.5 text-center text-sm">
        <p className="font-sans tracking-wide">
          Free Shipping on Orders Above ₹999 • COD Available
        </p>
      </div>

      {/* Main Header */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col gap-6 mt-8">
                    <Logo className="mb-4" />
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-lg font-serif transition-colors hover:text-gold",
                          location.pathname === item.href
                            ? "text-gold"
                            : "text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/" className="shrink-0">
                <Logo />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-gold relative group",
                    location.pathname === item.href
                      ? "text-gold"
                      : "text-foreground"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                    location.pathname === item.href && "scale-x-100"
                  )} />
                </Link>
              ))}
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9">
                <User className="h-4 w-4" />
              </Button>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-gold-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    0
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
